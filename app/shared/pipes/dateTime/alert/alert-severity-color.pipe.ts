import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';

//{{ dateVar | formatdatetime: default }}
@Pipe({
  name: 'colorCrossSeverity',
})
export class AlertSeverityColor implements PipeTransform {
  constructor(private sessionService: SessionService) {}

  transform(input: any, type: string): any {

    if (type == 'sevborder')
      return input == 3 ? "#f12929" : input == 2 ? "#ff9898" : input == 1 ? "#ffc9c9" : "rgb(183, 216, 183)";
    else if (type == 'sevname')
      return input == 3 ? "Critical" : input == 2 ? "Major" : input == 1 ? "Minor" : input == 0 ? "Normal" : "Info";
    else
      return input == "Critical"? "#f12929" :  input == "Major"? "#ff9898": input == "Minor"? "#ffc9c9" : "rgb(183, 216, 183)";
  }
}
