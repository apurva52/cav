import {Pipe, PipeTransform} from "@angular/core";
 
/**
 *Pipe for calculating roundoff value from any html
 */
@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
    /**
     *
     * @param value
     * @returns {number}
     */
    transform(value: number): number {
        return isNaN(value)?value:Math.round(value);
    }
}