import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lt_1'
})
export class Lt1Pipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return '-';
    }
    if (value === 0) {
      return 0;
    }
    if (value < 1 ) {
      return '<1';
    } else {
      return value;
    }
  }

}
