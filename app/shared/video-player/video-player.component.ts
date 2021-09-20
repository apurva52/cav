import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { HttpClient } from '@angular/common/http';
import { VideoInfo } from './service/video-data.model';
import { VIDEO_DATA } from './service/video-data.dummy';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPlayerComponent implements OnInit {

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

  items: MenuItem[];

  data: VideoInfo[];

  constructor(private http: HttpClient) { } 

  ngOnInit(): void {
    const me = this;
    me.items = [
      {label: 'Google US English'},
      {label: 'Google हिन्दी'}
    ];

    const myVideo: any = document.getElementById("my_video_1");
    myVideo.addEventListener("play", me.progressLoop);

    me.data = VIDEO_DATA;     
  }
  
  progressLoop() {
    const me = this;
    const progress = document.getElementById("progress-bar") as HTMLInputElement;
    const timer = document.getElementById("timer");
    const myVideo: any = document.getElementById("my_video_1");
    setInterval(function () {
      progress.value = Math.round((myVideo.currentTime / myVideo.duration) * 100).toString();
      timer.innerHTML =   Math.round((myVideo.currentTime / myVideo.duration) * 100).toString() + "%";
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
    if (myVideo.paused){
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

  setVolume(){
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    if (myVideo.muted) {
  		myVideo.muted = false;
      me.volumeLabel = 'Mute';
      me.volumeIcon =  'icons8 icons8-speaker';
  	}
  	else {
  		myVideo.muted = true;
      me.volumeLabel = 'Unmute';
      me.volumeIcon =  'icons8 icons8-mute';
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
    } else if (myVideo.webkitRequestFullscreen) { /* Safari */
      myVideo.webkitRequestFullscreen();
    } else if (myVideo.msRequestFullscreen) { /* IE11 */
      myVideo.msRequestFullscreen();
    }
  }  

  toggleSettingPanel(){
    const me = this;
    me.isShow = !me.isShow;
  }

  previous(value){
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.addEventListener("play", me.progressLoop);
    if (value > 0) {
      me.selectedIndex = value -1;
      console.log('prevoius if' + me.selectedIndex);
    } else {
      me.selectedIndex = me.data.length;
      console.log('prevoius else' + me.selectedIndex);
    }
   
  }
  next(value){
    const me = this;
    const myVideo: any = document.getElementById("my_video_1");
    myVideo.addEventListener("play", me.progressLoop);
    if (value <= me.data.length) {
      me.selectedIndex = value + 1;
      console.log('next if' + me.selectedIndex);
    } else {
      me.selectedIndex = 0;
      console.log('next else' + me.selectedIndex);
    }
  }
}
