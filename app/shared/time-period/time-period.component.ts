import { AfterViewInit, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { OP_TYPE_WIDGET_WISE } from '../actions.constants';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';
import { MomentDateTimeAdapter } from '../date-time-picker-moment/moment-date-time-adapter';
import { PageSidebarComponent } from '../page-sidebar/page-sidebar.component';
import { TimebarValue, TimeMarker, TimebarTimeConfig, TimebarValueInput } from '../time-bar/service/time-bar.model';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { GlobalTimebarAlertLoadedState } from '../time-bar/service/time-bar.state';
import { MenuItemUtility } from '../utility/menu-item';
import { ObjectUtility } from '../utility/object';

@Component({
  selector: 'app-time-period',
  templateUrl: './time-period.component.html',
  styleUrls: ['./time-period.component.scss'],
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
export class TimePeriodComponent
  extends PageSidebarComponent
  implements AfterViewInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  timeFilterLoading: boolean;
  widget: DashboardWidgetComponent;

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
  widgetIndex: number = 0;
  isItems : boolean = false;
  constructor(
    private timebarService: TimebarService,
    public sessionService: SessionService,
    private ref: ChangeDetectorRef
  ) {
    super();
    const me = this;
    me.loading = true;
    me.isItems  = false;
    me.firstTime = true;
  }

  ngAfterViewInit() {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      me.init();
    });
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

  //for opening widget wise window
  timePeriodOpen(widget: DashboardWidgetComponent) {
    const me = this;
    me.widget = widget;
    me.widgetIndex = widget.widget.widgetIndex;
    me.timeFilterVisible = true;

    // Apply time filter for all widget checkbox
    // if (!me.checked) {
    // me.checked = status;
    // }
    if(me.value && me.value.viewBy) {
      me.value.viewBy = ObjectUtility.duplicate(me.timebarService.getValue().viewBy);
    }
    me.tmpValue = ObjectUtility.duplicate(me.value);

    //  if (!me.tmpValue)
    //    me.tmpValue = ObjectUtility.duplicate(me.value);
    //  else
    //    me.tmpValue = ObjectUtility.duplicate(me.tmpValue);

    //code done for Bug 101848 - LRM | Widget Wise Time Period Issue :
    //Previous applied widget wise time period for any widget is showing for another selected widget,
    // instead it should time period of selected widget while opening widget wise time period.
      if(me.widget.widget.widgetWiseInfo && me.widget.widget.widgetWiseInfo.widgetWise){
        let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
        let selectedTimePreset = MenuItemUtility.searchById(me.widget.widget.widgetWiseInfo.duration.preset, timePreset);
        me.tmpValue.timePeriod.selected.id = selectedTimePreset.id;
        me.tmpValue.timePeriod.selected.label = selectedTimePreset.label;
        me.tmpValue.viewBy.selected.id = me.widget.widget.widgetWiseInfo.duration.viewBy +"";
        setTimeout(() => {


         me.timebarService.setViewByOptions({updateTime: true}, me.tmpValue).subscribe((value: TimebarValue) => {
          setTimeout(() => {
            me.timebarService.setViewByValue({updateTime: true}, value).subscribe(
              (value: TimebarValue) => {
                setTimeout(() => {
                   me.tmpValue = value;
                });
              }
            );
          });
         });
        });

      }

    me.preset = !me.timebarService.isCustomTime(
      _.get(me.tmpValue, 'timePeriod.selected.id', '')
    );

    me.onTimeFilterTypeChange();
  }

  timeFilterClose() {
    const me = this;
    me.timeFilterVisible = false;
  }

  isCustomTime(tp: string): boolean {
    return tp.startsWith('SPECIFIED_TIME_');
  }
  //on click of apply button
  timeFilterApply() {

    const me = this;
    // me.timeApply(me.tmpValue);
    let widgetDuration = {
      et: this.tmpValue.time.frameEnd.value,
      preset: this.tmpValue.timePeriod.selected.id,
      st: this.tmpValue.time.frameStart.value,
      viewBy: Number(this.tmpValue.viewBy.selected.id)
    }
    let isCustom = me.isCustomTime(me.tmpValue.timePeriod.selected.id);
    if(!isCustom){
     me.presetData = null;
    }
    let widgetWiseInfo = {
      widgetId: me.widget.widget.widgetIndex,
      widgetWise: true,
      duration: widgetDuration
    }
    this.widget.widget.widgetWiseInfo = widgetWiseInfo;
    this.widget.widget.opName = OP_TYPE_WIDGET_WISE;
    this.widget.load();
    me.timeFilterClose();
  }

  onTimeFilterTypeChange() {
    const me = this;

    if (!me.preset) {
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );
      // const serverTime = moment(me.sessionService.time);
      const serverTime = moment(me.sessionService.time).zone(this.sessionService.selectedTimeZone.offset);

      if (customTime) {
        me.customTimeFrame = [
          moment(customTime.frameStart.value),
          moment(customTime.frameEnd.value),
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
    me.firstTime = true;
    me.timebarService.events.onChange.subscribe(() => {
      me.timeApply(me.timebarService.getValue(), true);
    });
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
    if(me.preset && me.presetData  && (me.firstTime|| iscustom)){

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
          // me.tmpValue = {...me.tmpValue};
          // Bug 107480 - LRM | Widget Wise Time Period : Start and End time is not updating
          //  according to time applied on applying widget wise time period in canvas mode
          this.ref.detectChanges();

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

    return value;
  }

  private timeApply(value: TimebarValue, silent?: boolean) {
    const me = this;
    const preparedValue = JSON.parse(JSON.stringify(me.prepareValue(value)));

    me.value = ObjectUtility.duplicate(preparedValue);
    me.timeFrame = [
      me.value.time.frameStart.value,
      me.value.time.frameEnd.value,
    ];

    /* if (!silent) {
    me.timebarService.setValue(me.value);
    } */
  }

  openGlobalSidebar() { }
}
