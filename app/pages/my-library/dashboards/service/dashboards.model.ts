import { SelectItem } from 'primeng';
import {
  CompareCTX,
  DashboardFavCTX,
} from 'src/app/shared/dashboard/service/dashboard.model';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
} from 'src/app/shared/table/table.model';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
export interface MyDashboardsTable extends Table {
  headers?: DashboardTableHeader[];
  data: any;
  options: SelectItem[];
}

export interface DashboardTableHeader {
  cols: DashboardHeaderCols[];
}

export interface DashboardHeaderCols extends TableHeaderColumn {}

export interface Status {
  code?: number;
  message?: string;
  detailedMesssage?: string;
}

export interface DashboardReq {
  opType?: number;
  //cctx?: ClientCTX;
  cctx?: Object;
  tr?: string;
  compareCtx?: CompareCTX;
  multiDc?: boolean;
  favCtx?: DashboardFavCTX;
}

export const DELETE_DASHBOARD: number = 6;
export const DELETE_DASHBOARD_DIRECTORY: number = 9;
export const DELETE_MULTIPLE_DASHBOARD: number = 8;
export const SAVE_DASHBOARD: number = 1;
export const UPDATE_DASHBOARD: number = 2;
export const EDIT_DASHBOARD: number = 3;
export const READ_MODE: number = 4;
export const COPY_DASHBOARD : number = 5;
export const READ_WRITE_MODE: number = 7;
export const NO_ACCESS: number = 0;
export const USER_DEFAULT : number = 16;
export const PROJECT_DEFAULT : number = 15;

/*code msgs*/
export const DUPLICATE_DASHBOARD_NAME: number = 210;
export const DASHBOARD_SUCCESSFULY_SAVED: number = 211;
export const EXCEPTION_IN_DASHBOARD_SAVING: number = 212;
export const DASHBOARD_SUCCESSFULY_DELETED: number = 213;
export const EXCEPTION_IN_DASHBOARD_DELETING: number = 214;
export const NO_DASHBOARD_AVAILABLE: number = 215;
export const DASHBOARD_PATH_IS_NOT_AVAL_ON_SERVER: number = 216;
export const DASHBOARD_EXCEPTION : number = 217;
export const NO_WRITE_ACCESS_FOR_DASHBOARD : number = 218;
export const NO_WRITE_ACCESS_FOR_DASHBOARD_MESSAGE : string = "User has no write permissions.";
export const EXCEPTION_IN_DASHBOARD_SAVING_MESSAGE : string = "Exception in saving dashboard."
export const DASHBOARD_USER_PROJECT_SAVED:number = 219;
export const DASHBOARD_USER_SAVING_MESSAGE : string = "Do you want to set this dashboard as user default dashboard ?";
export const DASHBOARD_PROJECT_SAVING_MESSAGE : string = "Do you want to set this dashboard as project default dashboard ?";
export const DASHBOARD_PROJECT_INFO_MESSAGE : string = "Cannot delete this dashboard directory as it contains project default dashboard.";
export const DASHBOARD_USER_INFO_MESSAGE : string = "Cannot delete this dashboard directory as it contains user default dashboard.";
export const DASHBOARD_CURRENT_LOAD_INFO_MESSAGE : string = "Cannot delete this dashboard directory as it contains current loaded dashboard.";
export const DELETE_MULTIPLE_DASHBOARD_MESSAGE : string = "Are you sure to delete selected files and directories ?";
export const DELETE_DASHBOARD_DIRECTORY_MESSAGE : string = "Are you sure to delete this dashboard directory ?";
export const DELETE_DASHBOARD_MESSAGE : string = "Are you sure to delete this dashboard ?";