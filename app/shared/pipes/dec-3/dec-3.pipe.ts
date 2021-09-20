import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dec_3',
})
export class Dec3Pipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return 0;
    }

    const num: any = value + 'e+' + 3;
    let val = Number(Math.round(num) + 'e-' + 3) ;
    if(val.toString() == '0') {
      return '0.000';
    }
    if(val.toString().includes('.')) {
      return val.toLocaleString('en-US', {minimumFractionDigits: 3});
    }else {
      return val.toLocaleString() + '.000';
    }
  }
}
