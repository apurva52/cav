import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { Moment } from 'moment-timezone';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { NfLogsService } from 'src/app/pages/home/logstab/service/nf-logs.service';
import { environment } from 'src/environments/environment';
import { OP_TYPE_GLOBAL_TIME } from '../actions.constants';
import { MomentDateTimeAdapter } from '../date-time-picker-moment/moment-date-time-adapter';
import { PageSidebarComponent } from '../page-sidebar/page-sidebar.component';
import { MenuItemUtility } from '../utility/menu-item';
import { ObjectUtility } from '../utility/object';
import {
  TimebarValue,
  TimebarValueInput,
  TimeMarker,
  TimebarTimeConfig,
} from './service/time-bar.model';
import { TimebarService } from './service/time-bar.service';
import { GlobalTimebarAlertLoadedState } from './service/time-bar.state';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrls: ['./time-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    },
  ],
})
export class TimeBarComponent
  extends PageSidebarComponent
  implements AfterViewInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  timeFilterLoading: boolean;

  paused: boolean;

  timeFilterVisible: boolean = false;
  timeFilterEnableApply: boolean = false;

  value: TimebarValue = null;
  tmpValue: TimebarValue = null;
  timeFrame: number[] = [];

  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;

  timeMarkers: TimeMarker[] = [];
  alertMarkers: TimeMarker[] = [];

  timers: { [key: string]: NodeJS.Timeout } = {};

  preset: boolean = true;
  firstTime : boolean = false;

  presetData:TimebarValue = null;
  checked: boolean = false;

  invalidDate: boolean = false;
  isItems : boolean = false;
  isEditMode : boolean = false;
  constructor(
    public timebarService: TimebarService,
    public sessionService: SessionService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private nf: NfLogsService
  ) {
    super();
    const me = this;
    me.loading = true;
    me.isItems = false;
    me.firstTime = true;
  }

  ngAfterViewInit() {
    const me = this;

    me.timebarService.instance.getInstance().subscribe(() => {
      me.init();
    });
  }

  onSliderTimeFrameChanged() {
    const me = this;

    if (me.timers['slider.timeframe']) {
      clearTimeout(me.timers['slider.timeframe']);
    }

    me.timers['slider.timeframe'] = setTimeout(() => {
      me.setTmpValue({
        timePeriod: me.timebarService.getCustomTime(
          me.timeFrame[0],
          me.timeFrame[1]
        ),
      }).subscribe((value: TimebarValue) => {
        me.timeApply(value);
      });
    }, 500);
  }

  controlPrevious() {
    const me = this;
    me.timebarService.controlPrevious();
  }

  controlPause() {
    const me = this;
    me.timebarService.controlPause();
  }

  controlStart() {
    const me = this;
    me.timebarService.controlStart();
  }

  controlNext() {
    const me = this;
    this.timebarService.controlNext();
  }

  timeFilterOpen(status: boolean) {
    const me = this;

    me.timeFilterVisible = true;
    me.firstTime = true;

    // Apply time filter for all widget checkbox
    if (!me.checked) {
      me.checked = status;
    }

    me.value.viewBy = ObjectUtility.duplicate(me.timebarService.getValue().viewBy);

    me.tmpValue = ObjectUtility.duplicate(me.value);
    me.preset = !me.timebarService.isCustomTime(
      _.get(me.tmpValue, 'timePeriod.selected.id', '')
    );


    // This is the case of when the local time zone is different and server time zone is different the wne have to set the time zone according to the server in moment js
    let timeZone = sessionStorage.getItem("_nvtimezone");
    let zone = me.sessionService.selectedTimeZone.value;

    if(!(!me.sessionService.selectedTimeZone && (!zone || zone.indexOf(",") == -1  || (zone.split(",").length <2 )))) {
      timeZone  =  zone.split(",")[1].trim();
    }

    moment.tz.setDefault(timeZone); // set the time zone into moment

    me.onTimeFilterTypeChange();
    me.cd.detectChanges();
  }

  timeFilterClose() {
    const me = this;
    me.timeFilterVisible = false;
  }
  isCustomTime(tp: string): boolean {
    return tp.startsWith('SPECIFIED_TIME_');
  }

  timeFilterApply() {
    const me = this;
    sessionStorage.setItem('opName' , OP_TYPE_GLOBAL_TIME);
    me.timeApply(me.tmpValue);
    console.log(this.route.snapshot['_routerState'].url)
    if ((this.route.snapshot['_routerState'].url).includes("/home/logs")) {
            console.log(this.route.snapshot['_routerState'].url)

            me.nf.timeDataCarrier.next({time:true,view:me.tmpValue.viewBy.selected.id})
          //  me.nf.viewByCarrier.next(me.tmpValue.viewBy.selected.id)
            console.log(this.tmpValue)
         }
         let isCustom = me.isCustomTime(me.tmpValue.timePeriod.selected.id);
         if(!isCustom){
          me.presetData = null;
         }

    me.timeFilterClose();
  }

  onTimeFilterTypeChange() {
    const me = this;

    if (!me.preset) {
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );

      // const serverTime = moment(me.sessionService.time);
      const serverTime = moment(me.sessionService.time).zone(
        this.sessionService.selectedTimeZone.offset
      );


      if (customTime) {
        me.customTimeFrame = [
          moment(customTime.frameStart.value).zone(
            this.sessionService.selectedTimeZone.offset),
          moment(customTime.frameEnd.value).zone(
            this.sessionService.selectedTimeZone.offset),
        ];
      }
      //code changed for Bug 106678 - LRM | Time Period :Applied Start/End Time should be selected
      // if user uncheck Custom Preset form Live preset time period applied.
      else{
        me.customTimeFrame = [
          moment(me.tmpValue.time.frameStart.value).zone(
            this.sessionService.selectedTimeZone.offset),
          moment(me.tmpValue.time.frameEnd.value).zone(
            this.sessionService.selectedTimeZone.offset),
        ];
      }


      if (!me.customTimeFrame || !me.customTimeFrame.length) {
        me.customTimeFrame = [
          serverTime.clone().subtract(1, 'hour'),
          serverTime.clone(),
        ];
      }

      me.customTimeFrameMax = serverTime.clone();

      setTimeout(() => {
        me.onTimeFilterCustomTimeChange();
      });
    } else {
      me.validateTimeFilter();
    }
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

  onTimeFilterRunningChange() {
    const me = this;
    me.setTmpValue({
      running: me.tmpValue.running,
    });
  }

  onTimeFilterDiscontinuedChange() {
    const me = this;
    me.setTmpValue({
      discontinued: me.tmpValue.discontinued,
    });
  }

  onTimeFilterIncludeCurrentChange() {
    const me = this;
    me.setTmpValue({
      includeCurrent: me.tmpValue.includeCurrent,
    });
  }

  private init() {
    const me = this;
    me.loading = false;
    me.isItems = false;
    me.firstTime = true;
    me.timebarService.events.onChange.subscribe(() => {
      me.timeApply(me.timebarService.getValue(), true);
      me.isEditMode = sessionStorage.getItem('mode') == 'VIEW' ? false : true;
    });
    me.cd.detectChanges();

   if(me.sessionService.copyLinkParam && me.sessionService.copyLinkParam.requestFrom == "CopyLink"){
    me.setTmpValue({
      timePeriod: me.timebarService.getCustomTime(
        me.sessionService.copyLinkParam.st,
        me.sessionService.copyLinkParam.et
      ),
    }).subscribe((value: TimebarValue) => {
      me.timeApply(value);
    });
   }
  }

  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    // TODO: make it dynamic
    if (me.tmpValue.timePeriod.selected.state.online) {
      me.tmpValue.running = true;
    } else {
      me.tmpValue.running = false;
    }
let previous =  me.tmpValue.timePeriod.previous;
let selected = me.tmpValue.timePeriod.selected;
let iscustom = me.isCustomTime(selected.id);
if(me.preset && me.firstTime && !iscustom){
  me.presetData = me.tmpValue;
}
if(me.preset && me.presetData && (me.firstTime|| iscustom)){
  me.tmpValue.timePeriod.selected = me.presetData.timePeriod.selected;
  me.tmpValue.viewBy.selected = me.presetData.viewBy.selected;
  me.tmpValue.running = me.presetData.running;
  me.tmpValue.discontinued = me.presetData.discontinued;
  me.tmpValue.includeCurrent = me.presetData.includeCurrent;
}
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
    me.firstTime = false;
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
          me.isItems = true;
          me.validateTimeFilter(true);
        }
      };

    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.isItems = true;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);

    value.timePeriod.options.splice(3,1);

    return value;
  }

  private timeApply(value: TimebarValue, silent?: boolean) {
    const me = this;
    const preparedValue = me.prepareValue(value);

    me.value = ObjectUtility.duplicate(preparedValue);
    me.timeFrame = [
      me.value.time.frameStart.value,
      me.value.time.frameEnd.value,
    ];

    if (!silent) {
      me.timebarService.setValue(me.value);
    }

    // time is changed from globaltimebar filter or slider.
    if (!silent) me.timebarService.isTimeChangedFromGlobal = true;


    // console.log("me.tmpValue---from time-",value,me.tmpValue);
    me.timebarService.setGlobalTimeBar(me.value);
    if(me.timebarService.baselineTime!=null){
      me.timebarService.baselineTime.preset =me.value.timePeriod.selected.id;
      me.timebarService.baselineTime.presetlabel=me.value.timePeriod.selected.label;
      me.timebarService.baselineTime.name =me.value.timePeriod.selected.label;
      me.timebarService.baselineTime.start=me.value.time.frameStart.value;
      me.timebarService.baselineTime.end=me.value.time.frameEnd.value;

    }

    if(me.sessionService.copyLinkParam && me.sessionService.copyLinkParam.requestFrom == "CopyLink"){
        me.value.timePeriod.selected.label = "Custom Time";
        value.time.frameStart.value = me.sessionService.copyLinkParam.st;
        value.time.frameEnd.value = me.sessionService.copyLinkParam.et;

        if(me.value.time.min.value != Number(me.value.time.frameStart.value))
       me.value.time.min.value = Number(me.value.time.frameStart.value);

        if(me.value.time.max.value != Number(me.value.time.frameEnd.value))
           me.value.time.max.value = Number(me.value.time.frameEnd.value);

      me.sessionService.copyLinkParam.requestFrom = "";
    }

    me.timebarChanged();
    me.cd.detectChanges();
  }

  private timebarChanged() {
    const me = this;

    const diff = me.value.time.max.value - me.value.time.min.value;

    me.timebarService
      .loadAlert(me.value.time.min.value, me.value.time.max.value)
      .subscribe((state: Store.State) => {
        if (state instanceof GlobalTimebarAlertLoadedState) {
          if (state.data && state.data.length) {
            for (const a of state.data) {
              // Formula: ((markers.value - timeFrameMin) * 100) / (timeFrameMax - timeFrameMin)
              a.position =
                ((a.value - me.value.time.min.value) * 100) / diff + '%';
            }

            me.alertMarkers = state.data;
          }
        }
      });

    me.positionTimeMarkers();
    me.cd.detectChanges();
  }

  private positionTimeMarkers() {
    const me = this;
    const timeMarkers = [];

    const markerCount = 20;

    const diff = me.value.time.max.value - me.value.time.min.value;

    for (let i = 1; i < markerCount; i++) {
      const p = i / markerCount;

      const t: number = p * diff + me.value.time.min.value;

      timeMarkers.push({
        label: null,
        position: p * 100 + '%',
        value: t,
      });
    }
    me.timeMarkers = timeMarkers;
    me.cd.detectChanges();
  }

  private onTmpValueChange(value: TimebarValue) {
    const me = this;
  }

  openGlobalSidebar() {}
}


