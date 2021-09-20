import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import { ReplaySettings } from './../service/replaysettings';
import { ReplayHandler } from '../replay-handler';
import { ReplayUtil } from './../../common/util/replay-utils';
//import { ClipboardService } from 'ngx-clipboard'
import { Clipboard } from '@angular/cdk/clipboard'


declare var clearheatmap;
declare var NVScrollMap;
declare function removeForm():any;

@Component({
  selector: 'app-replay-control',
  templateUrl: './replay-control.component.html',
  styleUrls: ['./replay-control.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReplayControlComponent implements OnInit {
  val: number [];
  playPause :boolean = true;
  dropdown :boolean = false;
  //replayColor
  color1: string = '#2a4e80';
  // replay prev color
  color2: string = '#a60202';
  // simulate page load delay
  val1:boolean = false;
  //Replay unexpected mutation
  val2:boolean = false;
  // Show silent user action count
  val3:boolean = false;
  //Replay auto fill silently
  val4:boolean = true;
  //Skip failed snapshot
  val5:boolean = true;
  // show mouse movement data
  val6:boolean = true;
  skinToggle:boolean = false;
  customspeedrange:any=0.25;
  // audio
  audio_on:boolean = true;
  voices =[];
  @Input() disablefirst:boolean = false;
  @Input() disableprev:boolean = false;
  @Input() disbaleplay:boolean = false;
  @Input() disablenext:boolean = false;
  @Input() disablelast:boolean = false;
  @Input() rd : Document =null;
  @Input() sid : string;
  @Input() isActive ;
  fullscreen : boolean = true;
  @Input() fullscreenTT : string = "Fullscreen";
  @Input() progressbarwidth ;
  @Input() playLabel = 'Play';
  @Input() playIcon = 'icons8 icons8-material-filled';
  @Output() replayexpansion  : EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() forwardreplay  : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() backwardreplay : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() firstpagereplay  : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() lastpagereplay : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() resetMaps : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();


  
  count_mode :number = 1;
  time_mode :number = 0;

  progressbarmode: number = this.count_mode; //count
 
  advancedDropDown:boolean=false;
   time:any;

  autoSpeedType = 0;
  autoSpeedValue = 0;
  actual :number = 0;
  twice : number = 2;
  fourTimes : number = 3;
  radvanc : number = 4;
  customspeed=false;
  rspeed : number = 0;
  radvspeed : number =null; 
  sliderspeed:number = 1;
  voiceDropDown : boolean = false;
  selected_voice = null;
  voiceSelected:any;
  rshare: boolean;
  pointerDropDown: boolean=false;
  pointerclass:any='1';
  volumeLabel = 'Mute';
  volumeIcon = 'icons8 icons8-speaker';
  //playLabel: string;
  //playIcon: string;
  //volumeLabel: string;
  //volumeIcon: string;
  isShow: boolean;
  selectedIndex: number;
  data: any;
  firstTime : boolean = true;
  adv_selected = false;
       
  constructor(private replayHandler :ReplayHandler,private _clipboardService: Clipboard) {
    this.replayHandler = replayHandler;
    let rt = this;
    console.log("paly label : ", this.playLabel , " -- playIcon - -" , this.playIcon);
    this.replayHandler.on('msg').subscribe(response  => 
    {
      //console.log("Replay component response : " , response);
      if(response === null || response === undefined)  return;
      if(response["key"] == "callExpandFrame"){
         rt.expandFull(event);
      } 
    });
  
  }

  ngOnInit() {
    console.log("paly label : ", this.playLabel , " -- playIcon - -" , this.playIcon);
    
    let voicearr = this.replayHandler.voice_options;
    //console.log('voicearr[3].name=',voicearr[3].name)
   
    this.voices =voicearr;
    console.log('this.voices=',this.voices);
    try{
     this.voiceSelected = this.voices[1].name;
    }catch(e){
     if(this.voices.length ==0)
      this.voices = window.speechSynthesis.getVoices();
      this.voiceSelected = this.voices[1].name;
    }
    //console.log("Replay control , voices : ", this.voices);
    this.selected_voice = this.voices[1];
  }
  ngAfterViewInit(){
    /*let a = <HTMLInputElement> document.getElementById("ractual");
    console.log("ngAfterViewInit Called : ", a);
    if(a != null){
      a.checked = true;
    }*/
  }
  showFirstPage(ev){
    if(this.disablefirst == true || (ev && ev.target && ev.target.className && ev.target.className.indexOf("disbaled") != -1))
      return;
    this.firstpagereplay.emit(ev);
  }
  showLastPage(ev){
    if(this.disablelast) return;
    this.lastpagereplay.emit(ev);
  }
  showNextReplay(event)
  {
    if(this.disablenext) return;
    //console.log("emitting event on showNextReplay control: ", event);
    this.forwardreplay.emit(event);
  }
  showPrevReplay(event){
    if(this.disableprev) return;
    //console.log("emitting event on showNextReplay control: ", event);
    this.backwardreplay.emit(event);
  }
  clickEvent(){
    this.playPause = !this.playPause;    
  }

  dropdownEvent(){
    console.log("dropdownEvent method called: ", this.dropdown);
    this.dropdown = !this.dropdown;
    this.voiceDropDown=false;
    this.pointerDropDown=false;
   // this.voiceSelected =null;
    if(this.advancedDropDown ||this.customspeed){
    this.dropdown=false;
    this.advancedDropDown=false;
    this.customspeed=false;
    }
    //if(this.dropdown)
    {
      ReplaySettings.replayColor = this.color1;
      ReplaySettings.replayPrevColor = this.color2;
      ReplaySettings.simulatePageLoadDelay = this.val1;
      ReplaySettings.replayUnexpectedMutation = this.val2;
      ReplaySettings.progresBarMode = this.progressbarmode;
      ReplaySettings.showSilentUserActionCount = this.val3;
      ReplaySettings.replayAutoFillSilently = this.val4;
      ReplaySettings.skipFailedSnapshot= this.val5;
      ReplaySettings.showMouseMoveData = this.val6;
      this.replayHandler.setSilentCount(this.val3);
      this.selectSpeed();
    }    
    console.log(ReplaySettings.showMouseMoveData + '-'+  this.rspeed + " replayColor - " + ReplaySettings.replayColor + " replayPrevColor- " + ReplaySettings.replayPrevColor+ " simulatePageLoadDelay- " +ReplaySettings.simulatePageLoadDelay + " replayUnexpectedMutation- " +ReplaySettings.replayUnexpectedMutation + " progresBarMode- " +ReplaySettings.progresBarMode+ " showSilentUserActionCount- " +ReplaySettings.showSilentUserActionCount+ " replayAutoFillSilently- " + ReplaySettings.replayAutoFillSilently + " skipFailedSnapshot- " +  ReplaySettings.skipFailedSnapshot);
    this.setRS();
  }
selectSpeed()
 {
   console.log("in select speed : ", this.rspeed);
   // actual
   if(this.rspeed == 0)
   {
    ReplaySettings.autoSpeedType = 0;
    ReplaySettings.autoSpeedValue = 1;
   }// fixed
   else if(this.rspeed == 1){
    ReplaySettings.autoSpeedType = 1;
    if(this.radvspeed == null) 
      ReplaySettings.autoSpeedValue = this.sliderspeed * 1000;
    else
      ReplaySettings.autoSpeedValue = Number(this.radvspeed) *1000;
    if(isNaN(ReplaySettings.autoSpeedValue))
       ReplaySettings.autoSpeedValue = 1000;
   }
   // slower
   else if(this.rspeed == 2)
   {
      ReplaySettings.autoSpeedType = 2
      ReplaySettings.autoSpeedValue = 50;
   } //faster
   else if(this.rspeed == 3)
  {
    ReplaySettings.autoSpeedType = 3
    ReplaySettings.autoSpeedValue = 75;
  }// advanced rspeed = 4
  else{
     console.log("in select speed : ", this.radvspeed);
     this.adv_selected = true;
     if(Number(this.radvspeed) != 1){
        ReplaySettings.autoSpeedType = 4;
        ReplaySettings.autoSpeedValue = Number(this.radvspeed);
     }else{
       // case this.radvspeed  == 1
       ReplaySettings.autoSpeedType = 0;
       ReplaySettings.autoSpeedValue = 1;
     }
  }
  console.log("ReplaySettings.autoSpeedType : " , ReplaySettings.autoSpeedType);
  console.log("ReplaySettings.autoSpeedValue : " , ReplaySettings.autoSpeedValue);
}

  videoSkin(){
    this.skinToggle = !this.skinToggle;       
  }
  
  myShareFunction(event: any) {
    //alert("Share Button is clicked");
    //console.log(event);
    // generate token for 7 days (7*24 = 168 hours)
    let validityPeriod = "168:00:00"; 
    let token = null;
    // step 1 : Generate Token
    //let url = '/DashboardServer/web/commons/generateToken?productKey=guest&userName=guest&validityPeriod=' + validityPeriod; 
    this.replayHandler.httpService.getToken(localStorage.getItem('productKey'),"guest",validityPeriod).subscribe(res =>{
     if('errorCode' in res && res['errorCode'] == "7001"){
       alert("Error in generating key from server");
       return;
     }
      token = res['token'];
      token = encodeURIComponent(token);
      
      this.rshare = true;
      this.hideTime();
      //let text = window.location.protocol + "//"+ window.location.host + "/ProductUI/index.html#" + window.location.href.split("#")[1] + "&token=" + token;
      let obj={};
      obj['nvSessionId'] = this.sid;
      obj['isShare'] = "true";
      obj['active']= this.isActive;
      obj['isActive'] = this.isActive;
      obj = escape(JSON.stringify(obj));
      let text = window.location.protocol + "//"+ window.location.host + "/ProductUI/index.html#" + window.location.href.split("#")[1] + "&token=" + token + "&filterCriteria=" + obj + "&isShare=true";
      this._clipboardService.copy(text);
    });
    
 }
 expandFull(ev)
 {
   let bar = <HTMLHtmlElement> document.querySelector("#controlbar");
   this.fullscreenTT = "Fullscreen";
   if(this.fullscreen)
     this.fullscreenTT = "Exit Fullscreen";

    console.log("fullscreenTT : ", this.fullscreenTT);

     if(bar && this.fullscreen)
       bar.style.width = "99%";
     else if(bar){
      // reduce the bar width  
      bar.style.width = "1064px";
      // remove any map , if plotted
     }
      try{
        this.rd = ReplayUtil.getReplayDocument();
        this.removeLoader();
        this.showReplayPointer();
        this.clearAttentionMap();
        this.clearHeatMap();
        this.resetMaps.emit(ev);
        if(typeof NVScrollMap == "undefined")
          NVScrollMap = top["NVScrollMap"];
        NVScrollMap.removeScrollMap();
        this. showCanvas();
        this.clearClickMap();
       }
      catch(e)
       {
          console.log("clearMap exception : " + e);
       } 
       
   this.fullscreen = !this.fullscreen;
   this.replayexpansion.emit(this.fullscreen);
   //removeForm();
   
 }

 /*replaySwitcherHandler(ev){
  if(this.disbaleplay) return;
  console.log("emitting event on PLay control: ", event);
  this.playreplay.emit(ev);
 }*/

 replaySwitcherHandler(event)
 {
    if(event)
      event.preventDefault();
    //if(ReplaySettings.debugLevel > 0)
     //nvreporterdebug('page loading - ' + pageLoading);
 
   if(ReplaySettings.replayMode == 0)
   {
     //Switch MANUAL_REPLAY->AUTO_REPLAY
     ReplaySettings.replayMode = 1;
     this.playLabel = 'Pause';
     this.playIcon = 'icons8 icons8-pause';   
     //Arg - switchMode.
     this.replayHandler.startAutoReplay(true); 
   }
   else {
     //Switch AUTO_REPLAY->MANUAL_REPLAY
     this.playLabel = 'Play';
     this.playIcon = 'icons8 icons8-material-filled';
     //first stop auto replay timer if running.
     this.replayHandler.stopAutoReplayTimer();
     ReplaySettings.replayMode = 0;
     this.replayHandler.startManualReplay();
     
   }
   //dont set replay mode in localStorage
   //this.setRS();
 }
  removeLoader(){
    var x = this.rd.getElementById('load');    
      if(x != null){
        x.remove();
      }
  }
  showReplayPointer(){
    var d = ReplayUtil.getReplayDocument();
    var p = d.getElementById("replaypointer");
    if(p != null)
    p.style.display = "block";
  }
  showCanvas(){
    var d = ReplayUtil.getReplayDocument();
    var p = d.getElementById("replaycanvas");
    if(p != null)
    p.style.display = "block";
  }
  clearAttentionMap()
  {
      // remove canvas
      var x = this.rd.getElementById('myc');    
      if(x != null){
        //this.rd.removeChild(x);
        x.remove();
      }
      // remove overlays
      var x = this.rd.getElementById('overLayParent1');    
      if(x != null){
        //this.rd.removeChild(x);
        x.remove();
      }
      // remove pop overs
      var x = this.rd.getElementById('popOverid');    
      if(x != null){
        //this.rd.removeChild(x);
        x.remove();
      }
      // remove scale image
      var x = this.rd.getElementById('scaleid');    
      if(x != null){
        //this.rd.removeChild(x);
        x.remove();
      }
  }
  clearHeatMap(){
    // remove tool tip div, 
    var x = document.getElementById('tid');    
    if(x != null){
      //this.rd.removeChild(x);
      x.remove();
    }
    // remove scale image
    var x = this.rd.getElementById('scaleid');    
    if(x != null){
      //this.rd.removeChild(x);
      x.remove();
    }

        // remove scale image
    var x = this.rd.getElementById('scaleblue');    
    if(x != null){
      //this.rd.removeChild(x);
      x.remove();
    }
    
    const element = document.getElementById("replayIframe") as HTMLIFrameElement;
    let parentOverlayElement= <HTMLCanvasElement>element.contentWindow.document.getElementsByClassName('heatmap-canvas')[0];
    if(parentOverlayElement){
      parentOverlayElement.style.backgroundColor='';
      parentOverlayElement.style.removeProperty('background-color');
      parentOverlayElement.style.opacity='0.7';
    }

    clearheatmap();
  }
  clearScrollMap(){
    // remove canvas
    var x = this.rd.getElementById('myc');    
    if(x != null){
      //this.rd.removeChild(x);
      x.remove();
    }
    
    NVScrollMap.removeScrollMap();
  }
  setRS(){
    let obj ={};
    for(let i =0; i < Object.keys(ReplaySettings).length; i++){
      let key = Object.keys(ReplaySettings)[i];
      obj[key] = ReplaySettings[key];
    }
    //  set replay mode and speed related configuration as default value. Do not want to save this for next session
    obj["replayMode"] = 0;
    obj["autoSpeedType"]= 1;
    obj["autoSpeedValue"]=1000;
    //let msg = {"key":"settings","data":obj}
    //this.replayHandler.broadcast(msg);
    localStorage.setItem("ReplaySettings",JSON.stringify(obj));
  }
  handleAdvanced($event){
    //console.log('inside handleAdvanced method for advanced');
    //this.dropdown= false;
    this.isShow = false;
    this.advancedDropDown= true;
    this.sliderspeed=null;
  }
  
  handleAdvancedspeed($event)
  {
      this.sliderspeed=null;
      if(Number(this.radvspeed) != 1)
      {
          ReplaySettings.autoSpeedType = 4;
          ReplaySettings.autoSpeedValue = Number(this.radvspeed);
      }else{
         // case this.radvspeed  == 1
         this.rspeed = 0;
         ReplaySettings.autoSpeedType = 0;
         ReplaySettings.autoSpeedValue = 1;
       }
        //console.log('handleAdvancedspeed slider method called' , this.radvspeed);
  }
    
  handleCustomspeed($event){
       this.radvspeed=null;
       this.rspeed = 1;
       this.autoSpeedType = 1 ;
       this.autoSpeedValue = this.sliderspeed*1000;
       this.adv_selected = true;
       //console.log('handleCustomspeed slider method called this.sliderspeed',this.sliderspeed);    
    }
        

  backtoPopUp($event){
    this.isShow= !this.isShow;
    this.advancedDropDown= !this.advancedDropDown;
  }

  openCustom($event){
    this.advancedDropDown= !this.advancedDropDown;
    this.customspeed =! this.customspeed;
  }

  backtoSpeed($event){
     
    this.advancedDropDown= !this.advancedDropDown;
    this.customspeed =! this.customspeed;
  }


  clickOut(ev){
    // if out of the setting panel
    if(!ev.target.classList.contains('setting-panel') && (ev.target.parentElement && ev.target.parentElement.id  && ev.target.parentElement.id != 'settings') && (!ReplayUtil.hasParentClass(ev.target,'setting-panel'))){
    //if(!this.hasParentClass(ev.target,'setting-panel')){  
      this.isShow = false;
      this.advancedDropDown = false;
      this.customspeed = false;
      // hide all the settings and apply all the changes
      this.dropdownEvent();
    }          
  }
  

  audiofn($event){
    console.log("audiofn called : ", this.audio_on);
    this.replayHandler.stop_speaking = false;
    this.audio_on = !this.audio_on;
    if(this.audio_on == false){
      this.replayHandler.stop_speaking = true;
      this.volumeLabel = 'Unmute';
      this.volumeIcon = 'icons8 icons8-mute';
    }else{
      this.volumeLabel = 'Mute';
      this.volumeIcon = 'icons8 icons8-speaker';
    }
  }

  voiceSelection(){
    this.voiceDropDown = !this.voiceDropDown;
    
  }
  setVoice(index,voice){
    //console.log("selected voice : ", index);
    this.selected_voice = this.voices[index];
    this.replayHandler.selected_voice = this.selected_voice;
    this.voiceDropDown = !this.voiceDropDown;
    this.voiceSelected= voice.name;
  }
  
  hideopup(time=0){
    console.log('hidepopup method called');
    this.rshare =false;
    clearTimeout(time);
  }

  hideTime(){
   this.time =setTimeout(() => {
    console.log('inside first showevent');  
    this.hideopup(this.time);
    console.log('7000 mssec after');
    },2500);
  }


  SelectPointer($event){
    this.isShow= false;
    this.pointerDropDown= true; 
}

HandlePointerval($event){
  var d = ReplayUtil.getReplayDocument();
  var ele = d.getElementById("replaypointer"); 
   ele.removeAttribute("class");
   //ele.className=`pointer click-${this.pointerclass}`;
   ele.className = this.pointerclass;
   //this.pointerDropDown= false;
   ReplaySettings.pointer=this.pointerclass;
}


clearClickMap() {
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
  for (let i = 0; i <= counterele.length - 1; i++) {
    let c = <HTMLElement>counterele[i];
    c.style.display = "none";
  }

  var overlayele = doc.getElementsByClassName("nvol");
  for (let i = 0; i <= overlayele.length - 1; i++) {
    let c = <HTMLElement>overlayele[i];
    c.style.display = "none";
  }

  var popovers = doc.getElementsByClassName("nvpopOver");
  for (let i = 0; i <= popovers.length - 1; i++) {
    let c = <HTMLElement>popovers[i];
    c.style.display = "none";
  }

  var popovers = doc.getElementsByClassName("nvoverlaytemp");
  for (let i = 0; i <= popovers.length - 1; i++) {
    let c = <HTMLElement>popovers[i];
    c.style.display = "none";
  }
  document.getElementById("replaycanvas").style.display = "block";

  let parentOverlayElement=<HTMLElement>element.contentWindow.document.querySelector("#overLayParent");
 
  if(parentOverlayElement){
    parentOverlayElement.style.backgroundColor='';
    parentOverlayElement.style.removeProperty('background-color');
    parentOverlayElement.style.opacity='0.7';
  }

}


  ngOnDestroy() {  
    if(this.voices!=null &&this.voices!=undefined)
      this.voices.length=0;  
      clearTimeout(this.time); 

  }


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

  playPause1() {
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
    // added a listerner on document, on clicking outside setting panel will disappear
    if(this.firstTime){
      document.addEventListener('click',(event)=>{this.clickOut(event)});
      this.firstTime = false;
    }
    const me = this;
    me.isShow = !me.isShow;
    me.dropdownEvent();
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
    me.selectedIndex = selectedVideo;
  }
}
