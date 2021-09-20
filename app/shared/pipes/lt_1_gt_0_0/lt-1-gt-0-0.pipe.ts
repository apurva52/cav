import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lt_1_gt_0_0'
})
export class Lt1Gt0Is0Pipe implements PipeTransform {

    transform(value: number): any {
        if (isNaN(value)) {
            return value;
        }
        if (value < 1 && value >= 0) {
            return 0;
        } else {
            return Math.round(value);
        }
    }

}
