import { Moment } from "moment-timezone";
import { TimeZoneValueInfo } from "src/app/core/session/session.model";

export interface ScheduleConfiguration {
  id?: number;
  index?: string;
  colorForGraph?: string;
  scheduleType?: any;
  type?: number;
  weekday?: any;
  month?: any;
  week?: any;
  day?: any;
  from?: any;
  to?: any;
  toDate?: Date;
  fromDate?: Date;
  customTimeFrame?: Moment[],
  customFormDate?: Moment[],
  weekplusday?: any;
  weekplusdayforyear?: any;
  ruleScheduleWeekDayItem?: any;
  ruleScheduleMonthItem?: any;
  durationHr: number;
  durationMt: number;
  _selectedTimeZone: TimeZoneValueInfo;
}

export interface UpcomingScheduleConfig{
  ust?: number;
  uet?: number;
}