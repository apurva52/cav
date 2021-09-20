import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { PageInformation } from '../../../common/interfaces/pageinformation';
import { Session } from '../../../common/interfaces/session';
import { NVAppConfigService } from '../../../common/service/nvappconfig.service';
import { ReplayHandler } from './../../../play-sessions/replay-handler';
import { SessionStateService } from '../../../session-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetadataService } from '../../../common/service/metadata.service';
import { Metadata } from '../../../common/interfaces/metadata';


//declare var NFScrollMap;


@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapConfigComponent extends PageDialogComponent implements OnInit {

  last: SelectItem[];
  userSegment: SelectItem[];
  selectedSegmentforMap : number = 0;
  lastTime: string = 'true';
  mapLastTime : any;
  customEndTimeFrame: Moment[] = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  @Input() dashboard: DashboardComponent;
  tagList = [];
  metadataName: any;
  index =0;
  replayIframe : HTMLIFrameElement;
  replayIframeDoc : HTMLDocument;
  @Input() session : Session;
  @Input() pages : PageInformation[];
  @Input() activePageindex : number;
  showDates: boolean;
  nvconfigurations = null;
  nvAppConfigService: NVAppConfigService;
  viewrange:any=0;
  Granularity:any=0;
  threshold:any=0;
  rollovermode:any=false;
  presentview:any=false;
  hiddenele:any=false;
  metadata : Metadata;
  pickerType ="both";

  constructor(private timebarService: TimebarService,
    private sessionService: SessionService,
    private replayHandler :ReplayHandler,
    nvAppConfigService : NVAppConfigService,
    private stateService: SessionStateService,
    private metadataService: MetadataService,
    private router: Router) {
    super();
    this.nvAppConfigService = nvAppConfigService;
  }

  ngOnInit(): void {

    const me = this;

    me.last = [
      {label: '1 Hour', value: "1 Hour"},
      {label: '4 Hour' , value: "4 Hour"},
      {label: '8 Hour' , value: "8 Hour"},
      {label: '12 Hour' , value: "12 Hour"},
      {label: '1 Day' , value: "1 Day"},
      {label: '1 Week' , value: "1 Week"},
      {label: '1 Month' , value: "1 Month"},
      {label: '1 Year' , value: "1 Year"}
    ];
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
      let user_seg_keys = Array.from(this.metadata.userSegmentMap.keys());
      me.userSegment = user_seg_keys.map(key => {
        return { label: this.metadata.userSegmentMap.get(key).name, value: key };
      });
      me.userSegment.unshift({
        label: 'All',
        value: 0
      });
    });
    me.mapLastTime = me.last[0].value;
    me.replayIframe = document.getElementById("replayIframe") as HTMLIFrameElement;
    me.replayIframeDoc = me.replayIframe.contentWindow.document;
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
      console.log("nvconfigurations : ", this.nvconfigurations);
    });
  }

  getDuration() {
    try {
      const startTime: number = this.timebarService.getValue().time.frameStart.value;
      const endTime: number = this.timebarService.getValue().time.frameEnd.value;
      const graphTimeKey: string = this.timebarService.getValue().timePeriod.selected.id;
      const viewBy: string = this.timebarService.getValue().viewBy.selected.id;

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy: viewBy
      }
      return duration;
    } catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }

  showDialog() {
    super.show();
  }

  open() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    });
  }

  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.timeFilterEnableApply = false;

    me.timebarService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');

        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          me.timeFilterEnableApply = true;
          output.next(me.tmpValue);
          output.complete();
        } else {
          me.tmpValue = null;
          me.timeFilterEnableApply = false;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);

    return value;
  }

  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    const input: TimebarValueInput = {
      timePeriod: me.tmpValue.timePeriod.selected.id,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: me.tmpValue.running,
      discontinued: me.tmpValue.discontinued,
      includeCurrent: me.tmpValue.includeCurrent,
    };

    if (clearViewBy) {
      input.viewBy = null;
    }

    me.setTmpValue(input);
  }

  openMap(i){
    this.index = i;
    let ele = <HTMLElement> document.getElementsByClassName('ui-tabview-panels')[0];
    ele.style.display = "";
    if(i == 2 || i ==3 || i == 4)
      ele.style.display = "none";
    this.customize();
  }
  customize(){
    const me = this;
    if(me.index == 0 || me.index == 1){
      me.pickerType = "both";
      me.last = [
        {label: '1 Hour', value: "1 Hour"},
        {label: '4 Hour' , value: "4 Hour"},
        {label: '8 Hour' , value: "8 Hour"},
        {label: '12 Hour' , value: "12 Hour"},
        {label: '1 Day' , value: "1 Day"},
        {label: '1 Week' , value: "1 Week"},
        {label: '1 Month' , value: "1 Month"},
        {label: '1 Year' , value: "1 Year"}
      ];
    }else{
      me.pickerType = "calendar";
      me.last = [
        {label: '1 Day' , value: "1 Day"},
        {label: '1 Week' , value: "1 Week"},
        {label: '1 Month' , value: "1 Month"},
        {label: '1 Year' , value: "1 Year"}
      ];
    }
    me.mapLastTime = me.last[0].value;
  }

  generateMap(){
    console.log("generateMap called :", this.tmpValue , " -- ", this.lastTime, " -- ", this.mapLastTime);
    let time = null;
    let st = null, et = null , d= null, e = null;
    if(this.lastTime == 'true'){
      time = this.mapLastTime;
      console.log("last time applied : ", time);
   }else{
     st =  this.tmpValue.time.frameStart.value;
     et =  this.tmpValue.time.frameEnd.value;
     d = new Date(st);
     let startTime = window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0];
     e  = new Date(et);
     let endTime =  window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0];
     console.log("st : ", startTime , " et : ", endTime); 
   }
   this.setParams(time,d,e);
   // for scroll map
   if(this.index == 2){
      this.router.navigate(['../mapping/scroll-map']);
   }
   if(this.index == 3){
      this.router.navigate(['../mapping/heat-map']);
   }
   if(this.index == 4){
      this.router.navigate(['../mapping/attention-map']);
   }
   if(this.index == 0){
      this.setMapParam();
      this.router.navigate(['../mapping/click-map']);
   }
   if(this.index == 1){
    this.setMapParam();
    this.router.navigate(['../mapping/navigation-map']);
   }
  }
   

  setParams(time,d,e){
    this.stateService.set('lasttime',time);
    this.stateService.set('starttime', d);
    this.stateService.set('endtime', e);
    this.stateService.set('session',this.session);
    this.stateService.set('selectedPageIdx',this.activePageindex+"");
    this.stateService.set('pages',this.pages);
    this.stateService.set('selectedSegmentforMap',this.selectedSegmentforMap+"");
  }

  setMapParam(){
    let mapConfig = {
      considerHiddenElement : this.hiddenele,//false,
      considerNotPresentElement: this.presentview,//false,
      RollUpMode : this.rollovermode, // false,
      minimumPctforView : this.viewrange,
      minimumPctforTable : this.Granularity,
      largeAreaThreshold : this.threshold
    }
    this.stateService.set('mapConfig',mapConfig);
  }
  
}
