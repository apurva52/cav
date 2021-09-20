import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashboardsDeleteTitle'
})
export class DashboardsDeleteTitle implements PipeTransform {

  transform(value: any, user: any, operation:any, nodes: any, ...args: unknown[]): unknown {
    if(sessionStorage.getItem("Permission") == "false"){
        return "No permission to delete dashboard";
    }
   else if(!value['path']){
        return "No permission to delete dashboard";
    }
    else if(nodes && nodes.length){
        return "No permission to delete dashboard";
    }
    else if ((value['access'] == 4 || value['access'] == 0) && value['owner'] !== user) {
      return "No permission to delete dashboard";
    }

    else if ((value['icon'] == "icons8-user" || value['icon'] == "icons8-project")&&(operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple') && value['type']== 'File') {
      return "No permission to delete user/system default dashboard.";
    }
    else if ((value.path?.indexOf('/dashboards/system') == 0 ) && (operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple')) {
      return "No permission to delete system default dashboard.";
    }
    else if ((value['label'] == sessionStorage.getItem('loadedDashboardName') && value['path'] == sessionStorage.getItem('loadedDashboardPath')) && (operation == 'edit' || operation == 'delete' || operation == 'deleteMultiple') && value['type']== 'File' ) {
      return "No permission to delete currently loaded dashboard.";
    }
    else {
      return "Delete Dashboard.";
    }

  }
}
