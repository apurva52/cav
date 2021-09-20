import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "commaFormat"
})
export class CommaFormatPipe implements PipeTransform {
    transform(value) {
       
        let val = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return val;
    }
}