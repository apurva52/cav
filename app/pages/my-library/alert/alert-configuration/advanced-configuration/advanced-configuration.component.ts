import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, MessageService, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { AlertConfigurationComponent } from '../../alert-rules/alert-configuration/alert-configuration.component';
import { MAINTENANCE_SCHEDULETYPE_TYPE, MODULE, RULE_SCHEDULETYPE_TYPE, SCHEDULE } from './service/advanced-configuration.dummy';
import { ScheduleConfiguration } from './service/advanced-configuration.model';
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';
import { AttributesConfig, ScheduleConfig } from '../../alert-rules/alert-configuration/service/alert-config.model';
import { AdvancedConfigurationService } from './service/advanced-configuration.service';
import { METRIC_COLOR_ARR } from '../../alert-rules/alert-configuration/service/alert-config.dummy';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import { environment } from 'src/environments/environment';
import { ConfigureMaintenanceComponent } from '../../alert-maintenance/configure-maintenance/configure-maintenance.component';
import { TimeZoneInfo, TimeZoneValueInfo } from 'src/app/core/session/session.model';
import { values } from 'lodash';
import { ALERT_MODULES } from '../../alert-constants';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-advanced-configuration',
  templateUrl: './advanced-configuration.component.html',
  styleUrls: ['./advanced-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    }
  ]
})
export class AdvancedConfigurationComponent extends PageDialogComponent implements OnInit {

  val: number = 15;
  onetimeFlag: boolean = true;
  customEndTimeFrame : Moment[] = null;
  customTimeFrame: Moment[];
  customFormDate: Moment[];
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  preset: SelectItem[];
  days: SelectItem[];
  custom: SelectItem[];
  week: SelectItem[];
  weekdays: SelectItem[];
  weekMonthDays: SelectItem[];
  monthList: SelectItem[];
  scheduleConfig: ScheduleConfiguration;

  addedScheduleConfig: any[] = [];
  scheduleType: any = 4;
  updateScheduleMode: boolean;
  indexOfSchedulerSelected: number;

  @Input() alertConfigurationComponent: AlertConfigurationComponent;
  @Input() configMaintenanceComponent: ConfigureMaintenanceComponent;
  visible: boolean;
  monthListWithDay: { label: string; value: number; totalDay: number; }[];
  dayList: { label: string; value: number; }[];
  _feature: number;
  isOnlyReadable: boolean;
  constructor(private timebarService: TimebarService,
    public sessionService: SessionService,
    private messageService: MessageService,
    private advConfigService: AdvancedConfigurationService,
    private alertCapability: AlertCapabilityService,
    private cd: ChangeDetectorRef) {
    super();
   }

  ngOnInit(): void {
    const me = this;

    me.preset = [
      {label:'Every Week', value:'week'},
      {label:'Every Month', value:'month'},
    ]

    me.days = [
      {label:'Monday', value:'monday'},
      {label:'Tuesday', value:'tuesday'},
      {label:'Wednesday', value:'wednesday'},
      {label:'Thursday', value:'thursday'},
      {label:'Friday', value:'friday'},
      {label:'Saturday', value:'saturday'},
      {label:'Sunday', value:'sunday'},
    ]

    me.custom = RULE_SCHEDULETYPE_TYPE;
    me.week = [
      { label: "1st", value: 1 },
      { label: "2nd", value: 2 },
      { label: "3rd", value: 3 },
      { label: "4th", value: 4 },
      { label: "last", value: 5 }
    ];

    me.weekdays =[
      { label: 'Sunday', value: 0 }, 
      { label: 'Monday', value: 1 },
      { label: 'Tuesday', value: 2 },
      { label: 'Wednesday', value: 3 },
      { label: 'Thursday', value: 4 },
      { label: 'Friday', value: 5 },
      { label: 'Saturday', value: 6 },
    ]

    me.monthList = [
      { label: "January", value: 0 },
      { label: "February", value: 1 },
      { label: "March", value: 2 },
      { label: "April", value: 3 },
      { label: "May", value: 4 },
      { label: "June", value: 5 },
      { label: "July", value: 6 },
      { label: "August", value: 7 },
      { label: "September", value: 8 },
      { label: "October", value: 9 },
      { label: "November", value: 10 },
      { label: "December", value: 11 }
    ]

    me.weekMonthDays = [
      { label: 'Sunday', value: 0 },
      { label: 'Monday', value: 1 },
      { label: 'Tuesday', value: 2 },
      { label: 'Wednesday', value: 3 },
      { label: 'Thursday', value: 4 },
      { label: 'Friday', value: 5 },
      { label: 'Saturday', value: 6 },
      { label: "1st", value: 1 },
      { label: "2nd", value: 2 },
      { label: "3rd", value: 3 },
      { label: "4th", value: 4 },
      { label: "5th", value: 5 },
      { label: "6th", value: 6 },
      { label: "7th", value: 7 },
      { label: "8th", value: 8 },
      { label: "9th", value: 9 },
      { label: "10th", value: 10 },
      { label: "11th", value: 11 },
      { label: "12th", value: 12 },
      { label: "13th", value: 13 },
      { label: "14th", value: 14 },
      { label: "15th", value: 15 },
      { label: "16th", value: 16 },
      { label: "17th", value: 17 },
      { label: "18th", value: 18 }, 
      { label: "19th", value: 19 },
      { label: "20th", value: 20 },
      { label: "21st", value: 21 },
      { label: "22nd", value: 22 },
      { label: "23rd", value: 23 },
      { label: "24th", value: 24 },
      { label: "25th", value: 25 },
      { label: "26th", value: 26 },
      { label: "27th", value: 27 },
      { label: "28th", value: 28 },
      { label: "29th", value: 29 },
      { label: "30th", value: 30 },
      { label: "31st", value: 31 },
      { label: "Last", value: 32 },
    ]
  }

  addUpdateScheduler(isAdd: boolean){
    const me = this;

    let type = me.validateRuleScheduleConfiguration(me.scheduleConfig);
    if (type == SCHEDULE.NON_OF_ABOVE)
      return type;

    const scheduleConfig: ScheduleConfiguration = {
      index: METRIC_COLOR_ARR[me.updateScheduleMode ? me.indexOfSchedulerSelected : me.addedScheduleConfig.length].name,
      colorForGraph: METRIC_COLOR_ARR[me.updateScheduleMode ? me.indexOfSchedulerSelected : me.addedScheduleConfig.length].color,
      scheduleType: me.scheduleConfig.scheduleType,
      type: type,
      weekplusday: me.scheduleConfig.ruleScheduleWeekDayItem,
      weekplusdayforyear: me.scheduleConfig.ruleScheduleMonthItem,
      weekday: me.scheduleConfig.weekday,
      week: me.scheduleConfig.week,
      month: me.scheduleConfig.month,
      customTimeFrame: me.customTimeFrame,
      customFormDate: me.customFormDate,
      fromDate: me.scheduleConfig.fromDate,
      toDate: me.scheduleConfig.toDate,
      from: me.scheduleConfig.scheduleType.value != 4 ? moment(me.customFormDate[0]).format('HH:mm') : moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm'),
      to: me.scheduleConfig.scheduleType.value != 4 ? moment(me.scheduleConfig.toDate).format('HH:mm') : moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm'),
      durationHr:  me.scheduleConfig.scheduleType.value != 4 ? me.scheduleConfig.durationHr : 0,
      durationMt:  me.scheduleConfig.scheduleType.value != 4 ? me.scheduleConfig.durationMt : 0,
      _selectedTimeZone: me.scheduleConfig._selectedTimeZone
    }

    if(me._feature == MODULE.ALERT_MAINTENANCE)
    {
      me.scheduleConfig.weekday = scheduleConfig.weekday;
      me.scheduleConfig.weekplusday = me.scheduleConfig.ruleScheduleWeekDayItem = scheduleConfig.weekplusday;
      me.scheduleConfig.weekplusdayforyear = me.scheduleConfig.ruleScheduleMonthItem = scheduleConfig.weekplusdayforyear;
    }
    let browserOffSet = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").offset;
    
    const tmpSchedule: ScheduleConfig = {
      type: scheduleConfig.type,
      month: scheduleConfig.type == SCHEDULE.DAY_OF_A_YEAR || scheduleConfig.type == SCHEDULE.WEEKDAY_OF_YEAR ? scheduleConfig.month.value : 0,
      week: scheduleConfig.type == SCHEDULE.WEEKDAY_OF_MONTH || scheduleConfig.type == SCHEDULE.WEEKDAY_OF_YEAR ? scheduleConfig.week.value : 0,
      day: scheduleConfig.type == SCHEDULE.WEEKDAY_OF_EVERY_WEEK ? scheduleConfig.weekday.value : scheduleConfig.type == SCHEDULE.DAY_OF_MONTH || scheduleConfig.type == SCHEDULE.LAST_DAY_OF_EVERY_MONTH || scheduleConfig.type == SCHEDULE.WEEKDAY_OF_MONTH ? scheduleConfig.weekplusday.value : scheduleConfig.type == SCHEDULE.DAY_OF_A_YEAR || scheduleConfig.type == SCHEDULE.WEEKDAY_OF_YEAR ? scheduleConfig.weekplusdayforyear.value : 0,
      st: scheduleConfig.scheduleType.value != 4 ? me.customFormDate[0].valueOf() / 1000 : scheduleConfig.customTimeFrame[0].valueOf() / 1000,
      et: scheduleConfig.scheduleType.value != 4 ? me.durationToSecConversion() : scheduleConfig.customTimeFrame[1].valueOf() / 1000,
      zone: scheduleConfig._selectedTimeZone.value,
      offset: scheduleConfig._selectedTimeZone.diffTimeStamp / 1000,
      dayST: scheduleConfig.scheduleType.value != 4 ? me.advConfigService.utcHourMinuteConvertor(me.customFormDate[0].valueOf()) : 0
    }
    for(let i = 0; i < me.addedScheduleConfig.length; i++)
    { 
      if(me.updateScheduleMode? me.indexOfSchedulerSelected != i && MenuItemUtility.deepEqual(me.addedScheduleConfig[i], scheduleConfig, ['index', 'colorForGraph', 'scheduleType', 'type','weekplusday','weekplusdayforyear','weekday','week', 'month', 'customFormDate','customTimeFrame']) : MenuItemUtility.deepEqual(me.addedScheduleConfig[i], scheduleConfig, ['index', 'colorForGraph','scheduleType', 'type','weekplusday','weekplusdayforyear','weekday','week', 'month', 'customTimeFrame','customFormDate']))
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Same Schedule is already configured for this rule' });
          return;
      }
    } 
    if (me.updateScheduleMode) {
      me.addedScheduleConfig[me.indexOfSchedulerSelected] = scheduleConfig;
      if(isAdd)
      {
        if(me._feature == MODULE.ALERT_RULE)
          me.alertConfigurationComponent.setAdvaceConfigration(false, me.indexOfSchedulerSelected, tmpSchedule);
        else if(me._feature == MODULE.ALERT_MAINTENANCE)
          me.configMaintenanceComponent.maintenanceConfig.maintenances[0].attributes.scheduleConfig = tmpSchedule;
      }
      me.updateScheduleMode = !me.updateScheduleMode;
    }
    else{ 
      me.addedScheduleConfig.push(scheduleConfig);
      if (isAdd)
      {
        if(me._feature == MODULE.ALERT_RULE)
          me.alertConfigurationComponent.setAdvaceConfigration(true, me.indexOfSchedulerSelected, tmpSchedule);
        else if(me._feature == MODULE.ALERT_MAINTENANCE)
          me.configMaintenanceComponent.maintenanceConfig.maintenances[0].attributes.scheduleConfig = tmpSchedule;
      }
    }
    me.scheduleConfig.scheduleType = RULE_SCHEDULETYPE_TYPE[0];
    me.scheduleConfig.weekday = "";
    me.scheduleConfig.ruleScheduleWeekDayItem = "";
    me.scheduleConfig.week = "";
    me.scheduleConfig.ruleScheduleMonthItem ="";
    me.scheduleConfig.month = "";
    me.scheduleConfig._selectedTimeZone = me.sessionService.selectedTimeZone? me.sessionService.selectedTimeZone : me.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset");
    me.customTimeFrame = [
      moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
      moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
    ];
    me.scheduleConfig.durationMt = 0;
    me.scheduleConfig.durationHr = 0;
    me.customFormDate = [
      moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
    ];
    
  }

  validateRuleScheduleConfiguration(scheduleConfig: ScheduleConfiguration){
    const me = this;
    if(scheduleConfig.scheduleType.value != RULE_SCHEDULETYPE_TYPE[4].value)
    {
      if(scheduleConfig.durationHr <= 0 && scheduleConfig.durationMt <= 0)
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter schedule duration' });
        return SCHEDULE.NON_OF_ABOVE;
      }
      
      if(scheduleConfig.durationHr > 23)
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid hours duration' });
        return SCHEDULE.NON_OF_ABOVE;
      }

      if(scheduleConfig.durationHr > 59)
      {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid minutes duration' });
        return SCHEDULE.NON_OF_ABOVE;
      }
    }

    if (scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[0].value){
      if (me.validateFromToDate(scheduleConfig))
        return SCHEDULE.NON_OF_ABOVE;
      return SCHEDULE.EVERY_DAY;
    }
    else if (scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[1].value){
      if (!scheduleConfig.weekday) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week day.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (me.validateFromToDate(scheduleConfig))
        return SCHEDULE.NON_OF_ABOVE;
      return SCHEDULE.WEEKDAY_OF_EVERY_WEEK;
    }
    else if (scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[2].value) {
      if (!scheduleConfig.ruleScheduleWeekDayItem) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select day.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (me.validateFromToDate(scheduleConfig))
          return SCHEDULE.NON_OF_ABOVE;

      if (scheduleConfig.ruleScheduleWeekDayItem.label == 'Last')
        return SCHEDULE.LAST_DAY_OF_EVERY_MONTH;
      else if (scheduleConfig.ruleScheduleWeekDayItem.label == 'Sunday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Monday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Tuesday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Wednesday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Thursday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Friday' || scheduleConfig.ruleScheduleWeekDayItem.label == 'Saturday'){
        if (!scheduleConfig.week) {
            me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week.' });
            return SCHEDULE.NON_OF_ABOVE;
        }
        return SCHEDULE.WEEKDAY_OF_MONTH;
      }
      else
        return SCHEDULE.DAY_OF_MONTH;
    }
    else if (scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[3].value) {
      if (!scheduleConfig.ruleScheduleMonthItem) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select day.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (!scheduleConfig.month) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select month.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (me.validateFromToDate(scheduleConfig))
        return SCHEDULE.NON_OF_ABOVE;

      if (scheduleConfig.ruleScheduleMonthItem.label == 'Sunday' || scheduleConfig.ruleScheduleMonthItem.label == 'Monday' || scheduleConfig.ruleScheduleMonthItem.label == 'Tuesday' || scheduleConfig.ruleScheduleMonthItem.label == 'Wednesday' || scheduleConfig.ruleScheduleMonthItem.label == 'Thursday' || scheduleConfig.ruleScheduleMonthItem.label == 'Friday' || scheduleConfig.ruleScheduleMonthItem.label == 'Saturday'){
        if (!scheduleConfig.week) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week.' });
          return SCHEDULE.NON_OF_ABOVE;
        }
        return SCHEDULE.WEEKDAY_OF_YEAR;
      }
      else
        return SCHEDULE.DAY_OF_A_YEAR;
    }
    else if (scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[4].value) {
      if (!me.customTimeFrame || !me.customTimeFrame[0] || !me.customTimeFrame[1]) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid start and end time.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start date and End date should not be the same.' });
        return SCHEDULE.NON_OF_ABOVE;
      } else if (me.customTimeFrame[0].valueOf() > me.customTimeFrame[1].valueOf()) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start date should be less then End date.' });
        return SCHEDULE.NON_OF_ABOVE;
      }
      return SCHEDULE.CUSTOM_EVENT_DAY;
    }
    else
      return SCHEDULE.NON_OF_ABOVE;
  }

  validateFromToDate(scheduleConfig: ScheduleConfiguration) {
    const me = this;
    if (!me.customFormDate[0]) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid start time.' });
      return true;
    } /* else if (!scheduleConfig.toDate) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid end time.' });
      return true;
    } */ /* else if (scheduleConfig.fromDate.getTime() >= scheduleConfig.toDate.getTime()) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start date should be less then End date.' });
      return true;
    } */
    else
      return false;
  }

  /**
   * This is used when user click on the row of derived componet table
   */
  updateScheduler(index: number, schedulerData: ScheduleConfiguration) {
    try {
      const me = this;
      me.indexOfSchedulerSelected = index;
      me.addedScheduleConfig[index].updateScheduler = !me.addedScheduleConfig[index].updateScheduler;
      me.updateScheduleMode = me.addedScheduleConfig[index].updateScheduler;

      const scheduleConfig: ScheduleConfiguration = {
        scheduleType: schedulerData.scheduleType,
        ruleScheduleWeekDayItem: schedulerData.weekplusday,
        ruleScheduleMonthItem: schedulerData.weekplusdayforyear,
        weekday: schedulerData.weekday,
        week: schedulerData.week,
        month: schedulerData.month,
        fromDate: schedulerData.fromDate,
        toDate: schedulerData.toDate,
        durationHr: schedulerData.durationHr,
        durationMt: schedulerData.durationMt,
        _selectedTimeZone: schedulerData._selectedTimeZone
      }
      if (schedulerData.scheduleType.value == RULE_SCHEDULETYPE_TYPE[4].value){
        me.customTimeFrame = [
          moment(schedulerData.customTimeFrame[0]).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
          moment(schedulerData.customTimeFrame[1]).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
        ];
      }
      else
      {
        me.customFormDate = [
          moment(schedulerData.customFormDate[0]).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
        ]
      }
      me.scheduleConfig = scheduleConfig;
      if (!me.updateScheduleMode){
        let diffTimeStamp = this.sessionService.selectedTimeZone?
        this.sessionService.selectedTimeZone.diffTimeStamp : 
        this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

        let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

        me.scheduleConfig = {
          scheduleType: RULE_SCHEDULETYPE_TYPE[0],
          fromDate: new Date(Date.parse(moment(me.sessionService.time).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))),
          toDate: new Date(Date.parse(moment(me.sessionService.time).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))),
          durationHr: 0,
          durationMt: 0,
          _selectedTimeZone: me.sessionService.selectedTimeZone? me.sessionService.selectedTimeZone : me.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset")
        }
        
        me.customTimeFrame = [
          moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
          moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
        ];

        me.customFormDate = [
          moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        ]
      }
      let i = 0;
      while (i < me.addedScheduleConfig.length) {
        if (me.addedScheduleConfig[i].updateScheduler && i != index) {
          me.addedScheduleConfig[i].updateScheduler = false;
        }
        i++;
      }
    } catch (error) {
      console.error("Exception in selectGraph method = ", error);
    }
  }

  deleteScheduler(idx: number){
    const me = this;
    me.addedScheduleConfig.splice(idx,1);
    me.alertConfigurationComponent.setAdvaceConfigration(false, idx, null);
    me.addedScheduleConfig.forEach((schedule,idx) => {
      schedule.index = METRIC_COLOR_ARR[idx].name;
      schedule.colorForGraph = METRIC_COLOR_ARR[idx].color;
    });
  }

  showDialog() {
    super.show();
  }

  open(schedule: boolean, scheduleConfig: ScheduleConfig[], feature: number) {
    const me = this;
    me.visible = schedule;
    me._feature = feature;
    me.addedScheduleConfig = [];
    me.custom = [];

    if(feature == MODULE.ALERT_RULE)
    {
      me.custom = RULE_SCHEDULETYPE_TYPE;
      me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_RULE);
    }
    else
    {
      me.custom = MAINTENANCE_SCHEDULETYPE_TYPE;
      me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_MAINTENANCE);
    }

    if(scheduleConfig)
    {
      scheduleConfig.forEach(element => {
        me.scheduleConfig = {
          scheduleType: element.type == SCHEDULE.EVERY_DAY ? RULE_SCHEDULETYPE_TYPE[0] : element.type == SCHEDULE.WEEKDAY_OF_EVERY_WEEK ? RULE_SCHEDULETYPE_TYPE[1] : element.type == SCHEDULE.DAY_OF_MONTH || element.type == SCHEDULE.LAST_DAY_OF_EVERY_MONTH || element.type == SCHEDULE.WEEKDAY_OF_MONTH ? RULE_SCHEDULETYPE_TYPE[2] : element.type == SCHEDULE.DAY_OF_A_YEAR || element.type == SCHEDULE.WEEKDAY_OF_YEAR ? RULE_SCHEDULETYPE_TYPE[3] : RULE_SCHEDULETYPE_TYPE[4],
          weekday: element.type == SCHEDULE.WEEKDAY_OF_EVERY_WEEK ? me.weekdays[element.day] : {},
          ruleScheduleWeekDayItem: element.type == SCHEDULE.DAY_OF_MONTH || element.type == SCHEDULE.LAST_DAY_OF_EVERY_MONTH ? me.weekMonthDays[element.day + 6] : element.type == SCHEDULE.WEEKDAY_OF_MONTH ? me.weekMonthDays[element.day] : undefined,
          ruleScheduleMonthItem: element.type == SCHEDULE.DAY_OF_A_YEAR ? me.weekMonthDays[element.day + 6] : element.type == SCHEDULE.WEEKDAY_OF_YEAR ? me.weekMonthDays[element.day] : undefined,
          week: element.type == SCHEDULE.WEEKDAY_OF_MONTH || element.type == SCHEDULE.WEEKDAY_OF_YEAR ? me.week[element.week - 1] : undefined,
          month: element.type == SCHEDULE.DAY_OF_A_YEAR || element.type == SCHEDULE.WEEKDAY_OF_YEAR ? me.monthList[element.month] : undefined,
          //fromDate: new Date(Date.parse(moment(element.st * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))),
          durationHr: Math.trunc(element.et/3600),
          durationMt: (element.et - Math.trunc(element.et/3600) * 60 * 60)/60,
          _selectedTimeZone: me.advConfigService.getTimeZoneInfo(element.zone, "value")
        }

        if (me.scheduleConfig.scheduleType.value == RULE_SCHEDULETYPE_TYPE[4].value){
          me.customTimeFrame = [
            moment(element.st * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
            moment(element.et * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
          ];
        }
        else
        {
          me.customFormDate = [
            moment(element.st * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
          ]
        }

        me.addUpdateScheduler(false);
      });
    }

    if(me._feature == MODULE.ALERT_RULE || !scheduleConfig)
    {
      let diffTimeStamp = this.sessionService.selectedTimeZone?
      this.sessionService.selectedTimeZone.diffTimeStamp : 
      this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      me.scheduleConfig = {
        scheduleType: RULE_SCHEDULETYPE_TYPE[0],
        fromDate: new Date(Date.parse(moment(me.sessionService.time).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))),
        toDate: new Date(Date.parse(moment(me.sessionService.time + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))),
        durationHr: 0,
        durationMt: 0,
        _selectedTimeZone: me.sessionService.selectedTimeZone? me.sessionService.selectedTimeZone : me.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset")
      }

      me.customFormDate = [
        moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
      ]
      
      me.customTimeFrame = [
        moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
      ];
    }

    /* console.log("time ==", new Date().getDay(), "time with zone == ", 
    new Date(Date.parse(
      moment(new Date().getTime()).zone(
        me.sessionService && me.sessionService.selectedTimeZone != null ? 
        me.sessionService.selectedTimeZone.offset : "+0530").format('MM/DD/YYYY HH:mm:ss'))).getDay(), 
        me.sessionService.selectedTimeZone.offset, ", utc ==", new Date().getDay()); */
  }

  onTimeFilterCustomTimeChange() {
    const me = this;
    /* setTimeout(() => {
      console.log("me.customTimeFrame ", me.customTimeFrame);
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        console.log("1 ", me.customTimeFrame[0].valueOf(), ", 2: ", me.customTimeFrame[1].valueOf());
        if (me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()) {
          //const me = this;
          //me.timeFilterEnableApply = false;
          me.invalidDate = true;
          console.log("me.invalidDate: ", me.invalidDate);
        } else {
          me.invalidDate = false;
          console.log("me.invalidDate ", me.invalidDate);
         const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    }); */
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

  durationToSecConversion()
  {
    const me = this;

    return (me.scheduleConfig.durationHr * 60 * 60 + me.scheduleConfig.durationMt * 60);
  }

  /* weekConvertionZoneWise(scheduleConfig: ScheduleConfiguration)
  {
    const me = this;
    if(!scheduleConfig.weekday)
      return {};

    return MenuItemUtility.searchByAnyKey(scheduleConfig.fromDate.getDay(), me.weekdays, "value");
  } */

  /* dayCovertionZoneWise(scheduleConfig: ScheduleConfiguration)
  {
    const me = this;
    //let currentDate = new Date(Date.parse(moment(new Date().getTime()).utc().format('MM/DD/YYYY HH:mm:ss')));
    let utcDateForm = new Date(Date.parse(moment(scheduleConfig.fromDate.getTime() - me.sessionService.selectedTimeZone.diffTimeStamp).format('MM/DD/YYYY HH:mm:ss')));

    let totalDayInMonth;

    let dateOfAlerting = new Date(Date.parse(moment(new Date().getTime()).utc().format('MM/DD/YYYY HH:mm:ss')));
    dateOfAlerting.setHours(utcDateForm.getHours(), utcDateForm.getMinutes());
    dateOfAlerting.setDate(utcDateForm.getDate());

    if(utcDateForm.getMonth() == 1)
    {
      if(me.isLeapYear(utcDateForm.getFullYear()))
        totalDayInMonth = 28;
      else
        totalDayInMonth = 29;
    }
    else
    {
      totalDayInMonth = MenuItemUtility.searchByAnyKey(utcDateForm.getMonth(), me.monthListWithDay, "value")["totalDay"];
    }
    
    if(scheduleConfig.scheduleType.value == SCHEDULE.DAY_OF_MONTH)
    {
      if(totalDayInMonth == utcDateForm.getDate())
        dateOfAlerting.setDate(MenuItemUtility.searchByAnyKey(me.currentUTCDate.getMonth(), me.monthListWithDay, "value")["totalDay"]);
      else
        dateOfAlerting.setDate(utcDateForm.getDate());

      if(dateOfAlerting.getTime() + me.durationToSecConversion() < me.currentUTCDate.getTime())
      {
        dateOfAlerting.setDate(1);
        dateOfAlerting.setMonth(me.currentUTCDate.getMonth() + 1);

        if(totalDayInMonth == utcDateForm.getDate())
          dateOfAlerting.setDate(MenuItemUtility.searchByAnyKey(me.currentUTCDate.getMonth() + 1, me.monthListWithDay, "value")["totalDay"]);
        else
          dateOfAlerting.setDate(utcDateForm.getDate());
      }
    }
    else if(scheduleConfig.scheduleType.value == SCHEDULE.DAY_OF_A_YEAR && utcDateForm.getMonth() == 1 && totalDayInMonth == utcDateForm.getDate())
      dateOfAlerting.setDate(MenuItemUtility.searchByAnyKey(1, me.monthListWithDay, "value")["totalDay"]);
    
    let day: any = MenuItemUtility.searchByAnyKey(new Date(Date.parse(
        moment(dateOfAlerting.getTime() + me.sessionService.selectedTimeZone.diffTimeStamp).
        format('MM/DD/YYYY HH:mm:ss'))).getDate(), me.dayList, "value")
    
    return day;
  } */
  
}

