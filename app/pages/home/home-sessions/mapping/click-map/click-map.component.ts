import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng';
import { VIDEO_DATA } from 'src/app/shared/video-player/service/video-data.dummy';
import { VideoInfo } from 'src/app/shared/video-player/service/video-data.model';
import { MapConfigComponent } from '../dialog/map-config/map-config.component';
import { CLICK_MAP_DATA } from './service/click-map.dummy';
import { SessionStateService } from '../../session-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformation } from '../../common/interfaces/pageinformation';
import { Session } from '../../common/interfaces/session';
import { PageDump } from '../../common/interfaces/pagedump';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplayHandler } from '../../play-sessions/replay-handler';
import { NvhttpService } from '../../common/service/nvhttp.service';
import { DOMBuilder } from '../../common/interfaces/dombuilder';
import { ReplayUtil } from '../../common/util/replay-utils';
import { NVAppConfigService } from '../../common/service/nvappconfig.service';
import { Store } from 'src/app/core/store/store';
import {  NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../../home-sessions/common/service/nvhttp.service';
import * as $ from 'jquery';
import { Clipboard } from '@angular/cdk/clipboard'


export class ClickTreeNode
{
  tag: any;
  rolledup: boolean;
  siblingIndex: any;
  nextSibling: any;
  firstChild: any;
  next: any;
  clickCount: any;
  rollupCount: number;
  baseFlag: boolean;
  real_id: any;
  totalCTNRecords: any;
  parent: any;
  NextPage: any;
  domNode: any;
  value: any;
  centerY: any;
  avgWidth: any;
  avgHeight: any;
  width: any;
  height: any;
  elementsubtype: any;
  elementname: any;
  idType: any;
  id: any;
  real_idType: any;
    
  constructor(uaRecord : UARecord, tag : string, index :any)
  {
    this.tag = tag || uaRecord.tag;
    this.rolledup = false;
    this.siblingIndex = index || 1; 
    this.nextSibling = null;
    // this.tag = uaRecord.tag;
    this.firstChild = null;
    this.next = null;     // same level but having different attribute such as value/height/width etc
    // this.siblingIndex = uaRecord.siblingIndex;
    this.clickCount = uaRecord.clickCount;
    this.rollupCount = 0;
    this.baseFlag = false;         // no rollup above this
    this.real_id = uaRecord.real_id || uaRecord.id;
    this.real_idType = uaRecord.real_idType|| uaRecord.idType;
    this.id = uaRecord.id;
    this.idType = uaRecord.idType;
    this.elementname = uaRecord.elementname;
    this.elementsubtype = uaRecord.elementsubtype;
    //this.value = value;
    //Note: this is average hieght and width of that element.
    this.height = uaRecord.height;
    this.width = uaRecord.width;
    this.avgHeight = uaRecord.height;
    this.avgWidth = uaRecord.width;
    this.centerY = uaRecord.xpos;
    this.centerY = uaRecord.ypos;
    this.value = uaRecord.value;
    this.domNode = null;
    this.NextPage = null;
    //Note: to traverse back.
    this.parent = null;
    this.totalCTNRecords++;

    }
}

export class UARecord 
{
  id: any;
  tag: any;
  idType: any;
  elementname: any;
  elementtype: any;
  elementsubtype: any;
  xpos: number;
  ypos: number;
  height: number;
  width: number;
  clickCount: number;
  iframeid: any;
  xpath: any;
  real_id : any;
  real_idType : any;
  value : any;
  constructor(uaStr){
  var token = uaStr[0].split(",");
  this.id = token[0]; 
  //TODO: input tag can have subType we need to handle all the types.
  this.tag = token[3];
  this.idType = token[1];
  //this.real_id = token[0];;
  //this.real_idtype = token[1];
  this.elementname = token[2];
  this.elementtype = token[3];
  this.elementsubtype = token[4];
  this.xpos = parseInt(token[5]);
  this.ypos = parseInt(token[6]);
  this.height = parseInt(token[8]);
  this.width = parseInt(token[7]);
  this.clickCount = parseInt(token[9]);
  this.iframeid = token[10];
  this.xpath = token[11];
  // if records.idType is not -2 , use records.xpath
  if(this.xpath != null && this.xpath != "null" && this.idType != -2){
  this.id = this.xpath ;
  this.idType = -2;
  }
  /*
  if(tag.match(/\[-*[0-9]+\]/) != null)
  {
  //Format: tag[1]
  this.tag = tag.replace(/\[-*[0-9]+\]/, "").trim();
  this.siblingIndex  = parseInt(tag.split('[')[1]);
  }
  else
  {
  this.tag = tag.trim();
  this.siblingIndex = 1;
  }
  */
}
}

export class FunnelNode
{
  ctn: any;
  children: any[];
  constructor(ctn){
   this.ctn = ctn;
   this.children = [];
  }
}

export class XPathToken
{
  node :any;
  type:any;
  index : any;
      constructor(node, type, index){
      this.node = node;
      //Note: xpath can have id as first token.
      //Type can be ID or Tag
      this.type = type;
      //Eg. DIV[3] -- index - 3
      this.index = index;
      }
}

@Component({
  selector: 'app-click-map',
  templateUrl: './click-map.component.html',
  styleUrls: ['./click-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ClickMapComponent implements OnInit {
  selectedRow = [];
  downloadOptions: MenuItem[];

  items: MenuItem[];

  data: VideoInfo[];
  selectedVideo: boolean = true;

  @ViewChild('mapConfig', { read: MapConfigComponent })
  mapConfig: MapConfigComponent;

  playIcon: string = 'icons8 icons8-material-filled';
  playLabel: string = 'Play';

  volumeIcon: string = 'icons8 icons8-speaker';
  volumeLabel: string = 'Mute';

  isShow: boolean = false;
  color: string = 'red';
  selectedValues: string = 'val1';
  progressMode: string = 'count';
  replaySpeed: string = 'actual';
  selectedIndex: number = 0;

  selectedPage: PageInformation;
  selectedSession : Session;
  srcpath : any;
  flag :any;
  fullscreen = false;
  pagedump: PageDump;
  base :any;
  replayHandler :ReplayHandler;
  nvhttp: NvhttpService;
  snapshotPath: any;
  @ViewChild('replayIframe') replayIframe: ElementRef;
  @ViewChild('replaycanvas') replayCanvas : ElementRef;
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
  nvDomBuilder : DOMBuilder;
  iframe_width : string = "100%";
  previframe_width :string = "";
  iframe_height : string = '100%';//"calc(100% - 30px)";
  iframe_transform : string = "";
  iframe_position : string = "";
  iframe_left : string = "";
  // if any template to be added to pagedump
  applyTemplate : boolean = false;
  // if template needs to be added, then what class need to be added to iframe
  templateCls : string = "";
  canvas_style : any = {'position': 'absolute','z-index': 1, 'display':'none'};
  nvconfigurations: any;
  nvAppConfigService : NVAppConfigService;
  currentpageindex: any;
  pages : PageInformation[];
  selected; 
  y_elem; 
  y_pos;
  x_pos;
  mainarr = [];
  busy=false;
 
  lasttime;
  starttime;
  endttime;
  selectedSegmentforMap;
  userdata: any;
  clickmapConfig: any;
  swidth: number;
  sheight: number;

  documentSize = -1;
  //Constants.
  ID = 0;
  IDTYPE = 1; 
  //... 

  //Record format: 
  //From db record will come as json array.
  //Each record will be of following format:
  //[<id>, <idType>, ..]
  rootNode = null;
  rollUpCnt;
  temp1 =  parent.document.getElementById("heatmapiddiv");
  //Note: with the help of total count we will get % and with help of max count we will get color code.
  totalCount = 0;
  maxCount = 0;
  //This will store funnelNode.
  funnelData = [];
  totalCTNRecords = 0;
  hiddenCTNRecords = 0;
  notFoundCTNRecords = 0;
  viewGranCTNRecords = 0;
  tableGranCTNRecords = 0;
  largerthreshold = 300;
  varCountAll = {
    totalCTNRecords : 0,
    hiddenCTNRecords : 0,
    notFoundCTNRecords : 0,
    viewGranCTNRecords : 0,
    tableGranCTNRecords : 0
  }
  DOM_ID = -1;
  othercount = 0;
  fdata;  
  rollupCount: number;
  tag: any;
  siblingIndex: any;
  nextSibling: any;
  firstChild: any;
  next: any;
  baseFlag: boolean;
  real_id: any;
  real_idType: any;
  id: any;
  idType: any;
  elementname: any;
  height: any;
  width: any;
  avgHeight: any;
  avgWidth: any;
  centerX: any;
  centerY: any;
  clickCount: any;
  ctn: any;
  children: any[];
  node: any;
  type: any;
  index: any;
  load = -1;
  popOverCount = 1;
  ele =  {};
  lastPop = 0
  area = [];
  pageviewcount:any;

  clickmapdata : any;  
  extraHTML: any;
  extraHTML1: any;
  selectectedHTML: any;
  pageSource: string;
  displaySource: boolean;
  Tranparency:any=0;


  constructor(private stateService: SessionStateService,nvAppConfigService : NVAppConfigService, private route : ActivatedRoute,
    private router: Router, private sanitizer: DomSanitizer, replayHandler : ReplayHandler,nvhttp : NvhttpService , private http: HttpClient,private _clipboardService: Clipboard) {
      this.replayHandler = replayHandler;
      this.nvhttp = nvhttp;
      this.nvAppConfigService = nvAppConfigService;
    }

  ngOnInit(): void {
    const me = this;
    me.data = CLICK_MAP_DATA;
    me.clickmapdata = CLICK_MAP_DATA
    me.downloadOptions = [
      {
        label: 'Mapping',
        command: (event: any) => {
          this.mapConfig.open();
        },
      },
      { label: 'Selector Actions' },
      { label: 'Forms' },
    ];

    me.items = [
      { label: 'Google US English' },
      { label: 'Google हिन्दी' }
    ];

    //const myVideo: any = document.getElementById("my_video_1");
    //myVideo.addEventListener("play", me.progressLoop);

    me.data = VIDEO_DATA;

    console.log("Clickmap  component 0 ");
    me.route.queryParams.subscribe(params=>{
      console.log("clickmap  component 1 ");
      let temp1 =  document.getElementById("heatmapiddiv");
      temp1.innerHTML = "";
      me.initC();
    });
    
  }


  initC(){
    const me = this;
    console.log("initC called in clickmap map");
    console.log("end-- " , me.stateService.get("endtime"));
    me.lasttime = me.stateService.get("lasttime");
    me.starttime = me.stateService.get("starttime")
    me.endttime = me.stateService.get("endtime");
    me.selectedSegmentforMap = me.stateService.get("selectedSegmentforMap");
    me.clickmapConfig = me.stateService.get("mapConfig");

    me.selectedSession =  me.stateService.get("session");

    me.pages =  me.stateService.get("pages");
    me.currentpageindex = me.stateService.get("selectedPageIdx");
    me.selectedPage = me.pages[me.currentpageindex];
    console.log("me.currentpageindex : ", me.currentpageindex , " -- pi : " , me.selectedPage.pageInstance);
    me.base = environment.api.netvision.base.base;
    let ua = this.selectedSession.userAgent;
    let deviceType = this.selectedSession.deviceType.name;
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
      this.addTemplate(ua,deviceType); 
      this.setIframeSize();
      this.openPageDump(me.currentpageindex,me.selectedPage.pageInstance, 0, null);
    });
  }

    // set the iframe height , width and transform property 
    setIframeSize(){
      //console.log("setIframeSize called, session.screenResolution : ", JSON.stringify(this.session.screenResolution));
      let scrnResolution = null;
      try{
        scrnResolution = this.selectedSession.screenResolution["name"];
        if(scrnResolution == null || scrnResolution == undefined)
        scrnResolution = this.selectedSession.screenResolution.dim;
      }catch(e){
        scrnResolution = this.selectedSession.screenResolution.dim;
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
      pageWidth = parseFloat(getComputedStyle(document.body, null).width.replace("px", ""));// * 0.7699;
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
      this.iframe_transform = "scale("+tx+","+ty+")";
      // to show in middle
      if(this.selectedSession.protocolVersion != 1)
      {
        this.iframe_left = "35%";
        this.iframe_position = "absolute";
      }
      // bug : 86949
      if(this.applyTemplate)
        this.iframe_height = "";
      console.log("iframe_width " , this.iframe_width, " iframe_height ", this.iframe_height , " tx " , tx , " ty ", ty, " sheight : ", sheight);
  }
  addTemplate(userAgent:string, deviceType : string){
    let hasTemplate = this.nvconfigurations.hasTemplate;
    let itemplateUrl = this.nvconfigurations.templateUrl;
    let d = deviceType.toLowerCase();
    // mobile, iphone , tablet support
    if(!hasTemplate)
    {
      if(userAgent.toLowerCase().indexOf('iphone') > -1){
         this.applyTemplate = true;
         this.iframe_left = "35%";
         this.iframe_position = "absolute";
         this.templateCls = "iphone678";
         //this.canvasCls = "iphone678C";
      }
      else if(d == "mobile" && userAgent.toLowerCase().indexOf('iphone') > -1){
         this.applyTemplate = true;
         this.iframe_left = "35%";
         this.iframe_position = "absolute";
         this.templateCls = "iphone678";
      }
      else if(d == "mobile" || userAgent.toLowerCase().indexOf('mobile') > -1){
         this.applyTemplate = true;
         this.iframe_position = "absolute";
         this.templateCls = "smartphone";
      }
      else if(userAgent.toLowerCase().indexOf('tablet') > -1 || userAgent.toLowerCase().indexOf('ipad') > -1 ){
         this.applyTemplate = true;
         this.iframe_left = "28%";
         this.iframe_position = "absolute";
         this.templateCls = "tablet";
         //this.canvasCls = "tabletC";
      }else if(userAgent.toLowerCase().indexOf('mobile') > -1 ){
         this.applyTemplate = true;
         this.iframe_left = "35%";
         this.iframe_position = "absolute";
         this.templateCls = "smartphone";
         //this.canvasCls = "smartphoneC";
      }
    }
    
    else {
        // hasTemplate is true 
    }
  }
  
  openPageDump(currentpageindex:number,pageinstance:number, snapshotIndex:number, mode :string){
    this.replayHandler.setPageLoadCallback(snapshotIndex);
    //this.pagedumploading = true;
    this.busy = true;
    this.nvhttp.getSnapShotPathThroughAjax
    (
      currentpageindex,this.selectedSession.startTime,this.selectedSession.sid,pageinstance,this.selectedSession.partitionID,snapshotIndex).subscribe(response =>{   
     
              this.snapshotPath = response.split("%%%")[0];
              this.snapshotPath = this.snapshotPath.trim();
            
              // in case first page dump missing, set no pagedump or move to next pagedump
              // but that is only possible when data processing has been done.
              const win: Window = this.replayIframe.nativeElement.contentWindow;
              this.replayWindow = win;
              const iframe_document: Document = <Document> win.document;
              this.replayDocument = iframe_document;
              //console.log("Neeraj Assigning replayDocument 1: ", this.replayDocument);
              
              // missing pagedump
              if(this.snapshotPath == ""){
                console.log("Pagedump missing");
                this.pagedumpLoad = true;
                this.pagedumploading = false;
                return;  
              }
  
              let rr =this;
              
  
              //call to read pagedump file and render to iframe  
              this.nvhttp.readSnapshotFile(this.snapshotPath).subscribe(response => {
               //start with nvDomBuilder 
               //console.log("lets do it"); 
  
               const win: Window = this.replayIframe.nativeElement.contentWindow;
               this.replayWindow = win;
               const iframe_document: Document = <Document> win.document;
               this.replayDocument = iframe_document;
               for (; iframe_document.firstChild; )
               iframe_document.removeChild(iframe_document.firstChild);
  
               this.nvDomBuilder = new DOMBuilder(iframe_document, 'Admin', this.replayHandler, this);
              //window.nvDomBuilder = nvDomBuilder;
              //console.log("processing json data to form pagedump on - " + document);
              let basePath = ReplayUtil.getBasePathURL(this.selectedPage.url);
              //console.log("basePath : ", basePath);
              this.nvDomBuilder.initialize.apply(this.nvDomBuilder, [response, this.selectedPage.url]); 
              //taken care in nvDombuilder
              this.pagedumpLoad = true;   
              this.pagedumploading = false; 
              // keep the busy flag true, until we do not get click map data
              //this.busy = false;
              //this.getClickMapData();
            }); 
       });
  }

  // page dump loaded successfully
  afterPageDump(){
    console.log("afterPageDump called");
    // to disable all the clicks in page dump
    this.disable_left_click();
    this.getClickMapData();
  }
  getClickMapData(){
    this.resetPagedump();
    // close the pop up
    this.busy = true;
    let exitmapflag =false;
    let time = this.calculateTime(this.starttime,this.endttime,this.lasttime);
    let pagename = this.pages[this.currentpageindex].pageName.name;
    let pageid = this.pages[this.currentpageindex].pageName.id;
    let devicename = this.selectedSession.deviceType.name;
    let deviceID = this.getDeviceId(devicename);
    let channelid = this.selectedSession.channel.id;
    let usersegmentid = this.selectedSegmentforMap;
    //let obj = {"key" : "clickMap", "data" : {type:"Click Map"}};
    //this.replayHandler.broadcast('msg',obj); 
    this.showHeatMap(pagename, channelid, time.st, time.et,devicename,pageid,0, 0,1,exitmapflag,[],usersegmentid)
         
    let ctx = this;
    /*setTimeout(()=> {
       let obj1 = {"key" : "FilterDataClick", "data" : {type:"Click Map",startTime:time.st,endTime:time.et,last:this.lasttime,pageid:pageid}};
       ctx.replayHandler.broadcast('msg',obj1);
    }, 2000);*/  
    
               
  }

resetPagedump() {
  const element = document.getElementById(
    "replayIframe"
  ) as HTMLIFrameElement;
  var doc = element.contentWindow.document;

  var o = <HTMLElement>(
    element.contentWindow.document.querySelector("#overLayParent")
  );
  if (o) o.style.display = "none";

  var counterele = doc.getElementsByClassName("nvcounter");
  console.log("class elements", counterele);
  if(counterele.length!=0)
  { 
  for (let i = 0; i <= counterele.length - 1; i++) {
    let c = <HTMLElement>counterele[i];
    c.style.display = "none";
  }
}

  var overlayele = doc.getElementsByClassName("nvol");
  if(overlayele.length!=0)
  { 
  for (let i = 0; i <= overlayele.length - 1; i++) {
    let c = <HTMLElement>overlayele[i];
    c.style.display = "none";
   }
  }

  var popovers = doc.getElementsByClassName("nvpopOver");
  if(popovers.length!=0)
  { 
  for (let i = 0; i <= popovers.length - 1; i++) {
    let c = <HTMLElement>popovers[i];
    c.style.display = "none";
   }
  }

  var popovers = doc.getElementsByClassName("nvoverlaytemp");
  if(popovers.length!=0)
  { 
  for (let i = 0; i <= popovers.length - 1; i++) {
    let c = <HTMLElement>popovers[i];
    c.style.display = "none";
   }
  } 
  document.getElementById("replaycanvas").style.display = "block";
  this.replayCanvas.nativeElement.style.display = "block";
}
// st & et will be null in case last time is selected else duartion will be null
calculateTime(st,et,duration){
  // format of st : Wed Apr 08 2020 14:47:29 GMT+0530 (India Standard Time)
  // format of et : Fri Apr 10 2020 14:47:20 GMT+0530 (India Standard Time)
  // format of duration : 8 Hours
  console.log("calculateTime "," args : ", st , " - - ", et, " - ", duration );
  let time = {"st":0,et:0};
  if(st != null && et != null){
    let time_in_msec = Number(st);
    time.st = time_in_msec - (Number(this.nvconfigurations.cavEpochDiff)*1000);
    time_in_msec = Number(et);
    time.et = time_in_msec - (Number(this.nvconfigurations.cavEpochDiff)*1000);
  }
  else
  {
    let lasttime; 
   
    if(duration == "15 Minutes")
      lasttime = 15 * 60 * 1000;
    else if(duration == "1 Hour")
      lasttime = 1 * 60 * 60 * 1000;
    else if(duration == "4 Hour")
      lasttime = 4 * 60 * 60 * 1000;
    else if(duration == "8 Hour")
      lasttime = 8 * 60 * 60 * 1000;
    else if(duration == "12 Hour")
      lasttime = 12 * 60 * 60 * 1000; // 43200000
    else if(duration == "16 Hour")
      lasttime = 16 * 60 * 60 * 1000;
    else if(duration == "20 Hour")
      lasttime = 20 * 60 * 60 * 1000;
    else if(duration == "1 Day")
      lasttime = 1 * 24 * 60 * 60 * 1000;
    else if(duration == "1 Week") 
      lasttime = 7 * 24 * 60 * 60 * 1000;
    else if(duration == "1 Month") 
      lasttime = 30 * 24 * 60 * 60 * 1000;
    else
      lasttime = 1 * 365 * 24 * 60 * 60 * 1000;
    let temp = new Date(); 
    time.st = (Number(temp.getTime()) - Number(lasttime)) - (Number(this.nvconfigurations.cavEpochDiff) * 1000);
    time.et = (Number(temp.getTime())) - (Number(this.nvconfigurations.cavEpochDiff) * 1000);
  }
  return time;
}
getDeviceId(type)
  {
    type = type.toLowerCase().trim();
    let device ;
    if (type == "pc")
      device = 1;
    else if (type == "mobile")
      device = 2;
    else  if (type == "tablet")
      device = 3;
    else
      device = 0;
    return device;
  }
  addCanvas() 
  {
    console.log("drawCanvas called");
    var x = document.createElement("CANVAS");
    x.id = "myc";
    x.style.zIndex="99999999";
    x.style.opacity="0.7";
    x.style.position="absolute";
    var f = this.replayIframe.nativeElement.contentDocument;
    var g = f.getElementById('myc');
    if(g == null)
      f.body.insertBefore(x,f.body.firstElementChild);
    }

    /**
     * Starting clickmap library
     */
    showHeatMap(currentpage, channelid, starttime, endtime, deviceType, pageid, replaymode, version, protocolversion,exitorclickmapflag,urlPatternList,userSegment)
    {
      let mapConfig = this.clickmapConfig;
      let win = <Window> this.replayIframe.nativeElement.contentWindow;
      let doc = win.document;
       console.log("2 . mapConfig :" , mapConfig);
       try{
             var g = $('#myc');
             var f =  this.replayIframe;
             try{
              doc.body.scrollTo(0,0);
             }catch(e){
   
             }
             this.clearAllElementInformation();
            if(g != null)
               doc.body.removeChild(g[0]);
          }
        catch(e){}
       
        this.getHeatMapdata({
            currentpage: currentpage, 
            channelid: channelid, 
            starttime: starttime, 
            endtime: endtime, 
            deviceType: deviceType ,
            pageid : pageid ,
            protocolversion: protocolversion, 
            version: version, 
            replaymode: replaymode,
            exitorclickmapflag: exitorclickmapflag,
            urlPatternList: urlPatternList,
            userSegment : userSegment}, 
          this.c_callback
         );
       
    }

    clearAllElementInformation()
    {
    try{
      document.getElementById('srcid').style.display = 'none';
      document.getElementById('ename').innerHTML =  " : -";
      document.getElementById('etype').innerHTML =  " : -";
      document.getElementById('xpathorid').innerHTML = ""; 
      }
    catch(e)
      {}
    }
    getHeatMapdata(args, callback)
    {
      let win = <Window> this.replayIframe.nativeElement.contentWindow;
      let doc = win.document;
      //doc.getElementById('load').style.display = "block" ;
      this.busy = true;
      var url = "netvision/reports/heatmapdata.jsp";
      //show heatmap in webpage
      url = url + "?startDateTime=" + args.starttime + "&endDateTime=" + args.endtime + "&currentPage=" + args.currentpage +"&strOperationName=heatmap" +"&devicetype=" +args.deviceType + "&channelid=" +args.channelid + "&exitorclickmapflag="+args.exitorclickmapflag + "&pageid=" + args.pageid +"&userSegment=" + args.userSegment;
      //opening conection to the server
      // var url = "dataforheatmap.txt";
      //this.base = "//10.20.0.53:4431/"
      this.http.get(this.base + url).pipe(map((response: any) => response)).subscribe((res)=>{
        try{
          //let res = this.clickmapdata;
          this.busy = false;
          callback(null, res,this);
        }
        catch(e)
        {
          console.log(e);
        }
        var o =<HTMLElement> doc.querySelector('#overLayParent');
        if(o)
          o.style.display = "block";
        //doc.getElementById('load').style.display = 'none';
      },(err)=>{
          console.log("error while fetching clickmap data " ,err);
      });
    }


    c_callback(error, data,ctx)
    {
            if(error)
            {
              //TODO: give some notification failed to draw heatmap.
              alert("Failed to draw heatmap"); 
              return ;  
            }
            if(data == null || data == "")
            {
              alert("No data for the given timerange");
              return ;
            } 
            if(data.length == 0)
            {
            //TODO: give some notification failed to draw heatmap.
              alert("No data for the given timerange");  
              return ;
            }
            //var rec = JSON.parse(data);
            var rec = data;
            //uaRecords = rec.data;
          let uaRecords = [];
          for(var i = 0;i<rec.data.length;i++)
              {
                var len = rec.data[i];
                var lt = len[0].split(",").length;
                // if iframeid = null , then only push into records
                var g = len[0].split(",")[lt-2];
                if(g == "null")
                  uaRecords.push(rec.data[i]);
              }
            ctx.replayCanvas.nativeElement.style.display = "none";  
            try{
                document.getElementById('replaypointer').style.display = "none";
            } catch(e){} 
            ctx.pageviewcount = rec.counts;
            ctx.processAndShowHM(uaRecords,false);
    }
    processAndShowHM(uaRecords,exitorclickmapflag)
    {
        console.log("processAndShowHM : Navigation map : "+exitorclickmapflag + " uaRecords : " + uaRecords);
        //parent.document.getElementById('elementinfo').style.display = "block";
        this.processHeatMapRecord(uaRecords);
        this.initOverlay();
        try{
          this.removeCounters();
        }catch(e){console.log("Exception while removing : "+ e);}
        //totalCount = getTotalCounts(rootNode);
        //showing totalCounts in heatmap info div
        var temp1 =  document.getElementById("heatmapiddiv");
        temp1.innerHTML = '<div><span style="height:10%; background:lightblue; border-bottom:1px solid #7ebbe4;width :70%;border-radius:2px;float:right;margin-right:13%;margin-top:7%; box-shadow: 5px 5px 2px lightgrey;"><span style="font:12px cursive;color: #A52A2A;"><br><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Total Counts <b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+this.totalCount+'<span><hr style="height:4px;background:brown;width:20%;margin-left:-23%;margin-top:-4%" ><label id="vertical"></label></span></div><br></br><br></br><br></br><br></br>';
        this.fillDomNode(this.rootNode);
        //Note: getTotalCounts will also set a flag if node is considered or not.
        //It will check for 
        this.totalCount = this.getTotalCounts(this.rootNode);//,this.hiddenCTNRecords);
        this.hiddenCTNRecords = this.hiddenCTNRecords;
        this.notFoundCTNRecords = this.notFoundCTNRecords;
        //Need to update rollupcount if hidden or not present elements are not shown.
        /*
        if(mapConfig.considerHiddenElement == false || mapConfig.considerNotPresentElement == false)
        {
          //clear the current count.
          resetRollupCount(rootNode);
          markRollupInTree(rootNode.firstChild,rootNode);
        }
        */
        this.traverseClickTree(this.rootNode);
        //totalCount = getTotalCounts(rootNode);
        this.fillFunnelData(this.rootNode,this.funnelData);
        //window.funnelData = funnelData;
        if(this.clickmapConfig.RollUpMode)
        {
          this.funnelData.sort((a, b)=> {
            return parseInt(b.ctn.rollupCount) - parseInt(a.ctn.rollupCount);
          });
        }
        else{
          this.funnelData.sort((a, b)=>{
            return parseInt(b.ctn.clickCount) - parseInt(a.ctn.clickCount);
          });
        }
        //console.log("funnelData"+JSON.stringify(funnelData));
        this.showHeatMapInformation(this.funnelData,exitorclickmapflag);
        this.showOtherInformation();
        this.HideElement();
        this.HideElementInform();
        //hidelastVerLine(funnelData);
        //setPosition();
        this.showHideDisplayDiv();
        this.showCounters();
        this.addListener();

    }
  
  

    getXPath(element)
    {
      var paths = [];

      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;

          if (sibling.nodeName == element.nodeName)++index;
        }

        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
      }

      return paths.length ? "/" + paths.join("/") : null;
    }

    //This method will find the element and will return it's xpath.
    //If element will not found then it will return null.
    //Note: uarecord will only be pass if idType == -1
    convertIdToXPath(id, uaRecord)
    {
      var domElement = this.replayIframe.nativeElement.contentWindow.document.getElementById(id);
      if(domElement == null && uaRecord && uaRecord.idType == -1)
      { 
        //Note: check if id is random. Ex. productidXXX. here XXX is [0-9]{3}
        //Find such pattern and remove them and search again. 
        //Just check for regex pattern.
        id = id.replace(/[0-9]+/g, '');
        //now search all the elemtns matcing to this.
        var selector  = uaRecord.tag; 
        //append id.
        if(uaRecord.elementname && uaRecord.elementname != '' && uaRecord.elementname != null)
          selector += "[name=\""+ uaRecord.elementname+"\"]";

        //now append id.
        selector += "[id*=\""+ id +"\"]";
        try{     
          var elements = document.querySelectorAll(selector);
          //now find the perfect matching from this new list.
          for(var z = 0;z < elements.length; z++)
          {
            if(this.isItMe2(elements[z], uaRecord,null)) 
            {
              domElement = elements[z];
              break; 
            }
          }
        }
        catch(e){
        }
      }
      if(domElement)
        return this.getXPath(domElement);
      return null;
    }
   

    isElementLarge(element)
   {
      //get element size.
      var el = element.getBoundingClientRect();

      var size = Number(Math.sqrt(Math.pow(el.height, 2) + Math.pow(el.width, 2)));

      //get document hight.
      if(this.documentSize == -1)
      {
        var pageWidth = document['width'] || (null === document.documentElement ? 0 : document.documentElement.offsetWidth);
        var pageHeight = Math.max("undefined" == typeof document['height'] ? 0 : document['height'], "undefined" == typeof document.documentElement ? 0 : document.documentElement.offsetHeight, "undefined" == typeof document.documentElement ? 0 : document.documentElement.scrollHeight);
        //page size.
        this.documentSize = Number(Math.sqrt(Math.pow(pageHeight, 2) + Math.pow(pageWidth, 2)));
      }

      //It element size if more that 75 than it is large.
      if(size*100/this.documentSize > 75)
        return true;

      return false;
    }


    expandXPath(records)
   {
      var xpath;
      if(records.idType == this.DOM_ID)
      {
          xpath = this.convertIdToXPath(records.id, records); 
          if(xpath)
          {

            records.real_id = records.id; 
            records.real_idType = records.idType;
            records.id = xpath;
            records.idType = -2;
          }
      }
      else
      {
        //tokenize the xpath.
        var xpath_token1 = this.tokeNizeXPath(records.id); 
        //check if first token type is id.
        if(xpath_token1[0].type == "ID")
        {
          //expand this id.
          xpath = this.convertIdToXPath(xpath_token1[0].node,records);
          if(xpath)
          {
            var xpath_token2 = this.tokeNizeXPath(xpath);
            //now create the combine xpath.
            var xpath_complete = "";
            for(var i = 0; i < xpath_token2.length; i++)
            {
              xpath_complete += "/" +  xpath_token2[i].node;
              if(xpath_token2[i].index != 1)
                xpath_complete += "[" + xpath_token2[i].index + "]";
            }
            for(var j = 1; j < xpath_token1.length; j++)
            {
              xpath_complete += "/" +  xpath_token1[j].node;
              if(xpath_token1[j].index != 1)
                xpath_complete += "[" + xpath_token1[j].index + "]";
            }
            records.real_id = records.id;
            records.real_idtype = records.idType;
            records.id = xpath_complete;
            records.idType = -2;
          }
        }
      }
    }

    trimCSSPath(id)
   {
      if(id.indexOf(">") == -1)
      return id;
      var  r=  id.split(">");
      var  j =[];
      r.forEach((i)=>{ j.push(i.trim())})
      var e =  j.join('>'); 
      return escape(e);
    }

    

    updateCTN(node, uaRecord)
    {
        //Note: node can be initialized before as dummy. So it is time to fill other informations.
        node.clickCount += parseInt(uaRecord.clickCount);
        if(node.idType == 0)
        {
        node.idType = uaRecord.idType;
        node.id = uaRecord.id;
        node.real_id = uaRecord.id;
        node.real_idType = uaRecord.idType;
        }
        //node.value = value;
        if(node.height == -1)
        node.height = uaRecord.height;
        if(node.width == -1)
        node.width = uaRecord.width;
        if(node.centerX == -1) 
        node.centerX = uaRecord.xpos;
        if(node.centerY == -1)
        node.centerY = uaRecord.ypos;
    }

    /*ClickTreeNodeWithTag(uaRecord,tag,index)
    {
      this.tag = tag || uaRecord.tag;
      this.siblingIndex = index;
      this.nextSibling = null;
      // this.tag = uaRecord.tag;
      this.firstChild = null;
      this.next = null;     // same level but having different attribute such as value/height/width etc
      // this.siblingIndex = uaRecord.siblingIndex;
      this.rollupCount = 0;
      this.baseFlag = false;         // no rollup above this
      this.real_id = uaRecord.real_id || uaRecord.id;
      this.real_idType = uaRecord.real_idType|| uaRecord.idType;
      //this.tag = uaRecord.tag;
      this.id = uaRecord.id;
      this.idType = uaRecord.idType;
      this.elementname = uaRecord.elementname;
      //this.value = value;
      this.height = uaRecord.height;
      this.width = uaRecord.width;
      this.avgHeight = uaRecord.height;
      this.avgWidth = uaRecord.width;
      this.centerX = uaRecord.xpos;
      this.centerY = uaRecord.ypos;
      this.clickCount = uaRecord.clickCount;
      return this;
    }*/




    processHeatMapRecord(uaRecords)
    {
        //rootNode = new ClickTreeNode();
        //Note: the same records can be process multiple time. So first clear the prev one
        //reset all global variables.
        this.rootNode = null;
        this.totalCount = 0;
        this.funnelData = [];
        this.rollUpCnt = 0;
        this.rollupCount = 0;
        this.maxCount = 0;
        this.documentSize = -1;
        this.temp1 =  document.getElementById("heatmapiddiv");
        this.temp1.innerHTML = "";
        this.totalCTNRecords = 0;
        this.hiddenCTNRecords = 0;
        this.notFoundCTNRecords = 0;
        this.viewGranCTNRecords = 0;
        this.tableGranCTNRecords = 0;
        this.rootNode = new ClickTreeNode(new UARecord([",0,,,-1,-1,-1,-1,-1,0,"]),"root",1);
        var node;
        var uaRecord ;
        for(var z = 0; z < uaRecords.length; z++)
        {
        //rootNode = new ClickTreeNode(new UARecord(uaRecords[z]));
        //Note: uaRecords having , seperataed db record.
        //Conver that into object uaRecord Object.

        uaRecord = new UARecord(uaRecords[z]); 
        this.expandXPath(uaRecord);
        node = this.findMatchCTN(uaRecord); 
        if(node == null)
        {
            node = this.addCTN(uaRecord);
        }
        else {
          this.updateCTN(node, uaRecord);
        }
        }

        //TODO: because currently we are not having similar nodes.
        //optimizeClickTree(root); 
        this.setHeightWidth(this.rootNode,this.rootNode.height,this.rootNode.width);
        this.markRollupInTree(this.rootNode.firstChild, this.rootNode);
    }


   highlightDOMNode(domNode, color, tag ,id ,cnt, flag, cntr)
   {
      var popData = { "ElementName": cnt.elementname ,"ElementType" : tag , "Id" : id ,"Clicks" : cntr.clickCount ,"Idtype": cntr.idType};
      try
      {

      var ddrLink = "";//"nvPageStoreData.jsp?eventtype=2&eventid="+cntr.id+"&eventidtype="+cntr.idType+"&devicetype="+devicetype+"&channelid="+channelid+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+"&pageId="+pageid+"&protocolversion="+protocolversion+"&version="+version+"&replaymode="+replaymode + "&userSegment="+userSegment+"&exitorclickmapflag="+exitorclickmapflag; 
          //if(cntr.id == '/html' || cntr.id == '/html/head' || cntr.id == '/html/body' )
            //return;
          if(cntr.ignore != true)
          this.setOverlay(domNode,color,cnt + "%" ,popData,flag,ddrLink,cntr,this.clickmapConfig.RollUpMode);
      }
      catch(e){  alert(e); }   
    }
  



   traverseClickTree(ctn)
   {

      if (ctn.firstChild) 
      { 
        this.traverseClickTree (ctn.firstChild);
      }
      //Check if it has any valid count then get the element.
      if(ctn.clickCount > 0)
      {
        var idCtn = ctn.id.split(" ").join("%s");
        var realid = ctn.real_id.split(" ").join("%s");
        //eval(' idCtn = "' + ctn.id + '".split(" ").join("%s").split("'").join("\'"));
          
        var domNode = this.findDOMNodeInPage(ctn);
        ctn.domNode = domNode;
        if (domNode)
        {
            if(!this.isElementLarge(domNode))
            {
                  // this DOM Node needs to be highlighted
                  /*
                  if(exitorclickmapflag)
                  var clickPct = ((ctn.rollupCount*100)/pageviewcount);
                  else
                  */
                  if(this.clickmapConfig.RollUpMode == true)
                    var clickPct = ((ctn.rollupCount*100)/this.totalCount);
                  else
                    var clickPct = ((ctn.clickCount*100)/this.totalCount);
                  var colorPct = ((ctn.rollupCount*100)/this.maxCount); 
                  var color = this.getColor(colorPct);
                  var bgcolor = "rgba("+color+")";
                  if((clickPct > this.clickmapConfig.minimumPctforView))
                    this.highlightDOMNode(domNode, bgcolor , ctn.tag, ctn.id, clickPct.toPrecision(3) , (ctn.baseFlag) ? "primary" : "secondary" , ctn);
                  else
                    this.viewGranCTNRecords++; 
              }
            else {
                //console.log("Element - " +  ctn.id + " is quite large, so heatmap disabled for this element");
            }
        }
        else
        {
            //console.log("hidden information "+ctn.id );
        }
          
      }

      if (ctn.nextSibling){
        this.traverseClickTree(ctn.nextSibling);
      }
   }

   fillDomNode(ctn)
   {
      let urlPatternList =[];
      if (ctn.firstChild) 
      { 
        this.fillDomNode (ctn.firstChild); 
      }
      //Check if it has any valid count then get the element.
      if(ctn.clickCount > 0)  
      {
        var domNode = this.findDOMNodeInPage(ctn);
        //check for this domNode. If there is one sibling which having the same element then remove this ctn and update count in that one.
        if(domNode && !this.isElementLarge(domNode))
        {
        //if(!isElementLarge(domNode))
        {
          ctn.domNode = domNode;
          this.findMatchingSibling(ctn);
          if(ctn.tag.toLowerCase() == "a" || ctn.tag.toLowerCase() == "button" )
          {
            for(var i = 0;i<urlPatternList.length;i++)
            {
              var ahref= document.createElement('a');
              ahref.href = ctn.domNode.getAttribute("nvhref");
              var r = new RegExp(urlPatternList[i].pattern);
              if(r.test(ahref.pathname))
              {
                ctn.NextPage = urlPatternList[i].name;
              }
            }    
          } 
        else
        {
          if(ctn.tag == "a" || ctn.tag == "button")
          {
            for(var i = 0;i<urlPatternList.length;i++)
            {
              var ahref= document.createElement('a');
              ahref.href = ctn.domNode.href;
              if(urlPatternList[i].pattern.test(ahref.pathname))
              {
                ctn.NextPage = ahref.pathname;
              }
            }
          }
        }
        }
        }
      }
      //Check if domNode is not found.
      //Note: need to check this again as in findMatchingSibling it can be reset. 

      if(ctn.clickCount > 0)
      {
        //If  domNode is not found and considerNotPresentElement == false.
        //FIXME: 
        //Note: we can not remove element having basFlag true.
        if(ctn.baseFlag == false && ((ctn.domNode == null && this.clickmapConfig.considerNotPresentElement == false) || ctn.domNode != null && ctn.domNode.offsetParent == null && this.clickmapConfig.considerHiddenElement == false))
        {
          //Note: we can not remvoe node having baseflag true.
          if(ctn.baseFlag == false)
          { 
            //remove rollOver count and reset the ctn. 
            if(ctn.rolledup == true)
            {
              var parent = ctn.parent;
              while(parent)
              {
                if(parent.baseFlag == true)
                {
                  parent.rollupCount -= ctn.clickCount;
                  ctn.rolledup = false;
                  break;
                }
                parent = parent.parent;
              }
            }
            this.resetCTN(ctn);
          }
        }
      }
      else
      {
        ctn.domNode = this.findParent(ctn);
        //TODO: Need to handle condition where domNode not found.
        if(ctn.domNode == null)
           this.resetCTN(ctn);
      }


      if (ctn.nextSibling){
        this.fillDomNode(ctn.nextSibling);
      }
   }



   

   fillFunnelData(ctn, list)
   {
      var fNode = null;
      //Note: if baseflag is true then add on primary list else in given list.
      //This will be created for clickCount > 0.
      if(ctn.clickCount > 0)
      {
        fNode = new FunnelNode(ctn);
        if(ctn.baseFlag || this.clickmapConfig.RollUpMode == false)
        this.funnelData.push(fNode); 
        else 
        list.push(fNode);
      }

      //process for children.
      if(ctn.firstChild)
      {
      //Note: if base flag is true then we will add it's children in new array. 
      if(fNode && ctn.baseFlag)
         this.fillFunnelData(ctn.firstChild, fNode.children); 
      else 
         this.fillFunnelData(ctn.firstChild, list);
      }

      //Process for next Sibling.
      if(ctn.nextSibling){
        this.fillFunnelData(ctn.nextSibling, list); 
      }
   }

   //Note: this method will find the nearest text node. will be treated as level.
   getLabel(e)
   {
      let mee = this;
      var node = e;
      //Check for nodeType if INPUT then check for it's label tag. 
      if(node.nodeName == "INPUT" && node.id)
      {
      var l = document.querySelector('[for="' + node.id +'"]');
        if(l && l.textContent.trim() != "")
      return this.shortTextContent(l.textContent, 50,undefined);
      }

      //Method to get value. 
      function v(node)
      {
        //Check for text Content and then for input element having value.
          if(node.innerText != undefined && node.innerText.trim() != "")
            return mee.shortTextContent(node.innerText, 50,undefined);
          //Check for input then it;s value. 
        if(node.nodeName == "INPUT" && node.value && node.value.trim() != "")
        return mee.shortTextContent(node.value, 50,undefined);
        return null;
      }//Check for nodeType if INPUT then check for it's label tag. 


      var value = v(node);
      if(value && value.trim() != "") return value;

      //Check for Child Element. 
      function cv(node)
      {
        var children = node.children;
        //Check for this node. 
        for (var z = 0; z < children.length; z++)
        {
          if(children[z].tagName == "INPUT" && children[z].value && children[z].value.trim() != "")
            return mee.shortTextContent(children[z].value, 50,undefined);
          //Check for this itself.
          var value = cv(children[z]);
          if(value && value.trim() != "")
            return mee.shortTextContent(value, 50,undefined);
       }
      }

      //Check for child value. 
      var value = cv(node);
      if(value && value.trim() != "") return this.shortTextContent(value, 50,undefined);

      function ptext(node, self)
      {
        var value = null;
        if(self)
        {
         value = v(node);
         if(value && value.trim() != "") return value;
        }

        //Check for prev sibling. 
        var next =  node.previousElementSibling;
        while(next) {
          value = v(next);
          if(value && value.trim() != "") return value;
          next = next.previousElementSibling;
        }

      //Check for nextSibling. 
      next = node.nextElementSibling;
      while(next) {
        value = v(next);
        if(value && value.trim() != "") return value;
        next = next.nextElementSibling;
      }

      if(node.parentElement)
      {
        return ptext(node.parentElement, true);
      }
      }

      value = ptext(node, false);
      if(value && value.trim() != "") return value;

      return node.tagName;                                        
   }

   //TODO: currently we are checking in sibling only. But there can be a condition when node can be matched on different level.
   findMatchingSibling(ctn)
   {
      //take the first child of parent and traverse.
      var sibling = ctn.parent.firstChild;
      var mparent;
      for(;sibling;)
      {
      //Check if it is the same ctn then continue.
      if(sibling.id != ctn.id && sibling.domNode == ctn.domNode)
      {
        //update count.
        sibling.clickCount += ctn.clickCount;

        //Check if this node was not rolledup then rollup now.
        if(ctn.rolledup == false)
        {
         //update rollup count.
         //traverse it's parent till baseFlag is true.   
          mparent = sibling; 
          for(;mparent;)
          {
            if(mparent.baseFlag)
            {
              ctn.rolledup = true;
              mparent.rollupCount += ctn.clickCount;
              break;
            }
            mparent = mparent.parent;
          } 
        }

        this.resetCTN(ctn);
        break;  
      }
      //update sibling.
      sibling = sibling.nextSibling;
      } 
    }

    resetCTN(ctn)
    {
      //Note: currently we are not removeing the node. we will just reset the count. 
      ctn.clickCount = 0;
      ctn.domElement = null;
      ctn.baseFlag = false;
      ctn.rollupCount = 0;
    }


    setHeightWidth(parentNode, height, width)
    {
      //set height and width to all children.
      //Note: we will also set the clickParentCount.
      var child = parentNode.firstChild;

      //console.log("parentHeight"+child.id +"height"+ height +"width"+ width);
      for(;child;)
      {
      if(child.height == -1 ) 
      {
      child.height = height;
      child.width = width;
      }
      this.setHeightWidth(child, child.height, child.width);
      child = child.nextSibling;
      }
    }

    /* These counters as just for debug purpse*/
    compareElementBySize(child, parent)
    {
      //Note: currently we are assuming if parent size is more than 100 px then parent is large.  
      var childSize = Number(Math.sqrt(Math.pow($(child).innerHeight(), 2) + Math.pow($(child).innerHeight(), 2)));
      var parentSize = Number(Math.sqrt(Math.pow($(parent).innerHeight(), 2) + Math.pow($(parent).innerWidth(), 2)));
      //Note: if childSize is 0 then we will include that in parent.
      if(parentSize - childSize > 0)
      return true;
      else
      return false;

    }

    findParent(ctn)
    {
      //search pattern in all child and find the largest one..
      var largerParent = null;
      var sibling = ctn.firstChild;
      var parent;
      while(sibling)
      {
      if(sibling.domNode != null)
      parent = sibling.domNode.parentElement;
      else 
      parent = this.findParent(ctn.firstChild);

      if(parent)
      {
      if(largerParent)
      {
        if(this.compareElementBySize(parent, largerParent))
          largerParent = parent;
      }
      else 
        largerParent = parent;
      }

      sibling = sibling.nextSibling;
      }
      return largerParent;
    }


    

    allVariableCount()
    {
      this.varCountAll.totalCTNRecords = this.totalCTNRecords;
      this.varCountAll.hiddenCTNRecords = this.hiddenCTNRecords;
      this.varCountAll.notFoundCTNRecords = this.notFoundCTNRecords;
      this.varCountAll.viewGranCTNRecords = this.viewGranCTNRecords;
      this.varCountAll.tableGranCTNRecords = this.tableGranCTNRecords;   
      return this.varCountAll; 
    }

    getTotalCounts(ctn)
    {
      //update counters. 
      if(!ctn.domNode)
      this.notFoundCTNRecords++;
      if(ctn.domNode && ctn.domNode.offsetParent)
      this.hiddenCTNRecords++;

      if(!ctn.domNode)
      {
      if(this.clickmapConfig.considerNotPresentElement)
      {
        this.totalCount += parseInt(ctn.clickCount);
      }
      else 
      ctn.ignore = true;
      }
      else {
      if(ctn.domNode.offsetParent || this.clickmapConfig.considerHiddenElement == true)
      {
        this.totalCount += parseInt(ctn.clickCount);
      }
      else
      ctn.ignore = true;
      }

      if(this.maxCount <= ctn.rollupCount)
      this.maxCount = ctn.rollupCount;
      if (ctn.firstChild)
      {
        this.getTotalCounts(ctn.firstChild);
      }

      if (ctn.nextSibling){
        this.getTotalCounts(ctn.nextSibling);
      }

      return this.totalCount;
    }


    getColorOld(clickPct)
    {
      //color will vary from red - yellow.
      //when count will be less then we will increase the % of green.
      //alpha will vary from 1 to 0.5. 
      var value = [255, 0, 0, 0];/*rgba*/;
      value[1] = Number(255*((100 - clickPct)/100.0));
      value[3] = 0.5 + (0.5 * (clickPct/100.0));
      value[3] = Number(value[3].toPrecision(1));
      return value;
    }

    getColor(clickPct)
    {
      //color will vary from red - yellow.
      //when count will be less then we will increase the % of green.
      //alpha will vary from 1 to 0.5. 
      var value = [0, 255, 0, 1];/*rgba*/;
      value[1] = Number(255*clickPct/100);
      return value;
    }

    //Note: info is urlRecord
    isItMe2(element, info, strictMode)
    {
      strictMode = strictMode || true;
      var sizeThreshold = 20;

      //First check tagName, name, hight and width and then clix, cliy
      if(element.tagName.toUpperCase() == info.tag.toUpperCase()) 
      {
      if(!strictMode || (info.elementname && element.name && (info.elementname == element.name)) )
      {
      //compare height and width  
      var elementDim = element.getBoundingClientRect();
      var elementSize = Number(Math.sqrt(Math.pow(elementDim.height, 2) + Math.pow(elementDim.width, 2)));
      var infoSize = Number(Math.sqrt(Math.pow(info.height, 2) + Math.pow(info.width, 2))); 
      //if this difference in not more than 20% of the element hight then ok.
      if(Math.abs(infoSize - elementSize) <= (Math.min(infoSize, elementSize) *(sizeThreshold/100)) )
      {
        if(!strictMode)
          return true;

        //TODO: enable me when u are confident. 
        if(info.centerX != -1 && info.centerY != -1) 
        {
          //find click location.
          var clicksize = Number(Math.sqrt(Math.pow(info.centerX, 2) + Math.pow(info.centerY, 2))); 
          //find element topleft and bottomright.
          var etl = Number(Math.sqrt(Math.pow(elementDim.top, 2) + Math.pow(elementDim.left, 2))); 
          var ebr = Number(Math.sqrt(Math.pow(elementDim.top + elementDim.hight, 2) + Math.pow(elementDim.left + elementDim.width, 2))); 
          
          //get 20% of element size.
          etl -= (20/100)*elementSize; 
          ebr += (20/100)*elementSize; 
          if(clicksize > etl && clicksize < ebr)
            return true;
        }
      }
      }
      }
      return false;
    }

    //Note: info is ctn
    isItMe(element, info, strictMode)
    {
      strictMode = strictMode || true;
      var sizeThreshold = 20;

      //First check tagName, name, hight and width and then clix, cliy
      if(element.tagName.toUpperCase() == info.tag.toUpperCase()) 
      {
      if(!strictMode || (info.elementname && element.name && (info.elementname == element.name)) )
      {
      //compare height and width  
      var elementDim = element.getBoundingClientRect();
      var elementSize = Number(Math.sqrt(Math.pow(elementDim.height, 2) + Math.pow(elementDim.width, 2)));
      var infoSize = Number(Math.sqrt(Math.pow(info.height, 2) + Math.pow(info.width, 2))); 
      //if this difference in not more than 20% of the element hight then ok.
      if(Math.abs(infoSize - elementSize) <= (Math.min(infoSize, elementSize) *(sizeThreshold/100)) )
      {
        if(!strictMode)
          return true;

        //TODO: enable me when u are confident. 
        if(info.centerX != -1 && info.centerY != -1) 
        {
          //find click location.
          var clicksize = Number(Math.sqrt(Math.pow(info.centerX, 2) + Math.pow(info.centerY, 2))); 
          //find element topleft and bottomright.
          var etl = Number(Math.sqrt(Math.pow(elementDim.top, 2) + Math.pow(elementDim.left, 2))); 
          var ebr = Number(Math.sqrt(Math.pow(elementDim.top + elementDim.hight, 2) + Math.pow(elementDim.left + elementDim.width, 2))); 
          
          //get 20% of element size.
          etl -= (20/100)*elementSize; 
          ebr += (20/100)*elementSize; 
          if(clicksize > etl && clicksize < ebr)
            return true;
        }
      }
      }
      }
      return false;
    }

    findDOMNodeInPage(ctn)
    {
      if(ctn.id != null)
      {
      if(ctn.idType == this.DOM_ID){ 
      var domElement = this.replayIframe.nativeElement.contentWindow.document.getElementById(ctn.id);
      if(domElement == null)
      { 
      //Note: check if id is random. Ex. productidXXX. here XXX is [0-9]{3}
      //Find such pattern and remove them and search again. 
      //Just check for regex pattern.
      var id = ctn.id.replace(/[0-9]+/g, '');
      //now search all the elemtns matcing to this.
      var selector  = ctn.tag; 
      //append id.
      if(ctn.elementname && ctn.elementname != '' && ctn.elementname != null)
      selector += "[name=\""+ ctn.elementname+"\"]";

      //now append id.
      selector += "[id*=\""+ id +"\"]";

      var elements = document.querySelectorAll(selector);
      //now find the perfect matching from this new list.
      for(var z = 0;z < elements.length; z++)
      {
      if(this.isItMe(elements[z], ctn,null)) return elements[z];     
      }
      return null;
      }
      else
      return domElement;  
      }
      else
      {
      //get first matching element from given xpath.
      domElement = null;
      try 
      {
      domElement = this.replayIframe.nativeElement.contentWindow.document.evaluate(ctn.id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; 
      }
      catch(e) {
      //TODO:
      var id = ctn.id;
      var maxlmt =0;
      if(ctn.idType !== "-3"){
      while(id.indexOf(":") > -1 && maxlmt < 11){
        maxlmt++;
        id = id.replace(/\/[0-9A-Za-z]*:[^\/]*$/g, "/*").replace(/\/[0-9A-Za-z]*:[^\/]*\//g, "/*/");
      }
      }
      try{
      domElement = this.replayIframe.nativeElement.contentWindow.document.evaluate(id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }catch(e){console.log(e);}
      }

      //check for anyother element on the same sibling.
      if(!domElement) 
      {
      //remove last leaf from xpath.
      //html/body/div/a
      id = ctn.id.replace(/\[[0-9]+\]$/, "");
      var ele, sibling;
      if(id != ctn.id)
      {
      try {
      ele = this.replayIframe.nativeElement.contentWindow.document.evaluate(id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      catch(e) {
                console.log(e);
                while(id.indexOf(":") > -1){id = id.replace(/\/[0-9A-Za-z]*:[^\/]*$/g, "/*").replace(/\/[0-9A-Za-z]*:[^\/]*\//g, "/*/");}
              ele = this.replayIframe.nativeElement.contentWindow.document.evaluate(id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              }
      if(ele)
      {
        sibling = ele;
        for(;sibling;)
        {
            if(this.isItMe(sibling, ctn, false))
            {
              domElement = sibling;
              break;
            }
            sibling = sibling.nextElement;
        }
      }
      }
      }
      //Note: if id is random
      //TODO:
      if(!domElement)
      {
      //check if element starting with id then just replace pattern.

      }
      return domElement;
      }
      }
    }


    optimizeClickTree(ctn)
    {
      if (ctn.firstChild) 
      {
        this.optimizeClickTree (ctn.firstChild);
      }
      this.mergeNodes(ctn); //merge similar nodes 

      if(ctn.nextSibling)
      {
        this.optimizeClickTree (ctn.nextSibling);
      }
    }
    //ANJALI ::
    mergeNodes(ctn)
    {
      let baseNode = ctn;
      let anyNodeMerge = false;
      while (baseNode.next != null){
      ctn = baseNode;
      do
      {
      anyNodeMerge = false;
      while (ctn.next !=null) {
      let ntn = ctn.next;
      if (ntn.height == baseNode.height + 10)
      {
        console.log("-- ntn.height == baseNode.height + 10 --");
          /*if ( valueSameOrIgnore(baseNode.value, ntn,value)) 
          {
            mergeNtnIntoBaseNode(baseNode, ntn);
            anyNodeMerge = true;
            removeNtnFromChain();			
            
          } else  
          {
            ctn = ntn;
          }*/
      } else {
      ctn = ntn;
      }
      }
      } while (anyNodeMerge = true)
      baseNode = baseNode.next;
      }

    }



      //var largeAreaThreshold = 500;

    parentAreaLarge(child, parent)
    {
      //Check if child not is unlinked then just return true.
      if(parent.height == -1 || parent.width == -1) 
      return true;

      //find it's 
      //Note: currently we are assuming if parent size is more than 100 px then parent is large.  
      var childSize = Number(Math.sqrt(Math.pow(child.height, 2) + Math.pow(child.width, 2)));        
      var parentSize = Number(Math.sqrt(Math.pow(parent.height, 2) + Math.pow(parent.width, 2))); 
      /*var childArea = parseInt(child.height) * parseInt(child.width);
      var parentArea = parseInt(parent.height) * parseInt(parent.width);
      if(parentArea == childArea)
      {
      if(parent.parent != undefined)
      parentAreaLarge(child, parent.parent);
      return false;
      }
      if(parentArea - childArea > largeAreaThreshold)
      return true;*/
      //Note: if childSize is 0 then we will include that in parent.
      if(childSize == 0 || (parentSize - childSize > this.clickmapConfig.largeAreaThreshold))
      {
      return true;
      }
      else 
      return false;
    }

    resetRollupCount(ctn)
    {
      ctn.rollupCount = 0; 
      if (ctn.firstChild)
      {
        this.resetRollupCount(ctn.firstChild);
      }

      if (ctn.nextSibling){
        this.resetRollupCount(ctn.nextSibling);
      }
    }

    markRollupInTree(ctn, parent)
    {
      var rollupCount = 0;
      if(ctn != null && ctn.firstChild)
      {
      rollupCount = this.markRollupInTree(ctn.firstChild, ctn);
      }


      if(ctn.ignore == true || this.parentAreaLarge(ctn, parent))
      {
      //if parent area is large then don't roll up. 
      ctn.baseFlag = true;
      ctn.rollupCount = parseInt(ctn.clickCount) + Number(rollupCount);
      //reset 0 as this node will not we included in rollup elements of this parent.
      rollupCount = 0;  
      }
      else {
      ctn.baseFlag = false;
      ctn.rolledup = true;
      ctn.rollupCount = parseInt(ctn.clickCount) + Number(rollupCount);
      rollupCount = parseInt(ctn.rollupCount);
      }


      //Check for siblings.
      if(ctn.nextSibling)
      {
      rollupCount += this.markRollupInTree(ctn.nextSibling, parent);
      }
      return rollupCount;
    }


      //Note: format of xpath can be 
      //Complete XPath - /HTML /BODY /DIV[3]
      //Short XPAth - //*[@id='xgnContent'] /DIV[2] /DIV /DIV[2] /DIV[2] 
    tokeNizeXPath(Xpath)
    {
      //Note: remove first //
      if(Xpath.indexOf('//*') == 0)
      Xpath = Xpath.replace(/^\/\/\*/, '*');
      else //remove first / 
      Xpath = Xpath.replace(/^\//, "");

      //Note: array of XPAthToken.
      var tokens= [];
      var token;
      var strToken = Xpath.split('/'); 
      var type, id, index;
      for(var z = 0; z < strToken.length; z++)
      {
      if(strToken[z][0] == '*')
      {
      id = strToken[z].replace(/^.*id='(.*)'.*$/, "$1").trim();  
      tokens.push(new XPathToken(id, 'ID', 1));
      }
      else {
      id = strToken[z].trim();
      //Check if containing index.
      if(strToken[z].match(/\[[0-9]+\]/) != null)
      {
        //Format: tag[1]
        id = strToken[z].replace(/\[[0-9]+\]/, "").trim();
        index = parseInt(strToken[z].split('[')[1]);
      }
      else  
        index = 1;  //default value.
      
      tokens.push(new XPathToken(id, 'XPATH', index));
      }
      }
      return tokens;
    }

    

    addCTN(uaRecords)
    {
      var id ;
      var idType;
      var node;
      var child;
      if(uaRecords.idType == this.DOM_ID)
      {
      //TODO: traverse the root node children to check if already present.
      //add this as child of rootNode. 
      node = new ClickTreeNode(uaRecords,null,null);
      {
      //find the last childNode.
        //check if firstChild is not set then add new node.
        if(this.rootNode.firstChild == null)
        {
          this.rootNode.firstChild = node;
          node.parent = this.rootNode;
        }
        else {
          child = this.rootNode.firstChild; 
          for(;child.nextSibling;)
            child = child.nextSibling;
          child.nextSibling = node; 
          node.parent = this.rootNode;
        }
      }
      }

      else 
      {
      //XPath.
      var tokens = this.tokeNizeXPath(uaRecords.id);
      var token;
      var level = 0;
      var match = false;
      var parent;
      var sibling = null;
      //each token will be search on each level.  
      sibling = this.rootNode.firstChild;
      parent = this.rootNode;
      let prevSibling = null;

      token = tokens[level];
      for(;token;)
      {
      match = false;
      for (;sibling && !match;)
      {
        //match tag.
        if(sibling.tag == token.node && sibling.siblingIndex == token.index)
        {
          match = true;

          } else {
          prevSibling = sibling;
          sibling = sibling.nextSibling;
          }
      } 

      if(!match)
      {
        //Note: check if this is final level then add with actual data else with dummy data.
        var final = false; 
        if(level == tokens.length - 1)
          final = true;

        //add node with specified tag(token.tag).
        if(final)
          node = new ClickTreeNode(uaRecords,token.node,token.index);
        else
        {
          
          //Note: as this is intermediate node so we have taken count as 0.
          node = new ClickTreeNode(new UARecord([",0,,,-1,-1,-1,-1,-1,0,"]), token.node, token.index);

        }
        node.parent = parent;
        //Note: we have scanned all the siblibings. So this sibling will be the last sibling.  
        if(sibling == null){
          if (prevSibling == null){
            // make this firstchild of the parent
            parent.firstChild = node;
          } else {
            prevSibling.nextSibling = node;
          }
            
        } else {
      /* TODO: Handle This case
          // match with same tag and index found
          node = new ClickTreeNode(uaRecords);
          if (sibling.next == null){
            sibling.next = node
          }else {
            node.next = sibling.next;
            sibling.next = node;
            
          }
      */
        }
        //This having last matched node.
        sibling = node; 
      } 

      //move to next level.
      if (level == tokens.length - 1){
        // this was last token level
        break;
      } else {
        level++;
        token = tokens[level];
              //Now last matched sibling will become new parent.
              parent =  sibling;
        sibling = parent.firstChild;
        prevSibling = null;
      }
      }
      }
    }


    findMatchCTN(record)
    {
      var data = record;
      var ctn = {};
      var id = record.id;
      var idType = record.idType;
      var firstChild;
      var sibling;
      if(idType == this.DOM_ID)
      {
      //Search on rootNodes's first child's and their siblings.
      //if(rootNode != null)
      {
      //FIXME: what if id is html.
      //so better to put type of Id.
      firstChild = this.rootNode.firstChild;
      //traverse all the siblings of this child.
      for(;firstChild;) 
      {
      if(firstChild.id == id)
        return firstChild;
      firstChild = firstChild.nextSibling;
      }
      }
      return null;
      }
      else {
      //Tokenize the id.
      var tokens = this.tokeNizeXPath(id);
      var token;
      var level = 0;
      var match = false;
      //each token will be search on each level.  
      firstChild = this.rootNode.firstChild;

      token = tokens[level];
      for(;firstChild && token;)
      {
      sibling = firstChild;
      match = false;
      for(;sibling;) 
      {
        //match tag and index.
        if(sibling.tag == token.node && sibling.siblingIndex == token.index)
        {
          //continue for next level.
          match = true;
          //Check if this is final level or all tokens are consumed then return this sibling.
          //TODO: currently we are not handling for next nodes.
          if(level == tokens.length - 1)
            return sibling;
          break;
        }
        sibling = sibling.nextSibling;  
      }
      if(!match)
        return null;

      //move to next level.
      level++;
      token = tokens[level];
      //Now move to matched sibling's first child.
      firstChild = sibling.firstChild;
      }
      }
      return null;
    }


    showElementInformation(index1,index2)
    {
      let meee = this;
      var ih = "";
      var isd = "";
      let cid ;
      let tp;
      document.getElementById('elementinfo').style.display = "block";
      if(index2 == null || index2 == undefined)
      {
      if(this.funnelData[index1].ctn.id.length > 20 )
      cid = this.funnelData[index1].ctn.id.substring(0,20) + "...";
      else
      cid = this.funnelData[index1].ctn.id;
      if((this.funnelData[index1].ctn.elementname.indexOf("null") > -1) || (this.funnelData[index1].ctn.elementname.indexOf("undefined") > -1))
      document.getElementById('ename').innerHTML =  " : -";
      else
      document.getElementById('ename').innerHTML = " : "+ this.funnelData[index1].ctn.elementname;
      if((this.funnelData[index1].ctn.tag.indexOf("null") > -1) || (this.funnelData[index1].ctn.tag.indexOf("undefined") > -1))
      document.getElementById('etype').innerHTML =  " : -"; 
      else
      document.getElementById('etype').innerHTML = " : "+this.funnelData[index1].ctn.tag;
      if(this.funnelData[index1].ctn.idType == this.DOM_ID)
       document.getElementById('xpathorid').innerHTML= 'ID #'+cid;
      else
       document.getElementById('xpathorid').innerHTML= ' XPath  :'+cid;
      document.getElementById('xpathorid').title = this.funnelData[index1].ctn.id;
      //document.getElementById('xpathorid').setAttribute("onclick","copyText('"+this.funnelData[index1].ctn.id.split(" ").join("%s")+"','xpathorid')");
      
      let ell = <HTMLElement> document.getElementById('xpathorid');
      ell.addEventListener('click',()=>{meee.copyText(this.funnelData[index1].ctn.id.split(" ").join("%s"))});

      if(this.funnelData[index1].ctn.domNode != null && this.funnelData[index1].ctn.domNode != undefined )
      {
      tp = this.getLabel(this.funnelData[index1].ctn.domNode).replace(/\s/g, "");
      document.getElementById('srcid').style.display = 'block';
      if(this.funnelData[index1].ctn.domNode.offsetParent == null)
      document.getElementById('xpathorid').innerHTML += "<br>Element not found/hidden";
      }
      else
      {
      document.getElementById('srcid').style.display = 'none';
      document.getElementById('xpathorid').innerHTML += "<br>Element not found/hidden";
      }
      document.getElementById('elementinformation').setAttribute("path",this.funnelData[index1].ctn.id);
      }                                                      
      else                                                   
      { 

      if(this.funnelData[index1].children[index2].ctn.id.length > 20)
      cid = this.funnelData[index1].children[index2].ctn.id.substring(0,20) + "...";
      else
      cid = this.funnelData[index1].ctn.id;
      if((this.funnelData[index1].children[index2].ctn.elementname.indexOf("null") > -1) || (this.funnelData[index1].children[index2].ctn.elementname.indexOf("undefined") > -1))
      document.getElementById('ename').innerHTML =  " : -";
      else
      document.getElementById('ename').innerHTML = " : "+ this.funnelData[index1].children[index2].ctn.elementname;
      if((this.funnelData[index1].children[index2].ctn.tag.indexOf("null") > -1) || (this.funnelData[index1].children[index2].ctn.tag.indexOf("undefined") > -1))
        document.getElementById('etype').innerHTML =  " : -";
      else
       document.getElementById('etype').innerHTML = " : "+this.funnelData[index1].children[index2].ctn.tag;
      if(this.funnelData[index1].ctn.idType == this.DOM_ID)
       document.getElementById('xpathorid').innerHTML= ': ID #'+cid;
      else
       document.getElementById('xpathorid').innerHTML= ' : XPath  :'+cid;
      document.getElementById('xpathorid').title = this.funnelData[index1].children[index2].ctn.id
      //document.getElementById('xpathorid').setAttribute("onclick","copyText('"+this.funnelData[index1].children[index2].ctn.id+"','xpathorid')");
     
      let ell = <HTMLElement> document.getElementById('xpathorid');
      ell.addEventListener('click',()=>{meee.copyText(this.funnelData[index1].children[index2].ctn.id)});
     
      document.getElementById('elementinformation').setAttribute("path",this.funnelData[index1].children[index2].ctn.id);
      if(this.funnelData[index1].children[index2].ctn.domNode != null && this.funnelData[index1].children[index2].ctn.domNode != undefined && this.funnelData[index1].children[index2].ctn.domNode.offsetParent != null )
      {
      tp = this.getLabel(this.funnelData[index1].children[index2].ctn.domNode).replace(/\s/g, "");
      document.getElementById('srcid').style.display = 'block';
      //if(funnelData[index1].children[index2].ctn.domNode.offsetParent == null)
      //parent.document.getElementById('xpathorid').innerHTML += "<br>Element not found/hidden";
      }
      else
      {
      document.getElementById('srcid').style.display = 'none';
      document.getElementById('xpathorid').innerHTML += '<br>Element not found/hidden';
      }
      document.getElementById('elementinformation').setAttribute("path",this.funnelData[index1].children[index2].ctn.id);
      } 

    }                                                        
              

    createHeatMapNodes(tag,color,level,i,j,z,k,perc)
    {
      var ih = "";
      let cnt;
      if(level == 2)
      {
      ih += '<li count="'+i+'" j="'+j+'" class="an'+i+'" pathid='+this.trimCSSPath(this.funnelData[i].children[j].ctn.id) +' style="margin-top:2px;display:none" ><span class="btn nvrbtn-'+color+'  btn-'+color+'" style="width:90%" (click)="showInformation('+i+','+j+')" onmouseover="showHeatMapChildElement('+i+','+j+',true)" onmouseout="showHeatMapChildElement('+i+','+j+',false)">';
      ih += '<span style="float:left;" ondblclick=showDDR("'+this.trimCSSPath(this.funnelData[i].children[j].ctn.real_id)+'","'+this.funnelData[i].children[j].ctn.real_idType+'")>';
      ih += '<span class="badge" style= "font:10px cursive;color: #A52A2A;">'+this.funnelData[i].children[j].ctn.clickCount.toLocaleString()+'<br>('+z.toPrecision(3)+'%)</span>';
      ih += '</span>';
      ih += '<span id="dp'+i+'">';
      if(tag.length >=20)
      ih += '<span title="'+tag+'" style="font: 12px Arial, Helvetica, sans-serif;color: white;">'+tag.substring(0,20)+'...</span>';
      else
      ih += '<span title="'+tag+'" style="font: 12px Arial, Helvetica, sans-serif;color: white;">'+tag+'</span>';
      //ih += '<br><span class="elp" style="font:11px !important;color: #A52A2A;">ElName : '+funnelData[i].children[j].ctn.elementname+'</span>';
      //    ih += '<a style="padding:0px !important;font: 12px Arial, Helvetica, sans-serif;color: #A52A2A;cursor:pointer;height:10px;" style="font: 10px cursive;color: #A52A2A;cursor:pointer;" id = "mk'+i+j+'" href=javascript:copyText("'+funnelData[i].children[j].ctn.id.split(" ").join("%s")+'","mk'+i+j+'") >Copy Selector</a>';
      ih += '<br><span class="np"  style="font:11px cursive;color: #A52A2A;display:block"><b>&nbsp;'+this.funnelData[i].ctn.NextPage+'</b></span>';
      ih += '</span></span>';
      ih += '</li>';

      }
      else if(level == 1)
      {
      ih += '<li  count="'+i+'" j="'+j+'"  pathid='+this.trimCSSPath(this.funnelData[i].ctn.id) +' style="margin-top:2px;display:block" ><span  class="btn nvrbtn-'+color+' btn-'+color+'" style="width:90%"  (click)="showInformation('+i+');showHeatMapElement('+i+' ,true)" >';
      ih += '<span style="float:left;" ondblclick=showDDR("'+this.trimCSSPath(this.funnelData[i].ctn.real_id)+'","'+this.funnelData[i].ctn.real_idType+'")>';
      if(k == 'none')
      cnt = this.funnelData[i].ctn.rollupCount;
      else
      cnt = this.funnelData[i].ctn.clickCount ; 
      ih += '<span class="badge" style= "font:10px cursive;color: #A52A2A;">'+cnt.toLocaleString() +'<br>('+j.toPrecision(3)+'%)</span>';
      ih += '</span>';
      ih += '<span id="dp'+i+'">';
      if(tag.length >20)
      {
      ih += '<span title="'+tag+'" style="font: 12px Arial, Helvetica, sans-serif;color: white;">'+tag.substring(0,20)+'...</span>';
      if(k == "none")
      ih += '<span class="glyphicon glyphicon-plus" aria-hidden="true" width="15px" height="15px" style="float:right;cursor:pointer;" name = "'+i+'" (click)=showInnDiv("'+i+'")></span>';
      }
      else
      {
      ih += '<span title="'+tag+'" style="font: 12px Arial, Helvetica, sans-serif;color: white;">'+tag+'</span>';
      if(k == "none")
      ih += '<span class="glyphicon glyphicon-plus" aria-hidden="true" width="15px" height="15px" style="float:right;cursor:pointer;" name = "'+i+'" (click)=showInnDiv("'+i+'")></span>';
      }
      //ih += '<br><span class="elp" style="font:11px !important;color: #A52A2A;">ElName : '+funnelData[i].ctn.elementname+'</span>';
      //    ih += '<a style="padding:0px !important;font: 12px Arial, Helvetica, sans-serif;color: #A52A2A;cursor:pointer;height:10px;" id="mk'+i+'" href=javascript:copyText("'+funnelData[i].ctn.id.split(" ").join("%s")+'","mk'+i+'"); >Copy Selector</a>';
      ih += '<br><span class="np"  style="font:11px cursive;color: white;display:block"><b>&nbsp;'+this.funnelData[i].ctn.NextPage+'</b></span>';
      ih += '</span></span>';
      if(k == "block")
      ih += '</li>';
      }
      else if(level== 3)
      {
      ih += '<li count="'+i+'" i="'+j+'"  class="an'+z+'"  style="margin-top:2px;display:none"  ><span class="btn nvrbtn-primary btn-primary" style="width:90%"  >';
      ih += '<span style="float:left;">';
      ih += '<span class="badge"  style= "font:10px cursive;color: #A52A2A;">'+i+'<br>('+j.toPrecision(3)+'%)</span>';
      ih += '<span title="Others" style="font: 12px Arial, Helvetica, sans-serif;color: white">Others</span>';
      ih += '</span></span>';
      ih += '</li>';
      }


      return ih;

    }

    

    showHeatMapInformation(funnelData,exitorclickmapflag)
    {
      var counttotal = (((this.pageviewcount - this.totalCount)/this.pageviewcount) * 100).toPrecision(3); 
      var ih = "";
      if(exitorclickmapflag)
      {
      ih += "<div class='panel-heading' style='font-size:12px;color:black' >";
      ih += "Total page View <span class='badge'>"+ this.pageviewcount.toLocaleString() +"</span></span></br>";
      ih += "<span style='font-size:12px;' >Without click/action <span>"+ (this.pageviewcount - this.totalCount).toLocaleString() +"(" + counttotal +"%)</span></span></div>";
      }

      ih += "<div class='clt panel-body'><span class='btn nvrbtn-primary btn-primary' title='Total page views having clicks' > Total Click <span class='badge'>"+ this.totalCount.toLocaleString() +"</span></span><ul>";

      for(var i = 0; i <funnelData.length; i++)
      {
      if(funnelData[i].children.length > 0)
      {
      /*
      if(exitorclickmapflag)
      var clickPct = ((funnelData[i].ctn.rollupCount*100)/pageviewcount);
      else
      */
      var clickPct = ((funnelData[i].ctn.rollupCount*100)/this.totalCount);
      /* 
      ih += '<li><span class="btn btn-primary"> Total Counts <span class="badge">'+funnelData[i].ctn.rollupCount+'<br>('+clickPct.toPrecision(3)+'%)</span><span class="glyphicon glyphicon-minus" aria-hidden="true" width="15px" height="15px" style="float:right;cursor:pointer;" name = "'+i+'" onclick=showInnDiv("'+i+'")></span></li>'; */
      var tag = "";
      /*
      if(exitorclickmapflag)
      var cpt = ((funnelData[i].ctn.clickCount*100)/pageviewcount);
      else
      */
      var cpt = ((funnelData[i].ctn.clickCount*100)/this.totalCount);

      if(funnelData[i].ctn.ignore != true){
      if(funnelData[i].ctn.domNode != null && funnelData[i].ctn.domNode != undefined )
      {
      if(clickPct > this.clickmapConfig.minimumPctforTable)
      {
        tag = this.getLabel(funnelData[i].ctn.domNode).replace(/\s/g, "");
        ih += this.createHeatMapNodes(tag,"success",1,i,clickPct,"","none",null);
      }
      else 
          this.tableGranCTNRecords++;
      }
      else
      {
        tag = funnelData[i].ctn.tag;
        if(clickPct > this.clickmapConfig.minimumPctforTable)
          ih += this.createHeatMapNodes(tag,"warning",1,i,clickPct,"","none",null);
        else
        this.tableGranCTNRecords++;
      }
      }
      if(clickPct > this.clickmapConfig.minimumPctforTable){
      ih += "<ul>";

      var countc = 0;
      for(var j = 0;j<funnelData[i].children.length;j++)
      { 
        var tag = "";
          var clickpct = ((funnelData[i].children[j].ctn.clickCount*100)/this.totalCount);
        if(funnelData[i].children[j].ctn.ignore != true){
        if(funnelData[i].children[j].ctn.domNode != null && funnelData[i].children[j].ctn.domNode != undefined )
        {
          if(clickpct > 0.2)
          {
            tag = this.getLabel(funnelData[i].children[j].ctn.domNode).replace(/\s/g, "");
            ih += this.createHeatMapNodes(tag,"success",2,i,j,clickpct,null,null);
          }
          else
          {
              countc += funnelData[i].children[j].ctn.clickCount;
          }
          if((j == funnelData[i].children.length - 1) && (clickpct < 0.2)) 
            ih += this.createHeatMapNodes("Others","success",3,countc,(countc*100)/this.totalCount,i,null,null);
        }
        else
      {
        tag = funnelData[i].children[j].ctn.tag;
        if(clickPct > 0.2)
          ih += this.createHeatMapNodes(tag,"warning",2,i,j,clickpct,null,null);
        else
          countc += funnelData[i].children[j].ctn.clickCount;
          if((j == funnelData[i].children.length - 1) && (clickpct < 0.2))
            ih += this.createHeatMapNodes("Others","warning",3,countc,(countc*100)/this.totalCount,i,null,null);
      }
      }
        
      }

      ih += "</ul></li>";
      }
      }
      else
      {
      /*
      if(exitorclickmapflag)
        var clickPct = ((funnelData[i].ctn.rollupCount*100)/pageviewcount);
      else
      */
        var clickPct = ((funnelData[i].ctn.clickCount*100)/this.totalCount);
      var tag = "";
      if(funnelData[i].ctn.ignore != true){
      if(funnelData[i].ctn.domNode != null && funnelData[i].ctn.domNode != undefined )
      {
          tag = this.getLabel(funnelData[i].ctn.domNode).replace(/\s/g, "");
          if(clickPct > this.clickmapConfig.minimumPctforTable)
              ih += this.createHeatMapNodes(tag,"success",1,i,clickPct,"","block",null);
          else
          this.tableGranCTNRecords++;
      }
      else
      {
        tag = funnelData[i].ctn.tag;
        if(clickPct > this.clickmapConfig.minimumPctforTable)
        ih += this.createHeatMapNodes(tag,"warning",1,i,clickPct,"","block",null);
        else
        this.tableGranCTNRecords++;
      }
      }
      }
      }
      ih += "</ul></div>";

      this.temp1.innerHTML = ih;     
    }

    showOtherInformation()
    {
      if(this.othercount >= 0)
      return;

      var pct = Number(this.othercount * 100) /this.totalCount;

      var ih = "";

      ih +='<ul><span class="btn nvrbtn-primary btn-primary" style="margin-left:30px" >'+ this.othercount +' Other count with ' + pct + ' </span><ul>'; 
      this.temp1.innerHTML += ih; 
    }


    hidelastVerLine(funnelData)
    {
      var d = Number(funnelData.length - 1);
      var e = parent.document.getElementById('lb'+d);
      e.style.display = 'none';

      for(var i=0 ;i <funnelData.length;i++)
      {
      if(funnelData[i].children.length != 0){
      var g = Number(funnelData[i].children.length-1);

      var f = parent.document.getElementById('mp'+d+g);
      if(f == null) return;
      else
      f.style.display = 'none';
      }

      }
    }

      //Note: max limit of text content is 50.
      //we will try to find the complete text within 50 chars.
    shortTextContent(text, lmt, action)
    {
      // no limit check for text like 
      /*shoppingBag
      Visit
      */
      if(action != undefined && action == "hide" && text.indexOf('\n') > -1)
      return text.substr(0, text.indexOf('\n')+1) + "...";

      if(text.length <= lmt)
      return text;
      else if(action != undefined && action == "hide")
      {
      if(text.indexOf('\n') <= -1)
      return text.substr(0,lmt)+ "...";
      else
      return text.substr(0, text.indexOf('\n')+1) + "...";
      }

      //split the content by \n, \t and space \r \b.
      var lastComplete = -1;
      for(var z = 0;  z < text.length; z++)
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

    showDDRLink(id,idType)
    {
      var link = "";//"nvPageStoreData.jsp?eventtype=2&eventid="+id+"&eventidtype="+idType+"&devicetype="+devicetype+"&channelid="+channelid+"&startDateTime="+startDateTime+"&endDateTime="+endDateTime+"&pageId="+pageid+"&protocolversion="+protocolversion+"&version="+version+"&replaymode="+replaymode+"&exitorclickmapflag="+exitorclickmapflag+"&userSegment="+userSegment;
      return link;
    }
      

    showElementInfo(id,what)
    {
      
      var k = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll('.nvol');
      for(var f = 0;f < k.length ;f++)
      {
      k[f].style.background = '';
      k[f].style.border = '';
      k[f].style.boxShadow = '';
      }

      var el = document.querySelectorAll('#heatmapiddiv li')
      for(var l =0 ;l <el.length ;l++)
      {
        let ee = <HTMLElement> el[l].children[0];
        ee.style.border = '';
        ee.style.boxShadow = '';
      }

      var obj = this.funnelData[parseInt(id)].ctn.domNode;
      if(this.load > -1)
      {
      //if(obj != null)
      // $( ".nvoverlaytemp"+load ).remove();
      // $( ".nvoverlaytmp"+load ).remove();
      var rm1 = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll(".nvoverlaytemp");
      var rm2 = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll(".nvoverlaytmp");
      try{
      for(var i=0; i < rm1.length; i++)
      { 
      rm1[i].parentElement.removeChild(rm1[i]);
      }
      for(var j=0; j < rm2.length; j++)
      {
      rm2[j].parentElement.removeChild(rm2[j]);
      } 
      //$.each(rm1,function(){ this.remove(); });
      //$.each(rm2,function(){ this.remove(); });
      //$('.nvoverlaytemp').each(function(){  $(this).remove();      });
      //$('.nvoverlaytmp').each(function(){  $(this).remove();      });
      }
      catch(e)
      {}
      if(this.flag != "")
      {
      var b = parent.document.querySelector('li[pathid=\"'+this.trimCSSPath(this.flag)+'\"]');
      if(b != null){
        let bb = <HTMLElement> b.children[0];
        bb.style.border = '';
        bb.style.boxShadow = '';
      }
      }
      }
      if(obj != null || obj != undefined)
      obj.scrollIntoViewIfNeeded();
      /*var d = document.getElementById('nvreplayid');
      if(d == null)
      {
      d = document.createElement('div');
      d.id = "nvreplayid";
      d.style.cssText = "z-index:10002;position:absolute;float:initial;left:0px;top:0px;display:block;";
      var img = document.createElement('img');
      img.src = "/netvision/images/mousepointer.gif";
      d.appendChild(img);
      }*/
      var overlaytemp = document.createElement("div");
      var offset = $(obj).offset();
      //overlaytemp.setAttribute("class","nvoverlaytemp"+id);
      overlaytemp.setAttribute("class","nvoverlaytemp");
      overlaytemp.style.position = "absolute";
      //d.style.position = "absolute";
      overlaytemp.style.border = "1px solid yellow";
      overlaytemp.style.zIndex = "10002";
      overlaytemp.style.opacity = '0.7';
      if(obj != null){
      overlaytemp.style.background = "yellow";
      overlaytemp.style.top = ((offset.top - 8) < 0 ? 0:(offset.top - 8)) + "px";
      //d.style.top = offset.top - 8;
      overlaytemp.style.left = ((offset.left - 8) < 0 ? 0:(offset.left - 8)) +"px";
      //d.style.left = offset.left - 8 + "px";
      var visibleObj = obj;
      if(visibleObj.offsetHeight == 0)
      {
      while(visibleObj && visibleObj.offsetHeight == 0)
        visibleObj = visibleObj.offsetParent;

      }

      // overlaytemp.style.height = $(obj).innerHeight() + 5;
      //overlaytemp.style.width = (($(obj).innerWidth() + 5 ) > 100 ? $(obj).innerWidth() :($(obj).innerWidth() + 5));
      overlaytemp.style.height = $(visibleObj).innerHeight() + 5 + "px";
      overlaytemp.style.width = $(visibleObj).innerWidth() + 5 +"px";

      //this.replayIframe.nativeElement.contentWindow.document.getElementById("overLayParent").appendChild(d);
      this.replayIframe.nativeElement.contentWindow.document.body.appendChild(overlaytemp);
      }
      var a = parent.document.querySelector('li[pathid=\"'+this.trimCSSPath(this.funnelData[parseInt(id)].ctn.id)+'\"]');
      let ss = <HTMLElement> a.children[0];
      ss.style.border = '4px solid lime';
      ss.style.boxShadow = '10px 10px 5px #888888';
      this.load = id; 
      this.flag = this.funnelData[parseInt(id)].ctn.id;

      var o = this.replayIframe.nativeElement.contentWindow.document.querySelector('#overLayParent');
      if(o)
      o.style.display = "block";
      var k = this.replayIframe.nativeElement.contentWindow.document.querySelector('[path="'+this.flag+'"]');
      if(k)
      k.style.visibility = "visible";
    } 

    showCounters()
    {
      var o = this.replayIframe.nativeElement.contentWindow.document.querySelector('#overLayParent');
      if(o)
      o.style.display = "block";
      var k = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll('.nvcounter');
      for(let i=0;i<k.length;i++)
      {
      k[i].style.visibility = "visible";
      k[i].style.display = "block";
      }
    }
    removeCounters(){
      var k = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll('.nvcounter');
      for(i=0;i<k.length;i++)
      {
      k[i].parentElement.removeChild(k[i]);
      }
      // remove the attribute  
      var elms = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll("[nvolexist]");
      for(var i=0; i < elms.length; i++)
      {
      elms[i].removeAttribute('nvolexist');
      }
    }

    showElementInfochild(id,idm,what)
    {
      console.log("in showElementInfochild");
      var k = this.replayIframe.nativeElement.contentWindow.document.querySelectorAll('.nvol');
      for(var f = 0;f < k.length ;f++)
      {
      k[f].style.background = '';
      k[f].style.border = '';
      k[f].style.boxShadow = '';
      }

      var el = parent.document.querySelectorAll('#heatmapiddiv li')
      for(var l =0 ;l <el.length ;l++)
      {
        let ee = <HTMLElement> el[l].children[0];
        ee.style.border = '';
        ee.style.boxShadow = '';
      }

      var obj = this.funnelData[parseInt(id)].children[parseInt(idm)].ctn.domNode;
      if(this.load > -1)
      {
      //if(obj != null)
      //$( ".nvoverlaytemp"+load ).remove();
      //$( ".nvoverlaytmp"+load ).remove();
      var rm1 = $( ".nvoverlaytemp");
      var rm2 = $( ".nvoverlaytmp");
      $.each(rm1,function(){ this.remove(); });
      $.each(rm2,function(){ this.remove(); });
      if(this.flag != "")
      {
      var b = parent.document.querySelector('li[pathid=\"'+this.trimCSSPath(this.flag)+'\"]');
      let cc = <HTMLElement> b.children[0]; 
      cc.style.border = '';
      cc.style.boxShadow = '';
      }
      }
      if(obj != null || obj != undefined)
      obj.scrollIntoViewIfNeeded();
      /*var d = document.getElementById('nvreplayid');
      if(d == null)
      {
      d = document.createElement('div');
      d.id = "nvreplayid";
      d.style.cssText = "z-index:1000000;position:absolute;float:initial;left:0px;top:0px;display:block;background:green";
      var img = document.createElement('img');
      img.src = "/netvision/images/mousepointer.gif";
      d.appendChild(img);
      }*/
      var overlaytemp = document.createElement("div");
      var offset = $(obj).offset();
      //overlaytemp.setAttribute("class","nvoverlaytmp"+idm);
      overlaytemp.setAttribute("class","nvoverlaytmp");
      overlaytemp.style.position = "absolute";
      //d.style.position = "absolute";
      overlaytemp.style.border = "1 px solid yellow";
      overlaytemp.style.zIndex = "100000";
      overlaytemp.style.opacity = '0.7';
      overlaytemp.style.background = "yellow";
      if(obj != null){
      overlaytemp.style.top = ((offset.top - 8)< 0 ? 0:(offset.top - 8)) +"px";
      //d.style.top = offset.top - 8 +"px";
      overlaytemp.style.left = ((offset.left - 8) < 0 ? 0:(offset.left - 8)) +"px";
      //d.style.left = offset.left - 8 +"px"; 
      //overlaytemp.style.height = $(obj).innerHeight() + 5;
      //overlaytemp.style.width = (($(obj).innerWidth() + 5) > 100 ? $(obj).innerWidth() :($(obj).innerWidth() + 5));
      var visibleObj = obj;
      if(visibleObj.offsetHeight == 0)
      {
      while(visibleObj && visibleObj.offsetHeight == 0)
        visibleObj = visibleObj.offsetParent;

      }

      // overlaytemp.style.height = $(obj).innerHeight() + 5;
      //overlaytemp.style.width = (($(obj).innerWidth() + 5 ) > 100 ? $(obj).innerWidth() :($(obj).innerWidth() + 5));
      overlaytemp.style.height = $(visibleObj).innerHeight() + 5 +"px";
      overlaytemp.style.width = $(visibleObj).innerWidth() + 5 +"px";
      }
      //document.getElementById("overLayParent").appendChild(overlaytemp);
      document.body.appendChild(overlaytemp);
      var a = parent.document.querySelector('li[pathid=\"'+this.trimCSSPath(this.funnelData[parseInt(id)].children[parseInt(idm)].ctn.id)+'\"]');
      let ac = <HTMLElement> a.children[0]; 
      ac.style.border = '4px solid lime';
      ac.style.boxShadow = '10px 10px 5px #888888';
      this.load = id;
      this.flag = this.funnelData[parseInt(id)].children[parseInt(idm)].ctn.id;


    }

    HideElement()
    {
      var d = parent.document.querySelectorAll('.np');
      let dd;
      for(var i = 0;i <d.length; i++)
      {
      dd = d[i];
      if(dd.innerHTML == "<b>&nbsp;null</b>")
      dd.style.display = 'none';
      else
      dd.style.display = 'block';
      }
    }

    HideElementInform()
    {
      var d = parent.document.querySelectorAll('.elp');
      let dd;
      for(var i = 0;i <d.length; i++)
      {
      dd = d[i];
      if(dd.innerHTML.indexOf("null") > -1)
      dd.style.display = 'none';
      else
      dd.style.display = 'block';
      }
    }

    showHideDisplayDiv()
    {
      var sdiv = parent.document.getElementById('infodiv');
      if(sdiv)
      sdiv.style.display = "none";
      // var imgdiv = parent.document.getElementById('imgMinus');
      //imgdiv.style.display = "none";
      var hdiv = parent.document.getElementById('heatmapid');
      if(hdiv)
      hdiv.style.display = "block";
    }




    //This method will process the data and show the heatmap.
    
   
    getFunnelDataForPage()
    {
      return this.funnelData;
    }

    // getUARecordForPage()
    // {
    //   return uaRecords;
    // }

    getCTNNode(id)
    {
      var domElement = null;
      try
      {
      domElement = this.replayIframe.nativeElement.contentWindow.document.evaluate(id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      catch(e) {
      //TODO:
      var id = id;
      while(id.indexOf(":") > -1){id = id.replace(/\/[0-9A-Za-z]*:[^\/]*$/g, "/*").replace(/\/[0-9A-Za-z]*:[^\/]*\//g, "/*/");}
      domElement = this.replayIframe.nativeElement.contentWindow.document.evaluate(id, this.replayIframe.nativeElement.contentWindow.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      return domElement;
    }

    

      /*var devicetype ;
      var channelid;
      var startDateTime;
      var endDateTime;
      var pageid;
      var replaymode;
      var version;
      var protocolversion;
      var exitorclickmapflag ;
      var urlPatternList;
      var pageviewcount;
      var uaRecords ;
      var userSegment ;*/

    showHeatMapElement(i,what)
    {
      /*var w = "";
      if(frames[0].window.NVHeatMap == undefined)
      w = parent.window.frames[0].parent.window.NVHeatMap;
      else
      w = frames[0].window.NVHeatMap;
      return w.*/
      this.showElementInfo(i,what);
    }

    showInformation(i,j)
    {
      /*var w = "";
      if(frames[0].window.NVHeatMap == undefined)
      w = parent.window.frames[0].parent.window.NVHeatMap;
      else
      w = frames[0].window.NVHeatMap;
      return w.*/
      this.showElementInformation(i,j);
    }


      
    addListener()
    {
      document.querySelectorAll('#heatmapiddiv li').forEach((n)=>
      {
        console.log("a : "+ n);
        n.addEventListener('click',(ev)=>{
            var elms = ev.target;
            var elm = < HTMLElement> ev.target;
            while(elm && elm.tagName != 'LI'){
              elm = elm.parentElement;
            }
            console.log("elm : ", elm);
            if(!elm) return;
            var i = Number(elm.getAttribute("count"));
            var j = elm.getAttribute("j");
            i = Number(i);
            this.showElementInformation(i,null);
            this.showElementInfo(i,true); 
            //showPopOver(i+1,true,event);
            //highlightElement(i+1,event);
        });
      })
    }
    /** intro.js */
    clearOverLay()
    {
        $('#overLayParent').remove();
        $('.nvoverlaytemp').each(()=>{  $(this).remove();      });
        $('.nvoverlaytmp').each(()=>{  $(this).remove();      });
        $('.nvcounter').each(()=>{  $(this).remove();      });
        $('.nvpopover').each(()=>{  $(this).remove();      });
        $("[nvolexist]").each(()=>{  $(this).removeAttr('nvolexist');    });
        $('.nvol').each(()=>{  $(this).remove();      });
        this.area = [];
    }


 addCounter(top,left,value,zIndex,overlay,path,rollUpMode,frame)
{
 
  var counterParent =<HTMLDivElement> document.createElement("div");

  counterParent.id = "counter" + this.popOverCount;
  counterParent.setAttribute("count",this.popOverCount+'');

  //var counterParen=document.getElementById(counterParent.id);
  console.log('counterParent',counterParent);

  counterParent.setAttribute("class","nvcounter");
  counterParent.setAttribute("style","cursor:pointer;color:white;background-color:red;height:16px;width:auto;position:absolute;"
                                   + "padding-top:1px;padding-bottom:1px;padding-left:2px;padding-right:2px;border-radius:2px;"
								   + "font-size:12px;font-weight:bold;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;"
								   + "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);");
 if(rollUpMode == true)
   counterParent.style.visibility = "hidden";
 else
   counterParent.style.visibility="block";
  counterParent.style.zIndex = Number(zIndex) + 999999 + "";
  counterParent.innerHTML = value;
  counterParent.style.top = (top - 10 >= 0 ? top - 10 : 0)  + "px";
  counterParent.style.left = (left >= 0 ? left  : 0)  + "px";
  if(counterParent.innerHTML != "0%")
   frame.contentWindow.document.body.appendChild(counterParent);  
  counterParent.setAttribute("path",path);
  this.setStaticPosition(counterParent,path);
 // counterParent.addEventListener("mouseover",showPopOver(popOverCount,true,event));
 counterParent.addEventListener("mouseover",()=>{ console.log("counterParent clicked : ", event);this.showPopOver(this.popOverCount,true,event);}); 
 //counterParent.addEventListener("mouseout",showPopOver(popOverCount,false,event));
 
 counterParent.addEventListener("mouseout",()=>{ console.log("counterParent clicked : ", event);this.showPopOver(this.popOverCount,false,event)});

 counterParent.addEventListener("click",()=>{ console.log("counterParent clicked : ", event);this.showPopOver(this.popOverCount,true,event);this.highlightElement(this.popOverCount,event)});
}


 initOverlay()
{
  var overLayContainer = document.createElement("DIV");
  overLayContainer.style.width = "100%";
  overLayContainer.style.height = this.replayIframe.nativeElement.contentWindow.document.documentElement.scrollHeight + "px";
  //overLayContainer.style.backgroundColor = "grey";
  overLayContainer.style.opacity = 0.7 +"";
  overLayContainer.style.position = "absolute";
  overLayContainer.style.display = "none";
  //overLayContainer.style.overflow = 'hidden';
  overLayContainer.style.top = 0+ "px";
  overLayContainer.style.left = 0+ "px";
  overLayContainer.id="overLayParent";
  overLayContainer.style.zIndex = 10000 +"";
  this.replayIframe.nativeElement.contentWindow.document.body.appendChild(overLayContainer);
  //document.body.appendChild(overLayContainer);
}

loadOverLay()
{  
  
  var popData = { "Element Type " : "INPUT", "Id" : "#abc"  };
  try
  {
    var link = "http://www.google.com";
    this.setOverlay(document.getElementById('ele2'),"orange",23443,popData,"secondary",link,null,null);
    this.setOverlay(document.getElementById('ele1'),"skyblue",2000,popData,"primary",link,null,null);
    this.setOverlay(document.getElementById('ele1'),"skyblue",3000,popData,"primary",link,null,null);
    this.setOverlay(document.getElementById('ele1'),"skyblue",5000,popData,"primary",link,null,null);
  }
  catch(e){  console.log(e) }
}

showOverlay()
{
  console.log('show overlay is called from js');
  $('#overLayParent').css("display","block");
  $('.nvol').each(()=>{ 
    if($(this).attr("type") == "primary")
	{
      $(this).css("opacity","0.7");
	  $('#counter' + $(this).attr("olnm")).css("visibility","visible");
	}
    else 
    {
      $(this).attr("onmouseenter","blinkOverlay("+$(this).attr("olnm")+",true)");
      $(this).attr("onmouseout","blinkOverlay("+$(this).attr("olnm")+",false)");
    } 
  });
}


/* In case of secondary overlays the onmouseenter and onmouseout are overidden by the blinkOverlay method so need to handle 
   visibility of the popover again. */
blinkOverlay(index,what)
{
/*   if(what)
   {
     $('#overlay' + index).css("opacity","1");
	 $('#counter' + index).css("visibility","visible");
	 showPopOver(index,what);
   }
   else  
   {
     $('#overlay' + index).css("opacity","0");
	 $('#counter' + index).css("visibility","hidden");
	 showPopOver(index,what);
   }*/   
}


addPopover(obj,data)
{
  var popOver = document.createElement("span");
  popOver.id = "popover" + this.popOverCount;
  popOver.setAttribute("class","nvpopOver");
  popOver.setAttribute("style","font-size : 12px;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;position"
                               +": absolute;background-color : white;color : #222;border-radius : 3px;visibility:hidden;padding-bottom"
                      	       +": 8px;padding-left : 10px;padding-right : 10px;padding-top : 8px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),"
 							   +"0 6px 20px 0 rgba(0, 0, 0, 0.19);");
var elementinfo = {};
  for(var key in data)
  {
    if(key.indexOf("id") > -1)
      popOver.setAttribute("path",data[key]);
    if(data[key] != undefined && data[key] != null)
      elementinfo[key] = data[key];
    else
      elementinfo[key] = "-";
  }
  this.ele[popOver.id] = elementinfo; 
  document.body.appendChild(popOver);
}

showPopOver(id,what,ev)
{
  var target = ev.target;
  try{
    if(target)
      id = target.getAttribute("count");
  }catch(e){
    console.log(e);
  }
  console.log('showPopOver method called : ', id);

    var doc =  this.replayIframe.nativeElement.contentWindow.document;
   var popOver = top.document.getElementById("popover" + id);
   var counter = this.replayIframe.nativeElement.contentWindow.document.getElementById("counter" + id);
   if(what)
   {
     //$('#overlay' + id).css("box-shadow"," 0 0 5px 0 #ffffff");
//     $('#overlay' + id).css("z-index",10002);
     //$('#counter' + id).css("z-index",10003);
//     $('#overlay' + id).css("display","block");
//     $('#overlay' + id).css("background","yellow");
     /*$( "#overlay" + id ).mouseenter(function( event ) {
	   popOver.style.top = event.pageY;
	   popOver.style.left = event.pageX;
     });
     popOver.style.visibility = "visible";*/
    // parent.document.getElementById('elementinfo').style.display = "block";
    // parent.document.getElementById('elementinformation').setAttribute("path",counter.getAttribute("path"));
    // parent.document.getElementById('elementinformation').innerText = popOver.innerText;
    // parent.document.getElementById('srcid').style.display = "block";
    // parent.document.getElementById('sessid').style.display = "block";
    // NEW
     var eid = "overlay"+id;
     var eld = doc.getElementById(eid);
     if(eld){
       eld.style.zIndex = "10002";
       eld.style.display = "block";
       eld.style.background = "yellow";
       eld.addEventListener("mouseenter",(event)=>{
           popOver.style.top = event.pageY;
           popOver.style.left = event.pageX;
       });
       if(popOver) popOver.style.visibility = "visible"; 
     }
   }
   else
   { 
     if(this.lastPop > 0 && id == this.lastPop) return;
     var eid = "overlay"+id;
     var eld = doc.getElementById(eid);
     if(eld){
     eld.style.zIndex =  eld.getAttribute("dt_zindex");
     eld.style.display = "none";
     eld.style.background = eld.getAttribute("dt_background");
   }
 /*
     $('#overlay' + id).css("display","none");
     $('#overlay' + id).css("z-index",$('#overlay' + id).attr("dt_zindex"));
     //$('#overlay' + id).css("box-shadow","0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
     //$('#counter' + id).css("z-index",$('#overlay' + id).attr("type") == "primary" ? 1 : 2);
     $('#overlay' + id).css("backgroundColor",$('#overlay' + id).attr("dt_background")); 
     //$('#overlay' + id).css("background","yellow");
 */
     if(popOver != null)
      popOver.style.visibility = "hidden";
     
   }
}



highlightElement(id,ev)
{
  let cid;
  try{
    id = ev.target.getAttribute("count");
  }catch(e){
    console.log(e);
  }
  try{
     
     var doc = top.document;//this.replayIframe.nativeElement.contentWindow.document;
     // on click, first  dehighlight the last pop over
     if(this.lastPop > 0) 
     {

      var lastPopoverElm = doc.getElementById("popover" + this.lastPop);
      var lastOverlay = this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.lastPop);
      if(lastPopoverElm != null)
      {
        lastPopoverElm.removeAttribute("currentNode");
        lastPopoverElm.style.display="none";
        lastPopoverElm.style.zIndex = lastPopoverElm.getAttribute("dt_zindex");
        lastPopoverElm.style.background = lastPopoverElm.getAttribute("dt_background");
        lastPopoverElm.style.visibility = "hidden";
      }
      if(lastOverlay)
      {
        lastOverlay.style.zIndex =  lastOverlay.getAttribute("dt_zindex");
        lastOverlay.style.display = "none";
        lastOverlay.style.background = lastOverlay.getAttribute("dt_background");
      }
       if(this.flag != "")
       {
          var a = parent.document.querySelector('button[pathid=\"'+this.flag+'\"]');
         if(a){
           a.className = a.className.replace(/popstyle/g,"");
           //a.children[0].style.border = '';
           //a.children[0].style.boxShadow= '';
         }
       }
     }     
     this.lastPop = id;
     /*
     var rm1 = $( ".nvoverlaytemp");
     var rm2 = $( ".nvoverlaytmp");
     $.each(rm1,function(){ this.remove(); });
     $.each(rm2,function(){ this.remove(); });*/
     if(doc.getElementById("popover" + this.lastPop) != null)
      doc.getElementById("popover" + this.lastPop).setAttribute("currentNode","true");
     var counter = this.replayIframe.nativeElement.contentWindow.document.getElementById("counter" + id);
     var popOver = doc.getElementById("popover" + id);
     var elef = this.ele["popover"+id];
     if(elef.Id)
       elef.Id = elef.Id.trim();
      
     //parent.document.getElementById('elementinfo').style.display = "block";
     parent.document.getElementById('elementinformation').setAttribute("path",counter.getAttribute("path"));
     if((elef.ElementName.indexOf("null") > -1) || (elef.ElementName.indexOf("undefined") > -1))
       parent.document.getElementById('ename').innerHTML =  " : -";
     else
      parent.document.getElementById('ename').innerHTML = " : "+ elef.ElementName;
    if((elef.ElementType.indexOf("null") > -1) || (elef.ElementType.indexOf("undefined") > -1))
     parent.document.getElementById('etype').innerHTML =  " : -";
    else
     parent.document.getElementById('etype').innerHTML = " : "+ elef.ElementType;
    if(elef.Id.length > 15)
     cid = elef.Id.substring(0,15) + "...";
    else
     cid = elef.Id;
    if(elef.idtype == -1)
      parent.document.getElementById('xpathorid').innerHTML= 'ID #'+ cid;
    else
      parent.document.getElementById('xpathorid').innerHTML= ' XPath  :'+ cid;
     parent.document.getElementById('xpathorid').title = elef.Id;
     //parent.document.getElementById('srcid').style.display = "block";
     
     var a = parent.document.querySelector('button[pathid=\"'+elef.Id+'\"]');
     if(a)
     {
       a.className += " popstyle";
      //a.children[0].style.border = '4px solid lime';
      //a.children[0].style.boxShadow = '10px 10px 5px #888888';
      //a.children[0].scrollIntoView();
      this.flag = elef.Id;
     }
   }
  catch(e)
   { 
        console.log("error in highlightElement : ", e);
   }
     
}

// An attribute olexist = true is set for all the overlays so if the element is repeated then from second time onwards only 
// the click counter will be updated for that overlay using the olexist attr. 
setOverlay(obj,color,counter,popData,type,link,cnt,rollUpMode)
{
  let tmp;
    if( $(obj).attr("nvolexist"))
	{
	  $('#counter' +  $(obj).attr("nvolexist")).html( parseInt($('#counter' +  $(obj).attr("nvolexist")).html()) + counter);
	  return;
	}
    
    $(obj).attr("nvolexist",this.popOverCount);
    //Check if element having height/width if not then we can check for its parent.
    var visibleObj = obj;
    if(visibleObj.offsetHeight == 0)
    {
      while(visibleObj && visibleObj.offsetHeight == 0)
        visibleObj = visibleObj.offsetParent;
        
    }
    var offset = $(obj).offset();
    var overlay = document.createElement("div");
	overlay.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
	overlay.id = "overlay" + this.popOverCount;
	overlay.setAttribute("olnm",this.popOverCount+"");
	overlay.setAttribute("type",type);
	overlay.setAttribute("class","nvol");
	overlay.style.opacity = 0.7 +"";
	//overlay.style.backgroundColor = color;
	overlay.style.position = "absolute";
	overlay.style.borderRadius = "1%";
	overlay.style.top = ((offset.top - 8) < 0 ? 0: (offset.top - 8)) + "px";
	overlay.style.left = ((offset.left - 8 ) < 0 ? 0:(offset.left - 8 )) + "px"; 
	//overlay.style.height = $(obj).innerHeight() + 5;
        overlay.style.height = ($(visibleObj).innerHeight() + 5)+ "px"

	overlay.style.width = $(visibleObj).innerWidth() + 5 +"";
	this.addCounter(offset.top - 8,offset.left - 8,counter,(type == "secondary") ? 2 : 1,overlay,popData.Id,rollUpMode,this.replayIframe.nativeElement);
	this.addPopover(obj,popData);
        overlay.style.display = "none";
	overlay.style.cursor = "pointer";
	overlay.setAttribute("ondblclick","openSession('"+link+"')");
	//overlay.setAttribute("onmouseenter","showPopOver("+popOverCount+",true)");
	//overlay.setAttribute("onmouseout","showPopOver("+popOverCount+",false)");
        if(type == "secondary")
          overlay.style.zIndex = 1000 +"";
        else
        {
          //setZIndex(overlay.style.top,overlay.style.height,overlay.style.left,overlay.style.width,overlay);
          tmp = [];
          tmp.push(Number(parseInt(overlay.style.height) * parseInt(overlay.style.width)));
          tmp.push(this.popOverCount);
          this.area.push(tmp);
        }
        //document.getElementById("overLayParent").appendChild(overlay);
        this.replayIframe.nativeElement.contentWindow.document.body.appendChild(overlay);
        this.popOverCount++;
}

openSession(link)
{
   var win = window.open(link, '_blank');
   if(win) // if window is open
     win.focus();
}






setPosition()
{
  console.log('set position from js is called');

  this.area.sort((A, B)=>{return (A[0] - B[0]);});
  var zIndex = 100;
  for(var a = this.area.length-1; a >= 0; a--,zIndex++ )
  {
     if(this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]) !== null && this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]) !== undefined)
     {
        this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]).setAttribute("dt_zindex",zIndex);
        this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]).setAttribute("dt_background",this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]).style.backgroundColor);
        this.replayIframe.nativeElement.contentWindow.document.getElementById("overlay" + this.area[a][1]).style.zIndex = zIndex;
     }
  }
}

setStaticPosition(elm, id)      
{ 
  if(id == null ) return;
  var targetedElm = this.getElementByXPath(id,true,this.replayIframe.nativeElement.contentWindow,this.replayIframe.nativeElement.contentWindow.document);
  if(targetedElm == null )
  { 
    console.log("Element Not Found");
    return;
  }
  try{
    var elkPos = null;
    var jQelm = jQuery(targetedElm);
    var elk = this.replayIframe.nativeElement.contentWindow.document.querySelector('#persistent_bar_container');
    if(elk)
      elkPos = elk.style.position;
    if(jQelm.parentsUntil("body","#persistent_bar_container").length != 0 && elkPos == "fixed")
      elm.style.position = "fixed";
  }catch(e){}
}

getElementByXPath(eleid, nearParent, w, d)
{
    nearParent = nearParent|| false;
    w = w || window;
    d = d || document;

    var element = null;
    var c = 0;
    while(!nearParent || c <= 2)
    {
      try
      {
        element = d.evaluate(eleid, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      catch(Exception)
      {
        //handle for xpath when there is namespace in the xpath
        //in this case we are removing the namespace by *
        //replace the current id using regex
        while(eleid.indexOf(":") > -1){eleid=eleid.replace(/\/[0-9A-Za-z]*:[^\/]*$/g, "/*").replace(/\/[0-9A-Za-z]*:[^\/]*\//g, "/*/");}
        //nvreporterdebug("Namespace removed id - " + eleid);
        //replayDataSet[dataIndex].elementid = eleid;
        try { 
          element = d.evaluate(eleid, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        catch(e) {}
      }
      if(!nearParent) return element;
      //if we found visible then return.
      //TODO: anjali review window.getComputedStyle(element,null) ??
      else if(element != null && window.getComputedStyle(element,null).display != "none") return element;
      else if(eleid.indexOf("']") == eleid.length -2) return element;
      else if(eleid == "") return element ;

      else
        eleid = eleid.substring(0, eleid.lastIndexOf("/")).trim();
      c++;
    }
  return element;
                   
}

copyText(text){
  console.log("copyText called with text : ", text);
  this._clipboardService.copy(text);
}

showViewSource(){
  this.extraHTML=null;
  this.extraHTML1=null;
  this.selectectedHTML=null;

    let path = document.getElementById('elementinformation').getAttribute("path");
    this.pageSource = parent.frames[0].document.documentElement.outerHTML;
    if(path){
    var myElement = this.getMyElement(path);  
    this.displaySource=true;
    }
    if(myElement != null && this.pageSource.indexOf(myElement) > -1){
    this.extraHTML1=this.pageSource.split(myElement)[0];
    this.selectectedHTML=myElement;
    this.extraHTML=this.pageSource.split(myElement)[1];


    // this is to scroll to selected HTML
    // commenting it as : if user wants to scroll to see the other or complete html page, it scrolls back to selected html
    // bug id :108832
    // let checkExist = setInterval(function() {
    //   let el= document.getElementById('highdiv');
    //    let em =document.getElementById('dial100');
    //     if(el && em ){
    //          el.scrollIntoView();
    //     }
    //  }, 400);
    // now it will scroll only once to selected HTML
      let checkExist = setTimeout(()=>{
        let el= document.getElementById('highdiv');
        let em =document.getElementById('dial100');
        if(el && em ){
         el.scrollIntoView();
        }
      },500);
    }

    else
    this.extraHTML1= this.pageSource;
  }
 
   getMyElement(id)
  {
    if(id.indexOf("/") > -1)
    {
      var element =<HTMLElement>parent.frames[0].document.evaluate(id,parent.frames[0].document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if(element != null)
       return element.outerHTML;
      else
      {
       var f = id.substr(0,id.lastIndexOf("/"));
       return this.getMyElement(f);
      }
    }
    else
     return  parent.frames[0].document.getElementById(id).outerHTML; 
  }
  
  /*** End */

  setTransparencyLevel(){
    //this.Tranparencyslider=false;
    //this.clickMapSetting=true;
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

   disable_left_click(){
      //modify onevent of frames.
      const me = this;
      console.log("Disabling left click of lower frame.");
      let d = this.replayIframe.nativeElement.contentWindow.document;
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
  let d = this.replayIframe.nativeElement.contentWindow.document;
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
/*

  progressLoop() {
    const me = this;
    const progress = document.getElementById("progress-bar") as HTMLInputElement;
    const timer = document.getElementById("timer");
    const myVideo: any = document.getElementById("my_video_1");
    setInterval(function () {
      progress.value = Math.round((myVideo.currentTime / myVideo.duration) * 100).toString();
      timer.innerHTML = Math.round((myVideo.currentTime / myVideo.duration) * 100).toString() + "%";
      // const totalHours = Math.floor(myVideo.duration / 60 / 60);
      // const totalMinutes = Math.floor(myVideo.duration / 60) - (totalHours * 60);
      // const totalSeconds = Math.floor(myVideo.duration % 60);

      // const hours = String(totalHours).padStart(2, "0");
      // const minutes = String(totalMinutes).padStart(2, "0");      
      // const seconds = String(totalSeconds).padStart(2, "0");

      // const currHours = Math.floor(myVideo.currentTime / 60 / 60);
      // const currMinutes = Math.floor(myVideo.currentTime / 60) - (currHours * 60);
      // const currSeconds = Math.floor(myVideo.currentTime % 60);
      // currHours + ':' + currMinutes + ':' + currSeconds + "/" + hours + ':' + minutes + ':' + seconds      
    });
  }

  playPause() {
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) {
      myVideo.play();
      me.playLabel = 'Play';
      me.playIcon = 'icons8 icons8-material-filled';
    }
    else {
      myVideo.pause();
      me.playLabel = 'Pause';
      me.playIcon = 'icons8 icons8-pause';
    }
  }

  skip(value) {
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.currentTime += value;
  }

  setVolume() {
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    if (myVideo.muted) {
      myVideo.muted = false;
      me.volumeLabel = 'Mute';
      me.volumeIcon = 'icons8 icons8-speaker';
    }
    else {
      myVideo.muted = true;
      me.volumeLabel = 'Unmute';
      me.volumeIcon = 'icons8 icons8-mute';
    }
  }

  restart() {
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.currentTime = 0;
  }

  expandScreen() {
    const myVideo: any = document.getElementById("my_video_1");
    if (myVideo.requestFullscreen) {
      myVideo.requestFullscreen();
    } else if (myVideo.webkitRequestFullscreen) { //* Safari *
      myVideo.webkitRequestFullscreen();
    } else if (myVideo.msRequestFullscreen) { // IE11 *
      myVideo.msRequestFullscreen();
    }
  }

  toggleSettingPanel() {
    const me = this;
    me.isShow = !me.isShow;
  }

  previous(value) {
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.addEventListener("play", me.progressLoop);
    if (value > 0) {
      me.selectedIndex = value - 1;
      //console.log('prevoius if' + me.selectedIndex);
    } else {
      me.selectedIndex = me.data.length;
      //console.log('prevoius else' + me.selectedIndex);
    }

  }
  next(value) {
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.addEventListener("play", me.progressLoop);
    if (value <= me.data.length) {
      me.selectedIndex = value + 1;
      //console.log('next if' + me.selectedIndex);
    } else {
      me.selectedIndex = 0;
      //console.log('next else' + me.selectedIndex);
    }
  }

  listClick($event, selectedVideo) {
    const me = this;
    //console.log(selectedVideo);
    me.selectedVideo = selectedVideo;
  }

*/
}

