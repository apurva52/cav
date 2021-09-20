import { Pipe, PipeTransform } from '@angular/core';

// const intlEnUS: Intl.NumberFormat = new Intl.NumberFormat('en-US',
// {style: 'percent',
// maximumFractionDigits: 0,
// minimumFractionDigits: 0
// });

@Pipe({
  name: 'per_sym'
})
export class PerSymPipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return '0%';
    }
    const p = value.toFixed(0);
    return p+'%';
  }

}
