import { PipeTransform, Pipe } from '@angular/core';
@Pipe({ name: 'col' })
export class ColorPipe implements PipeTransform {
    transform(value, args: string[]): any {
       if (value == 'G' || value == 'g')
          return 'green';
       else if (value == 'R' || value == 'r')
          return 'red';
       else if (value == 'Y' || value == 'y')
          return '#dee509';
       else
           return 'green';
    }
}
