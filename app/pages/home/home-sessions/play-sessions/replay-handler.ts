
import { ElementRef, Inject, Injectable, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { Observable, Subject} from 'rxjs';
import { nvEncoder } from '../common/interfaces/nvencode';
import { PageInformation } from '../common/interfaces/pageinformation';
import { Session } from '../common/interfaces/session';
import { MetadataService } from '../common/service/metadata.service';
import { NvhttpService } from '../common/service/nvhttp.service';
import { ReplayService } from './service/replay.service';
import { DOMBuilder } from '../common/interfaces/dombuilder';
import { ReplayData } from './../common/interfaces/replay-data';
//import { ReplayPageactionsComponent } from './replay-pageactions/replay-pageactions.component';
import { ReplayUtil } from './../common/util/replay-utils';
import { ReplaySettings } from './service/replaysettings';
//import { Subject } from 'rxjs/Subject';
import { map , filter } from "rxjs/operators";
import { MessageService } from 'primeng';
import { NVAppConfigService } from '../common/service/nvappconfig.service';


declare var afterPagedumpLoad;

const REPLAY_NEXT = "next";
const REPLAY_PREVIOUS = "prev";

//There can be following mode in case of showNextReplay.
const USER_DRIVEN = 0;
const LAST_USERACTION_FAILED = 1;
const SILENT_USERACTION = 2;
const AUTO_REPLAY_MODE = 3;
//this mode will be called internally to handle case when we want to skip useraction silently.
const SKIP_USERACTION = 4;

const DB_USERACTION = "db";
const JSON_USERACTION = "json";
const SUCCESS = 0;
const FAILURE = -1;

//Replay Mode
const MANUAL_REPLAY = 0;
const AUTO_REPLAY = 1;

const FORWARD_MODE = 0;
const BACKWARD_MODE = 1;

//type of page Navigation.
//these will be handle to user action.
const PAGE_NAVIGATION_ON_CLICK = 1;
const PAGE_NAVIGATION_NEXT_REPLAY = 2;
const PAGE_NAVIGATION_PREVIOUS_REPLAY = 3;


//DB UserAction Code.
const DBUA_FOCUS = 0;
const DBUA_BLUR = 1;
const DBUA_CLICK = 2;
const DBUA_CHANGE = 3;
const DBUA_HASHCHANGE = 4;
const DBUA_MOUSEOVER = 5;
const DBUA_MM = 6; /**Mouse move */

const DBUA_LOAD = 1000;
const DBUA_UNLOAD = 1001;
const DBUA_RESIZE = 1002;
const DBUA_SCROLL = 1003;
const DBUA_OCHANGE = 1004;
const DBUA_TOUCHEND = 1005;


const DBUA_APPEND_CHILD = -10;
const DBUA_ADD_CHILD_AFTER_BEGIN = -11;
const DBUA_ADD_CHILD_AFTER_END = -12;
const DBUA_REMOVE_CHILD = -20
//Other events.
const DBUA_ENCRYPTION = -7;
const DBUA_RESOURCE_TIMING = -6;
const DBUA_INTERNAL_TIMING_DATA = -5
const DBUA_LONGPRESS = 13;
const DBUA_ONFLING = 14;
const DBUA_ANDSCROLL = 7;
const DBUA_AUTOFILL = 30;
const DBUA_DOUBLETAP = 12;

const UNEXPECTED_MUTATION = 0;
const EXPECTED_MUTATION = 1;

//FIXME: update it once we will handle the problem of total session duration.
// since prefetch module keeps
const DELTA_JSONDATA_ENTRIES = 5;

// user action request pending
const useractionReqPending = 0;
const JsonReqPending = 0; //1 means request is pending

//Selector Type.
const DOM_ID = -1;
const DOM_XPATH = -2;
const CSS_SELECTOR = -3;
const IDType = {
  "-1": "DOM_ID",
  "-2": "DOM_XPATH",
  "-3": "CSS_SELECTOR"
};

//Replay Class.
//Note: each element replayed will be assigned this class. just to remove previous replay.
const REPLAY_ELEMENT = "ana";
const TIME_BASED_PROGRESS = 0;
const UACOUNT_BASED_PROGRESS = 1;

const AUTO_REPLAY_ACTUAL_DELAY_MODE = 0;
const AUTO_REPLAY_FIXED_DELAY_MODE = 1; 
const AUTO_REPLAY_SLOW_MODE = 2;
const AUTO_REPLAY_FAST_MODE = 3;
const AUTO_ADVANCED_MODE = 4;
const nextPageLoadStartTime = 0;
const nextTaskInterval = 2000; //ms
const AutoReplayTimer = 0;
const AutoReplayWatchTimer = 0;
 
    


class NavigationBar {

   // these are all flags, if set true, means disbaled 
   firstPageControl :boolean = false;
   lastPageControl :boolean = false;
   forwardReplayControl :boolean = false;
   backwardReplayControl :boolean = false;
   playReplayControl : boolean = false;
   rh :any ;  
  playLabel: string;
  playIcon: string;
  constructor(ctx ) {
    // keeping context of repaly handler class to access all its property
    this.rh = ctx;
  }
  
 update () {
   //update next and previous.
   //console.log("navigation bar update method is called");
   if((this.rh.pagedumpload == true && this.rh.plSpinnerRunning == false)) //|| this.rh.replay_ended == true)
   {
    
     this.forwardReplayControl = true;
     this.backwardReplayControl = true;
     this.playReplayControl = true;
     this.firstPageControl = true;
     this.lastPageControl = true;
   } // in case of simulate page load delay, user can move to any direction to stop simulate page load delay at any point
   else if(this.rh.plSpinnerRunning == true){
    
    this.forwardReplayControl = false;
    this.backwardReplayControl = false;
    this.playReplayControl = false;
    this.firstPageControl = false;
    this.lastPageControl = false;
   }

   //in case we have to wait for request made for offset and its completion and thus disable replay icons
   else if(this.rh.waitforrequest == true ){
   
    this.forwardReplayControl = true;
    this.backwardReplayControl = true;
    this.playReplayControl = true;
    this.firstPageControl = true;
    this.lastPageControl = true;
   }


   else if(this.rh.pages.length == 1 && this.rh.userActionData[this.rh.currentPageInstance].data.length == 0)
   {
   
     // single page, having no data
     this.forwardReplayControl = true;
     this.backwardReplayControl = true;
     this.playReplayControl = true;
     this.firstPageControl = true;
     this.lastPageControl = true;
   }
   else if(this.rh.currentPageIndex + 1 >= this.rh.pages.length && this.rh.currentUserActionIndex+1 >= this.rh.userActionData[this.rh.currentPageInstance].data.length || this.rh.replay_ended == true)
   {
    
     // last page, and done with all data
     this.forwardReplayControl = true;
     this.backwardReplayControl = false;
     this.playReplayControl = true;
     this.firstPageControl = false;
     this.lastPageControl = true;
   }

   else if(this.rh.currentPageIndex <= 0 && this.rh.currentUserActionIndex < 0)
   {
    
     // start of replay
     this.forwardReplayControl = false;
     this.backwardReplayControl = true;
     this.playReplayControl = false;
     this.firstPageControl = true;
     this.lastPageControl = false;
   }
   else
   {
    
     //If it is in middle of replay then both ways are free foru.............. :)
     this.forwardReplayControl = false;
     this.backwardReplayControl = false;
     this.playReplayControl = false;
     this.firstPageControl = false;
     this.lastPageControl = false; 
   }
 

   //Update play/pause. 
   let pe = document.getElementById("playreplayid");
   if(pe == null)
     return;
   if(ReplaySettings.replayMode == MANUAL_REPLAY)
   {  
     //pe.className = pe.className.replace("icons8-pause","icons8-material-filled"); 
     this.playLabel = 'Play';
     this.playIcon = 'icons8 icons8-material-filled';
   }
   else {
     //pe.className = pe.className.replace("icons8-material-filled","icons8-pause");
     this.playLabel = 'Pause';
     this.playIcon = 'icons8 icons8-pause'; 
   }
 }
  
}
interface ReplayMessage {
  key: any;
  data?: any;
}
@Injectable({
  providedIn: 'root',
})

export class ReplayHandler {

  httpService: NvhttpService;
  replayService : ReplayService;
  userActionData: {};
  protocolversion: number;
  firstPageFlag: boolean = true;
  replayDocument: Document;
  navigationBar: NavigationBar;
  pages: PageInformation[];
  // current page of replay
  currentPage : PageInformation;
  currentSnapshotIndex: number = 0;
  currentPageInstance: number;
  currentPageIndex: number = 0;
  nvDomBuilder: DOMBuilder;
  currentUserActionIndex: number = -1;
  currentNonSilentUserActionIndex: number =0;
  currentSilentUserActionIndex : number =0 ;
  previousNonSilentUserActionIndex: number = -1;
  nextSilentUserActionCount: number = 0;
  pageNavigationType: number = PAGE_NAVIGATION_ON_CLICK;
  mrIntUATimer: number = -1;
  replayWindow : Window;
  session : Session = null;
  replaydata : ReplayData;
  pagedumpload : boolean = false;
  //pageActionC : ReplayPageactionsComponent;
  SNAPSHOT_ID : number = 0;
  metaDataService: MetadataService;
  defoffset:any='0';
  
  @ViewChild('replayIframe') replayIframeClone: ElementRef;
  replayControl: any;

  private _handler: Subject<ReplayMessage> = new Subject<ReplayMessage>(); 
  private msgtoAnalattyics = new Subject<any>();
  private newSub = new Subject<any>();

  // if replay has ended
  replay_ended: boolean = false;
  AutoReplayWatchTimer  = 0;
  timer = 0;
   nextPageLoadStartTime = 0;
   nextTaskInterval = 2000; //ms
   AutoReplayTimer = 0;
   
   // when simulatepageload is true 
  lastNavStartTime: number;
  pageLoadSpinnerTimer : any;
  // to indicate simulatepageload is true
  plSpinnerRunning :boolean =false;
  waitTimer: boolean = false; 
  canvas_height: string;

  // flag required for synching the extension call.
  // variable initialization 
  check :boolean = false;  
  popupVisible : boolean = false;
  autoRecord : string = "false";
  recordAutoSpeedType : string = "";
  recordAutoSpeedValue : string = "";
  fullScreenExt : string = "";

  //keyword for checking whether request in case of offset is completed or not
   waitforrequest:boolean=false;
   // for voice command
   msg  = null;
   config = null;
   voices = [];
   ss = window.speechSynthesis;
   stop_speaking :boolean = false;
   selected_voice =null;
   voice_options = [];
  // since page dump load flag gets reset once pagedump has rendered
  // removing the concept of setting loadingPageDump.html, adding a new flag to keep track of pagedump
  pagedumploading : boolean = false;
  // for speech synthesis synchronization with auto replay
  ttimer : number = -1;
  // to keep screen width and height
  swidth : number = -1;
  sheight : number = -1;
  // replay pointer animation indicator
  animationInterval : number = -1;
  // for mouse move data sync with auto replay
  mouseTimer : number = -1;
  // prime ng psg service
  msgService : any;
  nvconfigurations =null;
  nvAppConfigService: any;
  // to ensure processing pagedumpcallback hasbeen called, specially in case, when pagedump is drawn but useraction is still pending and stuck in timer
  // only be true, when processingpagedumpcallback has returned due to no useractiondata
  processingPending : boolean = false;
  // replay element to be higlighted din replay window
  replay_elem_to_be_highlighted = null;

  constructor(@Inject(NvhttpService) httpService, @Inject(ReplayService) replayService, @Inject(MessageService) msgService, @Inject(NVAppConfigService) nvAppConfigService) {
    this.httpService = httpService;
    this.replayService = replayService;
    this.msgService = msgService;
    this.nvAppConfigService = nvAppConfigService;
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response; 
    });
  }
   
  initData(   rd: ReplayData,
              userActionData:any,
              session: Session,
              replayDocument: Document, 
              pages: PageInformation[], 
              replayPage: PageInformation, 
              nvDomBuilder: DOMBuilder,
              replayWindow:Window,
              replayPageIndex:number,
              pagedumpLoad: boolean,
              controls:any,
              record_data : any,
              swidth:number,
              sheight : number) {
    
    //merged and sorted data of db user action and json useractions
    this.userActionData = userActionData;
    // flag to indicate it is first page, for the first time, need to call startReplayHandler
    this.firstPageFlag = true;
    // 1 - webpage , 100 - android page replay
    this.protocolversion = Number(session.protocolVersion);
    this.session = session;
    // replay document
    this.replayDocument = replayDocument;
    if(this.replayDocument == undefined || this.replayDocument == null )
      this.replayDocument = ReplayUtil.getReplayDocument(); 
    //this.navigationBar = null;
    this.navigationBar = new NavigationBar(this);
    this.pages = pages;
    this.currentPage = replayPage;
    this.currentPageInstance = Number(replayPage.pageinstance);
    this.currentPageIndex = Number(replayPageIndex);
    this.currentSnapshotIndex = 0;
    this.nvDomBuilder = nvDomBuilder;
    this.replayWindow = replayWindow;
    this.replaydata = rd;
    this.pagedumpload = Boolean(pagedumpLoad);
    //this.pageActionC = new ReplayPageactionsComponent();
    this.replayControl = controls;
    //format : this.record_data = {"recordAutomatic"  :recordAutomatic , "fullScreen" : fullScreen, "replayDelayType": replayDelayType, "speedValue":speedValue};
    this.fullScreenExt = record_data.fullScreen + ""; // to make it string , if boolean
    this.autoRecord  = record_data.recordAutomatic;
    this.recordAutoSpeedType = record_data.replayDelayType;
    this.recordAutoSpeedValue = record_data.speedValue;
    this.msg = new SpeechSynthesisUtterance();
    this.voices = this.ss.getVoices();
    // filtering voices
    this.filterVoices();
    this.config = null;
    //console.log("voices.length : ", this.voices.length, this.voices);
    //choose voice. Fallback to default
    this.msg.voice = this.config && this.config.voiceIndex ? this.voices[this.config.voiceIndex] : this.voices[0];
    this.msg.volume = this.config && this.config.volume ? this.config.volume : 1;
    this.msg.rate = this.config && this.config.rate ? this.config.rate : 1;
    this.msg.pitch = this.config && this.config.pitch ? this.config.pitch : 1;
    this.swidth = swidth;
    this.sheight = sheight;
    // now we have useractions and if still processing page dump call back is not called, call it
    if(this.processingPending){
      setTimeout(()=>{this.processingPageDumpCallback(null,false)},0);
    }
  }
  waitFor5Press(e,ctx)
  {
    if(e.keyCode=="53" || e.keyCode == "82")
    {
           document.querySelector('#pop-record-command')["style"].visibility="hidden";
           //remove handler also.
           document.removeEventListener('keyup', ctx.waitFor5Press);
           document.removeEventListener('onkeyup', ctx.waitFor5Press);
           ctx.popupVisible = false;
           ctx.autoRecord = "false";
           ReplaySettings.replayMode = AUTO_REPLAY;
           //console.log(ctx.recordAutoSpeedType + " -- " + ctx.recordAutoSpeedValue);
           if(ctx.recordAutoSpeedType == "0")
             ctx.recordAutoSpeedType = AUTO_REPLAY_ACTUAL_DELAY_MODE;
           if(ctx.recordAutoSpeedType != "" && ctx.recordAutoSpeedValue != ""){
             ReplaySettings.autoSpeedType = Number(ctx.recordAutoSpeedType);
             ReplaySettings.autoSpeedValue = Number(ctx.recordAutoSpeedValue);
           }
           if(this.fullScreenExt == "true")
             this.expandFrameMsg();
            ctx.processingPageDumpCallback(null, false);
           return;
    }
    else
    {
      document.querySelector('#pop-record-command').innerHTML="'WRONG KEY PRESSED' to start recording press 'Ctrl+Shift+5'";
    }
  }

  expandFrameMsg(){
    let obj : ReplayMessage = {"key" : "callExpandFrame", "data" : ""};
    this.broadcast('msg', obj);
  }
  processingPageDumpCallback(event, force:boolean) {
    console.log("processingPageDumpCallback called for : ", this.currentPageInstance);   
    this.disable_left_click();
    // in case of no page dump, these valuues will not be filled
    if(!this.userActionData  || (this.userActionData && !this.userActionData[this.currentPageInstance])){
      // set a flag , so that processing pagedumpcallback can be called again,
      this.processingPending = true;
        return;
    }
    this.processingPending = false;
    // this condition only applies if, simulate paheload delay was off
    if(force == false){
    // if page dump not loaded return
    if(!this.pagedumpload)
    {
      console.log("processingPageDumpCallback : pagedump not loaded");
      return;
    }
  }
    this.pagedumploading = false;
    let obj : ReplayMessage = {"key" : "pagedumploading", "data" :this.pagedumploading};
    this.broadcast('msg', obj);
    // when pagedump loaded , hide canvas opacity to 0
    let canvas_style  = {'position': 'absolute','z-index': 1, 'opacity':'0'};
    obj = {"key" : "setCanvasStyle", "data" : canvas_style};
    this.broadcast('msg', obj);
    let ctx = this;
    setTimeout(function() 
    {
      //console.log('Setting canvas style');
      // sometimes user have moved out of replay window, till this time 
      try{ctx.setCanvasStyling(ctx);}catch(e){}
    }, 60000);

    if( this.userActionData[this.currentPageInstance].jsonDataCollected == false && this.pagedumpload == true){
        this.loadReplayJsonData(true,this.defoffset);
        return;
    }
    // setting the data in replay service for prefetch
    this.replayService.setUserActionData(this.userActionData);
    this.replayService.setDetails(this.session,this.pages,this.pages[this.currentPageIndex].pageInstance,this.currentPageIndex);
    let prefetch_type = "useractions";
    let nextdata = this.replayService.getNextPage(prefetch_type);
    if(nextdata.p1 != null){
      // paasing DELTA_JSONDATA_ENTRIES as 1 , as right now we are not able to keep track for more than one page of useraction 
      let requestedPage = ReplayUtil.getRequestedPageList(nextdata.p1.pageinstance, 1, this.pages, this.pages.length, this.session.partitionID,nextdata.offset); 
      let basepath =  ReplayUtil.getBasePathURL(this.pages[this.currentPageIndex].url);
      //console.log("Prefetch : Requesting  useraction data for page list ", requestedPage);
      let logmsg = "pageinstance : " + nextdata.p1.pageinstance + " offset : "+ nextdata.offset + "  requested from processing pagedump callback.";
      this.replayService.console("log","Prefetch : UA ", logmsg);
      this.replayService.methodWrapper("getReplayJsonData",[requestedPage,this.session.sid,basepath,/*basepath n current version*/1],prefetch_type,nextdata).subscribe(response =>{
        console.log("User action data for page list : ", requestedPage);
      });

    }
      prefetch_type = "snapshots";
      let nextdatas = this.replayService.getNextPage(prefetch_type);
      let snapshotid= nextdatas.offset;
      if(nextdatas.p1 != null){
      //console.log("Prefetch : Requesting  snapshot data for page  ", nextdatas.p1.pageinstance);
      let logmsg = "pageinstance : " + nextdatas.p1.pageinstance + " snapshot id : "+ snapshotid + " " +  "path" + " requested from processing pagedump callback.";
      this.replayService.console("log","Prefetch : Snapshot ", logmsg);
      this.replayService.snapWrapper("getSnapShotPathThroughAjax",[1,this.session.startTime,this.session.sid,nextdatas.p1.pageinstance,this.session.partitionID,snapshotid],"snapshots",nextdatas,"path",snapshotid).subscribe(response =>{
        //console.log(" snapshot path for page instance : ", nextdatas.p1.pageinstance);
      });
      
    }
    
    if (this.firstPageFlag) {
      //checking if extension is invoking this call.
     if(this.autoRecord == "true")
     {
       //console.log("autoRecord true");
        this.check = true;
        //Check if banner is visible then return. 
        if(this.popupVisible == true)
          return;

        var c = this;    
       if(document.addEventListener)
       {
         document.querySelector('#pop-record-command')["style"].visibility="visible";
         document.addEventListener('keyup', (e)=>{c.waitFor5Press(e,c);});
       }
       else if(document["attachEvent"])
       {
        document.querySelector('#pop-record-command')["style"].visibility="visible";
        document.addEventListener('onkeyup', (e)=>{c.waitFor5Press(e,c);});
      }

       this.popupVisible = true;
       return;
    }
    else
    {
      document.querySelector('#pop-record-command')["style"].visibility="hidden";
      this.popupVisible = false;
      // to set necessary letiables
      this.startReplayHandler();
    }
  }
    this.checkImagePageNav();
    // reset pagedump load flag, this is used for two purposes: one for page dump has loaded, other for replay control
    // doing this in startReplayHandler
    this.pagedumpload = false;

    //Note: If simulatePageLoadDelay is enabled then in case of mannual replay compare elapsed time from real page load time. If elapsed time is less then page load time  //then need to hold processingPageDumpCallback.
    //In case of autoReplay it will be handled in startAutoReplayTimer.
    // simulatePageLoadDelay will not be enabled if SNAPSHOT_CHANGED is true 
    /*If pagedump not found then do not simulate pageLoadDelay*/
    if(this.currentSnapshotIndex == 0  && 
       !force && 
       ReplaySettings.replayMode == MANUAL_REPLAY && 
       this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].snapshotPath != "" && 
       ReplaySettings.simulatePageLoadDelay && 
       this.pageNavigationType != PAGE_NAVIGATION_PREVIOUS_REPLAY)
   {
        var curTime = new Date().getTime();
        //compare elapsed time from page load time.
        if(curTime - this.lastNavStartTime >= (this.pages[this.currentPageIndex].timeToLoad*1000))
        {
          console.log("Page is loaded");
          //Continue to processingPageDumpCallback.
        }
        else {
          this.navigationBar.update();
          this.passMsg();
         //Next and previous buttons are enabled so that user can skip pageload simultation steps. 
          /*document.getElementById("nextreplayid").src =  "/netvision/images/nextreplay.png";
          document.getElementById('prevreplayid').src =  "/netvision/images/prevreplay.png";
          document.getElementById('nextreplay').href = "javascript:showNextReplay()";
          document.getElementById('prevreplay').href = "javascript:showPrevReplay();";
          */
          /*this.plSpinnerRunning = true;
          let obj : ReplayMessage = {"key" : "simulatePLdelay", "data" : this.plSpinnerRunning};
          this.broadcast("msg",obj);*/
          var timeLeft =(this.pages[this.currentPageIndex].timeToLoad)*1000 - (curTime - this.lastNavStartTime);
          //console.log("Time left - " + timeLeft);
          let r = this;
           this.pageLoadSpinnerTimer = setTimeout(()=> {
             //console.log("inside pageLoadSpinnerTimer 1");
            r.processingPageDumpCallback(null, false);
            //console.log("inside pageLoadSpinnerTimer 2");
          }, timeLeft);
          return;
        }
  } 

  //remove the spinner. IN case of auto replay it will be removed insider startAutoReplayTimer.
  this.clearPageLoadSpinnerAndEnableControl();

  // reset , if snapshot not changed
  if(this.currentSnapshotIndex == 0){
    this.currentSnapshotIndex = 0;
    this.currentSilentUserActionIndex = 0;
    this.currentUserActionIndex = this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].idx;
    this.currentNonSilentUserActionIndex = this.getNonSilentUserActionIndex(this.currentPageInstance, null);
    this.setNextSilentUserActionCount();
    this.updateProgressBar();
    this.endReplay(false);
    
  }
    
    //move to last useraction in case if moved to previous page.
    //Only when current snapshot was successful.
    if(this.pageNavigationType == PAGE_NAVIGATION_PREVIOUS_REPLAY && this.isSuccessfullPageDump(this.currentPageIndex, this.currentSnapshotIndex,this.currentPageInstance)){
      this.moveToLastUserAction(this.currentSnapshotIndex); 
    }
    if(this.currentPageIndex + 1 >= this.pages.length && this.currentUserActionIndex+1 == this.userActionData[this.currentPageInstance].data.length)
    {
      this.endReplay(true);
      // Fix me  : afterpagedump load callback wont be executed
      /*
      //we done.
      displayReplayEndMsg();
      //disable nextReplayLink.
      disableNextReplayLink();
      this.passMsg(); */
      return;
    }
    //update progress bar
    //updateProgressBar();
    var uaStartIdx = this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].uaStartIdx;
    //If running in auto replay mode then start auto replay timer.
    if(ReplaySettings.replayMode == AUTO_REPLAY)
    {
      //Note: in case of snapshot change triggerByPageLoad should be false.
      if(this.currentSnapshotIndex > 0)
        this.startAutoReplayTimer(true/*triggered by page load*/);
      else 
        this.startAutoReplayTimer(false);
    }else if (this.pageNavigationType != PAGE_NAVIGATION_PREVIOUS_REPLAY) {
      if (uaStartIdx != -1 && this.userActionData[this.currentPageInstance].data.length > 0 && this.userActionData[this.currentPageInstance].data[uaStartIdx].isSilent == true) {
        //Added in setTiemout just to be assure that pageNavigationType will be reset
        //let root = this;
        this.showNextReplayChild(null, event);
        //setTimeout(()=>{root.showNextReplay},0);
      }
    }
    if (this.firstPageFlag) 
      this.firstPageFlag = false;
    
      let sessioninfo = {};
      sessioninfo["userSegment"] = this.session.userSegments;
      sessioninfo["channel"] = this.session.channel
      sessioninfo["browser"] = this.session.browser;
      sessioninfo["location"] = this.session.location;
      sessioninfo["os"] = this.session.os;
      sessioninfo["userAgent"] = this.session.userAgent;
      let currentpageinfo = {};
      let currentPage = this.pages[this.currentPageIndex];
      currentpageinfo["url"] = currentPage.url;
      currentpageinfo["referrerurl"] = currentPage.referrerUrl;
      currentpageinfo["events"] = currentPage.events;
      currentpageinfo["pageInstance"] = currentPage.pageInstance;
      currentpageinfo["pageindex"] = currentPage.pageName.id;
      currentpageinfo["cookies"] = currentPage.cookies;
      
      try{ 
        if(typeof afterPagedumpLoad == 'function'){
            console.log("calling afterPagedumpLoad method");
            afterPagedumpLoad.call(window,sessioninfo,currentpageinfo, this.replayDocument, true);
        }
        }
       catch(e)
        {
          console.log(" exception handled : ", e);
        }

      // reset pagedump load flag, this is used for two purposes: one for page dump has loaded, other for replay control
      //this.pagedumpload = false;
      //this.navigationBar.update();
      //this.passMsg();
  }

  setCanvasStyling(ctx)
  { 
    //console.log('setCanvasStyling');     
    let doc = ReplayUtil.getReplayDocument();
    ctx.canvas_height = "100%";
    let s ={};
    if(doc.body)
    {
      let h = doc.body.offsetHeight;
      if(doc.body.clientHeight < h)
        h = doc.body.clientHeight;
      let w = doc.body.offsetWidth;
      if(doc.body.clientWidth < w)
        w = doc.body.clientWidth;
      let iframeEle = <HTMLElement> document.querySelector('#replayIframe');
      let iframe_left = iframeEle.offsetLeft;
      // for tablet template, border  is 60 px,
      // all the numbers are constants taken from template css 
      if(ctx.session.userAgent.toLowerCase().indexOf('tablet') > -1 || ctx.session.userAgent.toLowerCase().indexOf('ipad') > -1 ){
          let canvas_top = "60px"
          ctx.canvas_height = (h-16) + "px"; // 16px is the tablet template border
          let l= (iframe_left + 16) + "px"  
          let ww = (w -16)+"px";
          s = {'position': 'absolute','z-index': 1,'height':ctx.canvas_height,'top':canvas_top,'left':l,'width':ww};
      }
      else if(ctx.session.userAgent.toLowerCase().indexOf('iphone') > -1){
        let canvas_top = "56px"
        ctx.canvas_height = h + "px";
        let ww = w  +"px";
        let l= (iframe_left + 25) + "px"  
        s = {'position': 'absolute','z-index': 1,'height':ctx.canvas_height,'top':canvas_top,'left':l,'width':ww };
      }
      else if(ctx.session.userAgent.toLowerCase().indexOf('mobile') > -1 ){
        // same as tablet
        let canvas_top = "60px";
        ctx.canvas_height = h + "px";
        let ww = w+"px";
        let l= (iframe_left + 16) + "px"  ;
        s = {'position': 'absolute','z-index': 1,'height':ctx.canvas_height,'top':canvas_top,'left':l,'width':ww};
      }
      else{
          // h can be used too
          ctx.canvas_height = "100%";
          if((doc.body.offsetWidth || doc.body.clientWidth) < doc.body.scrollWidth)
            ctx.canvas_height = "98%";//horizontal scroll is present
            s = {'position': 'absolute','z-index': 1,'height':ctx.canvas_height};
      }
      //s['opacity']=0; s['background']= 'gray';
      // can add canvas width from this styling 
      let obj : ReplayMessage = {"key" : "setCanvasStyle", "data" : s};
      ctx.broadcast('msg', obj);
    }
  }
  startReplayHandler() {
    this.pagedumpload = false;
    // for any callback on pagedump , post it is rendered
    //this.pagedumpPostProcessing();
    //this.navigationBar = new NavigationBar(this);
    //this.checkImagePageNav();
    try{
        //highlight the page action div 
      this.highlightDiv(REPLAY_NEXT,null,null);
    }catch(e){
      console.log("Ignored Exception occured to highlight page , since page actions are not plotted yet.");
    }
    //used to highlight current page
    this.highlightPageinNavigator();
    let obj : ReplayMessage = {"key" : "expandtwice", "data" : ""};
    this.broadcast('msg', obj);
    
  }
  //Function for highlighting divs 
  highlightDiv(mode,pageflag,flag)/*pageflag = "page when going to next page", flag="snapshot", when moving to last snapshot*/
  {
  if(flag && flag == "snapshot")
  {
    document.getElementById('panel-' + this.currentPageInstance).style.display = '';
    document.getElementById('panel-' + this.currentPageInstance).style.backgroundColor = '#C7E6D0'; // '#f6fbf8';//#cfe1f1';
    ReplayUtil.scrollIntoView(document.getElementById('panel-' + this.currentPageInstance),"highlightDiv");
    //document.getElementById('pageDiv' + this.currentPageInstance).scrollIntoView();
    // since we have disabled replay-wrapper scrolling to hide extra scroll bars
    // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
    //document.querySelector('.replay-wrapper').scrollTop = 0;
    return;
  }
  var namelinks= document.getElementsByName('pagediv');
  
  for(var i =0; i < namelinks.length ; i++)
  {
    namelinks[i].style.backgroundColor = 'white';
  }
  
  var name= document.getElementsByName('uadiv');
  for(var i =0; i < name.length ; i++)
  {
    name[i].style.backgroundColor = 'white';
  }

  if(mode == REPLAY_NEXT)//for next replay mode is 1
  {
    //check if previous page was having any non silent useraction then close that.
    if(this.currentPageIndex > 0)
    {
      //previous page instance. 
      var prevPageIndex = this.currentPageIndex-1;
      var prevPageInstance = this.pages[prevPageIndex].pageInstance;
      //hide previous page last useraction.
      if(this.userActionData[prevPageInstance].nonSilentUACount > 0)
      {
        let id = this.getLastNonSilentUAIndex(prevPageInstance);
        //showHide('uaDiv' + userActionData[prevPageInstance].data[userActionData[prevPageInstance].data.length - 1].id, 'hide');
        this.expandMe('uaDiv' + prevPageInstance + "_" + id);
      }
    }
    if(pageflag == "page")
      this.expandMe(null);
  }
  else if(mode == REPLAY_PREVIOUS)
  {
    //hide next page first useraction.
    if(this.currentPageIndex + 1 < this.pages.length)
    {
      var nextPageInstance = this.currentPageIndex + 1;
      if(this.userActionData[nextPageInstance].nonSilentUACount > 0)
      {
        //showHide('uaDiv' + userActionData[nextPageInstance].data[0].id, 'hide');
        this.expandMe('uaDiv' + this.userActionData[nextPageInstance].data[0].id);
      }
    } 
  }
  else /*no mode*/
  {
     // hide all open divs
     this.expandMe(null);
  }
    ReplayUtil.scrollIntoView(document.getElementById('panel-' + this.currentPageInstance),"highlightDiv");
    document.getElementById('panel-' + this.currentPageInstance).style.display = '';
    document.getElementById('panel-' + this.currentPageInstance).style.backgroundColor = '#C7E6D0'; // '#f6fbf8';//'#cfe1f1';
    let action = "Moved";
    try{
      let te = <HTMLElement> document.querySelector("#panel-"+ this.currentPageInstance+" #navtype");
       let t = te.innerText;
      action =  this.manipulateNavigation(t);
    }catch(e){}
      console.log("SPEECH : ",action,  " to new page ", this.pages[this.currentPageIndex].pageName.name);
      var text = "User " + action + " to " + this.pages[this.currentPageIndex].pageName.name;
      this.speak(text);
 
}

  addMousePointer(showFlag){
   try{
    if(this.replayDocument == null || this.replayDocument == undefined) {console.log("Replay Doc got undefined");}
    if(this.replayDocument.getElementById("replaypointer") == null)
    {
      //this.addClassToIframeDoc("/ProductUI/resources/netvision/pointerFonts/pointer-style.css");
      //this.addClassToIframeDoc("https://10.20.0.81/UnifiedDashboard/assets/line-icons/css/pointer-style.css");
      this.addClassToIframeDoc("/UnifiedDashboard/assets/line-icons/css/pointer-style.css");
      var pointer = document.createElement("span");
      pointer.className = ReplaySettings.pointer;
      //pointer.className = `pointer click-5`;
      pointer.id="replaypointer";
      pointer.style.cssText = "font-size: 30px; font-weight: bold; color: red;z-index:999999;position:absolute;float:initial;left:0px;top:0px;display:block;";
      this.replayDocument.body.appendChild(pointer);
    }
    if(showFlag)
      this.showMousePointer();
    else
      this.hideMousePointer();
  }catch(e){console.log("Exception in adding mouse pointer : ", e);}
    
  }
  getLastNonSilentUAIndex(prevPageInstance)
  {
  var arr =[];
  for(let i =0; i< this.userActionData[prevPageInstance].data.length ; i++ )
  {
   if(!this.userActionData[prevPageInstance].data[i].isSilent)
   {  
     try{
      if(this.userActionData[prevPageInstance].data[i])
        arr.push(this.userActionData[prevPageInstance].data[i].id.split("_")[1]);	 
     }catch(e){}
   }
  } 
    let sortedarr = arr.sort(function(A, B){return (B - A);});
    return sortedarr[0];
  }
  hideMousePointer(){
    if(this.replayDocument == null || this.replayDocument == undefined) {console.log("Replay Doc got undefined. You cant hide");}
    let pointer = this.replayDocument.getElementById("replaypointer");
    if(pointer == null)
      this.addMousePointer(false);
    pointer.style.display = "none";
  }
  showMousePointer(){
    if(this.replayDocument == null || this.replayDocument == undefined) {console.log("Replay Doc got undefined. You cant show");}
    let pointer = this.replayDocument.getElementById("replaypointer");
    if(pointer == null)
      this.addMousePointer(true);
    pointer.style.display = "block";
  }

  addClassToIframeDoc(path){
    //console.log("link added");
    let link = document.createElement('link');
    link.rel= "stylesheet";
    link.href = path;
    link.type = "text/css";
    this.replayDocument.head.appendChild(link);
  }
  addScriptToIframeDoc(path,doc){
    //console.log("script added1");
    if(doc.querySelector("#scr") != null)
      return;
    //console.log("script added2");
    let link = document.createElement('script');
    link.id = "scr";
    link.src = path;
    link.type = "text/javascript";
    doc.head.appendChild(link);
  }
  highlightPageinNavigator(){
    return;
    const pageDivs :any = document.querySelectorAll('.p-panel .ui-state-default, .p-panel .ui-widget-header');
    const actionDivs : any = document.querySelectorAll('[name="pagediv"]');
    let pds = [];
    for(let i=0; i< pageDivs.length; i++){
      const pageDiv : any = pageDivs[i];
      if(pageDiv.tagName && pageDiv.tagName == "DIV")
      pds.push(pageDiv);
    }
    let action = "Moved";

    for(let i=0; i< pds.length; i++){
      const pd : any = pds[i];
      let actionDiv = null;
      if(actionDivs.length > 0 )
        actionDiv =actionDivs[i].children[0];
      if(i == this.currentPageIndex){
        try{
        action =  this.manipulateNavigation(actionDiv.children[1].children[0].title);
        }catch(e){}
        console.log("SPEECH : ",action,  " to new page ", this.pages[this.currentPageIndex].pageName.name);
        var text = "User " + action + " to " + this.pages[this.currentPageIndex].pageName.name;
        this.speak(text);
          // selected page
          pd.style.background = "#c9e7ff";
          //pd.scrollIntoView();
          ReplayUtil.scrollIntoView(pd,"highlightPageinNavigator");
          if(actionDiv){
            actionDiv.style.background = "#c9e7ff";
            //actionDiv.scrollIntoView();
            ReplayUtil.scrollIntoView(actionDiv,"action");
            try{
              if(actionDiv.parentElement.id.indexOf("pageDiv") != -1 && actionDiv.parentElement.className.indexOf("hidePage"))
              actionDiv.parentElement.className = actionDiv.parentElement.className.replace("hidePage","showPage");
              //actionDiv.parentElement.scrollIntoView();
              ReplayUtil.scrollIntoView(actionDiv.parentElement,"action");
            }catch(e){}
          }
          //break;
      }else{
          pd.style.background = "white";
          if(actionDiv)
            actionDiv.style.background = "white";
      }
    }
    // since we have disabled replay-wrapper scrolling to hide extra scroll bars
    // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
    //document.querySelector('.replay-wrapper').scrollTop = 0;
  }
  manipulateNavigation(navType)
  {
    switch(navType.toLocaleLowerCase())
    {
      case "navigation" : return "navigated";
      case "reload" : return "reloaded";
      case "backward navigation" : return "backward navigated"; 
      case "soft navigation" : return "soft navigated";
      default : return "moved";
    }
  }

  //This method will check if onPagedumpLoad defined then execute that.
  /*pagedumpPostProcessing()
  {
    if(typeof onPagedumpLoad == 'function')
    {
      //console.log("onPagedumpLoad defined");
      //set a backdoor client on frame if not exist.
      let w = replayWindow;
      if(!w.__backdoor_client)
      {
        let s = w.document.createElement('script');
        s.type = "text/javascript";
        s.innerHTML = "function __backdoor_client(fun_str) { try {eval(fun_str); } catch(e) {console.log(\"Exception in processing onPagedumpLoad Callback\" + e.stack);}}";
        w.document.body.appendChild(s);
      }
      w.__backdoor_client("(" + onPagedumpLoad.toString() + ")();");
    }
  }*/
  
  // check if page thumbnails are not set , capture them from current pagedump
  checkImagePageNav() {
   try{
    let thumbnail: HTMLImageElement = null;
    let iconid: string = 'icon' + this.currentPageIndex;
      thumbnail = document.querySelector<HTMLImageElement>('#' + iconid);
      if(!thumbnail) return;
      //console.log("thumbnail : ", thumbnail);
      if (thumbnail.naturalHeight == 0 || thumbnail.src.indexOf('image-not-found') != -1)
        this.captureScreenImage(iconid);   
   }catch(e){console.log("Exception :" , e)}
  }

  //capture html canvas image
  captureScreenImage(imgid) {
    //console.log("captureScreenImage called with imgid : " , imgid);
    let cc = this;
    try{
    let thumbnail = document.querySelector<HTMLImageElement>('#' + imgid);
    let d: Document = <Document>this.replayDocument;
    let c = this;
    html2canvas(d.body, { logging: false, removeContainer:true, useCORS : true,type: 'view'
    /*,ignoreElements: (node) => {
      try
        {
           var a = node.offsetTop;//getComputedStyle(node);
           if(node.nodeName.toLocaleLowerCase != "iframe" || a < d.documentElement.clientHeight)
              return true;
           else
              return false;
        }catch(e){return false};
      }*/ 
    }).then(function(canvas) {
      var w = Math.max(d.documentElement.clientWidth, window.innerWidth || 0);
      var h = Math.max(d.documentElement.clientHeight, window.innerHeight || 0);
      var offset = 0;
      var cropX=0;
      var cropY=offset;
      var cropWidth= 1000;//w;
      var cropHeight=h;
      //console.log("cropWidth : ", cropWidth, " cropHeight : ", cropHeight);
      var cropped = document.createElement('canvas');
      cropped.width=cropWidth;
      cropped.height=cropHeight;
      var ctxCropped=cropped.getContext('2d');
      ctxCropped.drawImage(canvas,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
  
  
      var screenshot = cropped.toDataURL('image/jpeg');
      thumbnail.src = screenshot;
      var imgurl = screenshot.split(",")[1];
      c.saveNavigationImageTOServer("postData=" + imgurl,c.pages[c.currentPageIndex].pageName.name)
    },function(error){
      //console.log("captureScreenImage : In error section of  html2canvas :  ", error );
      try{
        let thumbnail = document.querySelector<HTMLImageElement>('#' + imgid);
        let d: Document = <Document>cc.replayDocument;
        html2canvas(d.body,{logging: false}).then(function(canvas) {
          var w = Math.max(d.documentElement.clientWidth, window.innerWidth || 0);
          var h = Math.max(d.documentElement.clientHeight, window.innerHeight || 0);
          var offset = 0;
          var cropX=0;
          var cropY=offset;
          var cropWidth= 1000;//w;
          var cropHeight=h;
          //console.log("cropWidth : ", cropWidth, " cropHeight : ", cropHeight);
          var cropped = document.createElement('canvas');
          cropped.width=cropWidth;
          cropped.height=cropHeight;
          var ctxCropped=cropped.getContext('2d');
          ctxCropped.drawImage(canvas,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
      
      
          var screenshot = cropped.toDataURL('image/jpeg');
          thumbnail.src = screenshot;
          var imgurl = screenshot.split(",")[1];
          cc.saveNavigationImageTOServer("postData=" + imgurl,c.pages[c.currentPageIndex].pageName.name)
        });
      }catch(e){
        console.log("captureScreenImage : Failed to capture screen by html2canvas again: ", e );
      }
    });
  }catch(e)
  {
    console.log("captureScreenImage : Failed to capture screen by html2canvas : ", e );
  }
}

  saveNavigationImageTOServer(img, pagename){
    //console.log("saveNavigationImageTOServer called");
      this.httpService.saveNavigationImageTOServer(img,pagename).subscribe(response => {
        console.log("Image saved to server");
      }, error =>{console.log("Failed to save image to server");});
  }
  showNextReplayChild(mode, event: Event) {
    //console.log("showNextReplay called" , this.currentUserActionIndex);
    if (event)
      event.preventDefault();
    //if(this.ss.speaking == true) return;
    // json data request not completed
    if(this.waitforrequest==true) return;
    // flag , to call processing pagedump or not  
    this.loadReplayJsonData(false,this.defoffset);
    
    //TODO: review it again. 
    if(this.pageLoadSpinnerTimer != -1 && ReplaySettings.replayMode == MANUAL_REPLAY)
    {
      this.processingPageDumpCallback(null, true);
      return;
    } 

    //TODO:  this case will not happen, so we can remove
    if(this.plSpinnerRunning == true)
    {
      //Check if spinner is running then hode.
      this.clearPageLoadSpinnerAndEnableControl();  
    }

    if(this.protocolversion != 200 && !this.isSuccessfullPageDump(0/*pageindex not needed*/, this.currentSnapshotIndex, this.currentPageInstance)) {
      //This will move to next snapshot.
      if(ReplaySettings.replayMode == AUTO_REPLAY){
        let a = this;
        this.stopAutoReplayTimer();
        this.waitTimer = true;
        setTimeout(()=>{
          console.log("Moving to next page");
          a.openSnapshot(REPLAY_NEXT)
          a.waitTimer = false;
         },1000);
      }
      else
        this.openSnapshot(REPLAY_NEXT);
      return;
    }

     

    //Flag to indicate if called internally by setTimeout or by user click.
    mode = mode || USER_DRIVEN;
    
    //Check if we don't have any useraction to be called then return.
    if(ReplaySettings.showTabs == false && this.currentPageIndex +1 >= this.pages.length && (this.currentUserActionIndex + 1) >= this.userActionData[this.currentPageInstance].data.length)
    {
      if(mode != SKIP_USERACTION){
        this.endReplay(true);
      }
      // also check , if all the next useractions are silent , uptill the data length and if user has clicked next button, instead of playing 
      // those ua in time out , call end replay
      if(((this.currentUserActionIndex + this.nextSilentUserActionCount) == this.userActionData[this.currentPageInstance].data.length -1) && mode == USER_DRIVEN)
      {
        this.endReplay(true);
      }
      return; 
    }

    
    //check if mrIntUATimer is running then just save this condition.
    if (mode == USER_DRIVEN && this.mrIntUATimer != -1 && this.pageNavigationType != PAGE_NAVIGATION_ON_CLICK) {
      //pendinguserrequest = replay_next;
      //run all the silent useraction and then move to next nonsilent one.
      clearTimeout(this.mrIntUATimer);
      this.mrIntUATimer = -1;
     // let maxV = 0;
      //check if we have next useraction and that useraction is silent
      while ((this.currentUserActionIndex + 1 < this.userActionData[this.currentPageInstance].data.length) &&
        (this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex + 1].isSilent == true) /*&& maxV < 10*/) {
        //maxV++;
        this.showNextReplayChild(SKIP_USERACTION, event);
      }
      this.showNextReplayChild(null, event);
      return;
    }

    //remove mrIntUATimer.
    if (this.mrIntUATimer != -1) {
      clearTimeout(this.mrIntUATimer);
      this.mrIntUATimer = -1;
    }
    //add mouse pointer.
    this.addMousePointer(true);
    //replay status.
    let replayStatus = FAILURE;
    let curPageUA = this.userActionData[this.currentPageInstance].data;
    //var curPageUA =  userActionData[currentPageInstance].ti.info[cpos].data;
    let silentFlag = false;
    //Now check what action is required.
    //If there are no userAction on current page then just move to next page.
    //if((currentUserActionIndex + 1) >= curPageUA.length)
    if (this.protocolversion != 200 && this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].uaEndIdx == this.currentUserActionIndex) {
      //openReplayPage(currentPageIndex + 1, REPLAY_NEXT);     
      if(ReplaySettings.replayMode == AUTO_REPLAY){
        let a = this;
        this.stopAutoReplayTimer();
        this.waitTimer = true;
        setTimeout(()=>{
          console.log("Moving to next page");
          a.openSnapshot(REPLAY_NEXT)
          a.waitTimer = false;
         },1000);
      }
      else
        this.openSnapshot(REPLAY_NEXT);
      return;
    }
    else if (this.protocolversion == 200 && curPageUA.length == 0) {
      this.openSnapshot(REPLAY_NEXT);
      return;
    }
    //Increase currentUserActionIndex and show replay.  
    this.currentUserActionIndex++;

    if (this.protocolversion == 200 && this.currentUserActionIndex >= curPageUA.length) {
      this.openSnapshot(REPLAY_NEXT);
      return;
    }
    if (curPageUA.length == 0 || curPageUA.length < this.currentUserActionIndex) return;
    
    //for making request againg in case page size is greater than limit
    if(curPageUA[this.currentUserActionIndex].hasOwnProperty("o") == true && mode != SKIP_USERACTION)
    {

        let currentoffset =  curPageUA[this.currentUserActionIndex].newoffset;
        let prevoffset    =  curPageUA[this.currentUserActionIndex].prevoffset;
       //console.log('insidenewcondition  repaly-handler=',currentoffset);
         if(currentoffset !=prevoffset){
        //let offset=this.currentPageInstance+"_"+currentoffset;
        
       //console.log('insidenewcondition keys not matched');
       this.userActionData[this.currentPageInstance].jsonDataCollected = false;
       this.loadReplayJsonData(this.userActionData[this.currentPageInstance].jsonDataCollected,currentoffset);
       this.currentUserActionIndex++;
       return;
        }
    }
    silentFlag = curPageUA[this.currentUserActionIndex].isSilent;
    if (!silentFlag) {
      this.currentNonSilentUserActionIndex++;

      //remove all previous color.
      //before moving to next replay first change color of previous marked elements.
      //TODO: create method for this.
      let prevElements :any = this.replayDocument.querySelectorAll('.' + REPLAY_ELEMENT);
      for(let z = 0; z < prevElements.length; z++){
        let prevElement :any = prevElements[z];
        prevElement.style.outline = ReplaySettings.replayPrevColor +  " solid";
        prevElement.style.outlineStyle = "auto";
      }
    }
    else
      this.currentSilentUserActionIndex++;

    replayStatus = this.showForwardUA(curPageUA[this.currentUserActionIndex], this.replayDocument, this.replayWindow, mode);

    //highlight uaDiv (only in case of non silent useraction)
    if (!silentFlag) {
      this.setNextSilentUserActionCount();
      if(mode !=  SKIP_USERACTION)
        this.highlightUADiv(REPLAY_NEXT,replayStatus);
      this.previousNonSilentUserActionIndex = this.currentUserActionIndex;
    }
    else
      this.nextSilentUserActionCount--;
      
     //update nextSilentUserActionCount.
     if(ReplaySettings.showSilentUserActionCount)
     { 
       //console.log("ReplaySettings.showSilentUserActionCount : ", this.nextSilentUserActionCount);
       var suadiv = <HTMLElement> document.querySelector('#panel-'+ this.currentPageInstance).querySelector('.suacount');
       if(suadiv)
       {
         if(this.nextSilentUserActionCount > 0)
         {
            //if(suadiv) suadiv.innerHTML = ""+ (Number(suadiv.innerHTML) - this.nextSilentUserActionCount); 
            //total non silent ua  - remaining silent ua
            //if(suadiv) suadiv.innerHTML = ""+ (this.getTotalSiletUserAction(this.currentPageInstance) - this.getRemainingSiletUA(this.currentPageInstance)) 
            //if(suadiv) suadiv.innerHTML = "" + this.getRemainingSiletUA(this.currentPageInstance);
            if(suadiv) suadiv.innerHTML = "" + this.currentSilentUserActionIndex;
          }
         //else 
          //suadiv.innerHTML = "0";
       }
     }

      // marking ua div red / yellow
    var uaDiv :any = document.querySelector('#uaDiv'+ curPageUA[this.currentUserActionIndex].id);
    
    if(uaDiv)
    {
      //in failue case change color to red.
      if(replayStatus == FAILURE)
   {
    uaDiv.querySelector('.warning-icon').style.display='none';
    uaDiv.querySelector('.error-icon').style.display='block';

        // uaDiv.style.backgroundColor = "red";
        uaDiv.setAttribute("replaystatus",-1);
   }   
      else if(replayStatus == -2) // for hidden element
      {
        uaDiv.querySelector('.warning-icon').style.display='block';
        uaDiv.querySelector('.error-icon').style.display='none';
        // uaDiv.style.backgroundColor = "yellow";
        uaDiv.setAttribute("replaystatus",-2);
      }
      else 
        uaDiv.style.color = "black";
    }
    this.updateProgressBar(); 
    if(!silentFlag){
      //this.navigationBar.update();
      //this.passMsg();
    }
    this.passMsg();
    if (this.currentPageIndex + 1 >= this.pages.length && this.currentUserActionIndex + 1 == curPageUA.length) {
      return;
    }
    //In case of auto replay mode, just leave it. It will be handled by caller.
    if(ReplaySettings.replayMode == AUTO_REPLAY || mode == SKIP_USERACTION)
    {
      return;
    } 
    let root = this;
    //check if current replay Failed. then move to next one. 
    if (replayStatus != SUCCESS && !silentFlag) {
      //move to next one.
      setTimeout(function () {
        root.showNextReplayChild(LAST_USERACTION_FAILED, event);
      }, 100);
      return;
    }
    if (silentFlag && (mode == LAST_USERACTION_FAILED)) {
      setTimeout(function () {
        root.showNextReplayChild(LAST_USERACTION_FAILED, event);
      }, 0);
      return;
    }
    //check for next UserAction if it is silent then run that.
    //TODO: A: currently we are disabling delay in silent user action.
    if (this.currentUserActionIndex + 1 < curPageUA.length) {
      var nextIdx = this.currentUserActionIndex + 1;
      //check if it is silent.
      if (curPageUA[nextIdx].isSilent) {
        //get timestamp of next userAction. and set timeout.
        var diff = curPageUA[nextIdx].timestamp - curPageUA[this.currentUserActionIndex].timestamp;
        /*if(ReplaySettings.replayMode != AUTO_REPLAY)
        {
          if(diff > 1000) diff = 1000;
        }*/
        this.mrIntUATimer =  <any>setTimeout(function () {
          root.pageNavigationType = PAGE_NAVIGATION_NEXT_REPLAY;
          root.showNextReplayChild(SILENT_USERACTION, event);
        }, diff);
        return;
      }
    }
  }
 
  // only handling to show UA divs
  // toggling of divs not handled here
  highlightUADiv(mode,rstatus)
  {
  var name= document.getElementsByName('uadiv');
  for(var i =0; i < name.length ; i++)
  {
    var s = Number(name[i].getAttribute("replaystatus"));
    //if(s != -1 && s != -2)
      name[i].style.backgroundColor = 'white';
  }
  var count =""; 
  var uaDiv = document.getElementById('uaDiv' + this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex].id); 

  //get previous UserAction. 
  var uaDivPrev = null; 
 
  if(mode == REPLAY_NEXT)//for next replay mode is 1
  {
    try{
      if(this.previousNonSilentUserActionIndex >= 0)
        uaDivPrev = document.getElementById('uaDiv' + this.userActionData[this.currentPageInstance].data[this.previousNonSilentUserActionIndex].id);
    }catch(e){
      uaDivPrev = null;
    }
    if(uaDiv)
    {
      uaDiv.style.display = 'block';
      if(rstatus == -1)
      {
        uaDiv.querySelector('.warning-icon')['style'].display='none';
        uaDiv.querySelector('.error-icon')['style'].display='block'
        //uaDiv.style.backgroundColor = 'red';
      }
      else
        uaDiv.style.backgroundColor = '#e7f7ed'; // '#f6fbf8'//'#cadbea';
      //uaDiv.children[2].scrollIntoView();
      //ANJALI:uaDiv.scrollIntoView();
      try{
        var action = "";
        var uaVal = uaDiv.querySelector('.useraction-val');
        var uaInfo = uaDiv.querySelector('.useraction-info'); 
        var etype = uaInfo.querySelectorAll('[actionfield="attr"]')[0] as HTMLElement;
        var evalCol = uaInfo.querySelectorAll('[actionfield="attr"]')[2] as HTMLElement;
        var imgCol = uaInfo.querySelectorAll('div')[2]; // img
        action = uaVal.querySelector('[actionfield="icon"]')["title"];
        // uaDiv.querySelector('[name=uainfo]').children[uaDiv.querySelector('[name=uainfo]').children.length-1].textContent
        //console.log("SPEECH : ", action , evalCol.innerText);
        var text = "";
        if(!evalCol)
        {
          // means, it an image, so take value,
          let valueEle =  uaInfo.querySelectorAll('[actionfield="attr"]')[1] as HTMLElement; 
          let v= valueEle.textContent;
          text = this.frameSentence(action,v,etype.innerText );
        }
        else
          text = this.frameSentence(action,evalCol["title"],etype.innerText );
        this.speak(text);
      }catch(e){console.log("SPPECH EXCEPTION  : ", uaDiv, e );}
      //parent.document.getElementById('eventiddiv').scrollTop += parent.document.getElementById('eventiddiv').scrollHeight;
    }
    if(uaDiv && (uaDiv == uaDivPrev))
    { 
      // hide previously visible
      this.expandMe(null);
      this.expandMe(uaDiv.id);
      return;
    }
    
    //In this case close previous one and open latest one.
    if(uaDivPrev)
    {
      this.expandMe(uaDivPrev.id);//showHide(uaDivPrev.id, 'hide');
    }
    if(uaDiv)
    {
      this.expandMe(uaDiv.id);//showHide(uaDiv.id, 'show');
    }
  }
  else
  {
    //check if we have any more useraction.
    if(this.previousNonSilentUserActionIndex > 0)
      uaDivPrev = document.getElementById('uaDiv' + this.userActionData[this.currentPageInstance].data[this.previousNonSilentUserActionIndex].id);
    if(uaDiv)
    {
      uaDiv.style.display = '';
      if(rstatus == -1){
        uaDiv.querySelector('.warning-icon')['style'].display='none';
        uaDiv.querySelector('.error-icon')['style'].display='block'
        //uaDiv.style.backgroundColor = 'red';
      }
      else
        uaDiv.style.backgroundColor = '#e7f7ed'; // '#f6fbf8';//'#cadbea';
      //uaDiv.scrollIntoView();
      //ReplayUtil.scrollIntoView(uaDiv,"highlightUADiv");
      //parent.document.getElementById('eventiddiv').scrollTop += parent.document.getElementById('eventiddiv').scrollHeight;
    }
    if(uaDiv == uaDivPrev)
    { 
      // hide previously visible
      this.expandMe(null);
      //expandMe(uaDiv.id);
      return;
    }
    //close previous first, then it will handle case when both previous and current are same.
    if(uaDivPrev)
    this.expandMe(uaDivPrev.id);//showHide(uaDivPrev.id, 'hide');
    if(uaDiv)
    this.expandMe(uaDiv.id);//showHide(uaDiv.id, 'show');
  }

  if(uaDiv)
  {
    //uaDiv.scrollIntoView();
    let msg : ReplayMessage = {"key" : "collapseUADiv","data":""};
    this.broadcast('msg',msg);
    ReplayUtil.scrollIntoView(uaDiv,"highlightUADiv");
    //parent.document.getElementById('eventiddiv').scrollTop += parent.document.getElementById('eventiddiv').scrollHeight;
  }
  // since we have disabled replay-wrapper scrolling to hide extra scroll bars
  // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
  //document.querySelector('.replay-wrapper').scrollTop = 0;
}
 expandMe(elm)
 {
        
 }
 frameSentence(action,value,tag )
 {
  let v = action;  
  if(value != null && value.indexOf("*") == -1)
   v= action + " " + value;  
   try{
    if(action.toLowerCase().indexOf("auto") != -1) 
       return v;
     else
       return "User "  + v;
   }catch(e){
     return "User "  + v;
   }
 }


  //this function will return if pass or fail.
  showForwardUA(eventData, d:Document, w:Window, mode:string) {
    d = d || document;
    w = w || window;

    if (eventData.type.indexOf("_") != -1) {
      eventData.type = eventData.type.split("_")[1];
    }
    if (eventData.type == JSON_USERACTION)
      return this.showForwardJSONUA(eventData, d, w, mode);
    else if(this.protocolversion == 200)
      return this.showForwardAndroid(eventData, d, w);
    else
      return this.showForwardDBUA(eventData, d, w);
  }

  showForwardJSONUA(eventData, d:Document, w:Window, mode:string) {
    //TODO: put debug with complete eventData detail.
    /*** eventData format - 
            {
              timestamp: 1447739716960,
              type: JSON_USERACTION,
              value: [[],[{"nodeType":1,"id":8188,"tagName":"SCRIPT","attributes":{"type":"text/javascript","src":"http://cts.channelintelligence.com/13014088_landing.js"},"previousSibling":null,"parentNode":{"id":9}}],[],[]]
              isSilet: true,
              id: null<unique id>
            };
    **/

    if (typeof eventData == "undefined")
      return SUCCESS;

    //nvreporterdebug("NV debug: Executing" + eventData.value);

    //console.log("showForwardJSONUA called : ", JSON.stringify(eventData.value));
    let jsonUserAction = eventData.value;
    //if(!replayWindow.nvDomBuilder) return FAILURE;
    try{
      jsonUserAction.d.splice(4);
      //TODO: currently we are not sending status.
      //FIXME: If any iframe is in loading state then we can not make the change in that. For that we have to make this code async.
      //Currently all such dom changes will be discarded. We can log error for such cases.
      //if(replayWindow.nvDomBuilder.loadingIframe > 0 )
      //console.warn( replayWindow.nvDomBuilder.loadingIframe + " iframes are still loading. " + " loadingIframeElement are - " + JSON.stringify(replayWindow.nvDomBuilder.loadingIframeElement) );
      let reverseRecord = this.nvDomBuilder["d"].apply(this.nvDomBuilder, jsonUserAction.d);
      //Note: in reverseRecord we will be having reverse changes that have been applied. this can be used to run in backward mode.
      //check if we already have previous change then don't concat.
      if (jsonUserAction.d.length < 8) {
        jsonUserAction.d = jsonUserAction.d.concat(reverseRecord);
      }
    }catch(e){
      console.log("Exception in showForwardJSONUA : ", e.message);
    }
    return SUCCESS;
  }

  getCurrentSnapshotPath(pageIndex: number, snapshotIdx: number, pinst: number) {

    return this.userActionData[pinst].snapshotInfo[snapshotIdx].snapshotPath;
  }

  isSuccessfullPageDump(pageIndex, snapshotIdx, pinst: number) {
    let path = this.getCurrentSnapshotPath(pageIndex, snapshotIdx, pinst);
    if (path == "" || path == null)
      return false;
    return true;
  }
  //this method will return currentNonSilentUserActionIndex.
  // useractions uptill now.
  getNonSilentUserActionIndex(pageInstance: number, currentSnapshotIndex: number) {
    var index = -1;
    //update current useraction
    for (var z = 0; z < this.pages.length; z++) {
      var pi = this.pages[z].pageInstance;
      if (this.pages[z].pageInstance < pageInstance) {
        if (this.userActionData[pi])
          index += this.userActionData[pi].nonSilentUACount;
      }
    }
    //Check for currentSnapshotIndex.
    if (currentSnapshotIndex) {
      //include nonSilentUACount till this currentSnapshotIndex.
      while (currentSnapshotIndex-- > 0) {
        if (this.userActionData[pageInstance].snapshotInfo.hasOwnProperty(currentSnapshotIndex)) {
          index += this.userActionData[pageInstance].snapshotInfo[currentSnapshotIndex].nonSilentUACount;
        }
      }
    }
    return index;
  }
  setNextSilentUserActionCount() {
    var count = this.currentUserActionIndex + 1;
    this.nextSilentUserActionCount = 0;
    while (count < this.userActionData[this.currentPageInstance].data.length && 
           this.userActionData[this.currentPageInstance].data[count++].isSilent)
      this.nextSilentUserActionCount++;
  }

  //This is generic one for openign both pagedump and snapshot.
//Note: assuming that first and last page check will already be there. 
 openSnapshot(mode : string)
 {
  mode = mode || REPLAY_NEXT;
  //pagedumpload = false;
  if(mode == REPLAY_NEXT)
  {
    //check if next there is a snapshot then load that else load the page. 
    if(this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].nextSnapIdx == -1)
    {
      ///Check if last page then end session.
      if(this.currentPageIndex + 1 < this.pages.length)
        this.openReplayPage(this.currentPageIndex + 1,  mode); 
      else 
      {
        this.endReplay(true);
        return; 
      }
        
    }
    else {
      //SNAPSHOT_CHANGED = true;
      this.openReplaySnapshot(this.currentPageIndex, this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].nextSnapIdx, mode);
    }
  }
  else {
    //If there is no page and snapshot then return. 
    if(this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].prevSnapIdx == -1 && this.currentPageIndex == 0)
      return;

    //Check if previously there is any snapshot then load that else laod page. 
    if(this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].prevSnapIdx == -1 && this.userActionData[this.pages[(this.currentPageIndex - 1)].pageInstance].lastSnapShotIdx == 0)
    {
      //open page. 
      this.openReplayPage(this.currentPageIndex -1, mode);
      return;
    }

    //Handling for snapshot.
    //SNAPSHOT_CHANGED = true;
    if(this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].prevSnapIdx == -1) 
      this.openReplaySnapshot(this.currentPageIndex - 1, this.userActionData[this.pages[(this.currentPageIndex - 1)].pageInstance].lastSnapShotIdx, mode);
    else 
      this.openReplaySnapshot(this.currentPageIndex, this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].prevSnapIdx, mode);
  }
}

//TODO: review all these methods.
//Note: we are not putting any check regarding page counts
//Note: replay controlls will be disabled while page is loading. 
openReplayPage(pageIndex, mode)
{
  mode = mode || REPLAY_NEXT;
  this.SNAPSHOT_ID = 0;
   this.currentSnapshotIndex = 0;
   this.currentPageIndex = pageIndex;
   this.currentPageInstance = this.pages[this.currentPageIndex].pageInstance;
   this.currentPage = this.pages[this.currentPageIndex];
  //check if auto replay timer is running then stop that.

  //stopAutoReplayTimer(); 
  
  if(pageIndex  >= this.pages.length || pageIndex < 0)
    return;

  //pageLoading = true;
  
  this.currentUserActionIndex = -1;
  this.previousNonSilentUserActionIndex = -1;
  //set page navigation type.
  if(mode == REPLAY_NEXT)
    this.pageNavigationType = PAGE_NAVIGATION_NEXT_REPLAY;
  else
    this.pageNavigationType = PAGE_NAVIGATION_PREVIOUS_REPLAY; 

  this.openPage(this.currentPageIndex, mode,null); 

  //2nd arg - retainIcon flag.
  this.openPageDump(this.currentPageIndex, false, 0);
}

openReplaySnapshot(pageIdx, snapshotIdx, mode)
{
  console.log("ISSUE - openReplaySnapshot - " +  snapshotIdx);
  mode = mode || REPLAY_NEXT;
  
  //stopAutoReplayTimer(); 

  //pageLoading = true;
  
  this.currentSnapshotIndex = snapshotIdx;
  //SNAPSHOT_CHANGED = true;
  if(mode == REPLAY_NEXT)
    this.pageNavigationType = PAGE_NAVIGATION_NEXT_REPLAY;
  else 
    this.pageNavigationType = PAGE_NAVIGATION_PREVIOUS_REPLAY;

  this.openPageDump(pageIdx, false, snapshotIdx);

  // just to highlight useraction page div
    this.openPage(pageIdx, mode,"snapshot");
    if(mode == REPLAY_PREVIOUS)
      this.highlightDiv(mode,"page","snapshot");
}

 /*openPageDump(pageindex,mode,snapShotIdx){
   if(snapShotIdx == null)
     snapShotIdx == this.currentSnapshotIndex;
     this.openPageDumpClone(this.pages, pageindex, this.currentPageInstance, snapShotIdx, mode);
 }*/
 openPageDumpClone(pages : PageInformation[], currentpageindex:number,pageinstance:number, snapshotIndex:number, mode :string){
  console.log("openPageDumpClone called for pageinstance : ", pageinstance, " snapshotIndex : ",snapshotIndex);
  this.setPageLoadCallback(snapshotIndex);
 
  /** 
  this.httpService.getSnapShotPathThroughAjax(1, 
    this.session.startTime,
    this.session.sid,
    pageinstance, 
    this.session.partitionID, snapshotIndex).subscribe(response => {  
    **/
   let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
   let rr = this;
   this.replayService.snapWrapper("getSnapShotPathThroughAjax",[1,this.session.startTime,this.session.sid,pageinstance,this.session.partitionID,snapshotIndex],"snapshots",nextdata,"path",snapshotIndex).subscribe(response =>{   
          //console.log("snapshot request=",response);
          let snapshotPath = response.split("%%%")[0];
           snapshotPath = snapshotPath.trim();
           if(rr.userActionData[pageinstance]){
             //console.log("openPageDump : Setting in replayUserActionData  : ", snapshotPath);
             rr.userActionData[pageinstance].snapshotInfo[snapshotIndex].snapshotPath = snapshotPath;
           }
           let iframeEle :any = document.querySelector("#replayIframe");
           //console.log("iframeEle : ", iframeEle, " -- ", iframeEle.nativeElement);
           let win = iframeEle.contentWindow;
           rr.replayWindow = win;
           const iframe_document: Document = <Document> win.document;
           rr.replayDocument = iframe_document;
        
          /*handling for no pagedump case*/
          if(snapshotPath == "")
          { /* pagedump does not exist*/
            // TODO : add a icon or messgae to show faild snapshot is skipped
            //for (; rr.replayDocument.firstChild; )
            //rr.replayDocument.removeChild(rr.replayDocument.firstChild);
            if(!snapshotIndex || ReplaySettings.skipFailedSnapshot == true)
            {
               if(rr.firstPageFlag && currentpageindex < (rr.pages.length - 1))
                 rr.openPageDump(currentpageindex+1,null,0);
               else if(currentpageindex == (rr.pages.length - 1))
               { // for last page
                 rr.pagedumpload = true;
                 iframeEle.src ="/netvision/reports/noPageDump.html";
                 rr.processingPageDumpCallback.call(rr);
               }
               else
               {
                 rr.pagedumpload = true;
                 rr.processingPageDumpCallback.call(rr);
               }
               return;
            }else
            {
               rr.pagedumpload = true;
               iframeEle.src ="/netvision/reports/noPageDump.html";
               rr.processingPageDumpCallback.call(rr);
               return;
            }
          }
             
          //let rr =this;
          if(rr.session.protocolVersion == 200)
          {
            // not emptying up the document here
            //console.log("readAndroidSnapshotFile called");
            rr.currentSnapshotIndex = snapshotIndex;
            rr.SNAPSHOT_ID =  snapshotIndex;
            //rr.setIframeSize();
            let requestUrl = "/netvision/rest/webapi/replayandroidImage?access_token=563e412ab7f5a282c15ae5de1732bfd1";
            requestUrl +="&replayFilepath=" + snapshotPath;
            // no snapshot case, set iframe src
            /*if(snapshotIndex == 0){
              //iframeEle.src = "http://10.20.0.53:8001" + requestUrl;
              iframeEle.src = requestUrl;
              rr.pagedumpload = true;
              rr.processingPageDumpCallback(null,false);
              return;
            }*/
            let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
            rr.replayService.snapWrapper("readAndroidSnapshotFile",[snapshotPath],"snapshots",nextdata,"pagedump",snapshotIndex).subscribe(response => {
            //this.httpService.readAndroidSnapshotFile(snapshotPath).subscribe(response => {
              //this.replayIframe.nativeElement.src=response;
              
              //console.log("readAndroidSnapshotFile snapshot",snapshotPath);
              //console.log("readAndroidSnapshotFile response",response);
              var reader = new FileReader();
              reader.addEventListener("load", function() {
                //console.log("Inside reader");
                var imagess = new Image();
                //image.height = 100;
                //image.title = file.name;
                imagess.src =<any> this.result;
                imagess.id="imgid1";
                // bug id : 109870
                imagess.style.cssText = "width:100%;height:100%";
                let d = rr.replayDocument;
                // empty the document
                for (; d.firstChild; )
                  d.removeChild(d.firstChild);
                // create head and body and append image
                d.append(d.createElement('html'))
                if(!d.head){
                    let h = d.createElement("head");
                    d.documentElement.appendChild(h);
                }
                if(d.body){
                  let dib = d.createElement('div');
                  dib.id ="divid1";
                  d.body.appendChild(dib);
                  dib.appendChild(imagess);
                }else{
                  let l = d.createElement("body");
                  d.documentElement.appendChild(l);
                  let dib = d.createElement('div');
                  dib.id ="divid1";
                  dib.appendChild(imagess);
                  d.body.appendChild(dib);
                }
                rr.pagedumpload = true;
                rr.processingPageDumpCallback(null,false); 
              }, false);
              reader.readAsDataURL(response);
            });
             return;
          }


            //call to read pagedump file and render to iframe  
            let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
            this.replayService.snapWrapper("readSnapshotFile",[snapshotPath],"snapshots",nextdata,"pagedump",snapshotIndex).subscribe(response => {
           //this.httpService.readSnapshotFile(snapshotPath).subscribe(response => {
             //start with nvDomBuilder 
             //console.log("lets do it"); 
             for (; rr.replayDocument.firstChild; )
             rr.replayDocument.removeChild(rr.replayDocument.firstChild);
             //console.log("Neeraj , this.replayDocument 5:" , rr.replayDocument);
             // just to pass nvconfigurations
             let obj = {'nvconfigurations' : this.nvconfigurations};
             rr.nvDomBuilder = new DOMBuilder(rr.replayDocument, 'Admin',rr, obj);
            //window.nvDomBuilder = nvDomBuilder;
            //console.log("processing json data to form pagedump on - " + document);
            
            let basePath = ReplayUtil.getBasePathURL(rr.pages[currentpageindex].url);
            //console.log("basepath : ", basePath  ," for page : ",  rr.pages[currentpageindex].url);
            rr.nvDomBuilder.initialize.apply(rr.nvDomBuilder, [response, rr.pages[currentpageindex].url]); 
          }); 
     });
}
 // pageid, mode, flag-"snapshot"
 /*flag = snapshot, in case we going to previous page snapshot*/
 openPage(a,b,c){
   //Caution :  highlightDiv functionality is also included in highlightPageinNavigator function
   // do not call in case of snapshot
   if(c == null)
     this.highlightPageinNavigator();
   this.highlightDiv(b,"page",c);

 }

  showForwardDBUA(eventData, d:Document, w:Window) {
    //TODO: put debug with complete eventData detail.
    var uAction = eventData.value;
    //console.log(" called showForwardDBUA with value : ", uAction);
    if (!uAction) return SUCCESS;
    uAction.eventtype = Number(uAction.eventtype);
    uAction.idtype = Number(uAction.idtype);
    if (uAction.eventtype == DBUA_SCROLL) {
      //console.log("w : ",w);
      //set previous scroll point.
      //TODO: handle for both x and y offset.
      uAction.prevValue = (w.pageYOffset || d["scrollTop"]) - (d["clientTop"] || 0);
      //w.scrollTo(0, uAction.ypos);
      w.scroll({top:uAction.ypos,behavior:"smooth"}); 
      return 0;
    }
    var ct = this;
    function iterate(dcount,datapoints,new_x,new_y){
      if(dcount<datapoints.length){
          new_x += Number(datapoints[dcount][0]); // x cordinate
          new_y += Number(datapoints[dcount][1]);  // y cordinate
          var next = dcount;
          if((dcount+1)<datapoints.length)
            next = dcount +1;
          var transitionDuration = ReplayUtil.calculateSpeed(datapoints[dcount],datapoints[next]);
          // to debug mouse move data cordinates
          //ReplayUtil.renderElement((new_x*ct.swidth)/64, (new_y*ct.sheight)/64);
          ct.updateMouse((new_x*ct.swidth)/64, (new_y*ct.sheight)/64, null,null,null,null,null,transitionDuration);  
          var s = transitionDuration *1000;
        
          dcount++;
          window.setTimeout(()=>{
            iterate(dcount,datapoints,new_x,new_y);
          }, s);
      }
    }
    if(uAction.eventtype == DBUA_MM){
      if(ReplaySettings.showMouseMoveData == true){
      // datapoint will be array of x,y cordinates [[x,y],[x,y]....]
      let datapoints = ReplayUtil.mmdecoder(uAction.value);
      let dcount = 0;
      let new_x =0, new_y=0;
      iterate(dcount,datapoints,new_x,new_y);
      console.log("Mouse move cordinates : ", datapoints);
      
    }
      return 0;
    }

    //validate if uAction correct.
    if (!uAction.elementid) {
      //TODO: put error.
      return -1;
    }
    let iframeDoc:any;
    if (uAction.iframeid && uAction.iframeid != "")
      iframeDoc = this.getIframeDocument(uAction.iframeid).doc;


    var element, nearParentFlag = false, value;

    //Note: in case of DBUA_CLICK and DBUA_CHANGE, if given element not found then find it's parent element.
    if (uAction.eventtype == DBUA_CLICK || uAction.eventtype == DBUA_CHANGE || uAction.eventtype == DBUA_AUTOFILL)
      nearParentFlag = true;

    // show in useraction info 
    var uaDiv = null;
    if (eventData.isSilent == false)
      uaDiv = document.querySelector('#uaDiv' + eventData.id);
    //console.log("uaDiv : ", uaDiv , " eventData.id : ", eventData.id);
    if (uaDiv) // when we traeting auto fill changes as silent , we will not have uaDiv
    {
      var uaInfo = uaDiv.querySelector('.useraction-info');
      // if there is an image , eselector will be null
      var eselector = null;
      if(uAction.elementtype != "IMG")
        eselector = uaInfo.querySelectorAll("div")[2].querySelector('div').querySelector('span');
      //console.log("uaInfo : " , uaInfo, " eselector : ", eselector);
    }
    //get element.
    if (uAction.idtype == DOM_ID) {
      //TODO: handling for nearParentFlag.
      if (uAction.iframeid && uAction.iframeid != "")
        element = iframeDoc.getElementById((uAction.elementid));
      else
        element = d.getElementById((uAction.elementid));
      if (uaDiv && eselector) {
        eselector.innerText = ReplayUtil.shortTextContent("#" + uAction.elementid, 20, "hide");
        eselector.title = "#" + uAction.elementid;
      }
    }
    else if (uAction.idtype == DOM_XPATH) {
      if (uAction.iframeid && uAction.iframeid != "")
        element = ReplayUtil.getElementByXPath(uAction.elementid, nearParentFlag, w, iframeDoc);
      else
        element = ReplayUtil.getElementByXPath(uAction.elementid, nearParentFlag, w, d);
      if (uaDiv && eselector) {
        eselector.innerText = ReplayUtil.shortTextContent(uAction.elementid, 20, "hide");
        eselector.title = uAction.elementid;
      }
    }

    else if (uAction.idtype == CSS_SELECTOR) {
      if (uAction.iframeid && uAction.iframeid != "")
        element = ReplayUtil.getElementByCssSelector(uAction.elementid, nearParentFlag, w, iframeDoc);
      else
        element = ReplayUtil.getElementByCssSelector(uAction.elementid, nearParentFlag, w, d);
      if (uaDiv && eselector) {
        eselector.innerText = ReplayUtil.shortTextContent(uAction.elementid, 20, "hide");
        eselector.title = uAction.elementid;
      }

    }


    if (element == null) {
      //nvreporterdebug("Element not found, with id - " + uAction.elementid + "(" + IDType[uAction.idtype] + ")");
      //mark useraction summary entry as red.
      if (eventData.isSilent == false)
        uaDiv = document.querySelector('#uaDiv' + eventData.id);
      if (uaDiv)
      uaDiv.querySelector('.warning-icon').style.display='none';
      uaDiv.querySelector('.error-icon').style.display='block';

        // uaDiv.style.background = "red";
      this.highlightPageAction(null,eventData.id);
      return -1;
    }

    if (element.offsetHeight == 0) {
      //nvreporterdebug("Element found hidden, with id - " + uAction.elementid + "(" + IDType[uAction.idtype] + ")");
      //mark useraction summary entry as red.
       uaDiv = document.querySelector('#uaDiv' + eventData.id);
      if (uaDiv)
      uaDiv.querySelector('.warning-icon').style.display='block';
      uaDiv.querySelector('.error-icon').style.display='none';

        // uaDiv.style.background = "yellow";
      this.highlightPageAction(null,eventData.id);
      return -2;
    }
    // this will update the info in uaDiv and will highlight the corresponding uaDiv, so that speech synthesis can do correct commentary
    // doing it after mouse movement, can cause incorrect commentry bcoz somethings are added dynamically
    if (uaDiv)
      this.updateUAInfo(element, 'uaDiv' + eventData.id); 
    //scroll window to element.
    //this.scrollReplayWindow(element);
    // to show pointer at element
    this.updatePointer(element,uAction,uaDiv,eventData,"next");

    //TODO: check why we need this condition.
    /*if (element.tagName == "BODY" && uAction.eventtype == DBUA_ADD_CHILD_AFTER_END || uAction.eventtype == DBUA_ADD_CHILD_AFTER_BEGIN)
      uAction.eventtype = DBUA_APPEND_CHILD;*/

      // highlight replay element is done when trainsition is done

    return 0;
  }
  highlightNextReplayElement(uAction,element,uaDiv,eventData){
    let value ="";
    
    if (uAction.eventtype == DBUA_CLICK) {
      try{
     element.style.outline = ReplaySettings.replayColor + " solid";
     element.className = element.className + " " + REPLAY_ELEMENT;
     element.style.borderWidth = "3";
     element.style.outlineStyle = "auto";
     }
     catch(e){}

     if (uAction.elementtype == "INPUT") {
       if (uAction.elementsubtype == "radio") {
         element.checked = !(element.checked);
         if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently)
       
         element.style.outline = ReplaySettings.replayColor + " solid";
         element.className = element.className + " " + REPLAY_ELEMENT;
         element.style.outlineStyle = "auto";
       }
     }
  

     if(uAction.elementtype == "IMG")
     {
       //add this image in useraction summary.
       this.setImageElement(element, 'uaDiv' + eventData.id); 
     }
   //  else
    /*if (uaDiv)
       this.updateUAInfo(element, 'uaDiv' + eventData.id); */

   }

   else if (uAction.eventtype == DBUA_CHANGE || uAction.eventtype == DBUA_AUTOFILL) {
     //decode the value if encoded.
     //TODO: test cases for radio, and checkbox.
     value = ReplayUtil.checkEncryptDecrypt(uAction.pageinstance, uAction.value, uAction.encValue);
     if (uAction.elementtype == "INPUT") {
       if (uAction.elementsubtype == "radio") {
         element.checked = value;
         if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
           element.style.outline = ReplaySettings.replayColor + " solid";
           element.style.outlineStyle = "auto";
         }
         element.className = element.className + " " + REPLAY_ELEMENT;
       }
       else if (uAction.elementsubtype == "checkbox") {
         element.value = value;
         element.checked = !element.checked;
         if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
           element.style.outline = ReplaySettings.replayColor + "  solid";
           element.style.outlineStyle = "auto";
         }
         element.className = element.className + " " + REPLAY_ELEMENT;
       }
       //TODO: check if we will get change event for such element.
       else if (uAction.elementsubtype == "image" && uAction.eventtype != DBUA_AUTOFILL) {
         element.style.outline = ReplaySettings.replayColor + " solid";
         element.className = element.className + " " + REPLAY_ELEMENT;
         element.style.borderWidth = "3";
         element.style.outlineStyle = "auto";
         //setImageElement(element, 'uaDiv' + eventData.id);
       }
       //For rest of the element type.
       else {
         element.value = value;
         if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
           element.style.outline = ReplaySettings.replayColor + " solid";
           element.style.outlineStyle = "auto";
          }
         element.className = element.className + " " + REPLAY_ELEMENT;
       }
     }
     else if (uAction.elementtype == "SELECT") {
       //save previous value.
       uAction.prevValue = encodeURIComponent(element.innerHTML);
       element.options[0].innerHTML = value;
       element.options[0].selected = true;
       if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
         element.style.outline = ReplaySettings.replayColor + " solid";
         element.style.outlineStyle = "auto";
       }
       element.className = element.className + " " + REPLAY_ELEMENT;
     }
     else if (uAction.elementtype == "TEXTAREA") {
       element.value = value;
       if (uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
         element.style.outline = ReplaySettings.replayColor + " solid";
         element.style.outlineStyle = "auto";
       }
       element.className = element.className + " " + REPLAY_ELEMENT;
     }
    
     /*if (uaDiv)
       this.updateUAInfo(element, 'uaDiv' + eventData.id);*/
   }
  }
  updateUAInfo(element, uaDivId)
  {
    if(element == null)
     return;
    //Initially we have filled the information like - 
    //<div class="useraction-info" style="display: block;">ElementType:INPUT(text)<br><font>ElementValue:Password1!<br></font></div> 
    //Note: ElementType is already there. Just update element Value.
   var uaDiv = document.querySelector('#'+uaDivId);
   var uaVal = uaDiv.querySelector('.useraction-val');
   var uaInfo = uaDiv.querySelector('.useraction-info'); 
   var etype = uaInfo.querySelectorAll('[actionfield="attr"]')[0] as HTMLElement;
   var evalCol = uaInfo.querySelectorAll('[actionfield="attr"]')[2] as HTMLElement;
   var imgCol = uaInfo.querySelectorAll('div')[2]; // img
   var evalue = "";
   //if(!etype)
   //{
     etype.innerText =  element.tagName.toUpperCase();
     if(element.tagName == 'INPUT')
       etype.innerText += "(" + element.type +")";
   //}
  /*
    if(element.tagName != 'IMG')
    {
      takeSnaps(element,imgCol);
    }
  */
   
   //Note: we will first prefer value|  
   //Note: in some cases we can not prefer value, example select
   //Note: for some
   if(element.tagName == 'IMG' )//&& imgCol.querySelector('img') == null)
   {
      this.setImageElement(element, uaDivId);
   }
   else if(element.tagName == 'INPUT' && (element.type == 'radio' || element.type ==  'checkbox' ))
   {
     //In this case find the nearest label.
      evalue = ReplayUtil.getLabel(element);
   }
   else if(element.tagName == 'SELECT')
   {
      evalue = element.options[element.selectedIndex].textContent || element.value; 
   }
   else if(element.tagName == 'INPUT')
   {
     evalue = element.value;
   }
    
   if (evalue.trim() == "")
   {
     evalue = ReplayUtil.getLabel(element); 
   }

   let label = evalue;

   // try to get level for input type fields. 
   if (element.tagName == 'INPUT' || element.tagName == 'SELECT') {
     label = ReplayUtil.getLabel(element);
     if (label == null) 
     {
       label = evalue;
     } else {
       label = label.trim();
       if (label != evalue) {
         label = label + ' ' +  evalue;
       }
     }
   }
    // in case of image evalCol will not be there
    if(evalCol){
      evalCol.innerText =  ReplayUtil.shortTextContent(evalue.trim(),15,"hide");  
      evalCol["title"] =  evalue.trim();  
    }
    let uval = <HTMLElement> uaVal.querySelector('[actionfield="label"]');
    uval.innerText = ReplayUtil.shortTextContent(label,15,"hide");
    uaVal["title"] = evalue.trim();
    //uaDiv.scrollIntoView();
    let msg : ReplayMessage = {"key":"collapseUADiv","data":""};
    this.broadcast('msg',msg);
    ReplayUtil.scrollIntoView(uaDiv,"updateUAInfo");
    let idd = uaDivId.split("uaDiv")[1];
    //this.pageActionC.toggleEvent1(null,idd);
    //parent.document.getElementById('eventiddiv').scrollTop += parent.document.getElementById('eventiddiv').scrollHeight;
   //<div class="useraction-info" style="display: block;">ElementType:INPUT(text)<br><font>ElementValue:Password1!<br></font></div> 
   //uaInfo.innerHTML = etype + "<br><font>" + evalue + "<br></font>"; 
   // since we have disabled replay-wrapper scrolling to hide extra scroll bars
    // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
    //document.querySelector('.replay-wrapper').scrollTop = 0;
  }

  setImageElement(element,id)
  {
    //console.log(element , " setImageElement called with id : id" , id);
    var uaDiv ;
    if(typeof id == "object")
     uaDiv = id;
    else
     uaDiv = document.querySelector('#'+id);
 
    var uaInfo = uaDiv.querySelector('.useraction-info'); 
    var imgCol = uaInfo.querySelectorAll('div')[2]; // img

    if(imgCol)
      imgCol.innerHTML = ""; 
    var i = document.createElement('img');
    i.src= element.src;
    i.id= "imgContainer";
    var w = element.width/2;
    var h = element.height/2;
    i.style.cssText = "min-width:60px;min-height:35px;width:"+w+";height:"+h;
    var c = document.createElement('center');

    if(imgCol)
    {
      c.appendChild(i);
      imgCol.appendChild(c);
    }

  }
  

  getIframeDocument(iframeid:String)
  {
    //format of iframeid  : "1-<id>;2-<xpath>"
    // eg : 1-iframe3;1-iframe2;1-iframe4;1-iframe3;1-iframe2;1-iframe1
    let ele :any= null;
    var totalIframes = iframeid.split(";");
    for(var f=totalIframes.length-1; f>=0; f--)
    {
      let idtype:any  = totalIframes[f].split("-")[0];
      //var id = totalIframes[f].split("-")[1];
      var id = totalIframes[f].substr(totalIframes[f].indexOf("-")+1, totalIframes[f].length);
      ele = this.replayDocument.querySelector(id);
      let newDoc;
      if(ele && ele.contentDocument)
        newDoc = ele.contentDocument;
      else
        newDoc = this.replayDocument;

      if(idtype == 1)
        ele  = newDoc.getElementById(id); 
       else
        ele = ReplayUtil.getElementByXPath(id,false,this.replayWindow,newDoc);
   }
   let doc ;
   let win ;
    if(ele &&  ele.contentDocument)
    {
      doc = ele.contentDocument;
      win = ele.contentWindow;
    }
    else 
    {
      doc = this.replayDocument; 
      win = this.replayWindow;
    }
    return {"doc":doc , "win" : win};
 }
 //used to scroll the window
 scrollReplayWindow(element)
{
  // handling in case of spinner
  if(element == null)
   return;
   if(this.replayWindow == null || this.replayWindow == undefined){
    let iframeEle :any = document.querySelector("#replayIframe");
    this.replayWindow  = iframeEle.contentWindow;
   }
  var w = window.parent;
  //get the window to scroll
  var scrollwindow = this.replayWindow;
  //get the position to top of element of the window
  var elementtop = element.getBoundingClientRect().top;
  //get the hidden fields area if any
  var hiddenarea = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;
  //get the visible are in the window
  var visiblearea = scrollwindow.innerHeight;
  //calulate the point upto which scroll needed
  var scrollpoint = ((elementtop + hiddenarea) - visiblearea/2);

  //check if distance from top is 0, then make scroll point zero
  if(elementtop == 0)
    scrollpoint = 0;

  //if(ReplaySettings.debugLevel > 0)
    //nvreporterdebug("scrollpoint: " + scrollpoint + ",elementtop: " + elementtop + ",hiddenarea: " + hiddenarea + ",visiblearea: " + visiblearea);

  //if scroll needed is less than zero then scoll to the top of the window
  //else scroll upto that point
  if(scrollpoint < 0)
    scrollpoint = 0;
    
  scrollwindow.scroll({top:scrollpoint,behavior:"smooth"});
  
  
  // scrolling in monogram pop up.
  if(scrollwindow.document.getElementsByClassName('inside-popup')[0] !=null)
  {
    scrollwindow.document.getElementsByClassName('inside-popup')[0].scrollTop = scrollpoint;
  }  
  
  //check after scrolling element is visible or not
  //assumption -  there is multiple scollbar
  elementtop = element.getBoundingClientRect().top;
  //get the visible are in the window
  visiblearea = scrollwindow.innerHeight;

  if(visiblearea < elementtop)
  {
    var win = this.replayWindow;
    //get the over flow applied for the element
    var overflowapplied = win.getComputedStyle(element,null).overflow;
    //get teh parent node
    var p = element.parentNode;
    //traverse until don't get the parent for which scroll bar properties has set
    while(p && p.nodeType == p.ELEMENT_NODE && win.getComputedStyle(p,null).overflow == overflowapplied)
    { 
      p = p.parentNode;
    }
    
    //get the parent node and set until we don't get the exact parent node
    while(visiblearea < elementtop)
    {
      //check if the we get the document node
      if(p.nodeType != p.ELEMENT_NODE)
        return;

      //set the properties of oveflow initial as it don't hide the content
      p.style.overflow = "initial";
      //scroll the window to the scroll point
      //scrollwindow.scroll(0,scrollpoint);
      scrollwindow.scroll({top:scrollpoint,behavior:"smooth"});
      //get the parent Node
      p = p.parentNode;
      //get the element top distance
      elementtop = element.getBoundingClientRect().top;
      //get the visible area
      visiblearea = scrollwindow.innerHeight;
    }
  }
}
// show mouse pointer on given element
updatePointer(element,uAction,uaDiv,eventData,mode)
{
  var elementWindow = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
  var r = ReplayUtil.computeFrameOffset(elementWindow,null,this.replayWindow,0);
  var obj = ReplayUtil.getElementPos(element);

// again getting posistions after scrolling 
//get the position to top of element of the window
//var elementtop1 = element.getBoundingClientRect().top;
//get the hidden fields area if any
//var hiddenarea1 = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;

  var d =  this.replayDocument.getElementById('replaypointer');
  if( d != null)
  {
    //d.style.left = element.getBoundingClientRect().left + element.getBoundingClientRect().width/10 + "px";
    //var topd = element.getBoundingClientRect().top + element.getBoundingClientRect().height/4 + "px";
    //d.style.top = (elementtop1 + hiddenarea1 - 15/*adjusting value, taaken on temporary basis*/) + "px";
    let yy = obj.top + r.top ;
    let xx = obj.left + r.left;
    var elem_to_be_highlighted = element;
    this.replay_elem_to_be_highlighted  = elem_to_be_highlighted;
    this.updateMouse(xx,yy,elem_to_be_highlighted,uAction,uaDiv,eventData,mode,1);     
  }
}

// false means hide
endReplay(showOrhide)
{
  //console.log("end");
  this.replay_ended = false;
  //this.navigationBar.update();
  if(showOrhide)
    this.navigationBar.playReplayControl = true;           
  //this.passMsg();
  //this.pageActionC.showEndMessage(showOrhide);
  //currentPageIndex = arrDataValues.length - 1;  
  //currentPageInstance = pi(currentPageIndex);
  // TODO: currentSnapshotIndex 
  // last ua will be unload
  if(showOrhide){
    this.replay_ended = true;
    this.msgService.add({severity:'success', summary:'Replay Ended', detail:''});
    this.currentUserActionIndex = this.userActionData[this.currentPageInstance].data.length - 2;
    this.stopAutoReplay();
    ReplaySettings.replayMode = MANUAL_REPLAY;
    var text = "Session Replay Ended";
    this.speak(text);
  }
  this.navigationBar.update();
  this.passMsg();
  //displayReplayEndMsg();
  //disable nextReplayLink.
  //disableNextReplayLink();
  if(showOrhide && this.check)
  {
    this.check = false;
    window.postMessage({ "params":{}, "command":"stopRecording", "nvWeb":true, "bg":true,"taskid":"0"},"*");
  }
    
  return;
}
speak(text:string){
  try{
    //issue : speechSynthesis.speak() without user activation is no longer allowed
    let aa = <HTMLElement> document.querySelector('speaker');
    aa.click();
    //doing it twice so that it is in enabled mode
    aa.click();
  }
  catch(e){

  }
 try{
   // to cancel the previous message and speak new one
  this.ss.cancel();
   // making new instannce to avoid repeating of samemessage again
  this.msg = new SpeechSynthesisUtterance();
  this.msg.volume = this.config && this.config.volume ? this.config.volume : 1;
  this.msg.rate = this.config && this.config.rate ? this.config.rate : 1;
  this.msg.pitch = this.config && this.config.pitch ? this.config.pitch : 1;
  // TODO handle rate for different speed
  /*if(ReplaySettings.replayMode == AUTO_REPLAY){
    if(ReplaySettings.autoSpeedType ==  AUTO_REPLAY_FIXED_DELAY_MODE)
      this.msg.rate = 1.5;
  }*/


  if(this.stop_speaking == true)
      this.ss.cancel();
  else
  {
    if(this.voices.length ==0){
        this.voices = this.ss.getVoices();
        this.filterVoices();
    }
    if(this.selected_voice == null)
       this.selected_voice = this.voices[1];
    this.msg.voice = this.selected_voice;
    this.msg.text = text;
    this.ss.speak(this.msg);
  }
 }catch(e){console.log("Exception while speaking : ", e);}
}

filterVoices(){
  for(let i=0; i < this.voices.length; i++)
  {
      let voice = this.voices[i];
      if(voice.lang == "en-US" || voice.lang == "hi-IN") 
        this.voice_options.push(voice);
  }
}
// method to get json data for a page at run time.
// if flag is true, call processingPageDumpCallback
loadReplayJsonData(flag:boolean,defoffset:any)
{
  //console.log('loadReplayJsonData method called and offset=',defoffset);

  //console.log("in loadReplayJsonData : ", this.currentPageIndex , " -- PI: ", this.pages[this.currentPageIndex].pageInstance);
  flag = flag || false;
  var pageInstance = this.pages[this.currentPageIndex].pageInstance;
  //lastJsonDataPageInstance = ((pageInstance == 1 ) ? 1 : (pageInstance - 1));
  let lastJsonDataPageInstance = ((pageInstance < 0) ? 1 : (pageInstance));

  // if data is present then return.
  if(this.userActionData[pageInstance].jsonDataCollected) {
   //console.log('in of block forloadReplayJsonData ',this.userActionData[pageInstance].jsonDataCollected,pageInstance)
    return;
  }
  
  //handlePanel(false);

  //check if recording via extension then pause it on data request.
  /*if(check)
  {
    var data = {"params":{"tasktype": "pause"}, "bg": true, "command": "pageLoadedForCapture", "nvCS": true};
    window.postMessage(data, "*");
  }*/
  //var jsonUData =

  // starting request to get replay json data 
  let obj : ReplayMessage = {"key" : "waiting","data":""};
  this.broadcast('msg', obj);
  this.waitforrequest=true;
  this.navigationBar.update();
  this.passMsg();

  this.getReplayJsonData(lastJsonDataPageInstance, DELTA_JSONDATA_ENTRIES, this.mergePageReplayData,flag,defoffset); // getting data in chunk starting from the current page.
  //mergePageReplayData(jsonUData);
  
  //handlePanel(true); 
}
  getReplayJsonData(lastJsonDataPageInstance : number, maxEntries: number,callback, cb2,defoffset)
  {
    let nextObj = {"p1" :  this.pages[this.currentPageIndex], "offset" : defoffset};
    let requestedPage = ReplayUtil.getRequestedPageList(lastJsonDataPageInstance, DELTA_JSONDATA_ENTRIES, this.pages, this.pages.length, this.session.partitionID,defoffset); 
    let basepath =  ReplayUtil.getBasePathURL(this.pages[this.currentPageIndex].url);
    //console.log("basepath : ", basepath  ," for page : ",  this.pages[this.currentPageIndex].url);
    let ctx = this;
    // wrap the method , now it will receive data from replay service
    this.replayService.methodWrapper("getReplayJsonData",[requestedPage,
                                       this.session.sid,
                                       basepath,//basepath n current version
                                       1],"useractions",nextObj).subscribe(response => {

        // starting request to get replay json data 
        let obj : ReplayMessage = {"key" : "completed","data":""};
        ctx.broadcast('msg', obj);
        this.waitforrequest=false;
        this.navigationBar.update();
          this.passMsg();

        let replayJsonData = response; 
        //getting response
        if(typeof cb2 == "boolean" && cb2 == true) // pass a flag to call processingPageDumpCallback in mergePageReplayData 
          callback.call(ctx, response,cb2,lastJsonDataPageInstance);
        else
          callback.call(ctx, response);

        if(typeof cb2 == "boolean" && cb2 == true)
          this.processingPageDumpCallback(null,false);
        /*if(cb2 && typeof cb2 == "function")
          cb2.call(window,getPageIndex(lastJsonDataPageInstance) + 1);*/
  },error => {
        //  request complted
        let obj : ReplayMessage = {"key" : "completed","data":""};
        ctx.broadcast('msg', obj);
        this.waitforrequest=false;
        this.navigationBar.update();
          this.passMsg();
      });
  }

  getSnapShotPathFromCache(pageIndex:number, snapshotIndex:number, pinst:number)
  {
    let path = this.userActionData[pinst].snapshotInfo[snapshotIndex].snapshotPath;
    if(path != null)
      return path;
    else
      return "NA";
  }

  openPageDump(index, retainflag, snapshotInstance)
 {
  console.log(' openPageDump  with snapshotInstance :  ' +  snapshotInstance);
  
  this.currentPageInstance = this.pages[index].pageInstance;
  this.currentPage = this.pages[index];
  this.currentPageIndex = Number(index);
  //this.pagedumpload = true;
  this.pagedumploading = true;
  let obj : ReplayMessage = {"key" : "pagedumploading", "data" :this.pagedumploading};
  this.broadcast('msg', obj);
  this.endReplay(false);
  

  //Note: till this point snapshotInstance should be set. 
  //Need to keep snapshot path because if already there then no need to get this again. 
  var snapshotPath = this.getSnapShotPathFromCache(index,snapshotInstance,this.pages[index].pageInstance);
  console.log("getSnapShotPathFromCache : " + snapshotPath); 

  // to open page dump on correct iframe
  /*if(ReplaySettings.showTabs == true && Object.keys(tabInfo).length > 0)
  {
     // open the tab for currentPageIndex on click of page from navigator
     var tinss = configurationPane.getTI(index);
     var pageinstancee = pi(index);
     configurationPane.showNextTabReplay("new",tinss,pageinstancee);
  }*/
  let iframeEle :any = this.replayIframeClone;
  let win: Window = null;
  if(this.replayIframeClone  == null){
    iframeEle  = document.querySelector("#replayIframe");
  }
  //console.log("iframeEle : ", iframeEle, " -- ", iframeEle.nativeElement);
  //const win: Window = this.replayIframeClone.nativeElement.contentWindow;
 

  if(snapshotPath.trim() == "NA")/*path does not exist , get path and draw pagedump*/
  {
    this.pagedumpload = false;
    // Anjali 
    //iframeEle.src="/netvision/reports/loadingPageDump.html";
    this.pagedumploading = true;
    //reqTrack = true;
    //  parent.lowerPane.location =  "loadingPageDump.html";
    //  var d = document.getElementById('filterQueryId').contentWindow.document;
    //  d.documentElement.innerHTML = ""; 
    //getSnapShotPathThroughAjax(index, snapshotInstance);
    this.openPageDumpClone(this.pages,index,this.pages[index].pageInstance,snapshotInstance,null);
  }
  else if(snapshotPath.trim() == "")
  { /* pagedump does not exist*/
    this.userActionData[this.pages[index].pageInstance].snapshotInfo[snapshotInstance].snapshotPath = "";
    // TODO : add a icon or messgae to show faild snapshot is skipped
    if(!snapshotInstance && ReplaySettings.skipFailedSnapshot == true)
    {
      if(this.firstPageFlag && index < (this.pages.length - 1))
        this.openPageDump(index+1,null,0);
      else if(index == (this.pages.length - 1))
      { // for last page
        this.pagedumpload = true;
        /*if(protocolversion == 200)
          top.androidIframe.src = pageDumpPath;
        else
          top.replayIframe.src = pageDumpPath;*/
        iframeEle.src ="/netvision/reports/noPageDump.html";
        this.processingPageDumpCallback.call(this);
      }
      else
      {
        this.pagedumpload = true;
        this.processingPageDumpCallback.call(this);
      }
    }else{
        this.pagedumpload = true;
        iframeEle.src ="/netvision/reports/noPageDump.html";
        this.processingPageDumpCallback.call(this);
    }
    
  }
  else /** got path, just draw with dombuilder */
  {
      this.setPageLoadCallback(snapshotInstance);
      //Anjali
      this.pagedumploading = true;
      //iframeEle.src="/netvision/reports/loadingPageDump.html";
      this.drawPageDump(this.pages,index,this.pages[index].pageInstance,snapshotInstance,null);
  }
}
drawPageDump(pages :PageInformation[],pageindex:number,pageinstance:number,snapshotInstance:number,mode:string){
  let snapshotPath = this.userActionData[pageinstance].snapshotInfo[snapshotInstance].snapshotPath;
  console.log("drawPageDump with path : " , snapshotPath);
  //call to read pagedump file and render to iframe  
  
  let iframeEle :any = this.replayIframeClone;
    let win: Window = null;
    if(this.replayIframeClone  == null){
      iframeEle  = document.querySelector("#replayIframe");
    }
    //console.log("iframeEle : ", iframeEle, " -- ", iframeEle.nativeElement);
    //const win: Window = this.replayIframeClone.nativeElement.contentWindow;
    try{
      win = iframeEle.nativeElement.contentWindow;
    }catch(e){
      win = iframeEle.contentWindow;
    }
    this.replayWindow = win;
    const iframe_document: Document = <Document> win.document;
    this.replayDocument = iframe_document;
   // for (; iframe_document.firstChild; )
   // iframe_document.removeChild(iframe_document.firstChild);

    let rr =this;
    if(this.session.protocolVersion == 200)
    {
       //console.log("drawAndroidSnapshotFile");
       rr.currentSnapshotIndex = snapshotInstance;
       rr.SNAPSHOT_ID =  snapshotInstance;
       let requestUrl = "/netvision/rest/webapi/replayandroidImage?access_token=563e412ab7f5a282c15ae5de1732bfd1";
       requestUrl +="&replayFilepath=" + snapshotPath;
       // no snapshot case, set iframe src
       /*if(snapshotInstance == 0){
              //iframeEle.src = "http://10.20.0.53:8001" + requestUrl;
              iframeEle.src = requestUrl;
              this.pagedumpload = true;
              this.processingPageDumpCallback(null,false);
              return;
        }*/
        let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
      //this.httpService.readAndroidSnapshotFile(snapshotPath).subscribe(response => {
      this.replayService.snapWrapper("readAndroidSnapshotFile",[snapshotPath],"snapshots",nextdata,"pagedump",snapshotInstance).subscribe(response => {
        //this.replayIframe.nativeElement.src=response;
        //console.log("readAndroidSnapshotFile response");
        var reader = new FileReader();
        reader.addEventListener("load", function() {
          console.log("Inside reader");
          var imagess = new Image();
          //image.height = 100;
          //image.title = file.name;
          imagess.src =<any> this.result;
          imagess.id="imgid1";
          // bug id : 109870
          imagess.style.cssText = "width:100%;height:100%";
          let d = rr.replayDocument;
          // empty the document
          for (; d.firstChild; )
            d.removeChild(d.firstChild);
          // create head and body and append image
          d.append(d.createElement('html'))
          if(!d.head){
              let h = d.createElement("head");
              d.documentElement.appendChild(h);
          }
          if(d.body){
            let dib = d.createElement('div');
            dib.id ="divid1";
            d.body.appendChild(dib);
            dib.appendChild(imagess);
          }else{
            let l = d.createElement("body");
            d.documentElement.appendChild(l);
            let dib = d.createElement('div');
            dib.id ="divid1";
            dib.appendChild(imagess);
            d.body.appendChild(dib);
          }
          /*if(d.getElementById('imgid1') != null)
          {
            var dd = <HTMLImageElement>  d.getElementById('imgid1'); 
            dd.src =  <any>this.result; 
          }*/
          rr.pagedumpload = true;
          rr.processingPageDumpCallback(null,false); 
        }, false);
        reader.readAsDataURL(response);
      });
       return;
    }
  
    let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
  //this.httpService.readSnapshotFile(snapshotPath).subscribe(response => {
  this.replayService.snapWrapper("readSnapshotFile",[snapshotPath],"snapshots",nextdata,"pagedump",snapshotInstance).subscribe(response => {
    //start with nvDomBuilder 
    //console.log("lets do it");   

    // clean the document specifically
    iframeEle  = document.querySelector("#replayIframe");
    win = iframeEle.contentWindow;
    rr.replayWindow = win;
    let iframe_document: Document = <Document> win.document;
    rr.replayDocument = iframe_document;
    //console.log("DrawPD : rr.replayDocument 1: " , rr.replayDocument + ", Total elements - ", (rr.replayDocument.querySelectorAll('*').length));
    for (; rr.replayDocument.firstChild; )
      rr.replayDocument.removeChild(rr.replayDocument.firstChild);
    //console.log("DrawPD : rr.replayDocument 2: " , rr.replayDocument + ', Total Elements - ', (rr.replayDocument.querySelectorAll('*').length));
    // just to pass nvconfigurations
    let obj = {'nvconfigurations' : this.nvconfigurations};
    rr.nvDomBuilder = new DOMBuilder(rr.replayDocument, 'Admin', rr, obj);
   //window.nvDomBuilder = nvDomBuilder;
   //console.log("processing json data to form pagedump on - " + document);
   
   let basepath =  ReplayUtil.getBasePathURL(rr.pages[rr.currentPageIndex].url);
   //console.log("basepath : ", basepath  ," for page : ",  rr.pages[rr.currentPageIndex].url);
   //console.log("DrawPD : response : " , response);
   let ccc = rr;
   /*setTimeout(()=>{
     console.log("DrawPD : After 2000 ms")
    ccc.nvDomBuilder.initialize.apply(ccc.nvDomBuilder, [response, ccc.pages[ccc.currentPageIndex].url]); 
   },2000);*/
   rr.nvDomBuilder.initialize.apply(rr.nvDomBuilder, [response, rr.pages[rr.currentPageIndex].url]); 
 });
}

highlightPageAction(uaDivId,id){
  let idd = "";
  if(uaDivId)
    idd = uaDivId.split("uaDiv")[1];
  else 
    idd = id;
  //this.pageActionC.toggleEvent1(null,idd);
}

onPageNav(page, index){
 this.currentPage = page;
 this.currentPageIndex = index;
 this.currentPageInstance = this.pages[index].pageInstance;
 this.currentSnapshotIndex = 0;
 this.currentUserActionIndex = -1;
 this.openPageDump(index,false,0);
 this.highlightPageinNavigator();
 this.highlightDiv(null,"page",null);
}

showPrevReplayChild(mode,event)
{
  if(event)
    event.preventDefault();

    this.loadReplayJsonData(false,this.defoffset);

    // cant check for pagedumpload, bcoz , once page has been loaded , in processingPageDumpCallback, this flag is set to false
    //if(this.pagedumpload == false) return;
    //console.log("this.pageLoadSpinnerTimer : ",this.pageLoadSpinnerTimer); 
    //TODO: review it again. 
    if(this.pageLoadSpinnerTimer != -1 && ReplaySettings.replayMode == MANUAL_REPLAY)
    {
      this.processingPageDumpCallback(null, true);
      return;
    } 

    //TODO:  this case will not happen, so we can remove
    if(this.plSpinnerRunning == true)
    {
      //Check if spinner is running then hode.
      this.clearPageLoadSpinnerAndEnableControl();  
    }

  // this is to reset prev width  when going in previous replay for once only
  /*if(firstProgressFlag)
  {
     prevwidth = 0;
     firstProgressFlag = false
  }*/

  /*var cpos =  -1;
  if(ReplaySettings.showTabs == true)
  {
    cpos = userActionData[currentPageInstance].ti.pos;
    if(cpos >= userActionData[currentPageInstance].ti.info.length)
       cpos -= 1;
  }
  if(cpos  < 0)
    cpos = 0;

  // moving to next  Tab untill no prev tab found
  if(ReplaySettings.showTabs == true &&
     cpos >= 0 &&
     userActionData[currentPageInstance].ti.info[cpos].strtidx == currentUserActionIndex &&
     userActionData[currentPageInstance].ti.info[cpos].prevtn != -1)
  {
     pageNavigationType = PAGE_NAVIGATION_PREVIOUS_REPLAY;
     currentPageIndex = Number(currentPageIndex);
     // there are two cases
     // 2. else case when moving backward first time , where pos = ino length, there we need to first execute all of its ua, in this case we have already reduced pos
     // 1. if case, now we need to reduce pos value and update cpos
     if(cpos =>  userActionData[currentPageInstance].ti.info.length)
       cpos = userActionData[currentPageInstance].ti.pos--;
     else
       userActionData[currentPageInstance].ti.pos--;
      
     if(cpos  < 0)
        cpos = 0;
     if( userActionData[currentPageInstance].ti.pos < 0 )
         userActionData[currentPageInstance].ti.pos = 0;

     configurationPane.showNextTabReplay(REPLAY_PREVIOUS,(Number(userActionData[currentPageInstance].ti.info[cpos].prevtn)),Number(userActionData[currentPageInstance].ti.info[cpos].ppi));
     // you cant close until u get unload 
     configurationPane.closecurrentTab(currentTabInstance);
    //openReplayPage(currentPageIndex + 1, REPLAY_NEXT);     
    return;
  }

  if(ReplaySettings.showTabs == true  &&  cpos >= 0  && userActionData[currentPageInstance].ti.info[cpos].strtidx != -1  &&  userActionData[currentPageInstance].ti.info[cpos].strtidx == currentUserActionIndex &&  userActionData[currentPageInstance].ti.info[cpos].prevtn == -1 )
  {
    //show Replay end msg
    return;
  }

*/

  if(!this.isSuccessfullPageDump(this.currentPageIndex,this.currentSnapshotIndex,this.currentPageInstance)) 
  {
      ////openReplayPage(currentPageIndex - 1, REPLAY_PREVIOUS);
      this.openSnapshot(REPLAY_PREVIOUS);
      return;
  }
  else {
    //Hide warning icon. 
     //closeIconModel();
  }

  //Flag to indicate if called internally by setTimeout or by user click.
  mode =  mode || USER_DRIVEN; 

  //Check if we have nothing to be back.
  if(this.currentPageIndex == 0 && this.currentUserActionIndex < 0)
  {
    //TODO: put logs.
    return;
  }
  
  //Note: in case of previous Mode user can not interrupt. Because this will happen sequencly. Still Add this.
  //check if mrIntUATimer is running then just save this condition.
  if(mode == USER_DRIVEN && this.mrIntUATimer != -1)
  {
    //pendinguserrequest = replay_next;
    //run all the silent useraction and then move to next nonsilent one.
    clearTimeout(this.mrIntUATimer);
    this.mrIntUATimer = -1;
    /*check if we have next useraction and that useraction is silent*/
    while(this.currentUserActionIndex > 0 &&
      this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex].isSilent == true)
    {
      this.showPrevReplayChild(SKIP_USERACTION,null);
    }
    this.showPrevReplayChild(null,null);
    return;
  }
  
  //remove mrIntUATimer.
  if(this.mrIntUATimer != -1)
  {
    clearTimeout(this.mrIntUATimer);
    this.mrIntUATimer = -1;
  }

  //add mouse pointer.
  this.addMousePointer(true);
  
  //replay status.
  var replayStatus = FAILURE; 
  var curPageUA = this.userActionData[this.currentPageInstance].data;
  var silentFlag = false;
  //Now check what action is required.
  //If there are no userAction on current page then just move to prev page.
  //  there are no userAction on current page means currentUserActionIndex = -1 and  not 0
  // currentUserActionIndex = 0 means still one userAction left.
  //if(currentUserActionIndex  < 0)
  //if((currentUserActionIndex - 1) < 0)
  //If we are at the begining of current snapshot start useractionindex then move to prev.
  if(ReplaySettings.showTabs == false  && (
     this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].uaStartIdx == 0 && this.currentUserActionIndex <= 0
     // || this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].uaStartIdx >= this.currentUserActionIndex + 1) &&
     //(this.userActionData[this.currentPageInstance].snapshotInfo[this.currentSnapshotIndex].uaEndIdx != this.currentUserActionIndex + 1)
     ))
  {
    this.openSnapshot(REPLAY_PREVIOUS);
    //openReplayPage(currentPageIndex - 1, REPLAY_PREVIOUS);     
    return;
  }
  //TODO: Handling for snapshot. 
  /**********In case of UserAction *******/ 
  {
    if(curPageUA.length == 0 || this.currentUserActionIndex > curPageUA.length) return;
    //Increase currentUserActionIndex and show replay.  
    silentFlag = curPageUA[this.currentUserActionIndex].isSilent;
    if(this.protocolversion == 200)
    {
        replayStatus = this.showBackwardUA(curPageUA[this.currentUserActionIndex], this.replayDocument, this.replayWindow);
    }
    else
     replayStatus = this.showBackwardUA(curPageUA[this.currentUserActionIndex], this.replayDocument, this.replayWindow);
   
    if(!silentFlag) 
    {
      this.highlightUADiv(REPLAY_PREVIOUS,replayStatus);
      this.previousNonSilentUserActionIndex = this.currentUserActionIndex;
    }

    // keeping currentUserActionIndex in a avariable and then decrement it 
    var prevUserActionIndex = this.currentUserActionIndex;

   //if(protocolversion != 200)
   this.currentUserActionIndex--;

   // can losse one useraction with this condition FIXME 
   if(/*ReplaySettings.showTabs == false  &&*/ this.currentUserActionIndex == 0)
     this.currentUserActionIndex--;
  
    if(!silentFlag) 
      this.currentNonSilentUserActionIndex--;
    else
      this.currentSilentUserActionIndex--;
    //update progress bar
    this.updateProgressBar();
    this.endReplay(false);
    

    //check if we have no more useractions then disable nextReplay link and show message.
    if(this.currentPageIndex <= 0 && this.currentUserActionIndex - 1 < 0)
    {
      return;
    }  
    // jab tak dusra page na ae, prev replay mat kro
    if(mode == SKIP_USERACTION || (curPageUA[prevUserActionIndex].value && curPageUA[prevUserActionIndex].value.hasOwnProperty("s"))) {
      return;
    }


    //check if current replay Failed. then move to next one. 
    if(replayStatus != SUCCESS && !silentFlag) 
    {
      let r = this;
      //move to next one.
      setTimeout (function() {
        r.showPrevReplayChild(LAST_USERACTION_FAILED,null);
      }, 0);
      return;
    }
   
    //check if current replay was silent and mode was LAST_USERACTION_FAILED. then continue.
    if(silentFlag && mode == LAST_USERACTION_FAILED)
    {
      let r = this;
      setTimeout(function() {
        r.showPrevReplayChild(LAST_USERACTION_FAILED,null);
      }, 0);
      return;
    } 

    //check for next UserAction if it is silent then run that.
    if(this.currentUserActionIndex - 1 >= 0)
    {
      var prevIdx = this.currentUserActionIndex - 1;
      //check if it is silent.
      if(curPageUA[prevIdx].isSilent)
      {
        let rr = this;
        //Note: in previous mode just move without any delay.
        this.mrIntUATimer  = <any> setTimeout(function() {
          rr.showPrevReplayChild(SILENT_USERACTION,null);
        }, 0); 
        return; 
      }
    }
  }
}

showBackwardUA(eventData, d, w)
{
  d = d || document;
  w = w || window;

  if(eventData.type == JSON_USERACTION) 
    return this.showBackwardJSONUA(eventData, d, w);
  /*else if(this.protocolversion == 200)// && eventData.value.hasOwnProperty("idtype") && eventData.value.idtype == "-4")// since in webview we can have both type of useractions
    return this.showBackwardAndroid(eventData, d, w);*/
  else 
    return this.showBackwardDBUA(eventData, d, w);
}

showBackwardJSONUA(eventData, d, w)
{
  //Now translate the actual records into previous record.
  //added --> removed.
  //removed --> added 
  //attrbutes -> attributes (with previous value)
  //characterData-> characterData (with previous value)
  
  if(!this.nvDomBuilder) return FAILURE;

  var nvDomBuilder = this.nvDomBuilder;
  var actualData = eventData.value.d;

  //check if we have reverse Record then first remove splice that.
  if(actualData.length < 8)
    return FAILURE;
  
  var reverseData = actualData.splice(4, 8);
  //add REMOVE_CHANGE flag.
  reverseData.push(2);

  this.nvDomBuilder["d"].apply(this.nvDomBuilder, reverseData); 
  return SUCCESS;
}

showBackwardDBUA(eventData, d, w)
{
  var uAction = eventData.value;
  if(!uAction) return; 
  if(uAction.eventtype == DBUA_SCROLL)
  {
    //w.scrollTo(0, uAction.prevValue);
    w.scroll({top:uAction.prevValue,behavior:"smooth"});
    return 0;
  }

    //validate if uAction correct.
  if(!uAction.elementid)
  {
    //TODO: put error.
    return -1;
  }
  let iframeDoc;
  if(uAction.iframeid && uAction.iframeid != "")
   iframeDoc = this.getIframeDocument(uAction.iframeid).doc;
 
  var element, nearParentFlag = false, value;
  
  //Note: in case of DBUA_CLICK and DBUA_CHANGE, if given element not found then find it's parent element.
  if(uAction.eventtype == DBUA_CLICK || uAction.eventtype == DBUA_CHANGE)  
    nearParentFlag = true;

  //get element.
  if(uAction.idtype == DOM_ID)
  {
    //TODO: handling for nearParentFlag.
    if(uAction.iframeid && uAction.iframeid != "")
      element = iframeDoc.getElementById((uAction.elementid));
    else 
      element = d.getElementById((uAction.elementid));
  }
  else if(uAction.idtype == DOM_XPATH)
  {
    if(uAction.iframeid && uAction.iframeid != "")
      element = ReplayUtil.getElementByXPath(uAction.elementid, nearParentFlag, w, iframeDoc);
    else
      element = ReplayUtil.getElementByXPath(uAction.elementid, nearParentFlag, w, d); 
  }

  else if(uAction.idtype == CSS_SELECTOR)
  {
    if(uAction.iframeid && uAction.iframeid != "")
      element =  ReplayUtil.getElementByCssSelector(uAction.elementid, nearParentFlag, w, iframeDoc);
    else
      element =  ReplayUtil.getElementByCssSelector(uAction.elementid, nearParentFlag, w, d);

  }

  var uaDiv = <HTMLHtmlElement> document.querySelector('#uaDiv' + eventData.id);
  // already handled in highlightUADiv
  /*if(uaDiv)
    ReplayUtil.scrollIntoView(uaDiv,"showBackwardDBUA");*/
    //uaDiv.scrollIntoView(); 
  if(!element) {
    //nvreporterdebug("Element not found, with id - " +  uAction.elementid + "(" + IDType[uAction.idtype] + ")");
    //mark useraction summary entry as red.
    if(uaDiv) 
    {
      uaDiv.querySelector('.warning-icon')['style'].display='none';
      uaDiv.querySelector('.error-icon')['style'].display='block';
    }
    //uaDiv.style.color = "red";
    return -1;
  }

  //scroll window to element., called from updatePointer
  //this.scrollReplayWindow(element);
  // to update pointer at element
  this.updatePointer(element,uAction,uaDiv,eventData,"prev");
  //highlight of replay element will be done from updatePointer method
  //TODO: check why we need this condition.
  /*if(element.tagName == "BODY" && uAction.eventtype == DBUA_ADD_CHILD_AFTER_END || uAction.eventtype == DBUA_ADD_CHILD_AFTER_BEGIN)
    uAction.eventtype = DBUA_APPEND_CHILD;*/
    
 

  /*else if(uAction.eventtype == DBUA_MODIFY_HTML)
  {
    value = decodeURIComponent(uAction.prevValue); 
    element.outerHTML = value;
  }

  else if(uAction.eventtype == DBUA_HIDE_ELEENT)
  {
    element.style.display = "";
  }

  else if(uAction.eventtype == DBUA_ATTRIB_CHANGE)
  {  
    var decoded_value =  decodeURIComponent(uAction.prevValue);

    //check for '=' in value
    var i = decoded_value.indexOf("=");
    var cname, cvalue;
    if(i > 0)
    {
      cname = decoded_value.substr(0, i);
      cvalue = decoded_value.substr(i+1);
      element.setAttribute(cname, cvalue);
    }
    else
    {
      //nvreporterdebug("value doesn't have proper attribute: " + decoded_value);
    }
  }*/
  /*
  else if(uAction.eventtype == DBUA_APPEND_CHILD)
  {
    var childIndex = element.childElementCount - 1;
    element.removeChild(element.childNodes[childIndex]);
  }

  else if(uAction.eventtype == DBUA_ADD_CHILD_AFTER_BEGIN)
  {
    element.removeChild(element.childNodes[0]);
  }
  
  else if(uAction.eventtype == DBUA_ADD_CHILD_AFTER_END)
  {
    //get the next element
    var nelement = element.nextSibling;
    nelement.remove();
  }

  else if(uAction.eventtype == DBUA_REMOVE_CHILD)
  {
    //set the prev value 
    element.innerHTML = decodeURIComponent(uAction.prevValue);
  }*/
  //let uaDiv = document.querySelector('#uaDiv' + eventData.id);
  //uaDiv.scrollIntoView();
  if(uaDiv){
    try{
      var action = "";
      var uaVal = uaDiv.querySelector('.useraction-val');
      var uaInfo = uaDiv.querySelector('.useraction-info'); 
      var etype = uaInfo.querySelectorAll('[actionfield="attr"]')[0] as HTMLElement;
      var evalCol = uaInfo.querySelectorAll('[actionfield="attr"]')[2] as HTMLElement;
      var imgCol = uaInfo.querySelectorAll('div')[2]; // img
      action = uaVal.querySelector('[actionfield="icon"]')["title"];
      // uaDiv.querySelector('[name=uainfo]').children[uaDiv.querySelector('[name=uainfo]').children.length-1].textContent
      //console.log("SPEECH : ", action , evalCol.innerText);
      // in case if image --  evalCol will be undefined
      var text = "";
      if(!evalCol){
        // means, it an image, so take value,
        let valueEle =  uaInfo.querySelectorAll('[actionfield="attr"]')[1] as HTMLElement; 
        let v= valueEle.textContent;
        text = this.frameSentence(action,v,etype.innerText );
      } 
      else
        text = this.frameSentence(action,evalCol["title"],etype.innerText );
      this.speak(text);
    }catch(e){console.log("SPPECH EXCEPTION  : ", uaDiv, e );}
  }
  let idd = eventData.id;
  //this.pageActionC.toggleEvent1(null,idd);
  // since we have disabled replay-wrapper scrolling to hide extra scroll bars
  // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
  //document.querySelector('.replay-wrapper').scrollTop = 0;
  return 0;
}
highlightPrevReplayElement(uAction,element,uaDiv,eventData){
  if(uAction.eventtype == DBUA_CLICK)
  {
    element.style.outline = "";
    element.style.outlineStyle = "";
    if(uAction.elementtype == "INPUT")
    {
      if(uAction.elementsubtype == "radio")
      {
        element.checked = !(element.checked);
        if(uAction.eventtype == DBUA_CHANGE || !ReplaySettings.replayAutoFillSilently){
          element.style.outline = ReplaySettings.replayColor + " solid";
          element.style.outlineStyle = "auto";
        }
        element.className = element.className + " "  + REPLAY_ELEMENT;
      } 
    }
  }  

  //TODO: Amrendra Handle it properly.
  else if(uAction.eventtype == DBUA_CHANGE)
  {
    if(uAction.elementtype == "INPUT")
    {
      //TODO: set value according to prevValue for radio, checkbox and image.
      if(uAction.elementsubtype == "radio")
      {
        element.checked = "";
        element.style.outline = "";
        element.style.outlineStyle = "";
        ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
      }
      else if(uAction.elementsubtype == "checkbox")
      {
        element.checked = false;
        element.style.outline = "";
        element.style.outlineStyle = "";
        ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
      }
      //TODO: check if we will get change event for such element.
      else if(uAction.elementsubtype == "image")
      {
        element.style.outline = "";
        element.style.outlineStyle = "";
        ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
      }
      //For rest of the element type.
      else {
        element.value = nvEncoder.decodeText(uAction.prevValue, nvEncoder.decode);
        element.style.outline = "";
        element.style.outlineStyle = "";
        ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
      }
    }
    else if(uAction.elementtype == "SELECT")
    {
      //save previous value.
      element.style.outline = "";
      element.style.outlineStyle = "";
      ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
    }
    else if(uAction.elementtype == "TEXTAREA")  
    {
      element.value = "";
      element.style.outline = "";
      element.style.outlineStyle = "";
      ReplayUtil.myRemoveClass(element, REPLAY_ELEMENT);
    }
  }
}

//This method will be called when we will move to previous page, In that case move to last useraction.
// ig pagedumpId given then move to last useraction of given pagedumpId/snapshotid
moveToLastUserAction(snapshotInstance)
{
  var currentPageUserAction = this.userActionData[this.currentPageInstance].data;
  //Check if there is any useraction then only move to last. 
  if(this.userActionData[this.currentPageInstance].snapshotInfo[snapshotInstance].uaEndIdx == -1) return;

  
  //TODO: check if currentUserActionIndex is updated. 
  while(this.userActionData[this.currentPageInstance].snapshotInfo[snapshotInstance].uaEndIdx !=  this.currentUserActionIndex)
  {
    this.showNextReplayChild(SKIP_USERACTION,null);
  }

  return;
}

updateProgressBar()
{
  //document.getElementById('perc').style.display = 'block';
  let width :number;
  let curTick , totalTick,totalTime, curTime;
  //Formula: In progress bar we just considering non silent user action.
  //(currentPageIndex + currentNonSilentUserActionIndex) / (totalPages + totalNonSiletUserAction)
  if(ReplaySettings.progresBarMode == UACOUNT_BASED_PROGRESS)
  {
    if(ReplaySettings.showTabs == false){
      curTick = (this.currentPageIndex + 1) + (this.currentNonSilentUserActionIndex + 1);
      let totalNonSiletUserAction = this.getTotalNonSiletUserAction(null);
      totalTick = this.pages.length+ totalNonSiletUserAction;
      width = Math.round(Number(curTick*100)/Number(totalTick));
  
      if(curTick > totalTick)
        width = 100;
    }else{
      
       
    }
  }
  else { //TIME_BASED_PROGRESS.
    if(ReplaySettings.showTabs == false)
    {
       curTime = this.getCurrentUserActionOffset(this.currentPageIndex, this.currentUserActionIndex); 
       //Note: currently we are calculating totalTime always because useractions can be updated. In case of JSON data.
       totalTime = this.getTotalSessionDuration();
      if(curTime < totalTime)
        width = Math.round(Number(curTime * 100)/parseInt(totalTime));
      else 
        width = 100;
    }else{
      
   }
  }
  ReplayUtil.progressBarValue = width;
  /*if(document.getElementById("stopactionmsgid") && document.getElementById("stopactionmsgid").style.display == "block")
   width = 100;
  document.getElementById("pro").style.width = width + "%";
  document.getElementById("perc").innerHTML = width + "%";*/
}

getCurrentUserActionOffset(pageIdx, uaIdx)
{
  var pageInstance = this.pages[pageIdx].pageInstance;
  var firstpageInstance = this.pages[0].pageInstance;
  //check if uaIdx is -1 then page just have been loaded. Just take page load time.
  if(uaIdx <= -1)
     return (this.userActionData[pageInstance].pageLoadTime - this.userActionData[firstpageInstance].navigationStartTime);
  else
    return (this.userActionData[pageInstance].data[uaIdx].timestamp - this.userActionData[firstpageInstance].navigationStartTime); 
}
getTotalSessionDuration()
{
  var startPageInstance = this.pages[0].pageInstance; 
  var endPageInstance = this.pages[this.pages.length -1].pageInstance;
  return this.userActionData[endPageInstance].lastUserActionTime - Number(this.userActionData[startPageInstance].navigationStartTime);
}
// give total non silent useraction , for a page or for complete session
getTotalNonSiletUserAction(pageinstance){
  let t =0;
   // for complete session
  if(pageinstance == null){
    for(let i=0; i < this.pages.length; i++){
      t += this.userActionData[this.pages[i].pageinstance].nonSilentUACount;
    }
  }
  else{
    t = this.userActionData[pageinstance].nonSilentUACount;
  }
  return t;
}
// give total  silent useraction , for a page or for complete session
getTotalSiletUserAction(pageinstance){
  let t =0;
  // for complete session
 if(pageinstance == null){
   for(let i=0; i < this.pages.length; i++){
     t += (this.userActionData[this.pages[i].pageinstance].data.length - this.userActionData[this.pages[i].pageinstance].nonSilentUACount);
   }
 }
 else{
   t = this.userActionData[pageinstance].data.length - this.userActionData[pageinstance].nonSilentUACount;
 }
 return t;
}
// onn the basis of current user action index, it will give , how many silent ua are left
getRemainingSiletUA(pi)
{
  let totalSilentUA = this.getTotalSiletUserAction(pi);
  let currentNonSilentUAindex = this.getNonSilentUserActionIndex(pi, null);
  // find currentSilentUAindex
  let currentSilentUAindex = 0;
  let nextSilentActions = 0;
  let index = this.currentUserActionIndex;
  for(let i=index; i< this.userActionData[pi].data.length; i++){
    nextSilentActions +=  this.getNextSilentUserActionCount(index);
  }
  currentSilentUAindex = totalSilentUA - nextSilentActions;
  //console.log("getRemainingSiletUA :",  totalSilentUA , " - ", nextSilentActions);
  return currentSilentUAindex
}
//same as already done, it returns the count
getNextSilentUserActionCount (x){ 
  var count = x + 1;
  let a = 0;
   while (count < this.userActionData[this.currentPageInstance].data.length && 
          this.userActionData[this.currentPageInstance].data[count++].isSilent)
     a++;
    return a;
  
}
passMsg(){
  //console.log("passmsg method is called " );
  this.replayControl.first = this.navigationBar.firstPageControl;
  this.replayControl.last = this.navigationBar.lastPageControl;
  this.replayControl.prev = this.navigationBar.backwardReplayControl;
  this.replayControl.next = this.navigationBar.forwardReplayControl;
  this.replayControl.play = this.navigationBar.playReplayControl;
  this.replayControl.progressBarWidth =  ReplayUtil.progressBarValue;
  this.replayControl.playLabel = this.navigationBar.playLabel;
  this.replayControl.playIcon = this.navigationBar.playIcon;
  //console.log("OUTPUT : first  : ",this.replayControl.first,  " last-  ",  this.replayControl.last , " prev-  ", this.replayControl.prev , " next- " , this.replayControl.next,  " play- ",  this.replayControl.play, " width -", ReplayUtil.progressBarValue);
  let obj : ReplayMessage = {"key" : "rcontrol", "data" :this.replayControl};
  this.broadcast('msg', obj);
  //super.setControls();
  //this.setControls();
  /*super.disablefirst = this.replayControl.first;
  super.disablelast = this.replayControl.last;
  super.disablenext = this.replayControl.next;
  super.disableprev = this.replayControl.prev;
  super.disbaleplay = this.replayControl.play;*/

}

/*********************AUTO REPLAY**********************/
//This method will convert given delay as per the auto speed factor. anjali

//ReplaySettings.autoSpeedType
//ReplaySettings.autoSpeedValue
applyAutoSpeedFactor(delay)
{
  switch(Number(ReplaySettings.autoSpeedType))  
  {
    case AUTO_REPLAY_FIXED_DELAY_MODE:
      return ReplaySettings.autoSpeedValue;
    case AUTO_REPLAY_SLOW_MODE:
     return Math.max(0, delay + (delay*ReplaySettings.autoSpeedValue)/100); 
    case AUTO_REPLAY_FAST_MODE:
      return Math.max(0,delay - (delay*ReplaySettings.autoSpeedValue)/100); 
    case AUTO_ADVANCED_MODE : 
      return Math.max(0, delay/ReplaySettings.autoSpeedValue);
    default:
      /*AUTO_REPLAY_ACTUAL_DELAY_MODE :) ana*/
      return delay; 
  }
} 


//This method will return -1 if there are no more task.
//else delay between task.
//TODO: in case if there is no delay between two actions, should be take a constant delay.
//Note: in case of silent userAction there should not be any fixed delay.
//Note: if next event is silent then don't apply any fixed delay.
autoReplayGetNextTaskDelay()
{
  var delay;
  //this flag will be set if next useraction is silent.
  //TODO: 
  var silentStep = false;
  //check if we don't left with any task.
  if(ReplaySettings.showTabs ==  false && this.currentPageIndex + 1 >= this.pages.length && this.currentUserActionIndex + 1 >= this.userActionData[this.currentPageInstance].data.length)
    return -1;


  if(ReplaySettings.showTabs == true)
  {
      //console.log("Auto Replay with tab");
      /*var currentTimeStamp = arrDataValues[getPageIndex(currentPageInstance)][10]*1000;
      if(currentUserActionIndex != -1 && userActionData[currentPageInstance].data.length > currentUserActionIndex)
        var currentTimeStamp = userActionData[currentPageInstance].data[currentUserActionIndex].timestamp;
      var curTbindx = getTabDataIndex(currentTimeStamp);
      if((curTbindx +1)== Tabdata.length)
        return -1;
      var nextTimeStamp = Tabdata[curTbindx+1].timestamp;
      delay = nextTimeStamp - currentTimeStamp;


       if(delay < 0) return 0;
       if(silentStep && ReplaySettings.autoSpeedType == AUTO_REPLAY_FIXED_DELAY_MODE)
         return 0;
       return applyAutoSpeedFactor(delay);*/
  }

  //check if need to switch page.
  if(this.currentUserActionIndex + 1 >= this.userActionData[this.currentPageInstance].data.length)
  {
    //get delay between page load and last event.
    var nextPageNavStartTime =  Number(this.pages[this.currentPageIndex+1].navigationStartTimeStamp)*1000;//arrDataValues[currentPageIndex + 1][10]*1000;
    var lastEventTime;
     if(this.currentUserActionIndex == -1)
      lastEventTime = Number(this.pages[this.currentPageIndex].navigationStartTimeStamp*1000);
     else
     {
        try{
          lastEventTime = this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex].timestamp;
        }catch(e){
          lastEventTime = nextPageNavStartTime;
          if(this.userActionData[this.currentPageInstance].data.length >0)
            lastEventTime = this.userActionData[this.currentPageInstance].data[this.userActionData[this.currentPageInstance].data.length -1].timestamp;
        }

     }
    delay = nextPageNavStartTime - lastEventTime;
  }
  else {
    //if this is first event then take diff from pageLoad time.
    if(this.currentUserActionIndex == -1) 
    {
      var pageLoadTime = this.userActionData[this.currentPageInstance].pageLoadTime;
      var uatimestamp = this.userActionData[this.currentPageInstance].data[0].timestamp; 
      //Check if this is silent.
      if(this.userActionData[this.currentPageInstance].data[0].isSilent)
        silentStep = true; 
      delay = uatimestamp - pageLoadTime;
    }
    else {
      //delay between two userAction.
      var ua1timestamp = this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex].timestamp;
      var ua2timestamp = this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex + 1].timestamp;
      //Check if this is silent.
      if(this.userActionData[this.currentPageInstance].data[this.currentUserActionIndex + 1].isSilent)
        silentStep = true; 
      delay = (ua2timestamp - ua1timestamp);
    }
  }

  if(delay < 0) return 0;
  //In case if the next step is not silent and fixed mode enable then don't apply autoSpeedFactors.
  if(silentStep && ReplaySettings.autoSpeedType == AUTO_REPLAY_FIXED_DELAY_MODE)
  {
    //Note: IN case of fixed delay we need to maintain fixed delay between two non silent useraction.
    return 0;
  }
 
  return this.applyAutoSpeedFactor(delay); 
}

stopAutoReplayWatchTimer()
{
  let tt = "0 sec";
  let obj : ReplayMessage = {"key": "autoReplayTimer" , "data" : {display : "none", value : tt}}; 
  this.broadcast("msg",obj);
  //document.getElementById('timerid').style.display = "none";
  clearInterval(this.AutoReplayWatchTimer);
  this.AutoReplayWatchTimer = 0;
}

startAutoReplayWatcheTimer(duration, id)
{
  clearInterval(this.AutoReplayWatchTimer);
  this.AutoReplayWatchTimer = -1;
  duration = duration/1000;
  var counter = 0;
  var start = Date.now(), diff, seconds;
  if(!id )
   id = 'timerid';
   let rrr = this;
   function timer(){
    //get the number of seconds that have elapsed since startTimer() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);

    // does the same job as parseInt truncates the float
    //seconds = (diff % 60) | 0;
    seconds = Math.round(diff);
    seconds = seconds < 0 ? "0" : seconds;

    let tt = seconds + " sec";
    let obj : ReplayMessage = {"key": "autoReplayTimer" , "data" : {display : "inline-flex", value : tt}}; 
    rrr.broadcast("msg",obj);
    if (diff <= 0)
    {
      //add one second so that the count down starts at the full duration
      //example 05:00 not 04:59
      start = Date.now() + 1000;
    }

    if(seconds <= 0)
    {
      clearInterval(rrr.AutoReplayWatchTimer);
      rrr.AutoReplayWatchTimer = -1;
    }
  }
  //Initialize watch.
  //document.getElementById(id).style.display="";
  this.AutoReplayWatchTimer = <any> setInterval(timer, 1000);
  timer();
}

//Will be called after page load.
//Note: triggerByPageLoad - indicate that called from processingPageDumpCallback.
startAutoReplayTimer(triggerByPageLoad)
{
  triggerByPageLoad = triggerByPageLoad || false;
  //stop any previous timer.
  clearTimeout(this.AutoReplayTimer);
  clearTimeout(this.ttimer);
  clearTimeout(this.mouseTimer);
  //simulate page load delay. 
  let startReplayDelay = 0;

  //Check if simulatePageLoadDelay and time taken in page load is less than actual page load time then set startReplayDelay.
  if(triggerByPageLoad && ReplaySettings.simulatePageLoadDelay && this.pageNavigationType != PAGE_NAVIGATION_PREVIOUS_REPLAY)
  {
    //console.log("simulatePageLoadDelay enabled");
    //get page load time. 
    var pageLoadTime = this.pages[this.currentPageIndex].timeToLoad; 
    pageLoadTime = this.applyAutoSpeedFactor(pageLoadTime);
    //check for elapse time
    var elapsedTime = new Date().valueOf() - nextPageLoadStartTime;
    startReplayDelay = pageLoadTime - elapsedTime;
    if(startReplayDelay < 0)
      startReplayDelay = 0;
  }
  
  //Note: first flag will be tell that timer was to sumulate page laod delay.
  let r = this;
  let replay = ((firstFlag : boolean)=>{
    firstFlag = firstFlag || false;
    r.stopAutoReplayWatchTimer();
    //clear spinner timer. 
    if(r.plSpinnerRunning == true)
    {
      r.clearPageLoadSpinnerAndEnableControl();
    }
    //TODO: check it.
    if(!firstFlag)
    {
       let newPage;
       //If simulatePageLoadDelay is enabled then for last page we should wait for actual page load time.  earlier session was ending just after initiating last page loading .
       if(r.waitTimer == false) 
        newPage = r.showNextReplayChild(AUTO_REPLAY_MODE,null);
       //Note: will be back from processingPageDumpCallback.
       //if(newPage)
         //return;
    }
    // hopefully in 500 ms , commentary and mouse movement will be completed
    // after adding speak funcrionality, showNextReplay may take time in doing commentry. So defer till commentry is not done 
    // alternative : use onEnd on utterance
    if (r.ss.speaking && ReplaySettings.replayMode == AUTO_REPLAY) {
      r.ttimer = <any> setTimeout(() => replay(true), 500);
      return;
    }

     // after adding mouse move functionality, showNextReplay may take time in moving mouse, currently hardcoded 1s is used. So defer till mouse animation is not done 
    if(r.animationInterval != -1){
       r.mouseTimer = <any> setTimeout(() => replay(true), 500);
       return;
    }
    
    //get delay for next Task and call showNextReplay.  
    var nextTaskDelay = r.autoReplayGetNextTaskDelay(); 
    if(nextTaskDelay < 0)
    {
      r.endReplay(true);
      /*
      //No more task left.
      displayReplayEndMsg();
      //disable nextReplayLink.
      disableNextReplayLink();
      navigationBar.update();*/
      //document.getElementById("playreplayid").setAttribute("class","fa fa-play");
      //document.getElementById("playpauseid").innerHTML = "Play"; 
      return;
    }
    //start watch timer.
    if(nextTaskDelay > 0)
    {
     r.startAutoReplayWatcheTimer(nextTaskDelay,null);
    }
    //set timer to call showNextReplay.
    r.AutoReplayTimer = <any> setTimeout(function() {
      replay(false);
    }, nextTaskDelay);
  });

  //start for first time.

  //if start ReplayDelay then start the timer.
  if(startReplayDelay > 0)
  {
    this.startAutoReplayWatcheTimer(startReplayDelay,null);    
  }
  
  this.AutoReplayTimer = <any> setTimeout(function() {
    replay(r.firstPageFlag); //first time flag.
  }, startReplayDelay); 
}

stopAutoReplayTimer()
{
  clearTimeout(this.AutoReplayTimer);
  clearTimeout(this.ttimer);
  clearTimeout(this.mouseTimer);
  this.AutoReplayTimer = -1;
  this.ttimer = -1;
  this.mouseTimer = -1;
  this.animationInterval = -1;
  //Also stop watch timer.
  this.stopAutoReplayWatchTimer();
}

stopAutoReplay()
{
  this.stopAutoReplayTimer();
  ReplaySettings.replayMode = MANUAL_REPLAY;
  //switch to manual replay....*** 
  //Think again.
  //done just to change the navigation.
  //FIXME: there is no need to to this because in openPageDump we are changing icon values.
  this.startManualReplay(); 
}

startManualReplay()
{
  this.navigationBar.update();
  this.passMsg();
}




//Note: switch mode will be pass when replay switched from Manual mode.
startAutoReplay(switchMode)
{
  switchMode = switchMode || false;
  console.log("type : ", ReplaySettings.autoSpeedType);
  console.log("value : ", ReplaySettings.autoSpeedValue);
  this.navigationBar.update();

  //if last page and there are no useraction then ....
  if((this.currentPageIndex + 1) == this.pages.length && (!this.userActionData[this.currentPageInstance].nonSilentUACount))  
  {
    return; 
  }

  if(ReplaySettings.autoSpeedType == AUTO_REPLAY_FIXED_DELAY_MODE) //1x
  {
    if(ReplaySettings.autoSpeedValue == 0 || isNaN(ReplaySettings.autoSpeedValue) || ReplaySettings.autoSpeedValue == null)
      ReplaySettings.autoSpeedValue = 1000; //1000 msec
  }  

  if(switchMode)
  {
    //Arg: firstFlag.
    this.startAutoReplayTimer(false);
  }
}


//used to handle next event
//when current replay is automativ then stop the replay and show the next event
nextEventHandler()
{
  if(ReplaySettings.replayMode == AUTO_REPLAY)
  {
    //switch to Mannual Replay.
    this.stopAutoReplayTimer();
    ReplaySettings.replayMode = MANUAL_REPLAY;
    this.startManualReplay();
  }
  this.showNextReplayChild(null,null);
}

//used to handle prev event
//when current replay is automativ then stop the replay and show the prev event
prevEventHandler()
{
  if(ReplaySettings.replayMode == AUTO_REPLAY)
  {
    this.stopAutoReplayTimer();
    ReplaySettings.replayMode = MANUAL_REPLAY;
    this.startManualReplay();
  }
  this.showPrevReplayChild(null,null);
}

setPageLoadCallback(snapshotid:number){
  
  /*if(ReplaySettings.debugLevel > 0)
    nvreporterdebug('Setting page load callback');*/
  console.log("setPageLoadCallback called");
  if(ReplaySettings.replayMode == AUTO_REPLAY)
  {
    //set time when we going to load page.
    this.nextPageLoadStartTime = new Date().valueOf();

    //this function will set page load callback and will remove AutoReplayTime.
    clearTimeout(this.AutoReplayTimer);
    this.AutoReplayTimer = 0;
    clearTimeout(this.ttimer);
    this.ttimer = 0;
    clearTimeout(this.mouseTimer);
    this.mouseTimer=-1;
  }

  //start the page load spinner.
  {
    if(this.check)
    {
      var data = {"params":{"tasktype": "pause"}, "bg": true, "command": "pageLoadedForCapture", "nvCS": true};
      window.postMessage(data, "*");
    }
    if(ReplaySettings.simulatePageLoadDelay){
      this.plSpinnerRunning = true;
      let obj : ReplayMessage = {"key" : "simulatePLdelay", "data" : this.plSpinnerRunning};
      this.broadcast("msg",obj);
      // start loader
      //document.getElementById('load').style.display ="";
      this.lastNavStartTime = new Date().getTime();
    } 
  }
  /*try{
  if(typeof beforePagedumpLoad == 'function')
    beforePagedumpLoad.call(window, sessioninfo,currentpageinfo);
  }
 catch(e)
 {}*/

}
clearPageLoadSpinnerAndEnableControl(){

  if(this.check)
  {
    var data = {"params":{"tasktype": "startResume"}, "bg": true, "command": "pageLoadedForCapture", "nvCS": true};
    window.postMessage(data, "*");
  }
  this.plSpinnerRunning  = false;
  let obj : ReplayMessage = {"key" : "simulatePLdelay", "data" : this.plSpinnerRunning};
  this.broadcast("msg",obj);
  //document.getElementById('load').style.display ="none";
  clearTimeout(this.pageLoadSpinnerTimer);
  this.pageLoadSpinnerTimer = -1;
}

mergePageReplayData(jsondata: any, flag:boolean, lastJsonDataPageInstance:number)
 {
   let ff = false;
   let lastPI = lastJsonDataPageInstance;
   let lastPI1 = 0;
  // move to previous page with same pos value before getting the data, bcoz
  // the new data can vary the previous page npi.
  // ex : before getting new data , npi of pi 5 was 6 
  // but after getting data , it becomes  7.
  /*if(ReplaySettings.showTabs == true)
  {
    try{
    console.log(top.currentPageInstance + "----" + lastJsonDataPageInstance);
    //var pindx = getPageIndex(jsondata[top.currentPageInstance]) -1;  
    //var pindx = getPageIndex(lastJsonDataPageInstance);  
    var pindx = getPageIndex(userActionData[top.currentPageInstance].ti.info[0].ppi);
    openPageDump(pindx);
    }catch(e){console.log("Failed");}
  }*/
   for(let pageInstance in jsondata){
    if(this.userActionData[pageInstance].jsonDataCollected)
      continue;
    if(ff == false){
        lastPI1 = Number(pageInstance) -1;
        ff = true;
    }
    //console.log("12Again. ANJALI : pageInstance", pageInstance);
     let prev_obj =null;

    if(jsondata[pageInstance]!=null){
     if(jsondata[pageInstance].length == 0){
      this.userActionData[pageInstance].jsonDataCollected = true;
     }
    for(let z = 0; z < jsondata[pageInstance].length; z++){
      if (z-1 >=0)
      prev_obj =jsondata[pageInstance][z-1];   
        
      this.replaydata.fillUserActionData(jsondata[pageInstance][z], 'json', Number(pageInstance),prev_obj,"");
     }
    } 
    //update lastJsonDataPageInstance.
    if(lastJsonDataPageInstance < Number(pageInstance))
      lastJsonDataPageInstance = Number(pageInstance);
   }
   this.replaydata.sortUserActionDataOnTimestamp(lastPI1);
   //console.log("33again. final replydata.userActionData : ", JSON.stringify(this.userActionData));
  
    /*console.log("dataUpdatedForPage : " + configurationPane.dataUpdatedForPage);
    handlePanel(true); */

  }

  /*****Handling for android**************/
  //change the pagedump if snapshot id changed
  showForwardAndroid(eventData, d, w)
  {
    var id = eventData.id;
    var uAction = eventData.value;
    if(!uAction) return SUCCESS;
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    this.replayWindow = replayIframe.contentWindow;
    const iframe_document: Document = <Document> this.replayWindow.document;
    this.replayDocument = iframe_document;

    var uaDiv = document.querySelector('#uaDiv'+eventData.id);
    if(uaDiv) 
      var uaInfo = uaDiv.querySelector('.useraction-info');
    //updateUAAndroidInfo(uAction, 'uaDiv' + eventData.id);
    if(replayIframe.contentWindow.document.getElementById('imgid1') == null)
    {  
      var d =  replayIframe.contentWindow.document.getElementById('divid1');
      if(d)
      { 
        var i = replayIframe.contentWindow.document.createElement('img');
        i.src  =  "";
        i.id = "imgid1";
        i.style.height = "100%";
        i.style.width = "100%";
        d.appendChild(i);
      }
      else
	    {
        this.replayDocument.querySelector('body').innerHTML = "<div id='divid1'><img src = ''  id ='imgid1' style ='height:100%;width:100%;'></div>"
      }
       //return SUCCESS;
    }
    var befimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
    var afimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
    if(uAction.snapshotid > 0)
    {
     if(this.SNAPSHOT_ID != uAction.snapshotid)
     {
       var arrTemp = new Array();
       //getSnapshotPathSync(currentPageIndex,uAction.snapshotid);
       this.openPageDumpClone(this.pages,this.currentPageIndex,this.pages[this.currentPageIndex].pageInstance,uAction.snapshotid,null);
       uAction.prevsnapshotid = this.SNAPSHOT_ID;
      if(replayIframe.contentWindow.document.getElementById('imgid1')  != null)
      {  
         afimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
         this.SNAPSHOT_ID =  uAction.snapshotid;
      }
     }
    }
    if(uaDiv) 
      this.updateUAAndroidInfo(eventData, 'uaDiv' + eventData.id,befimg1,afimg1 ,id);
    //hideSelInfo();
    return 0; 
  }

  // in case for android update the information
  updateUAAndroidInfo(eventData,uaDivId,befimg1,afimg1,id) 
  {
    var uAction = eventData.value;
    var uaDiv = document.querySelector('#'+uaDivId);
    var uaInfo = uaDiv.querySelector('.useraction-info'); 
    var uaVal = uaDiv.querySelector('.useraction-val');
    var etype = uaInfo.querySelectorAll('[actionfield="attr"]')[0] as HTMLElement;
    var evalCol = uaInfo.querySelectorAll('[actionfield="attr"]')[2] as HTMLElement;
    var imgCol = uaInfo.querySelectorAll('div')[2]; // img
    var evalue = "";


    etype.innerText = uAction.elementtype.toUpperCase();
    if(uAction.elementtype == 'INPUT')
      etype.innerText += "(" + uAction.elementtype +")";
    //evalue =  nvEncoder.decodeText(uAction.value, nvEncoder.decode);
    evalue = ReplayUtil.checkEncryptDecrypt(uAction.pageinstance, uAction.value, uAction.encValue);
    var evalues = ReplayUtil.shortTextContent(evalue,50,null);
    evalCol["title"] =  evalue;
    evalCol.innerText = evalues;
    //var g = uaVal.rows[0].cells[1];
    let uval = <HTMLElement> uaVal.querySelector('label[actionfield="label"]');
    if(uAction.eventtype != 7)
    {
      etype.innerText = uAction.elementtype.toUpperCase();
      if(uAction.elementtype == 'INPUT')
        etype.innerText += "(" + uAction.elementtype +")";
      //evalue = nvEncoder.decodeText(uAction.value, nvEncoder.decode);
      evalue = uAction.value;
      evalCol.innerText = evalue;
      uval.innerText = evalues;
      uaVal["title"] = evalue;
      //uaDiv.scrollIntoView();
      let d : ReplayMessage = {"key":"collapseUADiv","data":""};
      this.broadcast('msg',d);
      ReplayUtil.scrollIntoView(uaDiv,"updateUAAndroidInfo");
      let idd = uaDivId.split("uaDiv")[1];
      //this.pageActionC.toggleEvent1(null,idd);
    }
    /*else
    {
      var etype1 = uaInfo.rows[0].cells[0];
      var evalCol1 = uaInfo.rows[2].cells[0];
      etype1.style.display = "none";
      evalCol1.style.display = "none";
      etype.innerText = "";
      g.innerText = "SCROLL";
    }*/
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    // in case of web view , we will have a new iframe 
    var isWebview = replayIframe.contentWindow.document.querySelector('iframe');
    if(isWebview && uAction.idtype != -4)
    {
      replayIframe = isWebview;
      this.replayWindow = isWebview.contentWindow;
      this.replayDocument = this.replayWindow.document;
      this.showForwardDBUA(eventData, this.replayDocument, this.replayWindow);
    }
    else
    {
      if(befimg1 == afimg1)
        this.setPrevValue();
      else
        this.removePrevValue();
      this.setOverlayforpage(uAction,id);
    }
    // since we have disabled replay-wrapper scrolling to hide extra scroll bars
    // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
    //document.querySelector('.replay-wrapper').scrollTop = 0;
  }


  setOverlayforpage(uAction,id)
  {
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    if(replayIframe.contentWindow.document.getElementById('imgid1')  == null)
     return;
    /*
     let scrnResolution = null;
     try{
       scrnResolution = this.session.screenResolution["name"];
       if(scrnResolution == null || scrnResolution == undefined)
       scrnResolution = this.session.screenResolution.dim;
     }catch(e){
       scrnResolution = this.session.screenResolution.dim;
     }
     console.log("scrnResolution :" , scrnResolution);
     var swidth = scrnResolution.substring(0,scrnResolution.indexOf("x"));
     var sheight = scrnResolution.substring(scrnResolution.indexOf("x")+1,scrnResolution.length);
     var wid = parseInt(g.getBoundingClientRect().width)/parseInt(swidth);
     var ht =  parseInt(g.getBoundingClientRect().height)/parseInt(sheight);
     var tp = parseInt(g.getBoundingClientRect().top);
     */
    var g = replayIframe.contentWindow.document.getElementById('imgid1');
    var overlay = document.createElement("div");
    var f = replayIframe.contentWindow.document.body;
    overlay.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
    overlay.style.opacity = "1";
    overlay.style.position = "absolute";
    if(uAction.eventtype != 7)
     overlay.style.border = "2px solid blue";
    else
     overlay.style.border = "2px solid white";
    var k = replayIframe.contentWindow.document.getElementById('divid1');
    overlay.style.top =  parseInt(uAction.ypos) +"px";
    //console.log("top"+parseInt(uAction.ypos) + "wid"+ wid + "ht"+ ht + "left"+ parseInt(uAction.xpos));
    overlay.style.left = (parseInt(g.offsetLeft) + parseInt(uAction.xpos)) +"px";
    //overlay.style.top = parseInt(uAction.ypos) - parseInt(uAction.height); 
    //console.log( parseInt(uAction.ypos) + "  left "+  parseInt(g.offsetTop) + " top"+ parseInt(uAction.xpos) + " " +parseInt(g.offsetLeft));
    //overlay.style.left = (parseInt(g.offsetLeft) + parseInt(uAction.width) -  parseInt(uAction.xpos))- parseInt(g.offsetTop)- parseInt(k.offsetLeft)+parseInt(k.offsetTop);
    overlay.style.height =  uAction.height +"px";
    overlay.style.width = uAction.width +"px";
    overlay.setAttribute("class","overlay");
    overlay.setAttribute("id","overlayid"+id);
    //overlay.scrollIntoView();
    if(f == null){
       f = this.replayDocument.querySelector('body');
    }
      f.children[0].appendChild(overlay);
    //overlay.scrollIntoView();
    var k = replayIframe.contentWindow.document.getElementById('nvreplayid');
    var g =  replayIframe.contentWindow.document.getElementById('overlayid'+id);
    if(k && g)
      g.appendChild(k);
  }

  setPrevValue()
  {
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }

    var d = replayIframe.contentWindow.document.querySelectorAll('.overlay');
    if(d.length>0)
    {
     for(var i = 0;i < d.length ;i++)
     {
       d[i].style.border = "2px solid red";
     }
    }
  }

  removePrevValue()
  {
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    var d = replayIframe.contentWindow.document.querySelectorAll('.overlay');
    if(d.length>0)
    {
      for(var i = 0;i < d.length ;i++)
      {
        d[i].style.display = "none";
     }
    }
  }


  showBackwardAndroid(eventData, d, w)
  {
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    var uAction = eventData.value;
    var uaDiv = document.querySelector('#uaDiv'+eventData.id);
    if(uaDiv)
      var uaInfo = uaDiv.querySelector('.useraction-info');
    //updateUAAndroidInfo(uAction, 'uaDiv' + eventData.id);
    var PREV_ID = 0;
    var befimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
    var afimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
    if(uAction.prevsnapshotid > 0)
    {
      if(uAction.prevsnapshotid != uAction.snapshotid)
      {
       var arrTemp = new Array();
       //getSnapshotPathSync(currentPageIndex,uAction.prevsnapshotid);
       this.openPageDumpClone(this.pages,this.currentPageIndex,this.pages[this.currentPageIndex].pageInstance,uAction.prevsnapshotid,null);
       afimg1 = replayIframe.contentWindow.document.getElementById('imgid1').src;
      }
    }
    //currentUserActionIndex--;
    if(uAction.prevsnapshotid == uAction.snapshotid)
     this.setPrevValue();
    else
     this.removePrevValue();
    //setOverlay(uAction);
    return 0;
  }

  setSilentCount(flag){
    //console.log("resetting dtaa : setSilentCount called ", flag);
    let obj : ReplayMessage = {"key" : "silentCountData", "data" :flag};
    this.broadcast('msg', obj);
  }

  // Update the mouse position based on x & y
 updateMouse (x, y,elem_to_be_highlighted,uAction,uaDiv,eventData,mode,transitionDuration) {
  var d = ReplayUtil.getReplayDocument();
  var el = <HTMLElement>d.querySelector('#replaypointer');
  if(el == null) return;
  var el_size = 25;
    //console.log("updating Pointer on mm cordinates : " + "x :", x , " y : ", y);
    el.style.display ="block";
    el.style.zIndex = "1000";
    el.style.transitionProperty = 'transform';
    el.style.transitionDuration = transitionDuration + 's';
    el.style.transform = 'translate('+x+'px,'+y+'px)';
    let transitionEvent = ReplayUtil.whichTransitionEvent(el);
      el.addEventListener('transitionstart', (ev) => {
        //console.log('ANIM Started transitioning  ', ev.elapsedTime);
         // any non zero number , just to identify , mouse animation is in process
        this.animationInterval = 10;
        /*if(elem_to_be_highlighted)
          this.scrollReplayWindow(elem_to_be_highlighted);*/
      });
      el.addEventListener(transitionEvent,()=>{
        //console.log('ANIM Ended transitioning');
        // clearing interval here
        this.animationInterval=-1;
        if(this.replay_elem_to_be_highlighted != null){
          //this.scrollReplayWindow(elem_to_be_highlighted);
          if(mode == "next")
            this.highlightNextReplayElement(uAction,this.replay_elem_to_be_highlighted,uaDiv,eventData);
          if(mode == "prev") 
            this.highlightPrevReplayElement(uAction,this.replay_elem_to_be_highlighted,uaDiv,eventData); 
        }
        //if(elem_to_be_highlighted ==null) // for mouse move data, bcoz that time , we wont have any element to scroll to
         this.scrollReplayWindow(el);
      })
  }


broadcast(key: any,data?: any) {
  this._handler.next({key,data});
}

on<T>(key: any): Observable<T> {
  return this._handler.asObservable().pipe(filter(event => event.key === key)).pipe(map(event => <T>event.data));
}
sendMessage(message: Boolean) {
  this.msgtoAnalattyics.next({Boolean:false });
}

getMessage(): Observable<any> {
return this.msgtoAnalattyics.asObservable();
}



    mapsOpened(message: string) {
        this.newSub.next({ text: message });
    }

    clarMapsMesssage() {
        this.newSub.next();
    }

    isMapOpened(): Observable<any> {
      return this.newSub.asObservable();
  }
  disable_left_click(){
    //modify onevent of frames.
    const me = this;
    console.log("Disabling left click of lower frame.");
    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    var d = replayIframe.contentWindow.document
    d.onmousedown = me.handleMouseEvent;
    d.onmouseup   = me.handleMouseEvent;
    d.onclick     = me.handleMouseEvent;
    me.disable();

 }
 handleMouseEvent(e) {
  var evt = (e==null ? event:e);
   if((evt.button==2) || (evt.which==3)){
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
   }
   else
  {
   evt.stopPropagation();
   evt.preventDefault();
   evt.stopImmediatePropagation();
  }
}

// to disable all links and select options in page dump
disable() {

    let replayIframe :any = this.replayIframeClone;
    if(this.replayIframeClone  == null){
      replayIframe  = document.querySelector("#replayIframe");
    }
    var d = replayIframe.contentWindow.document
    let links= d.getElementsByTagName('A');
    for(var i=0; i<links.length; i++) {
      links[i].setAttribute("nvhref",links[i].href);
      links[i].href="javascript:return false";
      links[i].onclick = "return false";
    }
    let options= d.getElementsByTagName('options');
    for(var i=0; i<options.length; i++) {
      options[i].disabled = true;
    }
  }
}
