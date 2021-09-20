import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TransactionFlowpathDetailsTable } from './service/transaction-flowpath-details.model';
import { TransactionFlowpathDetailsService } from './service/transaction-flowpath-details.service';
import { TransactionFlowpathDetailsLoadedState, TransactionFlowpathDetailsLoadingErrorState, TransactionFlowpathDetailsLoadingState } from './service/transaction-flowpath-details.state';

@Component({
  selector: 'app-transaction-flowpath-details',
  templateUrl: './transaction-flowpath-details.component.html',
  styleUrls: ['./transaction-flowpath-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionFlowpathDetailsComponent implements OnInit {
  data: TransactionFlowpathDetailsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  isShow: boolean;
  _selectedColumns: any;
  cols: any;

  menuOptions: MenuItem[];
  downloadOptions: MenuItem[];
  items1 : MenuItem[];
  displayDetails: boolean;

  showFlowpathDetailsModel:boolean;
  
  @Output() arrowClick = new EventEmitter<boolean>();
  
  constructor(private flowpathDetailsService: TransactionFlowpathDetailsService, private router: Router) { }

  ngOnInit(): void {
    const me = this;
    me.load();

    me.menuOptions = [
      {
        label : 'Start Instrumentation',
        command: (event: any) => {
          this.showInstrumentationDetails();
        },
      },
      {
        label : 'Copy flowpath Link'
      },
      {
        label : 'Show all flowpath of selected flowpath session'
      },
      {
        label : 'Show all flowpath of selected flowpath NV session'
      },
      {
        label : 'Show all flowpath of selected flowpath instance'
      },
      {
        label : 'Open aggregate method timing for selected flowpaths'
      },
      {
        label : 'Deleted cache data'
      },
    ]
    me.downloadOptions = [
      {
        label : 'Word'
      },
      {
        label : 'Excel'
      },
      {
        label : 'PDF'
      }
    ]
    me.items1 = [
      {
        label: 'Method Timing Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/method-timing']);
        },
      },
      {

        label: 'DB Request Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/db-queries']);
        },
      },

      {
        label: 'Flowpath Analyzer',
        command: (event: any) => {
          this.router.navigate(['/flowpath-analyzer']);
        },
      },
      {
        label: 'BT IP Summary',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/ip-summary']);
        },
      },
    ];
  }

  showInstrumentationDetails(){
    this.displayDetails = true;
  }

  backDetails(){
    this.isShow = false;
    this.arrowClick.emit(this.isShow)
  }

  load() {
    const me = this;
    me.flowpathDetailsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionFlowpathDetailsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TransactionFlowpathDetailsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionFlowpathDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TransactionFlowpathDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TransactionFlowpathDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TransactionFlowpathDetailsLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.cols = me.data.headers[0].cols;
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

  openDownloadFileDialog() {
    const me = this;
    me.showFlowpathDetailsModel = true;
  }
  close() {
    this.showFlowpathDetailsModel = false;
  }
}
