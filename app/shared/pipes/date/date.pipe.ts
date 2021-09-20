import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';


//{{ dateVar | formatdate: long }}
@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

    transform(input: number | string, type: string): any {
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

        const format: string = environment.formats.date[type];

        return moment(input).format(format);
    }
}
