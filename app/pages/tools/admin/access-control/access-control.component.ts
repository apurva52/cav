import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { AppError } from "src/app/core/error/error.model";
import { Store } from "src/app/core/store/store";
import { AccessControlTable, AccessControlTableHeaderCols } from "./services/access-control.model";
import { AccessControlService } from "./services/access-control.service";
import { AccessControlLoadedState, AccessControlLoadingErrorState, AccessControlLoadingState } from "./services/access-control.state";
import { ACCESS_CONTROL_DATA_TABLE_USERS } from "./services/access-control.dummy";

@Component({
  selector: "app-access-control",
  templateUrl: "./access-control.component.html",
  styleUrls: ["./access-control.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class AccessControlComponent implements OnInit {

  data: any[];
  error: AppError;
  empty: boolean;
  loading: boolean;
  _selectedColumns: AccessControlTableHeaderCols[];
  cols: any[];
  selectedRow: any;

  constructor() { 

  }

  ngOnInit() {
   
    const me = this;
    
    me.data = ACCESS_CONTROL_DATA_TABLE_USERS.data;
   
    me.cols = ACCESS_CONTROL_DATA_TABLE_USERS.headers[0].cols;
    me._selectedColumns = me.cols;

  }


  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

}
