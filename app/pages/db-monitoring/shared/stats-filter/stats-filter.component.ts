import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { DBMonitoringService } from '../../services/db-monitoring.services';

@Component({
  selector: 'app-stats-filter',
  templateUrl: './stats-filter.component.html',
  styleUrls: ['./stats-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatsFilterComponent implements OnInit {

  toggleClass : boolean = false;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  customTimeFrame: Moment[] = null;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  checked: boolean = true;
  // selectedOptions: MenuItem;
  // dbOptions: MenuItem[];
  orderList: MenuItem[];
  selectedFilter = 'preset';
  selectPresetLabel: any;
  isPreset:boolean = false;
   dateTime: Date;
   latest_date:any;
  

  constructor(private timebarService: TimebarService,
    public dbMonService: DBMonitoringService,
    public datepipe: DatePipe) { 
    }

  ngOnInit(): void {
    const me = this;
    me.convertIntoData();
    me.dbMonService.options = me.dbMonService.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['presetOptions'];
    me.selectPresetLabel = me.dbMonService.options[3].label;
    me.dbMonService.selectedPreset = 'LIVE3';
  }

  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2 && me.customTimeFrame[0] && me.customTimeFrame[1]) {
        if (me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.dbMonService.selectedPreset = timePeriod;
          // me.dbMonService.selectedViewBy = viewBy;
          me.dbMonService.isAnalysisMode = true;
          me.dbMonService.scheduleDataRequest.next();
          // me.setTmpValue({
          //   timePeriod: timePeriod,
          // });
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

  public onPresetChange(event){
    const me = this;
    me.selectPresetLabel = event.target.innerText;
    me.dbMonService.options.forEach(element => {
      if (element.label == me.selectPresetLabel) {
        me.dbMonService.selectedPreset = 'LIVE' + (Number(element.id) -1);
        return;
      }
    });
    me.dbMonService.scheduleDataRequest.next();
    
  }
  
  convertIntoData(){
    this.dateTime=new Date();
    this.latest_date =this.datepipe.transform(this.dateTime, 'dd/MM/yyyy HH:mm:ss');
  }
}
