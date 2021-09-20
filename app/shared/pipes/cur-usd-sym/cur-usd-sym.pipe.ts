import { Pipe, PipeTransform } from '@angular/core';

const intlCurUS: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
});

@Pipe({
  name: 'cur_usd_sym',
})
export class CurUsdSymPipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return '$0';
    }
    if (value < 0 ) {
      return '$0';
    }
    return intlCurUS.format(value);
  }
}
