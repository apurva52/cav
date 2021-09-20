import { Pipe, PipeTransform } from '@angular/core';

const intlCurUS: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

@Pipe({
  name: 'cur_usd_sym_dec_2',
})
export class CurUsdSymDec2Pipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return '$0.00';
    }
    if (value < 0 ) {
      return '$0.00';
    }

    return intlCurUS.format(value);
  }
}
