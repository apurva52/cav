import { Pipe, PipeTransform } from '@angular/core';
// pipe
@Pipe({
  name: 'f_dbmon'
})
export class DBMonitoringPipe implements PipeTransform {

  transform(input: any, colDataType?: any): any {
    let result;
        if (input === null || input === 'NaN' || input == -123456789 || input === '' || input === 'null' || input == undefined || input == 'undefined') {
            return '-';
        }

        if (colDataType == 'string') {
            return input;
        }
        if (typeof (input) == 'string' && colDataType != 'string')
            if (input.includes('/') || input.includes('MB') || input.includes('%')) {
                console.log('value of this ', input.includes('/'));
                return '-';
            }
        if (colDataType == 'boolean') {
            if ((typeof (input) == 'string' && (input.toUpperCase( )  == 'TRUE' || input == 't' ))|| input == 1 || (typeof input == 'boolean' && input)) {
                return 'Yes';
            } else if ((typeof (input) == 'string' && (input.toUpperCase( ) == 'FALSE' || input == 'f' )) || input == 0 ||(typeof input == 'boolean' && !input))
                return 'No';
            else
                return '-';

        } else if (colDataType == 'number') {
            result = parseInt(input);
            if (isNaN(result)) {
                return '-';
            } else {
                return result.toLocaleString();
            }

        } else if (colDataType == 'decimal') {
            result = parseFloat(input);
            if (isNaN(result)) {
                return '-';
            }
            if (result.toString().includes('.')) {
                return result.toLocaleString('en-US', { minimumFractionDigits: 3 })
            } else {
                return result.toLocaleString();
            }
        }else if (colDataType == 'json'){
            return JSON.stringify(result);
        }
 
      }
    }
