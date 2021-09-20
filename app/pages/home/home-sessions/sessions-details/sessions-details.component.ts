import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResizedEvent } from 'angular-resize-event';
import { Session } from './../common/interfaces/session';
import { MenuItem } from 'primeng';
import { DataManager } from '../common/datamanager/datamanager';
import { SessionStateService } from '../session-state.service';
import { ReplayService } from '../play-sessions/service/replay.service';
import { HomeSessionService } from '../service/home-sessions.service';
import { SessionFilter } from '../common/interfaces/sessionfilter';
import { Store } from 'src/app/core/store/store';
import { HomeSessionsLoadedState, HomeSessionsLoadingErrorState, HomeSessionsLoadingState } from '../service/home-sessions.state';
import { MetadataService } from '../common/service/metadata.service';
import { Metadata } from '../common/interfaces/metadata';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { DrillDownDDRService } from '../common/service/drilldownddrservice.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { first } from 'rxjs/operators'; 
import { NvhttpService } from './../../home-sessions/common/service/nvhttp.service'; 
import { MessageService } from 'primeng/api'; 


@Component({
  selector: 'app-sessions-details',
  templateUrl: './sessions-details.component.html',
  styleUrls: ['./sessions-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionsDetailsComponent implements OnInit {
  items: MenuItem[];
  downloadOptions: MenuItem[];
  isShow: boolean = true;
  selectedSession: Session;
  selectedSessionIdx = 0;
  sessions: Session[];
  activeSession = false;
  lastTab: string = 'SESSION DETAILS';
  singleSessionMode = false;
  metadata: Metadata;
  loading = true;
  from : string;
   filter: any;
  nvconfigurations : any;
  activeindex:number; 
  breadcrumb: BreadcrumbService;
  activeItem : any; 
  ///taken--
  status: any;
  responseForScript = false;
  executeResponse = null;
  data4 = null;
  msg = null;
  rowdata: any;
  testcasename: any;
  testcase: boolean = false;
  filterhtml: string = '';
  //filterItems: MenuItem[];
  
  constructor(private route: ActivatedRoute, private router: Router, private stateService: SessionStateService, private replayService: ReplayService, private homeSessionService: HomeSessionService,
    private _location: Location, private metadataService: MetadataService, private nvAppConfigService: NVAppConfigService, private ddrService: DrillDownDDRService, breadcrumb: BreadcrumbService, private nvHttp: NvhttpService ,
    private messageService: MessageService,) {
      this.breadcrumb = breadcrumb;
      this.metadataService.getMetadata().subscribe(e => {
        this.metadata = e;
      });
      this.nvAppConfigService.getdata().subscribe(response => {
        this.nvconfigurations = response;
  
      });
    }

  ngOnInit(): void {
    const me = this;
     me.activeindex = 0;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];
    me.items = [
      { label: 'SESSION DETAILS', command: (event: any) => { this.navigate_to_details(); } },
      { label: 'PAGES', command: (event: any) => { this.navigate_to_page(); } },
      { label: 'CUSTOM METRICS', command: (event: any) => { this.navigate_to_cm(); } },
    ];

    this.activeItem = this.items[0];
    this.route.queryParams.subscribe(params => {
      console.log('sessions-detail, params change - ', params);
     if(params.tabindex)
      this.activeindex = 1;
      const sid = params['sid'];
      this.from = params['from'];
      this.filter = params['filter'];
      // if it is ddr to session details from any window open session details,
      // right now , it remembers the last tab opened, so reseting it
      //todo: handle if any specific tabs needs to be selected
      this.activeItem = this.items[0];

      if (!sid) {
        // If it is already loaded then return. 
        if (this.loading)
          me.reload();
        else 
          return;
      } else {
        // load data for given sid. 
        let sessionFilter = new SessionFilter();
        sessionFilter.nvSessionId = sid + '';
        // FIXME: handling for active/complete session detection.
        
        this.homeSessionService.LoadSessionListTableData(sessionFilter, false, false).subscribe(
          (state: Store.State) => {
            if (state instanceof HomeSessionsLoadedState) {
                if (!state.data.data || !state.data.data.length) {
                  //TODO: toast error.
                  console.error('No data found for sid - ' +  sid + ', going back');
                  this._location.back();
                }
                this.singleSessionMode = true;

                const sessions = state.data.data.map(a => {
                  let session: Session = new Session(a, this.metadata, state.isActive);
          
                  DataManager.addSession(session.sid);
                  return session;
                });

                // save in state service.
                //TODO: Review this code again.
                this.stateService.set('sessions.data', sessions);

                this.stateService.set('isActive', state.isActive);

                // removing saved session filter criteria.
                this.stateService.set('sessions.filterCriteria', null);

                this.stateService.set('sessions.selectedSessionIdx', 0);

                this.reload();
            } else if (state instanceof HomeSessionsLoadingErrorState) {
              // TODO: throw error using toast. 
              console.error('Error in loading data for sid - ' +  sid);

              //native to backward.
              this._location.back();
            } else if (state instanceof HomeSessionsLoadingState) {
              this.loading = true;
            }
          }
        )
      }
      
    });



    // set a observer to detect selected session change. 
    this.stateService.on('sessions.selectedSessionIdx').subscribe((idx: number) => {
      console.log('sessions-detail, session change - ', idx);
      this.singleSessionMode = false;
      me.reload();
    })

    // if any tab is selected
    let selectedTab = this.stateService.get('selectedTab');
    if(selectedTab){
      if(selectedTab == "detail"){
        this.activeItem = this.items[0];
         this.navigate_to_details();
      }
      else if(selectedTab == "page"){
        this.activeItem = this.items[1];
        this.navigate_to_page();
      }
      else if(selectedTab == "custom")
      {
        this.activeItem = this.items[2];
        this.navigate_to_cm();
      }
    }

    
  }
  exportSessiondetail() {
    console.log('exportSessiondetail ', this.selectedSession.sid);
    let sid = this.selectedSession.sid;
    //let timeFilter = ParseSessionFilters.sessionFilters.timeFilter;
    //let stime = timeFilter.startTime;
    //let etime = timeFilter.endTime;
    //let last = timeFilter.last;
    let timezoneflag = "Asia/Kolkata";
    let url = "/netvision/rest/webapi/exportsession?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    url += "&sid=" + sid + "&timezoneflag=" + timezoneflag;
    console.log(' selectedRow url ', url);
    window.open(url);
  }
  reload() {
    // get data from stats. 
    // TODO: handle null condition. 
    this.sessions = this.stateService.get('sessions.data', []);
    this.selectedSessionIdx = this.stateService.get('sessions.selectedSessionIdx', 0);
    if (this.selectedSessionIdx == null)
      this.selectedSession = null;
    else
      this.selectedSession = this.sessions[this.selectedSessionIdx];

    this.items.splice(3, 4);
    if (this.selectedSession.browser.id === 10 || this.selectedSession.browser.id === 21) {
     this.items = [];
      this.items.push(
        { label: 'SESSION DETAILS', command: (event: any) => { this.navigate_to_details(); } },
        { label: 'PAGE', command: (event: any) => { this.navigate_to_page(); } },
        { label: 'CUSTOM METRICS', command: (event: any) => { this.navigate_to_cm(); } },
        { label: 'APP CRASH', command: (event: any) => { this.navigate_to_crash(); } },
        { label: 'DEVICE INFO', command: (event: any) => { this.navigate_to_device_info(); } },
        { label: 'METHOD TRACE', command: (event: any) => { this.navigate_to_method_trace(); } },
        { label: 'LOCATION INFO', command: (event: any) => { this.navigate_to_location_info(); } },
        { label: 'DEVICE PERFORMANCE', command: (event: any) => { this.navigate_to_device_perf(); } }
      )
    }
    if (this.selectedSession.browser.id === 9) {
      this.items = [];
      this.items.push(
        { label: 'SESSION DETAILS', command: (event: any) => { this.navigate_to_details(); } },
        { label: 'PAGE', command: (event: any) => { this.navigate_to_page(); } },
        { label: 'CUSTOM METRICS', command: (event: any) => { this.navigate_to_cm(); } },
        { label: 'APP CRASH', command: (event: any) => { this.navigate_to_crash(); } },
        { label: 'DEVICE INFO', command: (event: any) => { this.navigate_to_device_info(); } },
        { label: 'LOCATION INFO', command: (event: any) => { this.navigate_to_location_info(); } }
      )
    }
    if (this.selectedSession.browser.id === 20) {
      this.items = [];
      this.items.push(
        { label: 'SESSION DETAILS', command: (event: any) => { this.navigate_to_details(); } },
        { label: 'PAGE', command: (event: any) => { this.navigate_to_page(); } },
        { label: 'CUSTOM METRICS', command: (event: any) => { this.navigate_to_cm(); } },
        { label: 'APP CRASH', command: (event: any) => { this.navigate_to_crash(); } },
        { label: 'DEVICE INFO', command: (event: any) => { this.navigate_to_device_info(); } }
      )
    }

    // set breadcrumb.
    this.breadcrumb.getBreadcrumbMenu().pipe(first()).subscribe((items: MenuItem[]) => {

      // search for Session Id, if present then remove that and add this.
      items.some((item, idx) => {
        if (item.label.indexOf('Session Id -') == 0) {
          this.breadcrumb.removeFrom(idx-1);
          return true;
        }
      });

      this.breadcrumb.add({
        label: `Session Id - ${this.selectedSession.sid}`,
        routerLink: '/sessions-details',
        queryParams: { from: 'breadcrumb' }
      } as MenuItem);
    });

    this.loading = false;
  }
   
    navigate_to_jserror() {
    this.router.navigate(['/jserror-detail'], { replaceUrl: true, queryParams: { filterCriteria: this.filter } });
  }
  //rearrange layout
  onResized(event: ResizedEvent) {
    window.dispatchEvent(new Event('resize'));
  }

  navigate_to_details() {
    this.lastTab = 'SESSION DETAILS';
    this.router.navigate(['/sessions-details/session-page-details'], { replaceUrl: true });
  }
  navigate_to_page() {
    this.lastTab = 'PAGE';
    this.router.navigate(['/sessions-details/session-page'], { replaceUrl: true });
  }
  navigate_to_cm() {
    this.lastTab = 'CUSTOM METRICS';
    this.router.navigate(['/sessions-details/custom-metrics'], { replaceUrl: true });
  }
  navigate_to_crash() {
    this.lastTab = 'APP CRASH';
    this.router.navigate(['/sessions-details/app-crash'], { replaceUrl: true });
  }
  navigate_to_device_info() {
    this.lastTab = 'DEVICE INFO';
    this.router.navigate(['/sessions-details/device-info'], { replaceUrl: true });
  }
  navigate_to_location_info() {
    this.lastTab = 'LOCATION INFO';
    this.router.navigate(['/sessions-details/location-info'], { replaceUrl: true });
  }
  navigate_to_device_perf() {
    this.lastTab = 'DEVICE PREF';
    this.router.navigate(['/sessions-details/device-preference'], { replaceUrl: true });
  }
  navigate_to_method_trace() {
    this.lastTab = 'METHOD TRACE';
    this.router.navigate(['/sessions-details/method-trace'], { replaceUrl: true });
  }

  handleSessionChange(idx: number) {
    console.log('Session Change, Idx - ' + idx);

    if (idx > this.sessions.length) {
      console.error('Invalid Session Selected, Idx - ', idx);
      return;
    }

    this.selectedSessionIdx = idx;
    this.selectedSession = this.sessions[this.selectedSessionIdx];

    // check for last tab. 
    let lastTabInfo = this.items[0];
    if (this.lastTab != null && this.lastTab != 'SESSION DETAILS') {
      this.items.some(item => {
        if (this.lastTab == item.label) {
          lastTabInfo = item;
          return true;
        }
      });
    }

    // Open Selected tab. 
    lastTabInfo.command();
  }
   Navigate_Home_Sessions() {
    this.router.navigate(['/home/home-sessions'], { replaceUrl: true });
  }
  navigate_to_replay() {
    this.replayService.openReplay(this.selectedSession.sid, this.selectedSession, null/*pages*/, 0/**index */, null/**pageinstance */, this.activeSession);
  }
  openNDSession()
  {
    var url = "";
    var pi = null;
    let st = this.selectedSession.startTime;
    let et = this.selectedSession.endTime;
    if(this.activeSession)
    {
      st += this.nvconfigurations.cavEpochDiff;
      et += this.nvconfigurations.cavEpochDiff;
    }
    this.ddrService.ndSessionDdr((st * 1000).toString(), (et * 1000).toString(), this.selectedSession.trnum + '', this.selectedSession.sid, this.selectedSession.flowpathInstances, undefined, undefined);
    
  }
  openNF(){
    let st = this.selectedSession.startTime;
    let et = this.selectedSession.endTime;
    if(this.activeSession)
    {
       st += this.nvconfigurations.cavEpochDiff;
       et += this.nvconfigurations.cavEpochDiff;
    }
    this.ddrService.nfSessionDdr(null,"session",this.selectedSession.flowpathInstances,this.selectedSession.sid,null,(st*1000),(et*1000));
  }  

  createScript(executeflag) { 
    executeflag = executeflag || false;
    this.data4 = "  Creating Script...";
    this.msg = null;
    this.responseForScript = true;
    //this.responseForScriptflag = true; 
    console.log(this.testcasename,"test case name ")
    if (this.testcasename.length > 64) {
      this.messageService.add({ severity: 'warn', summary: 'TestCaseName limit exceeded', detail: '' });
      return true;
    }
    //this.responseForScript = [];
    this.nvHttp.getTestScript(this.selectedSession.sid, this.testcasename, 'createscript').subscribe((state: Store.State) => {
      let response = state['data'];
      //this.responseForScript = response;
      if (response !== null && response !== "" && response !== undefined) {
        if (response["status"] === 'success') {
          if (executeflag == false) {
            this.responseForScript = false;
            console.log("executeflag == false");
            this.messageService.add({ severity: 'success', summary: response["msg"], detail: '' });
            window.open(response["redirectUrl"], "_self");
            this.msg = "Script created successfully";
          }
          else {
            console.log("executeflag == true");
            this.executeScript(response["msg"]);
          }
        }

        else {
          this.messageService.add({ severity: 'error', summary: response["ErrorMsg"], detail: '' });
          // this.responseForScript = null;
          this.msg = "Error in creating script";
        }
      }

    });
  }



  executeScript(path) {
    console.log("responseForScript==" + JSON.stringify(this.responseForScript));
    //if(this.responseForScript != null)
    {
      this.executeResponse = [];
      this.msg = null;
      this.data4 = "  Executing Script...";
      //if(this.responseForScript.status === 'success')
      {
        this.nvHttp.getTestScript(path, this.testcasename, 'executescript').subscribe((state: Store.State) => {
          let response = state['data']
          console.log("executeScript response==" + response);
          this.executeResponse = response;
          if (response !== null && response !== "" && response !== undefined) {
            if (response["status"] === 'success') {
              this.testcase = false;
              this.messageService.add({ severity: 'success', summary: 'Netstorm started successfully', detail: '' });
              let newWindow = window.open(response["executeScriptUrl"]);
              if (newWindow)
                newWindow.document.title = "script";
              this.msg = null;
              //SessionlistlargeComponent.setShowScript(false);
              this.executeResponse = null;
            }
            else {
              this.messageService.add({ severity: 'error', summary: response["errorStr"], detail: '' });
              this.responseForScript = false;
              this.testcase = false;
              this.msg = null;
              this.executeResponse = null;
            }
          }

        });
      }
    }
  }
  createAndExecute() {
    this.createScript(true);
  }
  openScript() {
    this.rowdata = this.selectedSession.sid;
    this.responseForScript = false;
    this.testcase = true;
    this.msg = null; 
    console.log (this.testcasename)
    //this.testcasename = data.entryPage + '_' + data.exitPage;
  }

}

