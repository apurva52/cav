import { Pipe, PipeTransform } from '@angular/core';

const intlEnUSDec: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

@Pipe({
  name: 'num_en_us_dec_2',
})
export class NumEnUsDec2Pipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return '-';
    }

    return intlEnUSDec.format(value);
  }
}
