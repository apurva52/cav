import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { Metadata } from '../../common/interfaces/metadata';
import { MetadataService } from '../../common/service/metadata.service';
import { NVAppConfigService } from '../../common/service/nvappconfig.service';
import { SessionStateService } from '../../session-state.service';
declare var changeGradient;

@Component({
  selector: 'app-mapping-configuration',
  templateUrl: './mapping-configuration.component.html',
  styleUrls: ['./mapping-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MappingConfigurationComponent extends PageSidebarComponent implements OnInit {
  classes = 'mapping-configure-sidebar';
  duration: MenuItem[];
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val1: number;
  val2: number;
  @Input() map = null;
  @Input() session = 1;
  @Input() pages = 1;
  @Input() activePageindex = 1;
  viewrange:any=0;
  Granularity:any=0;
  threshold:any=0;
  rollovermode:boolean=false;
  presentview:boolean=false;
  hiddenele:boolean=false;
  last: SelectItem[];
  userSegment: SelectItem[];
  selectedSegmentforMap : number = 0;
  lastTime: string = 'true';
  mapLastTime : any;
  pickerType="both";
  metadata : Metadata;
  selectedgradient:any="cyan";
  previousgradient:any="cyan";
  Tranparency:any=0; 

  @Input() showDates;
  @Input() suggestions;
  @Input() parser_failed;
  nvconfigurations: any;

  constructor(private timebarService: TimebarService,private stateService: SessionStateService,private router: Router,private metadataService: MetadataService,
    private nvAppConfigService : NVAppConfigService) {  super();}

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
        return { label: this.metadata.userSegmentMap.get(key).name, value: key }
      });
      me.userSegment.unshift({
        label: 'All',
        value: 0
      });
    });
    if(me.map == "clickmap" || me.map == "navigationmap"){
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
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
    });
  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
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

  generateMap(dataObj){
    console.log("generateMap called :", this.tmpValue , " -- ", this.lastTime, " -- ", this.mapLastTime);
    let time = null;
    let st = null, et = null , d= null, e = null;
    if(dataObj == null){
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
    }else{
        time ={};
        let s = dataObj.st;
        let e = dataObj.et;
        time["st"] = ((new Date(s).getTime() /1000) - this.nvconfigurations.cavEpochDiff) *1000;
        time["et"] = ((new Date(e).getTime() /1000) - this.nvconfigurations.cavEpochDiff) *1000;
    }
   this.setParams(time,d,e);
   // for scroll map
   if(this.map == "scrollmap"){
      this.router.navigate(['../mapping/scroll-map'], { queryParams: { random : Math.random() } });
   }
   if(this.map == "heatmap"){
      this.router.navigate(['../mapping/heat-map'], { queryParams: { random : Math.random() } });
   }
   if(this.map == "attentionmap"){
      this.router.navigate(['../mapping/attention-map'], { queryParams: { random : Math.random() } });
   }
   if(this.map == "clickmap"){
      this.setMapParam();
      this.router.navigate(['../mapping/click-map'], { queryParams: { random : Math.random() } });
   }
   if(this.map == "navigationmap"){
    this.setMapParam();
    this.router.navigate(['../mapping/navigation-map'], { queryParams: { random : Math.random() } });
   }
   this.closeClick();
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

  reset(){
    this.lastTime = 'true';
    this.customTimeFrame = [];
    this.mapLastTime = this.last[0].value;
    this.hiddenele = false;
    this.presentview = false;
    this.rollovermode = false;
    this.viewrange = 0;
    this.Granularity = 0;
    this.threshold = 0;

  }

   setTransparencyHeatmap(){
     const element = document.getElementById("replayIframe") as HTMLIFrameElement;
     let heatcanvas= <HTMLCanvasElement>element.contentWindow.document.getElementsByClassName('heatmap-canvas')[0];   
     let tranparencyLevel;
     tranparencyLevel =this.Tranparency/100;
     if(heatcanvas && this.map == "heatmap")
          heatcanvas.style.backgroundColor=`rgba(225, 225, 225,${tranparencyLevel})`;
   }

   changeG(){
     console.log("calling change G : ", this.selectedgradient);
     const element = document.getElementById("replayIframe") as HTMLIFrameElement;
     let heatcanvas= <HTMLCanvasElement>element.contentWindow.document.getElementsByClassName('heatmap-canvas')[0];   
     if(heatcanvas && this.map == "heatmap")
        changeGradient(this.selectedgradient);
   }

   
}
