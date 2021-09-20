import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Moment } from "moment-timezone";
import { MenuItem } from "primeng";
import { Observable, Subject } from "rxjs";
import { TimebarValue, TimebarValueInput } from "src/app/shared/time-bar/service/time-bar.model";
import { TimebarService } from "src/app/shared/time-bar/service/time-bar.service";
import { MenuItemUtility } from "src/app/shared/utility/menu-item";
import * as _ from 'lodash';
import { CPU_BURST_CHART } from "./service/cpu-burst.dummy";

@Component({
  selector: "app-cpu-burst",
  templateUrl: "./cpu-burst.component.html",
  styleUrls: ["./cpu-burst.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class CpuBurstComponent implements OnInit {
  
  customFromTimeFrame : Moment[] = null;
  customToTimeFrame : Moment[] = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;

  tierItems: any[];
  serverItems: any[];
  serverSelectionItems: any[];
  connectionTypeItems: any[];
  durationItem: any[];

  selectedTime: any = 'current';

  chart: any;
  values : any = [
    {day:'Mon', selected:false},
    {day:'Tue', selected: false},
    {day:'Wed', selected: false},
    {day:'Thu', selected: false},
    {day:'Fri', selected: false},
    {day:'Sat', selected: false},
    {day:'Sun', selected: false}]
  
  constructor(private timebarService: TimebarService) { 

  }

  ngOnInit() {

    const me = this;

    me.chart = CPU_BURST_CHART.charts[0];

    me.tierItems = [
      {
        label: "Tier 1",
        value: "Tier 1"
      },
      {
        label: "Tier 2",
        value: "Tier 2"
      },
      {
        label: "Tier 3",
        value: "Tier 3"
      }
    ];

    me.serverItems = [
      {
        label: "Server 1",
        value: "Server 1"
      },
      {
        label: "Server 2",
        value: "Server 2"
      },
      {
        label: "Server 3",
        value: "Server 3"
      }
    ];

    me.serverSelectionItems = [
      {
        label: "Specified",
        value: "Specified"
      },
      
    ];


    me.connectionTypeItems = [
      {
        label: "Type 1",
        value: "Type 1"
      },
      
    ];

    me.durationItem = [
      {
        label: "00",
        value: "00"
      },
      {
        label: "01",
        value: "01"
      },
      {
        label: "02",
        value: "02"
      },
      {
        label: "03",
        value: "03"
      },
      
    ];

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
}
