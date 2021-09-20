import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dec_2'
})
export class Dec2Pipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return 0;
    }

    const num: any = value + 'e+' + 2;
    return Number(Math.round(num) + 'e-' + 2);
    // return value.toFixed(2);
  }

}
