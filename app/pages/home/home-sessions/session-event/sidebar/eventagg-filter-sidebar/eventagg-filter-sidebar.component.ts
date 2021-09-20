import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import {
  TimebarValue,
  TimebarValueInput,
} from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { ParseHttpFilters } from '../../../common/interfaces/parsehttpfilters';
//import { PAGE_FILTER_SIDEBAR_DATA } from './service/http-filter-sidebar.dummy';
//import { PageFilterSidebar } from './service/http-filter-sidebar.model';


@Component({
  selector: 'app-eventagg-filter-sidebar',
  templateUrl: './eventagg-filter-sidebar.component.html',
  styleUrls: ['./eventagg-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventAggFilterSidebarComponent
  extends PageSidebarComponent
  implements OnInit {
  classes = 'page-sidebar page-filter-manager';
  duration: MenuItem[];
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val1: number;
  val2: number;
  
  timefilter : String = 'last';
  lasttime = {label: "1 Hour"};
  //data:PageFilterSidebar
  @Output() getData: EventEmitter<any>; 
  
  constructor(private timebarService: TimebarService) {
    super();
    this.getData = new EventEmitter();
    }

  ngOnInit(): void {
    const me = this;
    me.duration = [
      { label: '15 Minutes' },
      { label: '1 Hour' },
      { label: '4 Hours' },
      { label: '8 Hours' },
      { label: '12 Hours' },
      { label: '16 Hours' },
      { label: '20 Hours' },
      { label: '1 Day' },
      { label: '1 Week' },
      { label: '1 Month' },
      { label: '1 Year' }
    ];
    //me.data = PAGE_FILTER_SIDEBAR_DATA
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
  
  setTimeFilter()
  {
    console.log("setTimeFilter called :", this.tmpValue , " -- ", this.lasttime, " -- ", this.timefilter);
    let time = null;
    let st = null, et = null;
    let tf ={};
    if(this.timefilter == 'last'){
       time = this.lasttime.label;
       tf['last'] = time;
    }else{
      st =  this.tmpValue.time.frameStart.value;
      et =  this.tmpValue.time.frameEnd.value;
      let d = new Date(st);
      let e  = new Date(et);
      tf['starttime'] = d;
      tf['endtime'] = e;
    }
    this.getData.emit(tf);
    this.closeClick();
  }
  setFilters(){
    //let d = moment(new Date().getTime() - 24*60*60*1000,sessionStorage.getItem("_nvtimezone")).toDate();
    let time1 = ((new Date().getTime()) -  24*60*60*1000);
    let date = moment.tz(time1,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    let d = new Date(moment.tz(time1,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    let date1 = window["toDateString"](d);
    if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
    {
       let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
       date1 = tmpDate;
    }
    let startT = date1 + " 00:00:00";
    let endT = date1 + " 23:59:00";
    ParseHttpFilters.httpFilters.timeFilter.startTime =  startT;
    ParseHttpFilters.httpFilters.timeFilter.endTime =  endT;
    
    ParseHttpFilters.httpFilters.channel  = undefined;
    
    ParseHttpFilters.httpFilters.userSegment = undefined;

    /*let selectedChannel = null;
    let chm: any[] =  Array.from(this.metadata.channelMap.keys());
    let cn = null;
    if(chm.length > 0)
    {
      selectedChannel = this.metadata.channelMap.get(chm[0]).id.toString();
      cn = this.metadata.channelMap.get(chm[0]).name;
    }*/
    ParseHttpFilters.httpFilters.channel = "-1";
  }
}
