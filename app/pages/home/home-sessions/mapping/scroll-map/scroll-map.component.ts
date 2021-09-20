import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SCROLL_MAP } from './service/scroll-map.dummy';
import { ScrollMap } from './service/scroll-map.model';
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
import {ScrollMapService} from './service/scrollmap.service';
import { Store } from 'src/app/core/store/store';
import {  NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../../home-sessions/common/service/nvhttp.service';
import { State } from '@ngrx/store';
import * as $ from 'jquery';
import { ReplaySettings } from '../../play-sessions/service/replaysettings';
import * as moment from 'moment';
import { MappingConfigurationComponent } from '../mapping-configuration/mapping-configuration.component';



@Component({
  selector: 'app-scroll-map',
  templateUrl: './scroll-map.component.html',
  styleUrls: ['./scroll-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScrollMapComponent implements OnInit {
  data: ScrollMap;
  mediaID: string = '1402726504';

  API_ENDPOINT: string = 'https://www.cbc.ca/bistro/order';

  video: any = {
    title: '',
    description: '',
    duration: '',
    key: '',
  };

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  @ViewChild('VideoWidget', { read: ElementRef, static: false })
  VideoWidget: ElementRef;

  onHoverShow: boolean;
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
  iframe_position : string = "absolute";
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

  lptabledata:any = [];
  showsuggestedtimes:any=[];
  suggestions: any[];
  showDates: boolean;
  etapplied: any;
  parser_failed: boolean;
  stapplied: any;
  @ViewChild('mappingConfigurationSidebar', { read: MappingConfigurationComponent })
  mappingConfigurationSidebar: MappingConfigurationComponent;


  constructor(private http: HttpClient,private stateService: SessionStateService,nvAppConfigService : NVAppConfigService,  private route : ActivatedRoute,
    private router: Router, private sanitizer: DomSanitizer, replayHandler : ReplayHandler,nvhttp : NvhttpService, private smService : ScrollMapService) {
      this.replayHandler = replayHandler;
      this.nvhttp = nvhttp;
      this.nvAppConfigService = nvAppConfigService;
    }

  ngOnInit(): void {
    const me = this;
    me.data = SCROLL_MAP;
    //console.log("Scrollmap  component 0 ");
    me.route.queryParams.subscribe(params=>{
      //console.log("Scrollmap  component 1 ");
      me.initC();
    });
    this.nvhttp.getLPTable().subscribe(state =>{
        if(state instanceof NVPreLoadedState){
          this.lptabledata = state.data;
        }
        //console.log(" lptabledata: ",this.lptabledata);
    });
      
    
    
  }
  

  initC(){
    console.log("Scrollmap  component initC called");
    const me =this;
    console.log("last-- " , me.stateService.get("lasttime"));
    console.log("start-- " , me.stateService.get("starttime"));
    console.log("end-- " , me.stateService.get("endtime"));
    me.lasttime = me.stateService.get("lasttime");
    me.starttime = me.stateService.get("starttime")
    me.endttime = me.stateService.get("endtime");
    me.selectedSegmentforMap = me.stateService.get("selectedSegmentforMap");

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
      pageWidth = parseFloat(getComputedStyle(document.body, null).width.replace("px", "")) * 0.95;// * 0.7699;
      pageHeight = parseFloat(getComputedStyle(document.body, null).height.replace("px", ""));

      //console.log("pageWidth : ", pageWidth, " pageHeight : ", pageHeight);
      
      var swidth = Number(scrnResolution.substring(0,scrnResolution.indexOf("x")));
      var sheight = Number(scrnResolution.substring(scrnResolution.indexOf("x")+1,scrnResolution.length));

      //this.swidth = swidth;
      //this.sheight = sheight;
      
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
      if(this.selectedSession.protocolVersion != 1)
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
              //this.busy = false;
              //this.getScrollMapData();
            }); 
       });
  }
  // page dump loaded successfully
  afterPageDump(){
    console.log("afterPageDump called");
    this.disable_left_click();
    this.getScrollMapData();
  }
  //further scroll map procession
  getScrollMapData(){
    console.log("getScrollMapData called");
    let time = this.calculateTime(this.starttime,this.endttime,this.lasttime);
    this.stapplied = time["st"];
    this.etapplied = time["et"];

       let filters = {
        starttime : time.st,
        endtime : time.et,
        deviceType :  this.getDeviceId(this.selectedSession.deviceType.name),
        channelid : this.selectedSession.channel.id,
        currentpage : this.pages[this.currentpageindex].pageName.name,
        pageid : this.pages[this.currentpageindex].pageName.id,
        userSegment : this.selectedSegmentforMap
       };
       this.showDates = false;
       this.smService.LoadScrollMapData(filters).subscribe((state : Store.State) =>{
            if(state instanceof NVPreLoadingState){
                // show loader
                this.busy = true;
            }
            if(state instanceof NVPreLoadedState){
              console.log("data loaded in getScrollMapData");
              this.resetPagedump();
              let data = state.data;
              if(data == null || data == "" || data.length == 0 )
              {
                 alert("No data for the given timerange");
                 this.suggesttimefromlptable(time.st,time.et,this.lptabledata);
                 this.busy=false;
                 return ;
              }
              /*f(JSON.parse(data).length == 0)
              {
               //TODO: give some notification failed to draw heatmap.
                 alert("No data for the given timerange");
                 return ;
              }*/
              var g = data;//JSON.parse(data);
              console.log("showScrollMap called : "+g);
              let uaRecords = [];
              for(var i = 0;i <g.length ;i++)
              {
               if(g[i].ypos > 100) 
                 uaRecords.push(g[i]); 
              } 
              let userdata = data;//JSON.parse(data); 
              
              this.replayIframe.nativeElement.contentDocument.addEventListener('scroll', (event)=> {
                this.onScrollChange(event);
               }, false);
              this.busy = false;
              this.replayCanvas.nativeElement.style.display = "none";
              this.setuserdata(userdata);
              this.drawscrollmap(uaRecords);
              this.drawscrollmap(uaRecords);
              this.fillBookmarkArray();
              this.createNav();
              this.createScaleDiv();
             
            }
       }, (error: Store.State) => {
        if (error instanceof NVPreLoadingErrorState) {   
          console.log("error:", error); 
          this.busy=false;
        }
       })
  }
drawscrollmap(uaRecords)
{
  console.log("drawscrollmap called");
  var win = this.replayIframe.nativeElement.contentWindow;
  var d = win.document;
  var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
  var overLayContainer  = <HTMLDivElement> document.createElement("DIV");
  overLayContainer.style.width = "100%";

  overLayContainer.style.height = ht + "px";
  overLayContainer.style.opacity = '1.7';
  overLayContainer.style.position = "absolute";
  overLayContainer.style.display = "block";
  overLayContainer.style.top = 0 + "px";
  overLayContainer.style.left = 0 + "px";
  overLayContainer.id="overLayParent1";
  d.body.appendChild(overLayContainer);
  this.addCanvas();
  var x = d.getElementById("myc");
  var ctx = x.getContext("2d");
  x.style = "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;";
  x.setAttribute('style', "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;");
  var my_gradient = ctx.createLinearGradient(0, 0, 0, 150);
  this.creatediv(ctx,my_gradient,ht);
}

 creatediv(ctx,my_gradient,ht)
 {

   for(var i = 0;i<= 1000;i++)
   {
    my_gradient.addColorStop(i/1000, this.mainarr[i].color);
   }
   
     ctx.fillRect(0, 0, 1366, ht);
     ctx.fillStyle = my_gradient;

 }

 mapIntensityToColor(intensity, min, max) {
  var cint = this.map(intensity,min,max,0,255);
  var step = ((max - min) / 5);
  if(cint > 204) 
    return [255, this.map(intensity, max-step,max, 255,0), 0];
  if(cint > 153) 
    return [this.map(intensity, max-2*step,max-step, 0,255), 255, 0];
  if(cint > 102) 
    return [0, 255, this.map(intensity, max-3*step,max-2*step, 255,0)];
  if(cint > 51)
    return [0, this.map(intensity, max-4*step,max-3*step, 0,255), 255];
  return [this.map(intensity, min,max-4*step, 255,0), 0, 255];
}





 //var userdata = {};
 setuserdata(userdata)
 {
   console.log("setuserdata called ", userdata);
  var maxCount = 1;  
  
  for(var i =0;i<=1000;i++)
  {
    if(this.mainarr[i] == undefined)
    {
      this.mainarr[i] = {};
      this.mainarr[i].count = 0;
    }

  for(var g = 0 ;g < userdata.length ; g++)
    {
        if(i == userdata[g].ypos)
            this.mainarr[i].count = userdata[g].count;
    }

  }
  //aggregate the records. 
  var sum = 0;

  for(var z = this.mainarr.length-1; z>-1;z--)
  {
    sum += this.mainarr[z].count;
    this.mainarr[z].count = sum;

  }

  for(var i =0;i<this.mainarr.length;i++)
  {
      if(this.mainarr[i].count > maxCount)
        maxCount = this.mainarr[i].count;
  }

  for(var i =0;i<this.mainarr.length;i++)
  {
    this.mainarr[i].percentage = Math.round((this.mainarr[i].count/maxCount) * 100);
    var rgb =  this.mapIntensityToColor(this.mainarr[i].count,0,maxCount);
    this.mainarr[i].color = this.rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
    
  }
}

 getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

 map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

 componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

 rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
}

 removeScrollMap()
{
  var win = this.replayIframe.nativeElement.contentWindow;
  var d = win.document;
  var canvas = null;
  var context = null;
  try{
   canvas = <HTMLCanvasElement> d.getElementById("myc");
   context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  var f =  this.replayIframe.nativeElement.contentDocument.getElementById('overLayParent1');
  if(f != null)
    f.parentElement.removeChild(f);
  var g = this.replayDocument.querySelector("#scaleid");
  var di = this.replayDocument.querySelector("#spanrid");
  if(g != null)
   this.replayIframe.nativeElement.contentDocument.body.removeChild(g);
  if(di != null)
    this.replayIframe.nativeElement.contentDocument.body.removeChild(di);
  this.replayCanvas.nativeElement.style.display = "block";
  }
 catch(e)
  {}
  this.mainarr = []; 
  //$('#overLayParent').remove();
}

 fillBookmarkArray()
{
  console.log("fillBookMarkArray called");
  var prev = 0;
  var bookmark = [];
  for(var z = this.mainarr.length - 1; z >= 0; z--)
  {
        if(this.mainarr[z].percentage == prev) continue;
        if(this.mainarr[z].percentage - prev > 10 || parseInt(this.mainarr[z].percentage) % 10 == 0)
                {
                  bookmark.push({value: this.mainarr[z].percentage, idx: z});
                  prev = this.mainarr[z].percentage;
                }
  }

  //mark the flag.
  for(var z = 0; z < bookmark.length; z++)
  {
     if(z==0)
     {
      this.drawperc(bookmark[z].value,bookmark[z].idx);
       continue;
     }
     if((bookmark[z].value % 10 == 0))
       this.drawperc(bookmark[z].value,bookmark[z].idx); 
     if((z < bookmark.length  && bookmark[z].value  - bookmark[z-1].value < 9))
          continue;
      this.drawperc(bookmark[z].value,bookmark[z].idx);
        //mark(bookmark[z]);
  }
}


// Will be called when user starts dragging an element
_drag_init(elem) {
    // Store the object of the element which needs to be moved
    this.selected = elem;
   // x_elem = x_pos - selected.offsetLeft;
   this.y_elem = this.y_pos - this.selected.offsetTop;
}


f = null;


onScrollChange(ev) {

  var viewPortHeight = 0;
  var window =  this.replayIframe.nativeElement;
  if(window.innerHeight && (document.documentElement || document.body ) && (document.documentElement || document.body ).clientHeight)
    viewPortHeight = Math.min(window.innerHeight ,  (document.documentElement || document.body).clientHeight);
  else if(window.innerHeight)
    viewPortHeight = window.innerHeight;
  else if((document.documentElement || document.body ) && (document.documentElement || document.body ).clientHeight)
    viewPortHeight = (document.documentElement || document.body ).clientHeight;

  var viewPortWidth = 0;
  if(window.innerWidth && (document.documentElement || document.body ) && (document.documentElement || document.body ).clientWidth)
      viewPortWidth = Math.min(window.innerWidth ,  (document.documentElement || document.body).clientWidth);
  else if((document.documentElement || document.body ) && (document.documentElement || document.body ).clientWidth)
      viewPortWidth = (document.documentElement || document.body ).clientWidth;
  else if(window.innerWidth)
      viewPortWidth = window.innerWidth;

  var f = this.replayIframe.nativeElement.contentDocument.getElementById('spanrid');
  var w = window.parent;
  //get the window to scroll
  var scrollwindow = this.replayIframe.nativeElement.contentWindow;
  var win = this.replayIframe.nativeElement.contentWindow;
  var d = win.document;
  var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
  //get the hidden fields area if any
  var hr = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;
  hr = hr + viewPortHeight;
  var rnd = Math.round(hr/ht * 100 );
  //get the hidden fields area if any
  //var hiddenarea = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;
  //document.getElementById('spanrid').innerHTML = "";
  if(f != null && this.mainarr[(rnd*10)] != undefined)
    this.replayIframe.nativeElement.contentDocument.getElementById('userviewtxt').innerHTML = (this.mainarr[(rnd*10)].percentage) +"%";
  if(f != null)
       this.replayIframe.nativeElement.contentDocument.getElementById('userviewscroll').innerHTML = rnd +"%";
   
}

 createDivScale()
{
 var sp = <HTMLSpanElement>document.createElement('span');
 //CHECK IT ONCE
 sp.style.cssText =  "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;left:-200px;z-Index:1000;display:block;height:";
 sp.style.top = "74%";
 sp.style.left="0px";
 sp.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;z-Index:1000;display:block;top:74%;left:0px");
 sp.setAttribute('top', '74%');
 sp.setAttribute('left','0px'); 
 sp.id = 'spanrid';
 console.log("createDivScale , userAgent : " , this.selectedSession.userAgent);
  if(this.selectedSession.userAgent !== null && this.selectedSession.userAgent !== undefined)
  {
    if(this.selectedSession.userAgent.toLowerCase().indexOf("mobile") > -1 ||  this.selectedSession.userAgent.toLowerCase().indexOf("iphone") > -1)
    {
     sp.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;z-Index:1000;display:block;top:92%;left:0px");
    }
  }
 sp.setAttribute('class','spr');
 sp.innerHTML = "<span id='userid' style='font-size:14px' ><b>User View </b></span><span id='userviewtxt'>100%</span><br><span style='font-size:14px'  id='scrollid'><b>Scroll Position </b></span><span id='userviewscroll'>0%</span></span>";
  this.replayIframe.nativeElement.contentDocument.getElementById('overLayParent1').appendChild(sp);
}

drawperc(val,i)
{
    var win = this.replayIframe.nativeElement.contentWindow;
    var d = win.document;
    var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);

    var f = <HTMLDivElement>document.createElement('div');
    f.setAttribute('class','btn btn-primary');
    f.innerHTML = val + "%" ;
    f.style.cssText = "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:7%;position:absolute;margin-left:85%;z-Index:10000";
    f.id = 'val'+i;

    f.style.top  = ((parseInt(i) * ht )/1000).toString(); 
    let tp = ((parseInt(i) * ht )/1000) ;
    f.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:7%;position:absolute;margin-left:85%;z-Index:10000;top:"+ tp+"px");
    var win = this.replayIframe.nativeElement.contentWindow;
    var d = win.document;
    var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
    this.tempDiv(i,ht);

    $(f).mouseenter((event)=>
    {
      this.showTempDiv(event,val,i,ht);
    });

    $(f).mouseleave((event)=>
    {
      this.hideTempDiv(i);
    });

    this.replayIframe.nativeElement.contentDocument.getElementById('overLayParent1').appendChild(f);
}

tempDiv(i,ht)
{
  var popOver = document.createElement("span");
   popOver.id = "popover" + i;
   popOver.setAttribute("class","nvpopOver");
   popOver.setAttribute("style","font-size : 15px;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;position"
                              +": absolute;background-color : skyblue;color : purple;z-index:10000;border-radius : 3px;visibility:visible;padding-bottom"
                               +": 8px;padding-right : 10px;padding-top : 8px;padding-left : 10px;width:15%;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),"
                                                           +"0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-left:63%");
   popOver.style.display = "none";
   this.replayIframe.nativeElement.contentDocument.getElementById('overLayParent1').appendChild(popOver);
}

 showTempDiv(event,val,i,ht)
{  
    var popOver = this.replayIframe.nativeElement.contentDocument.getElementById("popover" + i);
    if(!popOver) return;
    var scrl = this.replayIframe.nativeElement.contentDocument.getElementById('val'+i);
    var rnd = (parseInt(scrl.style.top)/ht * 100 );
    popOver.style.display = "block";
    popOver.innerHTML = " User View "+val +"%<br> Scroll Position " + rnd.toFixed(2) + "%";
    popOver.style.top = event.pageY + "px";
}

 hideTempDiv(i)
{
  var popOver = this.replayIframe.nativeElement.contentDocument.getElementById("popover" + i);
    if(!popOver) return;
  popOver.style.display = "none";
}

 createScaleDiv()
{
  var scale = document.createElement('div');
  scale.innerHTML = "<b>Min <img src='/netvision/images/heatmap.png' style='width:50%;height:25px'> Max</b>";
  scale.setAttribute('id','scaleid');
  scale.setAttribute('style',"position:fixed;top:68%;left:20px;z-index:1000");
  let userAgent = this.selectedSession.userAgent;
  if(userAgent !== null && userAgent !== undefined)
  {
    if(userAgent.toLowerCase().indexOf("mobile") > -1 ||  userAgent.toLowerCase().indexOf("iphone") > -1)
    {
     scale.setAttribute('style',"position:fixed;top:84%;left:20px;z-index:1000");
    }
  }
  this.replayIframe.nativeElement.contentDocument.body.appendChild(scale);
}

 createNav()
{
 var g = document.createElement('div');
 g.id = 'draggable-element';
 g.style.cssText ='border-top: 20px solid transparent;border-right: 40px solid blue;border-bottom: 20px solid transparent;position:absolute;z-index:20030;width: 0px;height: 0px;left:0px';
 var op = this.replayIframe.nativeElement.contentDocument.getElementById('overLayParent1');
 op.appendChild(g);
 
 //hideIcon();
 var parentel = this.replayIframe.nativeElement.contentDocument;
 // Bind the s...
 parentel.getElementById('draggable-element').onmousedown=() =>{
  this._drag_init(parentel.getElementById('draggable-element'));
    return false;
};
//var maxScroll = $(parent.frames[0].document).height();
//var maxWindow = $(parent.frames[0]).innerHeight;
var f = parentel.getElementById('draggable-element');
//parent.frames[0].document.body.style.overflow = "hidden";
 var sp = document.createElement('span'); 
 sp.style.cssText = "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:absolute;left:3px;z-Index:10020;top:2px;display:none";
  //sp.style.top = event.pageY;
   sp.id = 'spanview';
   sp.setAttribute('class','spr');
   //parent.frames[0].document.getElementById('overLayParent1').appendChild(sp);
   parentel.getElementById('draggable-element').appendChild(sp);
   var tp = parentel.getElementById('draggable-element');
   sp.innerHTML = "User View <span>100<br> Scroll Position<span> 0%</span>";
 $(f).mousemove((event)=>
 {
    //if((parent.frames[0].innerHeight + $(parent.frames[0].window).scrollTop()) >= maxScroll) return;
    //_move_elem(event);
    // x_pos = document.all ? window.event.clientX : e.pageX;
    this.x_pos = 90;
    //y_pos = document.all ? window.event.clientY : e.pageY;
    this.y_pos = event.pageY;
    if (this.selected !== null && this.selected != undefined) {
       // selected.style.left = (x_pos - x_elem) + 'px';
       this.selected.style.top = (this.y_pos - this.y_elem) + 'px';
    }

    var hr = parseInt(tp.style.top);
    var win = this.replayIframe.nativeElement.contentWindow;
    var d = win.document;
    var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
    var rnd = Math.round(hr/ht * 100 );
    if(this.mainarr[(rnd*10)] != undefined){
         sp.innerHTML = "User View " + (this.mainarr[(rnd*10)].percentage).toFixed(2) + "%<br> Scroll Position"+ rnd.toFixed(2) +"%";
    }
 });
  $(f).mouseup((event)=>
  {
      //_destroy(event);
      this.selected = null;
  });

  $(f).mouseover((event)=>
  {
    sp.style.display = 'block'
  });
  $(f).mouseout((event)=>
  {
    sp.style.display = 'none';
  });
}

 hideIcon()
{
   var parentel = this.replayIframe.nativeElement.contentDocument;
   if( parentel.getElementById('replaypointer') !== null)
     parentel.getElementById('replaypointer').style.display = 'none';
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
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
  
  suggesttimefromlptable(st,et,lpdata){
    
    let stc= st/1000;
    let etc= st/1000;
    console.log('suggesttimefromlptable called with st ,et',st,et,stc,etc,lpdata);
  
    //finding all the rows with a particular parser name
    let similarparser=lpdata.filter(onerow => onerow.parsername == 'NVAggregateHeatMapTable');
    if(similarparser.length==0){
      alert('no data in lptable as well');
      return;
    }
  
    //let newdbdates=[223583400,223929000,224361000,226261800,226780200];
    //let newdbdates=[223583400,223929000];
    let newdbdates=[];
    const startendmap = new Map();
    //startendmap.set(223583400,223929000);
  
    //making a array of starttime and lasttime values 
    similarparser.map(((obj)=>{
      newdbdates.push(Number(obj.starttime));
      newdbdates.push(Number(obj.endtime));
      startendmap.set(Number(obj.starttime),Number(obj.endtime));
    }))   
  
    console.log('newdbdates=',newdbdates);
  
    /**
      filtering array on the basis received from user in gui,all the starttimes and endtimes
      in array of newdbdate will be compared to the value inputed from gui and then separte arrays
      will be formed which will be merged latter
    **/  
    var beforedates0 = newdbdates.filter(function(d) {
      return d - stc < 0;
    });
    
    var beforedates1 = newdbdates.filter(function(d) {
      return d - etc < 0;
    });
      
  
    var enddates1 = newdbdates.filter(function(d) {
      return d - etc > 0;
    });
      
  
    var enddates0 = newdbdates.filter(function(d) {
      return d - stc > 0;
    });
     
  
    let allbefore=beforedates0.concat(beforedates1);
    let allafter= enddates0.concat(enddates1);
   
    //all values shorter than starttime are in sorted format
    allbefore=  Array.from(new Set(allbefore));
    allbefore=allbefore.sort((a, b) => a - b);
  
    //all values greater than endttime are in sorted format
    allafter=  Array.from(new Set(allafter))
    allafter=  allafter.sort((a, b) => a - b);
    console.log('allbefore--',allbefore,'allafter--',allafter);
    console.log('startendmap',startendmap);  
    let starttimes=[];
    let endtimes=[];
    let datatoshow=[];
    let mapsize=startendmap.size;
    let len =allbefore.length-1;
    let index =0;
    
   
    //forming pairs of values from these sorted arrays pair will be of starttime and endtime values from newdbdates array
  
    while(index<2){
   
     /**
     selecting largest values from before will give us closest value to starting time 
     hence the from the last of before arrray value is selected,then it its index
     was found in the main dbdates array ,if index was even that means it was last time
     hence we need to find out the start time corresponding to it in dbdatesarray.
     so the way we have pushed values in newdbdates array is start and last hence 
     starttime value will be at -1 index conrresponding to endtime value.
    if value we slected from before array is at event index in newdbdates array
    that means it was starttime value than its paired value in newdbdates array will 
    be at +1 index in comparison to this.
     **/ 
  
       let eleofallbefore=allbefore[len-index];
       let indexindbarray=newdbdates.indexOf(eleofallbefore);
       
       if(indexindbarray==-1){
        index++;
        continue;
       }
      
  
       if((indexindbarray==0 || indexindbarray%2==0)){ 
         let pair= ''+eleofallbefore+','+''+newdbdates[indexindbarray+1];
         starttimes.push(pair);
       }
       else
       {
          let pair= ''+newdbdates[indexindbarray-1]+','+''+eleofallbefore;
          starttimes.push(pair);
       }
      
      let eleofallafter=allafter[index];
      let indexindbarr=newdbdates.indexOf(eleofallafter);
      if(indexindbarr==-1){
        index++;
        continue;
      }
      if((indexindbarray==0 || indexindbarray%2==0)){
      let pair =''+eleofallbefore +','+''+newdbdates[indexindbarray+1];
      endtimes.push(pair);
      }
      else
      {
        let pair =''+newdbdates[indexindbarr-1]+','+''+eleofallafter;
      endtimes.push(pair);
      } 
      index++;
    }
    console.log('pairs',starttimes,'---qw',endtimes);
    let allpairs=starttimes.concat(endtimes);
    console.log('all joined pairs',this.showsuggestedtimes);
    this.showsuggestedtimes = Array.from(new Set(allpairs));
    console.log('after removing duplicates',this.showsuggestedtimes);
    this.suggestions =[];
    for(var i =0 ; i< this.showsuggestedtimes.length; i++){
      var time = this.showsuggestedtimes[i].split(",");
      var obj = {};
      for(var j=0; j < time.length; j++){
        var d = (Number(time[j]) + this.nvconfigurations.cavEpochDiff) * 1000;
        var dateobj = new Date(d);
        if(j == 0)
          obj["st"] = window["toDateString"](dateobj);
        else
          obj["et"] = window["toDateString"](dateobj);
      }
      this.suggestions.push(obj);
    }
    console.log("suggestions ::: ", this.suggestions);
    this.showDates = true;
    this.mappingConfigurationSidebar.open();
    // show suggested time duration and also start parsers
    this.startParser();
  }
  
  startParser(){
      let st = (Number(this.stapplied)/1000) + this.nvconfigurations.cavEpochDiff;
      let et = (Number(this.etapplied)/1000) + this.nvconfigurations.cavEpochDiff;
      st =  moment.tz(new Date(st*1000),sessionStorage.getItem('_nvtimezone')).format('MM/DD/YY  HH:mm:ss');
      et = moment.tz(new Date(et*1000),sessionStorage.getItem('_nvtimezone')).format('MM/DD/YY  HH:mm:ss');
      console.log(" this.stapplied : ", this.stapplied, + " st : " + st + " this.etapplied : " + et);
      let debug_file ="nvaggregatemapparser_standalone.log ";
      // first check how many enteries done in .nvMapParser.json
      // start the parser
      this.nvhttp.startParser(st,et,debug_file).subscribe((state :any) =>{
        if(state instanceof NVPreLoadedState){
          let response = state.data;
          if(response.status != "SUCCESSFULL")
            this.parser_failed = true;     
        }
      });
  
  }

}
