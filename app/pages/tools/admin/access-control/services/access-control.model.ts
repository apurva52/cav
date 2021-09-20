import {
  TableHeaderColumn,
  Table,
  //TableHeader,
} from 'src/app/shared/table/table.model';

export interface AccessControlTableHeaderCols extends TableHeaderColumn {
  rowColorField?: boolean;
}
export interface TableHeader {
  cols: AccessControlTableHeaderCols[];
}

export interface AccessControlTable extends Table {
  headers?: TableHeader[];
  iconsField?: any;
  rowBgColorField?: any;
  data?: any[];

}


export interface getAllUserResponse {

  userList: [
    {
      userId?: number,
      name?: String,
      type?: String,
      din?: String
    }],
  capabilityList: [
    {
      name?: String,
      type?: String,
      description?: String
    }],
  groupList: [
    {
      name?: String,
      type?: String,
      description?: String
    }]


}

export interface saveUserReq {

  userId: string,
  name: string,
  type: string,
  email: string,
  password: string,
  confirmPassword: string,
  mobileNO: string

}

export interface saveUserGroupCapabilityRes {
  status: string
}

export interface groupSaveReq {
  name: string,
  type: string,
  description: string
}

export interface aclCompleteList {
  userCapabilities: any,
  statusCode: any,
  errorMsg: any,
  data: {
    account: [any],
    capabilityList: [any],
    groupList: [any],
    projectClusterList: [any],
    projectList: [any],
    userList: [any]
  }
}