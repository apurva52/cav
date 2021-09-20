
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {
  transform(input: string, maxLength: number) {
    if (maxLength === undefined) {
      return input;
    }

    if (input && input.length > maxLength) {
      return input.substring(0, maxLength) + '...';
    } else {
      return input;
    }
  }
}
