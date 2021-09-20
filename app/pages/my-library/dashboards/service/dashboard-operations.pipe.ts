import { Pipe, PipeTransform } from '@angular/core';
import { isPlainObject } from 'lodash';

@Pipe({
  name: 'dashboardOperations',
})
export class DashboardOperationsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    var obj = JSON.parse(value);
    if (obj.hasOwnProperty('path')) {
      return obj.path.indexOf('system') == 0 ? true : false;
    } else {
      var isAllow = false;
      if (obj.indexOf('/dashboards')! == 0)
        isAllow =
          obj.indexOf('system') == 0 ||
          obj.indexOf('Controller') == 0 ||
          obj.indexOf('Generators') == 0 ||
          obj.indexOf('KPI') == 0 ||
          obj.indexOf('mssqlfavorites') == 0 ||
          obj.indexOf('NDEHealth') == 0 ||
          obj.indexOf('NDEHealth_V2') == 0 ||
          obj.indexOf('SystemHealth') == 0
            ? true
            : false;
    }
    return isAllow;
  }
}
