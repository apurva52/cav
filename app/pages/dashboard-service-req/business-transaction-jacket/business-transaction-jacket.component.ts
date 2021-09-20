import {
  Component,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
  Output,
} from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { FlowPathService } from '../../drilldown/flow-path/service/flow-path.service';
import { FlowPathLoadedState, FlowPathLoadingErrorState, FlowPathLoadingState } from '../../drilldown/flow-path/service/flow-path.state';
import { FlowPathTable } from '../../drilldown/flow-path/service/flow-path.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-business-transaction-jacket',
  templateUrl: './business-transaction-jacket.component.html',
  styleUrls: ['./business-transaction-jacket.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class BusinessTransactionJacketComponent implements OnInit {

  data: FlowPathTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  rowID: number;
  isShow: boolean;
  sortDetails : boolean;
  selectedData: any;
  selectedRow = [];
  def_pagination:any;
  sortFieldName = '';

  @Output() closeClick = new EventEmitter<boolean>();
  @Output() selectRowEvent = new EventEmitter<any>();

  constructor(
    private flowPathService: FlowPathService,
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.rowID = params['rowID']
    });
  }

  ngOnInit(): void {
    const me = this;
    me.def_pagination =me.sessionService.getSetting("def_pagination");
    me.load(me.def_pagination);  
  }
  closeSearch() {
    this.isShow = false;
    this.closeClick.emit(this.isShow);
  }
  openSort() {
    this.sortDetails = true;
  }

  load(def_pagination) {
    const me = this;
    me.flowPathService.load(def_pagination).subscribe(
      (state: Store.State) => {
        if (state instanceof FlowPathLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof FlowPathLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: FlowPathLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  getListData(listData) {    
    const me = this;
    me.selectedData = listData;
    me.selectRowEvent.emit(me.selectedData);
  }
  

  private onLoading(state: FlowPathLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: FlowPathLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: FlowPathLoadedState) {
    const me = this; 
    me.data = state.data;
    me.error = null;
    me.loading = false;

    let highRow = {} ;
    for (const [i,row] of me.data.data.entries()){
      if (row.flowpathInstance ==  me.rowID) {  
        console.log("flowpath instance:"+row.flowpathInstance);    
        console.log("flowpath row data:"+JSON.stringify(row));
        me.data.data.splice(i,1);
        highRow = row;
        me.getListData(row);
      }      
    }
    me.data.data.unshift(highRow);
    me.selectedRow.push(highRow);
  }

  sortColumnsOnCustom(field, order, tempData) {
    const me = this;
    console.log("yaha aara hu ki ni", field, order, tempData);
    //for interger type data type
    if (field == "startTime") {
      if (order == -1) {
        var temp = (field);
        order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = field;
        order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    } else if (field == "appName" || field == "correlationId") {
      if (order == -1) {
        var temp = field;
        order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = field;
        order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else if(field == "methods" || field == "responseTime" || field == "callOuts" || field == "coherenceCallOut" || 
    field == "jmsCallOut" || field == "dbCallouts" || field == "totalError" || field == "status" || 
    field == "flowpathInstance" || field == "ndSessionId" || field == "nvPageId" || field == "syncTime" || 
    field == "nvSessionId" || field == "btCpuTime" || field == "storeId" || field == "terminalId" || 
    field == "QTimeInMS" || field == "suspensiontime" || field == "iotime" || field == "waitTime") {
      if (order == -1) {
        var temp = field;
        order = 1;
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return 1;
          } else if (b[temp].startsWith('<')) {
            return -1;
          }

          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = field;
        order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return -1;
          } else if (b[temp].startsWith('<')) {
            return 1;
          }
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      if (order == -1) {
        var temp = field;
        order = 1;
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let value;
          let value2;
          value = a[temp];
          value2 = b[temp];
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      } else {
        var temp = field;
        order = -1;
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let value;
          let value2;
          value = a[temp];
          value2 = b[temp];
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }

    }
    this.data.data = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.data.data = this.Immutablepush(this.data?.data, rowdata) });
    }
    //this.data = [...this.data];
  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

 sortColumnData(sortType) {
    const me = this;
    console.log("order", this.data, this.data?.data, sortType,  this.sortFieldName);
    const order = sortType === "asc" ? "1":"-1";
    this.sortColumnsOnCustom(this.sortFieldName, order, me.data?.data)
  }
}
