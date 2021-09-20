import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { ReplayService } from '../play-sessions/service/replay.service';
import { SessionStateService } from '../session-state.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MappingComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  constructor(private stateService: SessionStateService,private replayService: ReplayService) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Sessions' },
      { label: 'Mapping' },
    ]
    me.items = [
      {label: 'Click Map', routerLink: '/mapping/click-map'},
      {label: 'Navigation Map',  routerLink: '/mapping/navigation-map'},
      {label: 'Scroll Map', routerLink: '/mapping/scroll-map'},
      {label: 'Heat Map', routerLink: '/mapping/heat-map'},
      {label: 'Attention Map', routerLink: '/mapping/attention-map'},
  ];
  console.log("session-- " , this.stateService.get("session"));
  }


  navigate_to_replay(){
      console.log("navigate_to_details called : ", this.stateService.get("session"));
      //this.router.navigate(['/play-sessions'],{ queryParams: { selectedSession : JSON.stringify(this.selectedRow),random: Math.random()}, replaceUrl : true});
      //let msg = "session with sid : " + this.selectedRow.sid;
      //this.replayService.console("log", "openReplay1", msg);
      let s = this.stateService.get("session");
      let sid = s.sid;
      this.replayService.openReplay(sid, null/*session*/, null/*pages*/, 0/**index */, null/**pageinstance */, false);
    
  }
}
