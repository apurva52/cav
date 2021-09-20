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
import { TimeFilter } from '../../../common/interfaces/timefilter';
import { PathAnalyticsFilterComponent } from '../../path-analytics.component';


@Component({
  selector: 'app-path-analytics-sidebar',
  templateUrl: './path-analytics-sidebar.component.html',
  styleUrls: ['./path-analytics-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PathAnalyticsFilterSidebarComponent
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
  @Output() getData: EventEmitter<boolean>; 
  
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
    PathAnalyticsFilterComponent.tfilter.offset = 0;
    PathAnalyticsFilterComponent.tfilter.limit = 15;
    PathAnalyticsFilterComponent.tfilter.timeFilter = new TimeFilter();

    let time = null;
    let st = null, et = null;
    if(this.timefilter == 'last'){
       time = this.lasttime.label;
       PathAnalyticsFilterComponent.tfilter.timeFilter.last = time;
    }else{
      PathAnalyticsFilterComponent.tfilter.timeFilter.last = '';
      st =  this.tmpValue.time.frameStart.value;
      et =  this.tmpValue.time.frameEnd.value;
      let d = new Date(st);
      PathAnalyticsFilterComponent.tfilter.timeFilter.startTime = window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0];
      let e  = new Date(et);
      
      PathAnalyticsFilterComponent.tfilter.timeFilter.endTime =  window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0];
      
    }
    this.getData.emit(true);
    this.closeClick();
  }
  
}
