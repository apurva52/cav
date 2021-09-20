import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashboardsDynamicTitle'
})
export class DashboardsDynamicTitlePipe implements PipeTransform {

  transform(value: any, user: any, operation:any, ...args: unknown[]): unknown {
    if ((value['access'] == 4 || value['access'] == 0) && value['owner'] !== user) {
      return true;
    }

    else if ((value['icon'] == "icons8-user" || value['icon'] == "icons8-project")&&(operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple') && value['type']== 'File') {
      return true;
    }
    else if ((value.path?.indexOf('/dashboards/system') == 0 ) && (operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple')) {
      return true;
    }
    else if ((value['label'] == sessionStorage.getItem('loadedDashboardName') && value['path'] == sessionStorage.getItem('loadedDashboardPath')) && (operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple') && value['type']== 'File' ) {
      return true;
    }
    else {
      return false;
    }

  }
}
