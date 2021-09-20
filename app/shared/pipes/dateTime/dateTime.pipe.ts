import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';
import { AdvancedConfigurationService } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.service';

//{{ dateVar | formatdatetime: default }}
@Pipe({
  name: 'formatDateTime',
})
export class FormatDateTimePipe implements PipeTransform {
  constructor(private sessionService: SessionService,
    private advConfigService: AdvancedConfigurationService,
    ) {}

  transform(input: number, type: string): any {
    let customMeasurement;
    if (!input) {
      return null;
    }

    if (!type) {
      console.error(
        new Error(
          'Date type is not provided. Please provid date type eg: "something date | cav-date: "short""'
        )
      );
      return null;
    }

    if (type === 'customcompare') {
      customMeasurement = 'customcompare';
      type = 'default';
    }
    if (!environment.formats.date[type]) {
      console.error(
        new Error(
          'Date type provided is invalid. Please refer `environment.formats.date`'
        )
      );
      return null;
    }

    const format: string = environment.formats.dateTime[type];
    let selectedTimeZone = this.sessionService.selectedTimeZone;

    let offSet;
    if(!selectedTimeZone)
      offSet = "+0530";
    else
      offSet = this.sessionService.selectedTimeZone.offset; 
    
      let diffTimeStamp = this.sessionService.selectedTimeZone?
      this.sessionService.selectedTimeZone.diffTimeStamp : 
      this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;
    if (customMeasurement && customMeasurement == 'customcompare')
      return moment.tz(input, this.sessionService && this.sessionService.selectedTimeZone ? this.sessionService.selectedTimeZone.diffTimeStamp == 0 ? "-0000" : offSet : offSet).format(format);
    else
      return moment(input).zone(this.sessionService && this.sessionService.selectedTimeZone? this.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : offSet : offSet).format(format);//in case of UTC it coming '0000' which wrong as moment could not understand this without (+/-) sign. Hence we handle this from gui for now
    // return moment(input).format(format);
  }
}
