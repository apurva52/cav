import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { SessionService } from 'src/app/core/session/session.service';


//{{ dateVar | formatdatetime: default }}
@Pipe({
    name: 'clientFormatDateTime'
})
export class ClientFormatDateTimePipe implements PipeTransform {

  constructor(private sessionService : SessionService){}

    transform(input: number, type: string): any {
        if (!input) {
            return null;
        }

        if (!type) {
            console.error(new Error('Date type is not provided. Please provid date type eg: "something date | cav-date: "short""'));
            return null;
        }

        if ( !environment.formats.date[type] ) {
            console.error(new Error('Date type provided is invalid. Please refer `environment.formats.date`'));
            return null;
        }

        const format: string = environment.formats.dateTime[type]; 
        let clientTimeInfo = JSON.parse(localStorage.getItem('session'))['defaults']['clientTimeInfo'];
        return moment(input).zone(clientTimeInfo.offset).format(format);
        // return moment(input).format(format);
    }
}
