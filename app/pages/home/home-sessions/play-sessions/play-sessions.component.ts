import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Accordion, MenuItem, Panel } from 'primeng';
import { MapConfigComponent } from '../mapping/dialog/map-config/map-config.component';
import { PLAY_SESSIONS_DUMMY } from './service/play-sessions.dummy';
import { SessionPanelData } from './service/play-sessions.model';
import { MetadataService } from './../common/service/metadata.service';
import { ReplayService } from './service/replay.service';
import { Metadata } from './../common/interfaces/metadata';
import { DataManager } from '../common/datamanager/datamanager';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { DOMBuilder } from '../common/interfaces/dombuilder';
import { ReplayUtil } from './../common/util/replay-utils'; 
import { PageInformation } from '../common/interfaces/pageinformation';
import { Session } from '../common/interfaces/session';
import { ReplayData } from '../common/interfaces/replay-data'; 
import { Observable } from 'rxjs';
import { ReplayHandler } from './../play-sessions/replay-handler';
//import { AppComponent } from '../../app.component';
import {ReplayControlComponent } from './replay-control/replay-control.component';
//import {NVBreadCrumbService} from './../../services/nvbreadcrumb.service';
//import { BreadCrumbInfo } from './../../interfaces/breadcrumbinfo';
import { DataRequestParams } from '../common/datamanager/datarequestparams';
import { ReplaySettings } from './../play-sessions/service/replaysettings';
//import { MsgService } from '../common/service/msg.service';
import { NvhttpService,NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from '../common/service/nvhttp.service';
import { AppError } from 'src/app/core/error/error.model';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionData } from '../common/datamanager/sessiondata';
//import { ReplaySelectorComponent } from './replay-selector/replay-selector.component';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import * as moment from 'moment';
import 'moment-timezone';
//import { ReplayMapsComponent } from './replay-maps/replay-maps.component';
import { AfterViewInit} from '@angular/core';
import { playsession } from '../common/interfaces/playsession';
import { Store } from 'src/app/core/store/store';
import {MessageService} from 'primeng/api';
import { DrillDownDDRService } from './../common/service/drilldownddrservice.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { isNullOrUndefined } from 'util';


export interface TabDetails{
  name:String,
  label:String,
  selectedStatus:boolean;
}

declare var changeGradient;
 // default configuration for json data , 5 means, bring data for 5 pages
export  const DELTA_JSONDATA_ENTRIES : number = 5;
const UNEXPECTED_MUTATION = 0;
const EXPECTED_MUTATION = 1;

export const RES_TAB_LIST : TabDetails[] = [
  {name:"Tab 1", label:"Tab 1", selectedStatus:true},
  {name:"Tab 2", label:"Tab 2", selectedStatus:false},
  {name:"Tab 3", label:"Tab 3", selectedStatus:false},
  {name:"Tab 4", label:"Tab 4", selectedStatus:false},
]


@Component({
  selector: 'app-play-sessions',
  templateUrl: './play-sessions.component.html',
  styleUrls: ['./play-sessions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlaySessionsComponent implements OnInit {
  data : SessionPanelData;
  actionOptions: MenuItem[] = [];
  menuOptions: MenuItem[] = [];
  
  VideoWidget: ElementRef;
  @ViewChild('mapConfig', { read: MapConfigComponent })
  mapConfig: MapConfigComponent;
  metaDataService: MetadataService;
  metadata: Metadata = null;
  httpService: NvhttpService;
  nvAppConfigService : NVAppConfigService;

    // store all information about replay page
    replayPage : PageInformation;
    // to store page index
    // serial number of replay page in page list
    currentpageindex : number;
    //store snapshot path
    snapshotPath : string;
    // store replay useraction db data
    replayDBdata : any = null;
    // store replay useraction json data
    replayJsonData : any = null;
    // store session info
    session : Session = null; 
    // store pages info
    pages : PageInformation[] = null;
    // store total number of pages of a session
    totalRecords : number;
    // to  keep track , if useraction request is already in pending state
    requestInProgress : boolean;
    // array to keep observer
    pendingUserActionRequest : any[];
    // replay window 
    replayWindow : Window; 
    // replay document
    replayDocument : Document;
    // replay Iframe element, in case of android
    androidIframe : any;
    // replay window , in case of android 
    androidWindow : Window;
    // replay document , in case of android
    androidDocument : Document;
    // flag to indicate pagedump has loaded
    pagedumpLoad : boolean = false;
    // since we reset the above flag once the pagedump is set
    pagedumploading : boolean = false;
    // to show page actions
    showPageActions :boolean = false;
    // store complete user action data
    replayUserActionData : any = null;
    // DOMbuilder global instance
    nvDomBuilder : DOMBuilder = null;
    // to expand replay
    fullscreen :boolean = true;
    displayTabs: boolean = false;
    displayForms: boolean = false;
    displayMaps: boolean = false;
    displaySelectors: boolean = false;
    resTabList :TabDetails[];
    DELTA_ENTRIES : number; 
    // support multi tab feature
    showTabs : boolean = false;
    // progress bar value
    progressBarVal : number = 0;
    // disbale first page replay icon
    public disablefirst : boolean = false;
    // disbale backward replay icon
    public disableprev : boolean = false;
    // disbale play/pause replay icon
    public disbaleplay : boolean = false;
    // disbale forward replay icon
    public disablenext : boolean = false;
    // disbale last page replay icon
    public disablelast : boolean = false;
    // for active session
    activeSession : boolean = false;
    // for auto replay timer
    autoReplayTimer :string = "00:00";
    // replay parameter 
    params  :any ;
    // for simulate page load delay
    plSpinnerRunning :boolean = false;
    // expand/collapse of controlbar
    skinToggle1 : boolean = false; 
    // if any template to be added to pagedump
    applyTemplate : boolean = false;
    // if template needs to be added, then what class need to be added to iframe
    templateCls : string = "";
    //breadInfo:BreadCrumbInfo;
    iframe_width : string = "100%";
    previframe_width :string = "";
    iframe_height : string = "calc(100% - 30px)";
    iframe_transform : string = "";
    iframe_position : string = "absolute";
    iframe_left : string = "";
    mapName : string = "";
  
    @ViewChild('replayIframe') replayIframe: ElementRef;
    @ViewChild('replaycanvas') replayCanvas : ElementRef;
    @ViewChild('timerid') timerid : ElementRef;
    firstpagemissing: boolean = false;
    replayService: ReplayService;
    msgService : MessageService;
    canvasCls: any;
    showm:any=false;
    currentEntryID : number = -1;
    reset:any=true;
    allremdata=[];
    highLighterSub :any=false;
    showSilentActions: boolean;
    swidth: number;
    sheight: number;
    defoffset:any='0';
    // set canvas height , in case of pc devices, based on the check if horizontal scroll is coming or not 
    // as if set 100%, scroll will be covered by canvas
    // if set 98%, then pages not having scroll , there bottom 2% will be clickable 
    canvas_style : any = {'position': 'absolute','z-index': 1, 'opacity':'0'};
    record_data : any = null;
    isActive : boolean = false;
     // if any request is  in pending state , this flag will be true
    // will be required by useraction json data
    request_wait : boolean = false; 
    existAlerts: NodeJS.Timer;
    clickMapSetting:any=false;
    heatMapSetting:any=false;
    scrollmapsettings:any=false;
    showReplaycontrol:any=true;
    Tranparency:any=0; 
    Tranparencyslider:boolean=false;
    Tranparencysliderh:boolean=false;
    selectedgradient:any="cyan";
    previousgradient:any="cyan";
    nvconfigurations = null;
    playlabel = 'Play';
    playicon = 'icons8 icons8-material-filled';
    fullscreentt = 'Fullscreen';
    currentEvent: any;
    eventOptions: MenuItem[];
    appFlag: boolean = false;
    impactFlag: boolean = false;
    impactData: any = [];
    displayFlag: boolean = false;
    cardData: any
    currentRowData: any;
    error: AppError;
    loading: boolean = false;
    breadcrumb: BreadcrumbService;
    expandAll : boolean = false;
    @ViewChildren(Panel) pagePanels: QueryList<Panel>;
    @ViewChildren(Accordion) uaPanels: QueryList<Accordion>;
    toggleText : string = "Expand All";
  
  constructor(private http: HttpClient,httpService: NvhttpService, nvAppConfigService : NVAppConfigService,metaDataService: MetadataService, msgService :MessageService,private route: ActivatedRoute,replayService : ReplayService, private replayHandler :ReplayHandler,
    protected sanitizer: DomSanitizer, private cdr:ChangeDetectorRef,private elementRef:ElementRef, private ddrService : DrillDownDDRService, breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
    this.metaDataService = metaDataService;
    this.replayService = replayService;
    this.httpService = httpService;
    this.msgService = msgService;
    this.nvAppConfigService = nvAppConfigService;
    this.snapshotPath = null;
     this.replayDBdata = null;
     this.replayJsonData = null;
     this.replayHandler = replayHandler;
     this.pendingUserActionRequest = [];

     this.resTabList = RES_TAB_LIST; 
     this.DELTA_ENTRIES = DELTA_JSONDATA_ENTRIES;
     this.replayHandler.on('msg').subscribe(response  => {
      //console.log("Replay component response : " , response);
      if(response === null || response === undefined)  return;
      if(response["key"] == "collapseUADiv"){
        this.collapseAllUAPanels(); 
      }
      if(response["key"] == "rcontrol"){
        let replayControl = response["data"];
        this.disablefirst = replayControl.first;
        this.disablelast = replayControl.last;
        this.disablenext = replayControl.next;
        this.disableprev = replayControl.prev;
        this.disbaleplay = replayControl.play;
        this.progressBarVal = replayControl.progressBarWidth;
        this.playlabel = replayControl.playLabel;
        this.playicon = replayControl.playIcon;
      }
      else if(response["key"] == "autoReplayTimer"){
        let elm = this.timerid.nativeElement;
        if(elm)
          elm.style.display = response["data"]["display"];
        this.autoReplayTimer = response["data"]["value"];  
      }
      else if(response["key"] == "simulatePLdelay"){
        this.plSpinnerRunning = response["data"];  
      }
      else if(response["key"] == "silentCountData"){
        this.showSilentActions = <boolean>response["data"];
      }
      else if(response["key"] == "setCanvasStyle"){
        this.canvas_style = response["data"];
      }else if(response["key"] == "clickMap"){
        this.showm = true;
         let ele =document.getElementById('paccord');
         ele.style.display='none';
         this.clickMapSetting=true;
         this.showReplaycontrol=false;
         this.heatMapSetting=false;
         
           
        this.mapName = response["data"]["type"];
      }else if(response["key"] == "expandtwice"){
        // calling twice, just  to ensure correct rendering of page dump , when cav side bar menu was open
        // bug : 88336
        this.expandFull(null);
        this.expandFull(null);
      }
       else if(response["key"]=="waiting"){      
        this.request_wait = true;
        //console.log('waiting for request to get complete',this.request_wait);
      }
      else if(response["key"] == "completed"){
        this.request_wait = false;
        //console.log('for request to get completed',this.request_wait);
      }
      else if(response["key"] == "pagedumploading"){
         this.pagedumploading = response["data"];
      }else if(response["key"] == "ajaxdatafilled"){
        this.msgService.add({severity:'info', summary:'Refreshing actions', detail:''});
        //MsgService.log('Refreshing actions');
        this.showPageActions = false;
        setTimeout(()=>{this.showPageActions = true;},0);
      }
        else if(response["key"] == "heat"){
          this.heatMapSetting=true;
          this.showReplaycontrol=false;
          this.clickMapSetting=false;
          this.Tranparencysliderh=false;
          let replaycanvas=document.getElementById('replaycanvas');
           replaycanvas.style.display='none';
         }else if(response["key"] == "closeclickMapandOpenPopup"){
           this.backtoReplay();
           //this.showMaps();
         }  
         else if(response["key"] == "scrollmapsettings"){
          this.scrollmapsettings=true;
          this.showReplaycontrol=false;

         }   
        
    });
   }

  ngOnInit(): void {
    const me = this;

    //set breadcrumb. 
    this.breadcrumb.add({
      label: 'Replay',
      routerLink: '/play-sessions',
      queryParams: {...this.route.snapshot.queryParams}
    } as MenuItem);


    me.eventOptions = [
            { label: 'Impact of Event', command: (event: any) => { this.openImpactEvent(event); } },
          ];
    me.actionOptions = [
      {
        label: 'Mapping',
        command: (event: any) => {
          this.mapConfig.open();
        },
      },
      { label: 'Selector Actions' },
      { label: 'Forms' },
    ];
    this.menuOptions = [{
      label: 'SESSIONS ACTIONS',
      items: [
        {
          label: 'View Flowpath',
          icon: 'icons8 icons8-line-chart',
          command: () => {
              
          }
      },
      {
          label: 'View Transaction Flow',
          icon: 'icons8 icons8-synchronize',
          command: () => {
              
          }
      },
      {
        label: 'View Source Code',
        icon: 'icons8 icons8-database',
        command: () => {
            
        }
      },
      {
        label: 'View Stack Trace',
        icon: 'icons8 icons8-database',
        command: () => {
            
        }
      
      },
    ]
  }]
    me.data = PLAY_SESSIONS_DUMMY;  
    this.data.panels= [];
    this.data.sessionDetails =[];
    this.data.pageDetails = [];
    this.nvAppConfigService.getdata().subscribe(response => {
        this.nvconfigurations = response;
        this.metaDataService.getMetadata().subscribe(response => {
          this.metadata = response;
          DataManager.metadata = this.metadata;
          //console.log("Metadata received");
          // to ensure, we have meta data,
          // needed in case of independent replay request
          this.getParams();
        });
    }); 
  }
   
  getParams(){
    let isActiveStr = null;
    let isActive = false;
    let recordAutomatic = "";
    let fullScreen = "";
    let replayDelayType = "";
    let speedValue = "";
    // this will be used for share replay, if token is available in params, then need to make authenticate request 
    let token = "";
    this.route.queryParams.subscribe(params => {
      //this.replayService.console("log","ReplayComponent, ngOnInit , params : ",params);
      //this.replayService.console("log","ReplayComponent, ngOnInit ,ReplayService.replayArray : ", JSON.stringify(ReplayService.replayArray));
      let sid = params["sid"];

      if (sid) {
        if(Array.isArray(sid)) sid = sid[0];
        sid = sid.replace(/^0+/, '');
      }
      let entryid = Number(params["id"]);
      isActiveStr = params["active"];
      
      // params , when opening replay independently
      let fc = params["filterCriteria"];
      if(fc){
        fc = unescape(fc);
        fc = JSON.parse(fc);
        //console.log("fc : ", fc);
        sid = fc["nvSessionId"];
        //console.log("sid from filter criteria : ", sid);
        entryid = -1;
        // params for recording only
        isActiveStr = (fc["isActive"]);
        isActiveStr = isActiveStr + ''; // if boolean
        recordAutomatic = fc["recordAutomatic"];
        fullScreen = fc["fullScreen"];
        replayDelayType = fc["replayDelayType"];
        speedValue = fc["speedValue"];
        // param , when replay is shared
        token = fc["token"];
        let isShare = fc["isShare"];
        if(isShare == null || isShare == undefined || isShare != "true")
          isShare = false;
        let pk = localStorage.getItem("productKey");
        if(pk == null){
          pk =  sessionStorage.getItem("productKey");
        }
        if(isShare == "true" || isShare == true)
        {
          // to hide all the icons or ways to go out of replay
          //console.log('inside if for hideWays')
          //TODO: this.hideWays();
          localStorage.removeItem("productKey"); 
          sessionStorage.removeItem("productKey"); 
          localStorage.setItem('replayProductKey',pk);
          sessionStorage.setItem('replayProductKey',pk);
        }
      }
      if(isActiveStr != "true" || isActiveStr == null || isActiveStr == undefined){
        isActive = false;
      }
      else
        isActive = true;
      this.isActive = isActive;
      this.record_data = {"recordAutomatic"  :recordAutomatic , "fullScreen" : fullScreen, "replayDelayType": replayDelayType, "speedValue":speedValue};
      let entry = null;
      // for recording purpose, no entry in replay service
      if(entryid == -1)
       entryid = this.replayService.makeEntry(sid,null,null,0,null,isActive);
      entry = ReplayService.idToEntity(entryid);
      if(entry == null)
      {
        // for refresh case
        entryid = this.replayService.makeEntry(sid,null,null,0,null,isActive);
        entry = ReplayService.idToEntity(entryid);
      }  
      this.currentEntryID = entryid;
      //if(entry.sid ==  sid)
      //this.replayService.console("log","ReplayComponent, ngOnInit entry : ",JSON.stringify(entry));
      let sessionTimer = -1;
      let pagetimer = -1;
      let rt = this;
      if(entry.session != null)
      {
         this.session = entry.session;
      }else
      {
         this.replayService.console("log","ReplayComponent, ngOnInit ", "waiting for session");
         sessionTimer = <any> setInterval(function(){
        
           if(entry.session != null)
          {
            clearInterval(sessionTimer);
            sessionTimer = -1;
            rt.session = entry.session;
          }
        },1000);
      }
      if(entry.pages != null )
        this.pages = entry.pages;
      else
      {
        this.replayService.console("log","ReplayComponent, ngOnInit ", "waiting for pages");
         pagetimer = <any> setInterval(function(){
           if(entry.pages != null ){
             clearInterval(pagetimer);
             pagetimer = -1;
             rt.pages = entry.pages;
           }
         },1000);
       }
 
       if(sessionTimer == -1 && pagetimer == -1){
        // from page filter , index will be null 
        if(entry.index == null || entry.index == undefined)
           entry.index = 0;
        // if pageinstance is set , then set currentPageIndex according to page instance
         if(entry.pageinstance != null){
          this.currentpageindex = this.getIndex(this.pages,entry.pageinstance);
         }
         else
           this.currentpageindex = entry.index;
         this.replayPage = this.pages[this.currentpageindex];
         this.totalRecords = this.pages.length;
         this.loadReplay();
       }
       else{
          this.replayService.console("log","ReplayComponent, ngOnInit ", "waiting for session & pages");
          let temptimer = setInterval(function(){
           if(sessionTimer == -1 && pagetimer == -1){
             clearInterval(temptimer);
             // from page filter , index will be null 
             if(entry.index == null || entry.index == undefined)
               entry.index = 0;
             rt.currentpageindex = entry.index;
             rt.replayPage = rt.pages[rt.currentpageindex];
             rt.totalRecords = rt.pages.length;
             rt.loadReplay();
           }
          },1000);
       }
     });
  }
  /*
  loadReplay(){
    this.replayService.console("log","ReplayComponent, loadReplay called ","");
    setTimeout(()=>{MsgService.warn("HHHHHHHHHHHHHHHHHHH");},2000);
  }
  expandFull(a){
    
  }
  backtoReplay(){
    
  }
  showNextReplay(){

  }
  showPrevReplay(){

  }
  goToFirstPage()
  {

  }
  goToLastPage(){

  }*/

  openImpactEvent(item) {
        //console.log("openImpactEvent called with  -- item -- ");//, this.currentRowData.channel
        this.appFlag = true;
        this.impactFlag = true;
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - 1);
        var yesterdayStr = moment.tz(dateObj, sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
        var st = yesterdayStr + " 00:00:00";
        var et = yesterdayStr + " 23:59:59";
        let st_utc = moment.tz(new Date(st), "UTC").format('MM/DD/YYYY  HH:mm:ss');
        let et_utc = moment.tz(new Date(et), "UTC").format('MM/DD/YYYY  HH:mm:ss');
        this.httpService.getEventImpactInfo("", st_utc, et_utc, this.session.channel.name, this.currentEvent ).subscribe((state : Store.State) =>{
          if (state instanceof NVPreLoadingState) {
            //console.log('NVPreLoadingState', state);
            this.loading = true;
            this.error = state.error;
           
           this.appFlag = true;
         }
         if (state instanceof NVPreLoadedState) {

            this.loading = false;
            this.appFlag = false;
            //console.log("response : ", state);
            this.cardData = state;
            this.displayFlag = true;
         }
        },(err: Store.State) =>{
          if (err instanceof NVPreLoadingErrorState) {
          this.loading = false;
          this.appFlag = false;
          console.log("error occred : ", err);
          }
        })
        this.impactData = [];
        //console.log("eventName " , this.currentEvent);
        this.impactData.push({event : this.currentEvent});
        this.impactData.push({last: ""});
        this.impactData.push({startDateTime : st});
        this.impactData.push({endDateTime: et});
        this.impactData.push({channel: this.session.channel});
        //console.log("after this.impactData " , this.impactData);
        //console.log("impactFlag ",this.impactFlag);
      }
      changeFlagValue(ev) {
        //console.log("changeFlagValue ", ev);
        this.impactFlag = ev;
      }
    
      onClickMenu(name) {
        //console.log("setting event name as : ", name, " on clicking menu ");
       // this.currentRowData = rowData;
        this.currentEvent = name;
    
      }

  loadReplay(){
    this.data.panels= [];
    this.data.sessionDetails =[];
    this.data.pageDetails = [];
    this.fillSessionDetails(this.session);
    //this.fillPageDetails(this.replayPage);
    this.replayService.console("log","ReplayComponent, loadReplay called ","");
    this.thumbNailProcessing();
    //ReplayUtil.hideCavSideBar();
    this.replayHandler.addScriptToIframeDoc("/sys/nvConfig.js", document);
    // add iframe class based on useragent
    let ua = this.session.userAgent;
    let deviceType = this.session.deviceType.name.toLowerCase();
    this.checkForExtension();
    this.addTemplate(ua,deviceType); 
    let replaydata = null;    
    replaydata = new ReplayData(this.session, this.pages, this.totalRecords, this.session.protocolVersion, this.currentEntryID, this.replayHandler);
    replaydata.initRS();
    replaydata.initUserActionData();
    this.replayUserActionData = replaydata.userActionData;
    //console.log("1. replydata.userActionData : ", JSON.stringify(replaydata.userActionData));

    this.setIframeSize();

    
    //console.log(AppComponent.config.cavEpochDiff + " -- this.session.startTime : " +  this.session.startTime + " -- this.session.endTime -- " +  this.session.endTime);
    //1. PAGEDUMP :  call to get snapshot path
     // duplicate code : just to show pagedump without any data dependency 
     // setting the data in replay service for prefetch
    this.replayService.setUserActionData(this.replayUserActionData);
    this.replayService.setDetails(this.session,this.pages,this.pages[this.currentpageindex].pageInstance,this.currentpageindex);
     this.openPageDump(this.pages, this.currentpageindex,this.replayPage.pageinstance, 0, null);
    //2. UserAction - DB
     // in case of active session, need not subtract cavEpochDiff
     let st = this.session.startTime;
     let et = this.session.endTime;     
     if(this.isActive != true){
       st = this.session.startTime - this.nvconfigurations.cavEpochDiff;
       et = this.session.endTime - this.nvconfigurations.cavEpochDiff;
     }

     this.httpService.getReplayDBData(this.session.sid,
                                      -1,/*this.replayPage.pageinstance,*/
                                     st,
                                     et).subscribe(response => {
       this.replayDBdata =[];
       let respons = response.trim();
       let parsedRes = [];
       try{
          //console.log("ANJALI Error in parsing starts??");
          parsedRes = JSON.parse(respons);
          //console.log("ANJALI Error in parsing starts?? NO");
       }
       catch(e){
          //console.log("ANJALI Error in parsing starts?? YES");
          // iterate all the records and remove the record causing issue
           let s= respons.split("\n");
           for(let i=0; i < s.length; i++)
           {   
               //console.log("ANJALI : S[" + i + "]:" + s[i]);
               // to check for valid record
              if(s[i].trim != "" && s[i].length > 10)
              {    
                   try{ 
                        parsedRes.push(JSON.parse(s[i]));
                   }catch(e){
                          // remove the record causing issue
                          s.splice(i,1);
                   }
              }
           }
       }
         //console.log("ANJALI : parsedRes : ", parsedRes);
         // TODO : hanlde parsing issue
         //console.log("got it db");
         let myObserver1 = Observable.create(observer =>{
           observer.next({type:"db",data:parsedRes});
           observer.complete();
         });
         
         this.pendingUserActionRequest.push(myObserver1);
         
         this.replayDBdata = parsedRes;
     //console.log("2. replydata.userActionData : ", JSON.stringify(replaydata.userActionData));
    });
    //3. UserAction - JSON 
    let nextObj = {"p1" :  this.pages[this.currentpageindex], "offset" : '0'};
    // in case , when replay is started from a middle page, page the correct pageinstance
    let requestedPage = ReplayUtil.getRequestedPageList(this.pages[this.currentpageindex].pageInstance, this.DELTA_ENTRIES, this.pages, this.totalRecords, this.session.partitionID,this.defoffset); 
    let basepath =  ReplayUtil.getBasePathURL(this.replayPage.url);
    //console.log("basepath : ", basepath);
    /*this.httpService.getReplayJsonData(requestedPage,
                                       this.session.sid,
                                       basepath,//basepath n current version
                                       1)*/
      this.replayService.methodWrapper("getReplayJsonData",[requestedPage,
                                       this.session.sid,
                                       basepath,//basepath n current version
                                       1],"useractions",nextObj).subscribe(response => {
        this.replayJsonData = response;
        let myObserver2 = Observable.create(observer => {
         observer.next({type: "json", data: this.replayJsonData});
         observer.complete();
       });
       this.pendingUserActionRequest.push(myObserver2);
          
     //console.log("3. replydata.userActionData : ", JSON.stringify(replaydata.userActionData));
    });
  
  let root = this;
  // what if useraction requests are processed, but pagedump is still pending
  // to handle above case, request_completed indicates useraction requests completion status
  // timer will run until all three requests are not completed, if useraction requests are completed and page dump is still in waiting state,
  // it will not process useraction requests again
  let request_completed = false;
  let timer = setInterval(()=>{
     //console.log("this.pendingUserActionRequest.length : ", root.pendingUserActionRequest.length);
     if(root.pendingUserActionRequest.length == 2)
     {
      if(request_completed == false)
      {
       root.pendingUserActionRequest.forEach(observer =>
       {
          observer.subscribe((dataobj) =>{
            //console.log("root.pendingUserActionRequest DATA : ", dataobj.type);
             let  prev_dataobj =null;
              if(dataobj.type=="db")
            {
              for(let  i =0; i < dataobj.data.length; i++){

                 if(i -1 >= 0)
                  prev_dataobj =dataobj.data[i-1];
                replaydata.fillUserActionData(dataobj.data[i], 'db',i,prev_dataobj,"");
               }
            }
            else{
              for(let pageInstance in this.replayJsonData){
                 //console.log("12. ANJALI : pageInstance", pageInstance);
                
                if(this.replayJsonData[pageInstance]!=null){
                 if(this.replayJsonData[pageInstance].length == 0){
                   replaydata.userActionData[pageInstance].jsonDataCollected = true;
                 }
                 for(let z = 0; z < this.replayJsonData[pageInstance].length; z++){
                   //filter unexpected records if enabled.
                   if(ReplaySettings.replayUnexpectedMutation == true)
                   {
                      if(this.replayJsonData[pageInstance][z].m.state == UNEXPECTED_MUTATION)
                         continue;
                   }
                                 if(z -1 >= 0)
                                prev_dataobj =this.replayJsonData[pageInstance][z-1];
                    replaydata.fillUserActionData(this.replayJsonData[pageInstance][z], 'json', Number(pageInstance),prev_dataobj,"");
                 }
                }
              }
            }
          });
        });
        replaydata.fillRequestData();
        request_completed = true;
        let index = 0;
        replaydata.sortUserActionDataOnTimestamp(index);
        //console.log("33. final replydata.userActionData : ", JSON.stringify(replaydata.userActionData));
      }
      // this ensures , pagedump and userActionData is present before processingPageDumpCallback
      if(request_completed == true ){//&& this.pagedumpLoad == true){
        clearInterval(timer);
        root.replayUserActionData = replaydata.userActionData;
        root.setDataToShow();
        //console.log(root.showPageActions ," --  root.replayUserActionData : ",  root.replayUserActionData);
        root.showPageActions = true;
        let controls={first:false,last:false,next:false,prev:false,play:false,progressBarWidth:0, playLabel : 'Play', playIcon : 'icons8 icons8-material-filled'};
        if(root.replayDocument == undefined || root.replayDocument == null)
          console.log("root.replayDocument in undefined");
        this.replayHandler.initData( replaydata, // replaydata should have only one instance
                                              replaydata.userActionData,
                                              root.session, 
                                              root.replayDocument, 
                                              root.pages, 
                                              root.replayPage,
                                              root.nvDomBuilder,
                                              root.replayWindow,
                                              root.currentpageindex,
                                              root.pagedumpLoad,
                                              controls,
                                              root.record_data,
                                              root.swidth,
                                              root.sheight
                                              ); 
        if(this.firstpagemissing && (Number(this.currentpageindex)+1) < this.pages.length)
          this.replayHandler.openPageDump((Number(this.currentpageindex)+1),null,0);

          //bug 96220
        /*  try{
            // this will manage the netvision menu bar
            document.querySelector('#main-content #nvsidmenu.mat-drawer.mat-drawer-side')["style"]["marginTop"] = "35px";
            // this is for extra scroll, that is coming from mat
            document.querySelector('#main-content .mat-drawer-content')["style"]["overflow"] = "hidden";
            // since we have disabled replay-wrapper scrolling to hide extra scroll bars
            // keep its scrolling position to top since pd.scrollIntoView will scroll replay-wrapper
            document.querySelector('.replay-wrapper')["style"]["top"]="40px";
            document.querySelector('.replay-wrapper').scrollTop = 0;
            
          }catch(e){console.log("error while setting css")}*/
      }
     }
   },1000);
  }
  thumbNailProcessing()
  {
    let thumbnail : HTMLImageElement = null;
    for(let i =0; i < this.pages.length; i++)
    {
      thumbnail = document.querySelector<HTMLImageElement>('#icon' + i);
      //console.log("thumbnail : ", thumbnail);
      if(thumbnail == null) {continue;}
      thumbnail.src = '/netvision/websnapshot/' + this.pages[i].pageName.name + ".jpeg";
    }
  }
 
  
  // set the iframe height , width and transform property 
  setIframeSize(){
    //console.log("setIframeSize called, session.screenResolution : ", JSON.stringify(this.session.screenResolution));
    let scrnResolution = null;
    try{
      scrnResolution = this.session.screenResolution["name"];
      if(scrnResolution == null || scrnResolution == undefined)
      scrnResolution = this.session.screenResolution.dim;
    }catch(e){
      scrnResolution = this.session.screenResolution.dim;
    }
    //console.log("scrnResolution :" , scrnResolution);
    let pageWidth =0;
    let pageHeight = 0;
    let tx = 0;
    let ty = 0;
    //var pageWidth = (document.width || (null === document.documentElement ? 0 : document.documentElement.offsetWidth))*0.79;
    //var pageHeight = Math.max("undefined" == typeof document.height ? 0 : document.height, "undefined" == typeof document.documentElement ? 0 : document.documentElement.offsetHeight,"undefined" == typeof document.documentElement ? 0 : document.documentElement.scrollHeight);
    // 0.7699 is given according to width of replay content excluding side
    //pageWidth =  $(document).width()*0.7699
    //pageHeight = $(document).height();
    pageWidth = parseFloat(getComputedStyle(document.body, null).width.replace("px", "")) * 0.7399;
    pageHeight = parseFloat(getComputedStyle(document.body, null).height.replace("px", ""));


    //console.log("pageWidth : ", pageWidth, " pageHeight : ", pageHeight);
    
    var swidth = Number(scrnResolution.substring(0,scrnResolution.indexOf("x")));
    var sheight = Number(scrnResolution.substring(scrnResolution.indexOf("x")+1,scrnResolution.length));

    this.swidth = swidth;
    this.sheight = sheight;
    
    if(Number(pageWidth) > Number(swidth))
    {
      tx = swidth/pageWidth;
      ty = sheight/pageHeight;
    }
    else
    { 
      tx = pageWidth/swidth;
    }
    var sf = Number(swidth)/Number(sheight);
     if(sf > 1)
       {
         pageWidth = Number(pageWidth) ;
         pageHeight =  pageWidth/sf;
       }
     else
       {
        pageHeight = pageHeight;
        pageWidth = pageHeight * sf;
       }

       //Check if current view height/width are greater than actual size then take the actual size as pageHeight and pageWidth. 
       if(pageHeight > sheight && pageWidth > swidth)
       {
         pageWidth = swidth;
         pageHeight = sheight;
       }
    tx = Number(pageWidth)/Number(swidth);
    ty = Number(pageHeight)/Number(sheight);
    this.iframe_width = swidth + "px";
    this.previframe_width = this.iframe_width;
    this.iframe_height = sheight + "px";
    this.iframe_transform = "scale("+tx+","+ty+")" + " translate(-50%, 0px)";
    // to show in middle
    if(this.session.protocolVersion != 1)
    {
      //this.iframe_left = "35%";
      this.iframe_position = "absolute";
    }
    this.iframe_left = "50%";
    // bug : 86949
    if(this.applyTemplate)
      this.iframe_height = "";
    //console.log("iframe_width " , this.iframe_width, " iframe_height ", this.iframe_height , " tx " , tx , " ty ", ty, " sheight : ", sheight);
  }

  expandFull(fs){
 //console.log("expandFull in replay component start: ",this.fullscreen);  
    let i = ReplayUtil.showframe(this.swidth,this.sheight,this.session.userAgent, this.fullscreen);
    this.iframe_transform = i.iframe_transform;
    this.fullscreen = !this.fullscreen;
    // while expanding, there comes two scroll bars, in which one covers the other scroll bar
    // vertical scroll available  
    // this.fullscreen false, means, enabling fullscreen
    if(this.fullscreen == false && Math.max(document.body.offsetHeight, document.body.clientHeight) < document.body.scrollHeight)
    {  
       this.iframe_width = (parseInt(this.iframe_width) - 10) + "px";
       this.fullscreentt = "Exit Fullscreen";
    }
    // going back to collapse
    if(this.fullscreen == true){
      this.iframe_width = this.previframe_width;
      this.fullscreentt = "Fullscreen";
    }

    //console.log("expandFull in replay component in end: ",this.fullscreen); 
    // Check if need to call setCanvasStyling
  }
  showDialog() {
    this.displayTabs = true;
  }
  showForms() {
    this.displayForms = !this.displayForms;
    this.disableInputElements();

  }
  
  showMaps() {
    this.displayMaps = !this.displayMaps;
    if(this.displayMaps)
      this.replayCanvas.nativeElement.style.display="";
    else
     this.replayCanvas.nativeElement.style.display="none";
  }

  showSelectors() {
    
    this.displaySelectors = true;
    this.sg_build_floating_select();
    this.replayHandler.sendMessage(true);
    this.disableInputElements();
    document.getElementById("replaycanvas").style.display = "none";
    //console.log('show selector method called reset=',this.reset,'pagedumpLoad=',this.pagedumpLoad,'displaySelectors=',this.displaySelectors);
    this.cdr.detectChanges();
    
    // creates hover element over pagedump
  }
  onHideSelector(e){
    this.highLighterSub=true;
    this.deletehighlight();
    this.displaySelectors = false;
    document.getElementById("replaycanvas").style.display = "block";
  }
  openPageDump(pages : PageInformation[], currentpageindex:number,pageinstance:number, snapshotIndex:number, mode :string){
    this.replayHandler.setPageLoadCallback(snapshotIndex);
    this.pagedumploading = true;
    let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null};
    this.replayService.snapWrapper("getSnapShotPathThroughAjax",[currentpageindex,this.session.startTime,this.session.sid,pageinstance,this.session.partitionID,snapshotIndex],"snapshots",nextdata,"path",snapshotIndex).subscribe(response =>{   
     
             this.snapshotPath = response.split("%%%")[0];
             this.snapshotPath = this.snapshotPath.trim();
             if(this.replayUserActionData[pageinstance]){
               //console.log("open  PageDump : Setting in replayUserActionData  : ", this.snapshotPath);
               this.replayUserActionData[pageinstance].snapshotInfo[snapshotIndex].snapshotPath = this.snapshotPath;
             }
               // in case first page dump missing, set no pagedump or move to next pagedump
               // but that is only possible when data processing has been done.
               const win: Window = this.replayIframe.nativeElement.contentWindow;
               this.replayWindow = win;
               const iframe_document: Document = <Document> win.document;
               this.replayDocument = iframe_document;
               //console.log("Neeraj Assigning replayDocument 1: ", this.replayDocument);
               
             // missing pagedump
             if(this.snapshotPath == ""){
              //MsgService.log("Pagedump missing");
              this.msgService.add({severity:'info', summary:'Pagedump Missing', detail:''});
             // skip to next pagedump 
             if(ReplaySettings && ReplaySettings.hasOwnProperty("skipFailedSnapshot") && ReplaySettings.skipFailedSnapshot == true)
             { 
                 console.log("first pagedump missing, skipping");
                 for (; iframe_document.firstChild; )
                   iframe_document.removeChild(iframe_document.firstChild);
                  this.firstpagemissing = true;
             }
             else
             {     
                   this.replayIframe.nativeElement.src="/netvision/reports/noPageDump.html"; 
                   //called when data has loaded
                   //this.replayHandler.processingPageDumpCallback.call(window.parent);
             }
             
             this.pagedumpLoad = true;
             //this.pagedumploading = false;
             return;  
            }
            let rr =this;
            if(this.session.protocolVersion == 200)
            { 
              //console.log("readAndroidSnapshotFile called");
              //rr.setIframeSize();
              let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
              rr.replayService.snapWrapper("readAndroidSnapshotFile",[this.snapshotPath],"snapshots",nextdata,"pagedump",snapshotIndex).subscribe(response => {
              //this.httpService.readAndroidSnapshotFile(this.snapshotPath).subscribe(response => {
                //this.replayIframe.nativeElement.src=response;
                //console.log("readAndroidSnapshotFile response");
               /* for (; iframe_document.firstChild; )
                 iframe_document.removeChild(iframe_document.firstChild);*/
                var reader = new FileReader();
                reader.addEventListener("load", function() {
                  //console.log("Inside reader");
                  var image = new Image();
                  //image.height = 100;
                  //image.title = file.name;
                  image.src =<any> this.result;
                  image.id ="imgid1";
                  // bug id : 109870
                  image.style.cssText = "width:100%;height:100%";
                  // empty the document
                  let d = rr.replayIframe.nativeElement.contentWindow.document;
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
                    dib.appendChild(image);
                  }else{
                    let l = d.createElement("body");
                    d.documentElement.appendChild(l);
                    let dib = d.createElement('div');
                    dib.id ="divid1";
                    dib.appendChild(image);
                    d.body.appendChild(dib);
                  }
                  rr.pagedumpLoad = true;
                  //rr.pagedumploading = false;
                }, false);
                reader.readAsDataURL(response);
                
              });
               return;
            }


              //call to read pagedump file and render to iframe  
              let nextdata = {"p1" :{"pageinstance":pageinstance}, "offset" :null}
              this.replayService.snapWrapper("readSnapshotFile",[this.snapshotPath],"snapshots",nextdata,"pagedump",snapshotIndex).subscribe(response => {
             //this.httpService.readSnapshotFile(this.snapshotPath).subscribe(response => {
               //start with nvDomBuilder 
               //console.log("lets do it"); 

               const win: Window = this.replayIframe.nativeElement.contentWindow;
               this.replayWindow = win;
               const iframe_document: Document = <Document> win.document;
               this.replayDocument = iframe_document;
               //console.log("Neeraj Assigning replayDocument 2: ", this.replayDocument);
               for (; iframe_document.firstChild; )
               iframe_document.removeChild(iframe_document.firstChild);

              // just to pass nvconfigurations
               let obj = {'nvconfigurations' : this.nvconfigurations};
               this.nvDomBuilder = new DOMBuilder(iframe_document, 'Admin', this.replayHandler, obj);
              //window.nvDomBuilder = nvDomBuilder;
              //console.log("processing json data to form pagedump on - " + document);
              let basePath = ReplayUtil.getBasePathURL(this.replayPage.url);
              //console.log("basePath : ", basePath);
              this.nvDomBuilder.initialize.apply(this.nvDomBuilder, [response, this.replayPage.url]); 
              //taken care in nvDombuilder
              this.pagedumpLoad = true;   
              //this.pagedumploading = false; 
            }); 
       });
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    /*reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);*/
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
  clickEvent(tabName:String){
    //console.log("tabName in method = ", tabName);
    this.resTabList.forEach(function (tabData:TabDetails, index) {
      if(tabData.name === tabName)
         tabData.selectedStatus = true;
      else 
         tabData.selectedStatus = false;
    });
    //console.log("this.resTabList == ", this.resTabList)
  }

  showNextReplay(){
    //console.log("ev in showNextReplay in replay component : ", ev);
    this.setControls();
    this.progressBarVal = ReplayUtil.progressBarValue;
    this.replayHandler.showNextReplayChild(null,null);
  }
  showPrevReplay(){
    //console.log("ev in showPrevReplay in replay component : ", ev);
    this.setControls();
    this.progressBarVal = ReplayUtil.progressBarValue;
    this.replayHandler.showPrevReplayChild(null,null);
  }
  goToFirstPage(){
    this.setControls();
    this.progressBarVal = ReplayUtil.progressBarValue;
    this.currentpageindex = 0;
    this.replayPage = this.pages[0];
    this.replayHandler.onPageNav(this.replayPage, this.currentpageindex);
  }
  goToLastPage(){
    this.setControls();
    this.progressBarVal = ReplayUtil.progressBarValue;
    this.currentpageindex = this.pages.length -1;
    this.replayPage = this.pages[this.pages.length -1];
    this.replayHandler.onPageNav(this.replayPage, this.currentpageindex);
  }
  /*replaySwitcherHandlerP(ev){
    console.log("ev in replaySwitcherHandlerP in replay component : ", ev);
    this.replayHandler.replaySwitcherHandler(ev);
  }*/
  onClickfromPageNav(index){
    //console.log("onClickfromPageNav , ev : ", ev);
    //let obj = JSON.parse(ev);
    this.currentpageindex = index;
    this.replayPage = this.pages[index];
    this.replayHandler.onPageNav(this.replayPage, this.currentpageindex);
    this.setControls();
  }
  setControls(){
    //console.log("setControls method called ");
    this.disablefirst = this.replayHandler.replayControl.first;
    this.disablelast = this.replayHandler.replayControl.last;
    this.disablenext = this.replayHandler.replayControl.next;
    this.disableprev = this.replayHandler.replayControl.prev;
    this.disbaleplay = this.replayHandler.replayControl.play;
    this.progressBarVal = this.replayHandler.replayControl.progressBarWidth;
    //console.log("setControls : first  : ",this.disablefirst,  " last-  ",  this.disablelast , " prev-  ", this.disableprev , " next- " , this.disablenext,  " play- ",  this.disbaleplay);
  }

  videoSkin1(ev){
    //console.log("videoSkin1 called");
    let elm = <HTMLElement> document.querySelector(".skinhideshow");
    if(!elm) return;
    this.skinToggle1 = !this.skinToggle1;
    let bar = <HTMLElement> document.querySelector("#controlbar");
    if(this.skinToggle1){
      bar.className = bar.className.replace("v-show","v-hide");
      elm.style.bottom = "0px";
    }
    else{
      bar.className = bar.className.replace("v-hide","v-show");
      elm.style.bottom = "40px";
    }
  }
  sg_build_floating_select()
  {
    this.replayDocument = ReplayUtil.getReplayDocument(); 
    let replayhtml = this.replayDocument.querySelector('html');
    let fd = this.replayDocument.createElement('sg-tag');
    fd.id = "sg_floating_div";
    fd.className = "sg_coverandselect";
    fd.style.opacity = "1";
    replayhtml.insertBefore(fd,replayhtml.firstChild);

    let cssText = `sg-tag#sg_floating_div {
      position: absolute !important;
      outline: rgba(107, 107, 107, 0.70) solid 2px !important;
      pointer-events: none !important;
      z-index: 9999999 !important;
      height: 210px;
      width: 800px;
      padding: 0px !important;
      margin-left: 0px !important;
      margin-top: 0px !important;
      top: 404px;
      left: 551.5px;
      background: transparent !Important;
    
    }
    sg-tag#sg_floating_divhm {
      position: absolute !important;
      outline: rgba(255, 255, 255, 0.86) solid 2px !important;
      pointer-events: none !important;
      z-index: 9999999 !important;


      height: 210px;
      width: 800px;
      padding: 0px !important;
      margin-left: 0px !important;
      margin-top: 0px !important;
      top: 404px;
      left: 551.5px;
      background: transparent !Important;
    }`;
    let fd_css = this.replayDocument.createElement('style');
    fd_css.innerText=cssText;
    replayhtml.insertBefore(fd_css,replayhtml.firstChild);
  }
  // adding template on the basis of device type
  addTemplate(userAgent:string, deviceType : string){
     let hasTemplate = this.nvconfigurations.hasTemplate;
     let itemplateUrl = this.nvconfigurations.templateUrl;
     let d = deviceType.toLowerCase();
     // first give priority device type
     // mobile, iphone , tablet support
     if(!hasTemplate)
     {
       if(userAgent.toLowerCase().indexOf('iphone') > -1){
          this.applyTemplate = true;
          //this.iframe_left = "35%";
          this.iframe_position = "absolute";
          this.templateCls = "iphone678";
          //this.canvasCls = "iphone678C";
       }
       else if(d == "mobile"){
          this.applyTemplate = true;
          //this.iframe_left = "35%";
          this.iframe_position = "absolute";
          this.templateCls = "smartphone";
       }
       else if(d == "tablet" ){
          this.applyTemplate = true;
          //this.iframe_left = "28%";
          this.iframe_position = "absolute";
          this.templateCls = "tablet";
          //this.canvasCls = "tabletC";
       }else if(userAgent.toLowerCase().indexOf('mobile') > -1 ){
          this.applyTemplate = true;
          //this.iframe_left = "35%";
          this.iframe_position = "absolute";
          this.templateCls = "smartphone";
          //this.canvasCls = "smartphoneC";
       }else if(userAgent.toLowerCase().indexOf('tablet') > -1 || userAgent.toLowerCase().indexOf('ipad') > -1 ){
        this.applyTemplate = true;
        //this.iframe_left = "28%";
        this.iframe_position = "absolute";
        this.templateCls = "tablet";
      }
        // all cases : show iframe in midde
        // TODO : remove iframe_left from above cases and below css property to shift it to middle
        this.iframe_left = "50%";
        this.iframe_transform = this.iframe_transform + " translate(-50%, 0px)";
     }
     else if(ReplaySettings.showTabs == true){
         // multiple tab handling
     }
     else {
         // hasTemplate is true 
     }
  }
  // if chrome and mobile session, ask user to enable the extension
  checkForExtension(){
    let isChrome =  !!window["chrome"];
    let extensionMode = this.nvconfigurations.extensionMode;
    if(isChrome && extensionMode)
    {
      this.replayService.console("log","checkForExtension","is Chrome");
      let r = this;
      //make a request for web_accessible_resources , if found then only send msg
     this.httpService.checkForExtension("chrome-extension://gkdnjbboalcohalegmafkkahblbpcgjc/images/close.png")
     .subscribe(
      (state: Store.State) => {
        if (state instanceof NVPreLoadedState) {
          let response = state.data;
     //.subscribe(response =>{
        let m = response['status'] + " -- Web script : sending msg to content script , userAgent : " + this.session.userAgent;
        r.replayService.console("log","checkForExtension",m);
        // if extension is enabled, close.png response status will be 200
        if(response['status'] == 200)
        {
          window.postMessage({
           operation : "useragent",
           userAgent: this.session.userAgent
          }, window.origin);
        }/*else{
          r.replayService.console("log","checkForExtension","call showMsgBox");
           // if extension is disabled, status will be 0
           // ask user to enable it or add it to chrome
           r.showMsgBox(); 
        }*/
      }else{
        if(state instanceof NVPreLoadingErrorState){
          let err = state.error;
        r.replayService.console("warn","checkForExtension",err['status']);
        if(err['status'] == 200)
        {
          r.replayService.console("log","checkForExtension","Posting message");
          window.postMessage({
           operation : "useragent",
           userAgent: this.session.userAgent
          }, window.origin);
        }else{
          r.replayService.console("log","checkForExtension","call showMsgBox");
           // if extension is disabled, status will be 0
           // ask user to enable it or add it to chrome
           r.showMsgBox(); 
        }
      }
    }
      });
    }
  }
  showMsgBox(){
    this.replayService.console("log","showMsgBox","install extension");
    //MsgService.log('<span><a style="color: black !important;" href="https://chrome.google.com/webstore/detail/netvision/gkdnjbboalcohalegmafkkahblbpcgjc"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;Install extension for better replay experience</a></span>');
    //MsgService.log('Install extension for better replay experience');
    this.msgService.add({severity:'info', summary:'Install extension for better replay experience', detail:''});
  }

  clickMapdata($event){
  //console.log('event data',$event);
    //this.clickMap =$event;
    this.showm =true;
  }

  backtoReplay(){
    this.showm =false;
     let ele =document.getElementById('paccord');
     if(ele)
       ele.style.display='block';
      this.showReplaycontrol=true;
      this.clickMapSetting=false;
      this.heatMapSetting=false;
      this.Tranparencyslider=false;
      this.Tranparencysliderh=false;
      const element = document.getElementById("replayIframe") as HTMLIFrameElement;
      let parentOverlayElement=<HTMLElement>element.contentWindow.document.querySelector("#overLayParent");
          
          try{
            parentOverlayElement.removeEventListener('click',() =>{this.setTransparencyLevel()});
          }
          catch(err){
            console.log('error in removing listener');
          }
  }
/*
  resetSelPopup(){
    //console.log('reset method called',this.repSelector);
    this.repSelector.resetPopup();
  }
 */
  minimizePopup(){
    this.reset=!this.reset;
    if(!this.reset)
    {
      let ele =document.getElementById('selectorcomponent');
      ele.style.display='none';
    }
    else{
      let ele =document.getElementById('selectorcomponent');
      ele.style.display='block';
    }

  }

  deletehighlight(){
          //console.log('remove following elements borders',this.allremdata);
          this.removehighlight(this.allremdata);
    
          const element: HTMLIFrameElement = document.getElementById('replayIframe') as HTMLIFrameElement;
          var doc = element.contentWindow.document;
          var elems=doc.getElementsByTagName("sg-tag");
          for (let i = 0; i < elems.length-1; i++) {
          //console.log('elem',elems);
          let ele = <HTMLElement> elems[i];
          if(ele!=null)   
          ele.style.display = "none";
           }
    
          var elemfloat=doc.querySelector('#sg_floating_div');
          let ele = <HTMLElement> elemfloat;
          if(ele!=null)   
          ele.style.display = "none";
          
          this.highLighterSub=false;
          this.allremdata.length=0;
      }

      removehighlight($event){
               this.allremdata =[...$event]; 
              //console.log('data copied','is cross method =',this.highLighterSub,'data=', this.allremdata); 
              if(this.highLighterSub && $event.length !=0)
              {
                if($event.length == 1)
               {  
                //console.log(' case 1 element html element',$event[0]);
                $event[0].style.border = "none"; 
              }
          
                else{
                  //console.log('total element to be remove=',$event.length); 
                  for (let i = $event.length-1; i >-1 ; i--) {
                  let ele = <HTMLElement>$event[i];
                  //console.log('setting ele border none=',i,'=',ele); 
                  ele.style.border = "none";
                  $event.pop();
                 }   
              } 
            }
          }
          onHideAnalatyics($event){
            //console.log('on Hide method called for forms')
          this.replayHandler.sendMessage(true);
          }
          PagechangeclosePopup($event){
            //console.log('PagechangeclosePopup closed method called');
            this.displaySelectors = false;
            this.onHideSelector($event);
          }

          disableInputElements(){
          const element: HTMLIFrameElement = document.getElementById('replayIframe') as HTMLIFrameElement;
          var doc = element.contentWindow.document;
          var allinputelems=doc.getElementsByTagName("input");
           let len=allinputelems.length-1;

          for (let i = 0; i <=len; i++) {
          let ele = <HTMLInputElement> allinputelems[i];
          ele.disabled=true; 
          }

          var links = doc.getElementsByTagName('a');
          for(var i=0;i<links.length;i++)
          {
              links[i].href='#';
              links[i].onclick = function(){  return false; };
          }
          
        }  
        
        /*
        destroyMaps() {
          this.hideLoader();
          if(document.getElementById('load') != null)
            document.getElementById('load').style.display = "none";
          if (this.ReplayMapsComponent) {
            console.log('detroyMaps called');
            this.ReplayMapsComponent.ngOnDestroy();
          }
        }*/
      
        hideWays(){
          //console.log('Hideways called');
         try{
          // hiding NV nav bar
          document.querySelector('.mat-button-wrapper')["style"]["display"] = "none";
          // hiding Product UI nav bar
          document.querySelector('#sidebarCollapse')["style"]["display"] = "none";
          // hiding dropdown menu next to user button
          document.querySelector('.ui-splitbutton-menubutton')["style"]["display"] = "none";
          // hiding breadcrumb row
          document.querySelector('.netvision-bg')["style"]["display"] = "none";
          //Help icon
          document.querySelector('.navBarAccClass')["style"]["display"]='none';

          document.querySelector('.product-nav-bar')["style"]["display"]='none';
          //User logout options
          document.querySelector('[title="Help"]')["style"]["display"]='none';
 
          
          //hiding the share icons
         let checkExist = setInterval(function() {
          let el = document.getElementById('shareIcon') ;
            if(el != null) 
            {
               el["style"]["display"] ="none";
               //console.log("Exists!");
               clearInterval(checkExist);
            }
         }, 100);
        

         this.existAlerts = setInterval(function() {
          let eleme =<HTMLElement> document.querySelector('[title="Behavioral Alert Count"]'); 
          if(eleme!=null)
          {
             //console.log(" elemeExists!");
             eleme.parentElement.style.cssText = 'display:none !important';
             let ele123= <HTMLElement> document.querySelector('[title="Capacitive Alert Count"]');
             if(ele123!=null)
             ele123.parentElement.style.cssText = 'display:none !important';       
             clearInterval(this.existAlerts);
          }
       }, 100);
        
         this.preventBackButton();
                  
         }catch(e){console.log("Exception while hiding all way out from replay ", e);}
   }


        preventBackButton() {
        history.pushState(null, null, location.href);
         window.onpopstate = function () {
        history.go(1);
         };
        } 
       

        showTransparencyslider(){
          
          const element = document.getElementById("replayIframe") as HTMLIFrameElement;
          let doc = element.contentWindow.document;
        
          if(this.clickMapSetting){
          this.clickMapSetting=false;
          this.Tranparencyslider=true;
          let parentOverlayElement=<HTMLElement>element.contentWindow.document.querySelector("#overLayParent");
          
          try{
            parentOverlayElement.removeEventListener('click',() =>{this.setTransparencyLevel()});
          }
          catch(err){
            console.log('error in removing listener');
          }
          parentOverlayElement.addEventListener('click',() =>{this.setTransparencyLevel()});
          }
          else{
            this.heatMapSetting=false;
            this.Tranparencysliderh=true;
            let heatcanvas= <HTMLCanvasElement>element.contentWindow.document.getElementsByClassName('heatmap-canvas')[0];   

            try{
              heatcanvas.removeEventListener('click',() =>{this.setTransparencyHeatmap(heatcanvas)});
              }
              catch(err){
                console.log('error in removing listener');
              }
            heatcanvas.addEventListener('click',()=>{this.setTransparencyHeatmap(heatcanvas)});
          }
        
        }
         setTransparencyLevel(){
          this.Tranparencyslider=false;
          this.clickMapSetting=true;
          let TranparencyLevel =this.Tranparency/100;
         let existCondition =setInterval( () => {
          const element = document.getElementById("replayIframe") as HTMLIFrameElement;
          let doc = element.contentWindow.document;
          let parentOverlayElement=<HTMLElement>element.contentWindow.document.querySelector("#overLayParent"); 
          if (parentOverlayElement) {
            parentOverlayElement.style.backgroundColor='grey';
            parentOverlayElement.style.opacity= ""+TranparencyLevel;
            clearInterval(existCondition);
            }
           },100);    
         }
      
         setTransparencyHeatmap(heatcanvas){
          let TranparencyLevel;
          TranparencyLevel =this.Tranparency/100;
          if(this.selectedgradient!=this.previousgradient){
          changeGradient(this.selectedgradient);
           this.previousgradient =  this.selectedgradient;  
        }
          this.Tranparencysliderh=false;
          this.heatMapSetting=true;
          heatcanvas.style.backgroundColor=`rgba(225, 225, 225,${TranparencyLevel})`;
         
         }

       closeHeatMap(event){
        this.heatMapSetting=false;
        this.scrollmapsettings=false;
        let obj = {"key" : "callExpandFrame", "data" : {type:"Click Map"}};
        this.replayHandler.broadcast('msg',obj);
        this.fullscreen=false;
        this.expandFull(event);
        this.showReplaycontrol=true;
        this.selectedgradient="cyan";
        this.Tranparency=0;
        const element = document.getElementById("replayIframe") as HTMLIFrameElement; 
        let heatcanvas= <HTMLCanvasElement>element.contentWindow.document.getElementsByClassName('heatmap-canvas')[0];  
        try{
          heatcanvas.removeEventListener('click',() =>{this.setTransparencyHeatmap(heatcanvas)});
          heatcanvas.remove();
          }
          catch(err){
            console.log('error in removing listener');
          }
      

      }

      downloadMap(){
       //console.log('inside downloading map');
      }

      download(){        
       }


        ngOnDestroy() {
          if (this.existAlerts) {
            clearInterval(this.existAlerts);
          }
        }   

         hideLoader()
         {
            var f = ReplayUtil.getReplayDocument();
            var g = f.getElementById('load');
            if(g)
                g.style.display = "none";
           
         }
         fillSessionDetails(s: Session){
           var inof = {label : 'SID',value : s.sid + ''};
           this.data.sessionDetails.push(inof);
           inof = {label : 'Client IP',value :s.clientIp};
           this.data.sessionDetails.push(inof);
           if(!this.session.AndroidBrowserFlag){
              inof = {label : 'Max Onload',value :s.maxOnLoad + ''};
              this.data.sessionDetails.push(inof);
              inof = {label : 'Max TTDI',value :s.maxTTDI + ''};
              this.data.sessionDetails.push(inof);
           }
         } 
         setDataToShow(){
           //console.log("setDataToShow called : ", this.replayUserActionData);
           this.data.panels= [];
           let p =null;
           let uadata = Object.keys(this.replayUserActionData);
           uadata.forEach(pinst => {
              let pindex = this.getPindex(pinst);
              let firstpage = this.pages[0];
              //console.log("pindex : ", pindex, " -- pi-- ", pinst);
              p =  new playsession(this.replayUserActionData[pinst],this.pages[pindex],this.nvconfigurations.cavEpochDiff,this.session, firstpage);
              this.data.panels.push(p);
           });
           //console.log("this.data.panels : ", this.data.panels);
         }

         getPindex(instance){
           let index = 0;
           this.pages.forEach((p)=>{
               if(p.pageInstance == instance)
                 index = p.index;
           });
           return index;
         }
         // page detail will be filled for a single page on click of button
         fillPageDetails(page : PageInformation){
           this.data.pageDetails = [];
          var inof = {label : 'URL',value : page.url + ''};
          this.data.pageDetails.push(inof);
          inof = {label : 'Load time',value : page.timeToLoad +' seconds'};
          this.data.pageDetails.push(inof);
          if(!this.session.AndroidBrowserFlag){
            var p = page.referrerUrl;
            if(p == "null") p = "-";
            inof = {label : 'Referrer url',value : p};
            this.data.pageDetails.push(inof);
            inof = {label : 'DOM Interactive time',value :page.domInteractiveTime + ' seconds'};
            this.data.pageDetails.push(inof);
            inof = {label : 'Perceived Render time',value :page.percievedRenderTime + ' seconds'};
            this.data.pageDetails.push(inof);
            inof = {label : 'First Byte time',value :page.firstByteTime + ' seconds'};
            this.data.pageDetails.push(inof);
          }
         }
         openPageInfo(pageDetails,ev,index){
           //console.log("openPageInfo called with index : ", index);
          let replayPage = this.pages[index];
          this.fillPageDetails(replayPage);
          pageDetails.toggle(ev);
         }

         openNDSession(index)
         {
           var url = "";
           var pi = null;
           let flowpathID = "-1";
           if (index != null) {
             var ele = document.createElement('a');
             pi = Number(this.pages[index].pageinstance);
             pi = pi - 1;
      
             ele.href = this.pages[index].url;
             url = ele.pathname;
      
             flowpathID = this.pages[index].flowpathinstances;
           }
           let st = this.session.startTime;
           let et = this.session.endTime;
           if(this.isActive)
           {
             st += this.nvconfigurations.cavEpochDiff;
             et += this.nvconfigurations.cavEpochDiff;
           }
           this.ddrService.ndSessionDdr((st * 1000).toString(), (et * 1000).toString(), this.session.trnum + '', this.session.sid, flowpathID + '', pi + '', url);
           
         }
         openNDFlowpath(index,flowPathInstance)
         {
            var url = "";
            var pi = null;
            let flowpathID = "-1";
            if (index != null) {
              var ele = document.createElement('a');
              pi = Number(this.pages[index].pageinstance);
              pi = pi - 1;
        
              ele.href = this.pages[index].url;
              url = ele.pathname;
        
              flowpathID = this.pages[index].flowpathinstances;
            }
            let st = this.session.startTime;
            let et = this.session.endTime;
            if(this.isActive)
            {
              st += this.nvconfigurations.cavEpochDiff;
              et += this.nvconfigurations.cavEpochDiff;
            }
            this.ddrService.ndFlowpathDdr((st * 1000).toString(), (et * 1000).toString(), this.session.trnum + '',  flowPathInstance);
        }
        openNF(index){
          let st = this.session.startTime;
          let et = this.session.endTime;
          if(this.isActive)
          {
             st += this.nvconfigurations.cavEpochDiff;
             et += this.nvconfigurations.cavEpochDiff;
          }
          var url = "";
          var pi = null;
          if (index != null) {
              var ele = document.createElement('a');
              pi = Number(this.pages[index].pageinstance);
              //pi = pi - 1;
        
              ele.href = this.pages[index].url;
              url = ele.pathname;
          }
          //this.ddrService.nfSessionDdr(null,"session",this.session.flowpathInstances,this.session.sid,null,(st*1000),(et*1000));
          this.ddrService.nfSessionDdr(pi,"page",this.session.flowpathInstances,this.session.sid,url,st*1000,et*1000);
           
        }
        // get index of page from page instance
        getIndex(pagelist , pi){
          let j =0; 
          for(let i =0; i< pagelist.length; i++ ){
             if(pi == pagelist[i].pageinstance)
               return pagelist[i].index;
          }
          return j;
        }
        toggleAllPanels(){
          //console.log("toggleAllPanels called  ");
          if(this.expandAll == false){
            this.expandAll = true;
            this.pagePanels.map(p=>{
               p.expand(true);
            });
            this.uaPanels.map(p=>{
              ReplayUtil.openAllAccordionTabs(p);
            });
            this.toggleText = "Collapse All";
          }else{
            this.pagePanels.map(p=>{p.collapse(true);});
            this.uaPanels.map(p=>{
              ReplayUtil.closeAllAccordionTabs(p);
            });
            this.expandAll = false;
            this.toggleText = "Expand All";
          }
        }

        collapseAllUAPanels(){
          this.uaPanels.map(p=>{
            //console.log("p : ", p);
            ReplayUtil.closeAllAccordionTabs(p);
          });
        }

        
}
