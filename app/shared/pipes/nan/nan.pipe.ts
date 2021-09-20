import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nan'
})
export class NanPipe implements PipeTransform {

  transform(value: number): any {
    if (isNaN(value)) {
      return '-';
    }
    if (value === -123456789) {
      return '-';
    } else {
      return value;
    }
  }
}
