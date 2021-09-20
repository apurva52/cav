import {Pipe, PipeTransform} from '@angular/core';  
import { day, days, month, week, PRESETS, weekMonthDays } from 'src/app/pages/my-library/alert/alert-maintenance/service/alert-maintenance.dummy'
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { ScheduleConfig } from 'src/app/pages/my-library/alert/alert-rules/alert-configuration/service/alert-config.model';
import { AdvancedConfigurationService } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.service';

@Pipe ({  
  name : 'schedule'  
})  
export class Schedule implements PipeTransform {

    constructor(private sessionService: SessionService,
                private advConfigService: AdvancedConfigurationService){}

  transform(scheduleConfig: ScheduleConfig) : String { 

    let offSet;
    if(!this.sessionService.selectedTimeZone)
      offSet = "+0530";
    else
      offSet = this.sessionService.selectedTimeZone.offset; 

   let diffTimeStamp = this.sessionService.selectedTimeZone?
                    this.sessionService.selectedTimeZone.diffTimeStamp : 
                    this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;
    
   if(scheduleConfig.type == 8){
       return "From "+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("MM/DD/YYYY HH:mm:ss")+" To " + moment(scheduleConfig.et * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("MM/DD/YYYY HH:mm:ss") + " duration " + scheduleConfig.zone;
   }
   else{
    switch(scheduleConfig.type){
        case (PRESETS.EVERY_DAY):
            return 'Every Day From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
            
        case (PRESETS.WEEKDAY_OF_EVERY_WEEK):
            return 'Every Week For '+MenuItemUtility.searchByAnyKey(scheduleConfig.day, days, "value").label+' From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
           
        case (PRESETS.DAY_OF_MONTH):
            return 'Every Month For '+MenuItemUtility.searchByAnyKey(scheduleConfig.day, day, "value").label+' Day From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
           
        case (PRESETS.WEEKDAY_OF_MONTH):
            return 'Every Month For '+MenuItemUtility.searchByAnyKey(scheduleConfig.day, weekMonthDays, "value").label+' of '+MenuItemUtility.searchByAnyKey(scheduleConfig.week, week, "value").label+' week From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
            
        case (PRESETS.LAST_DAY_OF_EVERY_MONTH):
            return 'Last Day Of Every Month From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
           
        case (PRESETS.DAY_OF_A_YEAR):
            return 'Every Year For '+MenuItemUtility.searchByAnyKey(scheduleConfig.day, day, "value").label+' Day of '+MenuItemUtility.searchByAnyKey(scheduleConfig.month, month, "value").label+' From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
       
        case (PRESETS.WEEKDAY_OF_YEAR):
            return 'Every Year For '+MenuItemUtility.searchByAnyKey(scheduleConfig.day, weekMonthDays, "value").label+' of '+MenuItemUtility.searchByAnyKey(scheduleConfig.week, week, "value").label+' week of '+MenuItemUtility.searchByAnyKey(scheduleConfig.month, month, "value").label+' From '+ moment(scheduleConfig.st * 1000).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("HH:mm:ss") +' For '+ (Math.trunc(scheduleConfig.et/3600) > 0? Math.trunc(scheduleConfig.et/3600) + " hours ":"") + ((scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 > 0? (scheduleConfig.et - Math.trunc(scheduleConfig.et/3600) * 60 * 60)/60 + " minutes":"") + " duration " + scheduleConfig.zone;
         }
        
        }
    }
   
}  