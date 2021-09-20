import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lt_0'
})
export class Lt0Pipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return '-';
    }
    if (value < 0) {
      return '<0';
    } else {
      return value;
    }
  }

}
