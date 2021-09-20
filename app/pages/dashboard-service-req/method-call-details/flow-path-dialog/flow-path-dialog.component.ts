import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { MethodCallDetailsData, MethodCallDetailsTable, MethodCallDetailsTableHeaderCols, MethodCallDetailsTableLoadPayload } from '../service/method-call-details.model';
import { MethodCallDetailsService } from '../service/method-call-details.service';
import { MethodCallDetailsLoadingState, MethodCallDetailsLoadedState, MethodCallDetailsLoadingErrorState } from '../service/method-call-details.state';

@Component({
  selector: 'app-flow-path-dialog',
  templateUrl: './flow-path-dialog.component.html',
  styleUrls: ['./flow-path-dialog.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class FlowPathDialogComponent implements OnInit {

  data: MethodCallDetailsTable;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  visible: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  @Output() closeFlowpathDialog: EventEmitter<any> = new EventEmitter();
  @Input() flowpathDialogData: any;
  cols: MethodCallDetailsTableHeaderCols[];
  _selectedColumns: MethodCallDetailsTableHeaderCols[];
  selectedRow: MethodCallDetailsTable;
  
  constructor(
    private methodCallService : MethodCallDetailsService
  ) { }

  ngOnInit(): void {
    const me = this;
    console.log("flowpathDialogData****************",me.flowpathDialogData);
    me.data =me.flowpathDialogData;
    me.cols = me.data.headers[0].cols;
    me._selectedColumns = me.cols;
    me.visible=true;
    console.log("flowpathDialogData****************",me.data.paginator);
    // me.load();
  }

  closeDialog(){
    this.closeFlowpathDialog.emit(false);
  }

  load() {
    const me = this;
    me.methodCallService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof MethodCallDetailsLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof MethodCallDetailsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: MethodCallDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: MethodCallDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MethodCallDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: MethodCallDetailsLoadedState) {
    const me = this;
    // me.data = state.data;
    // me.error = null;
    // me.loading = false;
    // me.cols = me.data.treeTable.headers[0].cols;
    // me._selectedColumns = me.cols;
  }

  open(){
    const me = this;
    me.visible=true;
  }


}
