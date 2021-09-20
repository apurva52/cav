import { Pipe, PipeTransform } from '@angular/core';

const intlEnUS: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

@Pipe({
  name: 'f_kpi',
})
export class FKpiPipe implements PipeTransform {
  transform(value: any): any {
    if (value < 0 || value == '<0' || value === null || value === '') {
      return '-';
    } else if (value > 0 && value < 1) {
      return '<1';
    } else if (isNaN(value)) {
      return value;
    } else return intlEnUS.format(value);
  }
}
