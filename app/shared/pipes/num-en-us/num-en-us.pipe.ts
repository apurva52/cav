import { Pipe, PipeTransform } from '@angular/core';

const intlEnUS: Intl.NumberFormat = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0,
  minimumFractionDigits: 0});

@Pipe({
  name: 'num_en_us',
})
export class NumEnUsPipe implements PipeTransform {
  transform(value: number): any {
    if (isNaN(value)) {
      return '-';
    }

    return intlEnUS.format(value);
  }
}
