import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import * as moment from 'moment';
import { MappingConfigurationComponent } from '../mapping-configuration/mapping-configuration.component';


@Component({
  selector: 'app-attention-map',
  templateUrl: './attention-map.component.html',
  styleUrls: ['./attention-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttentionMapComponent implements OnInit {

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
  userdata: any;

  lptabledata:any = [];
  showsuggestedtimes:any=[];
  suggestions: any[];
  showDates: boolean;
  etapplied: any;
  parser_failed: boolean;
  stapplied: any;
  @ViewChild('mappingConfigurationSidebar', { read: MappingConfigurationComponent })
  mappingConfigurationSidebar: MappingConfigurationComponent;

  constructor(private stateService: SessionStateService,nvAppConfigService : NVAppConfigService, private route : ActivatedRoute,
    private router: Router, private sanitizer: DomSanitizer, replayHandler : ReplayHandler,nvhttp : NvhttpService) {
      this.replayHandler = replayHandler;
      this.nvhttp = nvhttp;
      this.nvAppConfigService = nvAppConfigService;
    }

    ngOnInit(): void {
      const me = this;
      console.log("attention  component 0 ");
      me.route.queryParams.subscribe(params=>{
        console.log("attention  component 1 ");
        me.initC();
      });
      this.nvhttp.getLPTable().subscribe(state =>{
        if(state instanceof NVPreLoadedState){
           this.lptabledata = state.data;
        }
        console.log(" lptabledata: ",this.lptabledata);
      });
      
    }

    initC(){
      const me = this;
      console.log("initC called in attention map");
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
            //this.getAttentionMapData();
          }); 
     });
}
 // page dump loaded successfully
 afterPageDump(){
  console.log("afterPageDump called");
  this.disable_left_click();
  this.getAttentionMapData();
}

 /** Attention Map handling */
 getAttentionMapData(){
  console.log("getAttentionMapData called");
  this.resetPagedump();
   let screenResolutionStr = "" + this.selectedSession.screenResolution;
   let swidth = screenResolutionStr.substring(0,screenResolutionStr.indexOf("x"));
   // expand the frame

   // add a loader
   this.busy = true;
   // make a canvas in iframe
   this.addCanvas();
   // make request to following url : 
   //http://10.20.0.53:8001/netvision/reports/nvAjaxController.jsp?sessionStartTime=-180467395811&sessionendtime=197964604189&currentPage=Home&strOperName=attentionheatmap&devType=PC&channelid=1&userSegment=0    
   let s = null; let e = null; let duration = null; let time = null;
 
   time = this.calculateTime(this.starttime,this.endttime,this.lasttime); 
   this.stapplied = time["st"];
   this.etapplied = time["et"];
    
      
            
   let pagename = this.pages[this.currentpageindex].pageName.name;
   let pageid = this.pages[this.currentpageindex].pageName.id;
   let devicename = this.selectedSession.deviceType.name;
   let deviceID = this.getDeviceId(devicename);
   let channelid = this.selectedSession.channel.id;
   let usersegmentid = this.selectedSegmentforMap;
   this.showDates = false;
   var rooot = this;
   
   this.nvhttp.getAttentionMapData(time.st,time.et,pagename,deviceID,channelid,usersegmentid).subscribe((state : Store.State) =>{
    if(state instanceof NVPreLoadingState){
        // show loader
        this.busy = true;
    }
    if(state instanceof NVPreLoadedState){
      console.log("data loaded in getAttentionMapData : ", state.data);
      let data = state.data;
      //rooot.closePopup();
      //rooot.expandFrame();
      //let obj = {"key" : "scrollmapsettings", "data" : {type:"scrollmapsettings"}};
      //rooot.replayHandler.broadcast('msg',obj);
      //rooot.drawCanvas();
      //rooot.hideCanvas();
      //NVAttentionMap.showAttentionHeatMap(pagename,channelid,st,et,deviceID,pageid,usersegmentid,response,swidth);
      //this.operateLoader("hide");
      if(data == null && data == "")
          {
             alert("No data for the given timerange");
             this.busy = false;
             this.suggesttimefromlptable(time.st,time.et,this.lptabledata);
             return ;
          }
          if(Object.keys(data["data"]).length == 0)
            {
              //TODO: give some notification failed to draw heatmap.
               alert("No data for the given timerange");
               this.busy = false;
               this.suggesttimefromlptable(time.st,time.et,this.lptabledata);
               return ;
            }
            this.userdata = data;
            this.drawAttentionmap(swidth);
            this.drawAttentionmap(swidth);
            this.createScaleDiv();
            this.hideIcon();
            document.getElementById("replaycanvas").style.display = "none";
            this.busy = false;
    }
   }, (error: Store.State) => {
    if (error instanceof NVPreLoadingErrorState) {   
      console.log("error:", error);
      this.busy = false;
     }
    });
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



drawAttentionmap(swidth)
{
  var win = this.replayIframe.nativeElement.contentWindow;
  var d = win.document;
  var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
  var overLayContainer = <HTMLDivElement> document.createElement("DIV");
  overLayContainer.style.width = "100%";
  var win = this.replayIframe.nativeElement.contentWindow;
  var d = win.document;

  overLayContainer.style.height = ht +'px';
  overLayContainer.style.opacity = 1.7 + "";
  overLayContainer.style.position = "absolute";
  overLayContainer.style.display = "block";
  overLayContainer.style.top = 0 + "";
  overLayContainer.style.left = "0";
  overLayContainer.id="overLayParent1";
  overLayContainer.style.zIndex= "10000000";
   var popOver = document.createElement("span");
   popOver.id = "popOverid";
   popOver.setAttribute("class","nvpopOver");
   popOver.setAttribute("style","font-size : 15px;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;position"
                              +": absolute;background-color : white;color : purple;z-index:10000;border-radius : 3px;visibility:visible;padding-bottom"
                               +": 8px;padding-right : 10px;padding-top : 8px;padding-left : 10px;height;20%;width:15%;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),"
                                                           +"0 6px 20px 0 rgba(0, 0, 0, 0.19);");

  /*try{
   popOver.style.top = event.pageY;
   }
   catch(e)
    {}*/
   popOver.innerHTML = "";
   var k =  this.replayIframe.nativeElement.contentWindow.document.getElementById('popOverid');
   if(k == null)
    this.replayIframe.nativeElement.contentWindow.document.body.appendChild(popOver);

   var f = this.replayIframe.nativeElement.contentWindow.document.getElementById('overLayParent1');
   if(f == null)
   this.replayIframe.nativeElement.contentWindow.document.body.appendChild(overLayContainer);



  $(overLayContainer).mouseover((event)=>
  {
   var j = <HTMLElement> this.replayIframe.nativeElement.contentWindow.document.getElementById("popOverid");
   j.style.display = "block";
   j.style.top = event.pageY + "px";
   j.style.left = (parseInt(swidth) - 250) +'px';
   var rnd = Math.round((event.pageY/ht) * 100);
   if(this.userdata.data[rnd*10] != undefined)
   j.innerHTML = "Average Duration "+(this.userdata.data[rnd*10].avgduration) + " ms";
 });
 $(overLayContainer).mouseout((event)=>
  {
   var j = <HTMLElement> this.replayIframe.nativeElement.contentWindow.document.getElementById("popOverid");
   j.style.display = "none";
  });


  var x = d.getElementById("myc");
  var ctx = x.getContext("2d");
  x.style = "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;";
  x.setAttribute('style', "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;");
  var my_gradient = ctx.createLinearGradient(0, 0, 0, 150);
  this.createAttentionDiv(ctx,my_gradient,ht);
}       


 createAttentionDiv(ctx,my_gradient,ht)
{
  console.log("createAttentionDiv called");
  for(var i = 0;i< Object.keys(this.userdata.data).length;i++)
   {
     if(this.userdata.data[i] !== undefined){
     var rgb =  this.mapIntensityToColor(parseInt(this.userdata.data[i].avgduration),0,parseInt(this.userdata.maxcount["-1"]));
     var color = this.rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
     my_gradient.addColorStop(i/1000, color);
    }
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

 createScaleDiv()
{
  var scale = top.document.createElement('div');
  scale.innerHTML = "<b>Min <img src='/netvision/images/heatmap.png' height=20 width=80%> Max</b>";
  scale.setAttribute('id','scaleid');
  scale.style.cssText = "position:fixed;height:20%;bottom:0;left:20px;z-index:100000";
  scale.setAttribute('style',"position:fixed;height:20%;bottom:0;left:20px;z-index:100000");
 // parent.document.body.appendChild(scale);
  this.replayIframe.nativeElement.contentWindow.document.getElementById('overLayParent1').appendChild(scale);
}

 rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
}

 map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

 componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

hideIcon()
{
   var parentel = this.replayIframe.nativeElement.contentDocument;
   if( parentel.getElementById('replaypointer') !== null)
     parentel.getElementById('replaypointer').style.display = 'none';
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
