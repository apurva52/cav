import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';
import { AdvancedConfigurationService } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/service/advanced-configuration.service';

//{{ dateVar | formatdatetime: default }}
@Pipe({
  name: 'alertTimeAgo',
})
export class AlertTimeAgo implements PipeTransform {
  constructor(private sessionService: SessionService,
			private advConfigService: AdvancedConfigurationService,
			) {}

  transform(input: number): any {
    if (!input) {
      return null;
    }

				var currentTime;
				let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

				if(this.sessionService && this.sessionService.time)
					currentTime = this.sessionService.time;
				else
					currentTime = moment(new Date().setMilliseconds(0)).utc().valueOf();


					let timeAgoStr = "";
					let timeDiff = currentTime - input;

					if(timeDiff < 0)
						return "0s";

					let days = Math.trunc(timeDiff/(60 * 24 * 60000));
					timeDiff = timeDiff % (60 * 24 * 60000);

					let hours = Math.trunc(timeDiff/(60 * 60000));
					timeDiff = timeDiff % (60 * 60000);

					let minutes = Math.trunc(timeDiff/(60000));
					timeDiff = timeDiff % (60000);

					let seconds = Math.trunc(timeDiff/(1000));


					if(days != 0)
						timeAgoStr = timeAgoStr + days + "d ";
					if(hours != 0)
						timeAgoStr = timeAgoStr + hours + "h ";
					if(minutes != 0)
						timeAgoStr = timeAgoStr + minutes + "m ";
					if(seconds != 0)
						timeAgoStr = timeAgoStr + seconds + "s";

						if(timeAgoStr == "")
							timeAgoStr = "0s";

    return timeAgoStr;
  }
}
