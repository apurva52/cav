import { Injectable } from "@angular/core";
import { SessionService } from "src/app/core/session/session.service";
import * as moment from 'moment-timezone';
import { ScheduleConfig } from "../../../alert-rules/alert-configuration/service/alert-config.model";
import { TimeZoneValueInfo } from "src/app/core/session/session.model";
import { REPEAT, SCHEDULE } from "./advanced-configuration.dummy";
import { UpcomingScheduleConfig } from "./advanced-configuration.model";
@Injectable({
	providedIn: 'root',
})
export class AdvancedConfigurationService {
	constructor(private sessionService: SessionService){

	}

	utcHourMinuteConvertor(time: number)
	{
		var currentDate = new Date();

		let offSet
		if(!this.sessionService.selectedTimeZone)
    offSet = "+0530";
  else
    offSet = this.sessionService.selectedTimeZone.offset; 

		currentDate.setTime(Date.parse(moment(time).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format('MM-DD-YYYY HH:mm:ss')));
		/* currentDate.setHours(0);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);
		const utcCurrDate = moment(currentDate).utc().valueOf(); */ //this.sessionService.reveseTimeToUTCTimeZone(Date.parse(currentDate.toUTCString()));
		return (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds())
	}

	localTimeHourMinuteConvertor(time: number)
	{
		var currentDate = new Date();
		currentDate.setHours(0);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);
		const utcCurrDate = moment(currentDate).utc().valueOf(); //this.sessionService.reveseTimeToUTCTimeZone(currentDate.getTime());
		// return this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(time + utcCurrDate);
		return (time + utcCurrDate);
	}

	getTimeZoneInfo(keyValue: string, key: string): TimeZoneValueInfo
  {
    const me = this;
    let index = "0";
    for(index in me.sessionService.timeZoneLists){
      if(me.sessionService.timeZoneLists[index]['value'][key] == keyValue){
        return me.sessionService.timeZoneLists[index]['value'];
      }
    }
  }

		updateScheduleTime(scheduleTime: Date, currentTime: Date)
		{
				scheduleTime.setDate(currentTime.getDate());
				scheduleTime.setFullYear(currentTime.getFullYear());
				scheduleTime.setMonth(currentTime.getMonth());
		}

		upcomingTimeInfo(schedule: ScheduleConfig, st: Date, scheduleTime: Date, scheduleTimeZone: TimeZoneValueInfo): UpcomingScheduleConfig
		{
			  const me = this;
			  let upSchConf: UpcomingScheduleConfig = {
							ust: st.getTime(),
							uet: me.endTimeCalculation(schedule, scheduleTime.getTime())
					}
					return upSchConf;
		}

		endTimeCalculation(schedule: ScheduleConfig, st: number)
		{
			 return st + (schedule.et * 1000);
		}

		adjustUpComingTime(scheduleTime: Date, currentTime: Date, schedule: ScheduleConfig, day: number, scheduleTimeZone: TimeZoneValueInfo): UpcomingScheduleConfig
		{
			 const me = this;
				if(scheduleTime.getTime() > currentTime.getTime())
						return me.upcomingTimeInfo(schedule, scheduleTime, scheduleTime, scheduleTimeZone);
				else if(scheduleTime.getTime() < currentTime.getTime() && me.endTimeCalculation(schedule, scheduleTime.getTime()) >= currentTime.getTime())
						return me.upcomingTimeInfo(schedule, currentTime, scheduleTime, scheduleTimeZone);
				else
				{
					 if(day == -1)
						  return null;
							
						scheduleTime.setDate(scheduleTime.getDate() + day);
						return me.upcomingTimeInfo(schedule, scheduleTime, scheduleTime, scheduleTimeZone);
				}
		}

		weekDayAdjustmentToBack(scheduleTime: Date, schedule: ScheduleConfig)
		{
			 if(scheduleTime.getDay() > schedule.day)
					scheduleTime.setDate(scheduleTime.getDate() - (scheduleTime.getDay() - schedule.day));
				else if(scheduleTime.getDay() < schedule.day)
				{
						scheduleTime.setDate(scheduleTime.getDate() - REPEAT.WEEK_DAY);

						scheduleTime.setDate(scheduleTime.getDate() + (schedule.day - scheduleTime.getDay()));
				}
		}

		weekDayAdjustmentToAdvance(scheduleTime: Date, schedule: ScheduleConfig)
		{
			 let weekDay;
				if(schedule.type == SCHEDULE.WEEKDAY_OF_EVERY_WEEK)
					weekDay = schedule.day
				else
				 weekDay = schedule.day;

				if(scheduleTime.getDay() > weekDay)
				{
						for(let i = scheduleTime.getDay(); i < 7;)
						{
								if(i == weekDay)
										break;
								else
									scheduleTime.setDate(scheduleTime.getDate() + 1);

								if(i == 6)
								{
										i = 0;
										continue;
								}
								i++;
						}
				}
				else if(scheduleTime.getDay() < weekDay)
						scheduleTime.setDate(scheduleTime.getDate() + (weekDay - scheduleTime.getDay()));
		}

		schduleDateUpdateWithWeekRow(schedule: ScheduleConfig, scheduleTime: Date)
		{
				const me = this;
				if(schedule.week == 1)
				{
						scheduleTime.setDate(schedule.week);
						me.weekDayAdjustmentToAdvance(scheduleTime, schedule);
				}
				else if(schedule.week == 5)
				{
						scheduleTime.setDate(me.getDaysInMonth(scheduleTime.getMonth(), scheduleTime.getFullYear()));
						me.weekDayAdjustmentToBack(scheduleTime, schedule);
				}
				else
				{
						scheduleTime.setDate(1 + ((schedule.week - 1) * REPEAT.WEEK_DAY));
						me.weekDayAdjustmentToAdvance(scheduleTime, schedule);
				}
		}

	upcomingScheduleTiming(schedule: ScheduleConfig): UpcomingScheduleConfig
	{
				const me = this;
				const scheduleTimeZone: TimeZoneValueInfo = me.getTimeZoneInfo(schedule.zone, "value");

				var scheduleTime = new Date(schedule.st * 1000);

				const currentTime = new Date();

				if(SCHEDULE.CUSTOM_EVENT_DAY == schedule.type)
				{
							let upSchConf: UpcomingScheduleConfig = {
								ust: (schedule.et * 1000 > currentTime.getTime()) && (schedule.st * 1000 < currentTime.getTime())? (currentTime.getTime() - scheduleTimeZone.diffTimeStamp) : (scheduleTime.getTime() - scheduleTimeZone.diffTimeStamp),
								uet: (schedule.et * 1000 - scheduleTimeZone.diffTimeStamp)
						}
						return upSchConf;
				}
				else if(SCHEDULE.EVERY_DAY == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						return me.adjustUpComingTime(scheduleTime, currentTime, schedule, REPEAT.EVERY_DAY, scheduleTimeZone);
				}
				else if(SCHEDULE.WEEKDAY_OF_EVERY_WEEK == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						me.weekDayAdjustmentToAdvance(scheduleTime, schedule);
						return me.adjustUpComingTime(scheduleTime, currentTime, schedule, REPEAT.WEEK_DAY, scheduleTimeZone);
				}
				else if(SCHEDULE.DAY_OF_MONTH == schedule.type || SCHEDULE.LAST_DAY_OF_EVERY_MONTH == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						scheduleTime.setDate(schedule.day);

						if(schedule.day == 31 || schedule.day == 32)
							scheduleTime.setDate(me.getDaysInMonth(scheduleTime.getMonth(), scheduleTime.getFullYear()));

						return me.adjustUpComingTime(scheduleTime, currentTime, schedule, me.getDaysInMonth(scheduleTime.getMonth(), scheduleTime.getFullYear()), scheduleTimeZone);
				}
				else if(SCHEDULE.WEEKDAY_OF_MONTH == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						let nextMonth = 0;
						while(true)
						{
								scheduleTime.setMonth(scheduleTime.getMonth() + nextMonth);
								me.schduleDateUpdateWithWeekRow(schedule, scheduleTime);
								
								let upSchConf: UpcomingScheduleConfig = me.adjustUpComingTime(scheduleTime, currentTime, schedule, -1, scheduleTimeZone);
								if(!upSchConf)
									nextMonth++;
								else
										return upSchConf;
						}
				}
				else if(SCHEDULE.DAY_OF_A_YEAR == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						scheduleTime.setDate(schedule.day);
						scheduleTime.setMonth(schedule.month);
						let nextYear = 0;

						while(true)
						{
							 scheduleTime.setFullYear(scheduleTime.getFullYear() + nextYear);
								if(schedule.month == 1 && schedule.day >= 28)
										scheduleTime.setDate(me.getDaysInMonth(scheduleTime.getMonth(), scheduleTime.getFullYear()));
								else if(schedule.day > 30)
										scheduleTime.setDate(me.getDaysInMonth(scheduleTime.getMonth(), scheduleTime.getFullYear()));

								let upSchConf: UpcomingScheduleConfig = me.adjustUpComingTime(scheduleTime, currentTime, schedule, -1, scheduleTimeZone);
								if(!upSchConf)
									 nextYear++;
								else
									 return upSchConf;
						}
				}
				else if(SCHEDULE.WEEKDAY_OF_YEAR == schedule.type)
				{
						me.updateScheduleTime(scheduleTime, currentTime);
						let nextYear = 0;
						while(true)
						{
							 scheduleTime.setMonth(schedule.month);
								scheduleTime.setFullYear(scheduleTime.getFullYear() + nextYear);
								me.schduleDateUpdateWithWeekRow(schedule, scheduleTime);
								
								let upSchConf: UpcomingScheduleConfig = me.adjustUpComingTime(scheduleTime, currentTime, schedule, -1, scheduleTimeZone);
								if(!upSchConf)
									nextYear++;
								else
										return upSchConf;
						}
				}
	}

	isLeapYear(year: number)
	{
			//three conditions to find out the leap year
			if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
					return true;
			} else {
							return false;
			}
	}

	setRaceCasesForDate(date: Date)
	{
		 date.setSeconds(0);
			date.setMilliseconds(0);
			return date;
	}

	getDaysInMonth = function(month,year) 
	{
  // Here January is 1 based
  //Day 0 is the last day in the previous month
			return new Date(year, month + 1, 0).getDate();
		// Here January is 0 based
		// return new Date(year, month+1, 0).getDate();
 };

	isGuiInUTCTimeZone()
	{
		 const me = this;
			if(me.sessionService && me.sessionService.selectedTimeZone && me.sessionService.selectedTimeZone.diffTimeStamp == 0)
			  return true;
			else
			 	return false;
	}

}