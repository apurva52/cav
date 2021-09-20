export class ModelWinDataInfo {

  modelAction: string;
  errorMessage: string;
  disableDialogCheckbox:boolean = false;
  headerName: string;
  message: string;
  actionBtnName = 'OK';
  cancelBtnName = 'Cancel';
  height :string;
  width:string;
}

export class InvalidRequest {
  errorMessage : string;
  status : number;
}
