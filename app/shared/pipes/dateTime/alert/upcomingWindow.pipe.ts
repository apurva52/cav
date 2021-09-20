import {Pipe, PipeTransform} from '@angular/core';  
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';
import { ScheduleConfig } from 'src/app/pages/my-library/alert/alert-rules/alert-configuration/service/alert-config.model';
import { AdvancedConfigurationService } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.service';
import { UpcomingScheduleConfig } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.model';

@Pipe ({  
  name : 'upcomingWindow'  
})  
export class UpcomingWindow implements PipeTransform {

    constructor(private sessionService: SessionService,
                private advConfigService: AdvancedConfigurationService){}

  transform(scheduleConfig: ScheduleConfig) : String {  

   const me = this;
   let offSet;
    if(!this.sessionService.selectedTimeZone)
      offSet = "+0530";
    else
      offSet = this.sessionService.selectedTimeZone.offset; 

   let diffTimeStamp = this.sessionService.selectedTimeZone?
      this.sessionService.selectedTimeZone.diffTimeStamp : 
      this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      let upcomingSchConfig: UpcomingScheduleConfig = me.advConfigService.upcomingScheduleTiming(scheduleConfig);
      return "From "+moment(upcomingSchConfig.ust).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("MM/DD/YYYY HH:mm:ss")+" To "+moment(upcomingSchConfig.uet).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format("MM/DD/YYYY HH:mm:ss");
 }
}  