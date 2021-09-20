import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PageDump } from '../../common/interfaces/pagedump';
import { PageInformation } from '../../common/interfaces/pageinformation';
import { Session } from '../../common/interfaces/session';
import { NvhttpService } from '../../common/service/nvhttp.service';
import { SessionStateService } from '../../session-state.service';

@Component({
  selector: 'app-page-dump',
  templateUrl: './page-dump.component.html',
  styleUrls: ['./page-dump.component.scss']
})
export class PageDumpComponent implements OnInit {

  constructor(private route: ActivatedRoute, private stateService: SessionStateService, private http : NvhttpService, private sanitizer: DomSanitizer) { }
  
  selectedPage: PageInformation;
  selectedSession : Session;
  srcpath : any;
  flag :any;
  fullscreen = false;
  pagedump: PageDump;
  base :any; 
  max:boolean = true;
  min:boolean = false;

  ngOnInit(): void {
    const me = this;
    me.base = environment.api.netvision.base.base;
    me.srcpath =  this.sanitizer.bypassSecurityTrustResourceUrl(me.base+'netvision/reports/loadingPageDump.html');
    console.log("ngOninit me.srcpath : ", me.srcpath);
    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('user-action, page change - ', idx);

      me.reload();
    });

    me.reload();
  }
  
  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.selectedPage = me.stateService.getSelectedSessionPage();
    let pageInstance = this.selectedPage.pageInstance;
      console.log("---Anjali---",this.selectedPage ,this.selectedSession,pageInstance)
    this.pagedump = new PageDump('NA', this.selectedSession, pageInstance , this.http, this.selectedPage, this.sanitizer);
    this.pagedump.getPageDump();
  }

  setDumpFlag()
  {
      let frame_elm = document.getElementById('pagedumpid');
      let pd = document.getElementById("pagedumpdiv");
      if(frame_elm == null) return;
      let srcpath = frame_elm["src"];
      if(srcpath  && srcpath != "" && srcpath.indexOf("noPageDump") != -1)
      {
        this.flag = "noPageDump";
        if(pd)
          pd["style"]["display"] = "none";
      }
      else
      {
        if(pd)
          pd["style"]["display"] = "";
        this.flag = srcpath;
      }
      console.log("setDumpFlag  this.flag ============= > ",   this.flag);
  }


  toggleFullscreen()
  {
    if(this.fullscreen === false){
      this.fullscreen = true; 
      this.min = true; 
      this.max = false;
      this.toggleMenuOption("none");     
      
    }
    else{
      this.fullscreen = false;
      this.min= false; 
      this.max = true;
      this.toggleMenuOption("");   

    }
  }

  toggleMenuOption(prop)
  {
     var menus = document.querySelectorAll('.mat-drawer-inner-container');
     for(var i=0; i < menus.length; i++)
     {
       menus[i]["style"]["display"] = prop;
     }
    
    
  }

}
