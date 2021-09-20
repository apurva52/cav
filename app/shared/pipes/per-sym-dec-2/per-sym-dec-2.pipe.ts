import { Pipe, PipeTransform } from '@angular/core';

// const intlEnUS: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
//   style: 'percent',
//   maximumFractionDigits: 2,
//   minimumFractionDigits: 2,
// });

@Pipe({
  name: 'per_sym_dec_2',
})
export class PerSymDec2Pipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return '0.00%';
    }
    const p = value.toFixed(2);
    return p+'%';
    // return intlEnUS.format(value);
  }
}
