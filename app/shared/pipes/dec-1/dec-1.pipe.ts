import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dec_1',
})
export class Dec1Pipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return 0;
    }

    const num: any = value + 'e+' + 1;
    return Number(Math.round(num) + 'e-' + 1);
    // return value.toFixed(1);
  }
}
