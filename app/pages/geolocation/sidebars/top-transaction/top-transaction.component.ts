import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { GeolocationComponent } from '../../geolocation.component';
import { TopTransactionData } from './service/top-transaction.model';
import { TopTransactionService } from './service/top-transaction.service';
import {
  TopTransactionsLoadedState,
  TopTransactionsLoadingErrorState,
  TopTransactionsLoadingState,
} from './service/top-transaction.state';
import { GeolocationService } from '../../service/geolocation.service';
import { MenuItem } from 'primeng';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';

@Component({
  selector: 'app-top-transaction',
  templateUrl: './top-transaction.component.html',
  styleUrls: ['./top-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopTransactionComponent
  extends PageSidebarComponent
  implements OnInit {
  data: TopTransactionData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  isColumnFilter: boolean;
  transactionFilterTitle: string = 'Enable Filters';

  cols: TableHeaderColumn[];
  _selectedColumns: TableHeaderColumn[];

  cols1: TableHeaderColumn[];
  _selectedColumns1: TableHeaderColumn[];
  downloadOptions: MenuItem[];

  @Input() geoLocation: GeolocationComponent;

  selectedAppName: any;
  tp : any;
  st : any;
  et : any;

  constructor(private topTransactionService: TopTransactionService, private geolocationService: GeolocationService) {
    super();
    const me = this;
    //getting app name
    me.selectedAppName = this.geolocationService.$selectedGeoApp;
    //Setting duration object
    me.tp = me.geolocationService.$tp;
    me.st = me.geolocationService.$st;
    me.et = me.geolocationService.$et;
  }

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
     
      {
      label: 'WORD',
      command: () => {
      const me = this;
      me.downloadShowDescReports("worddoc");
      }
      },
      {
      label: 'EXCEL',
      command: () => {
      const me = this;
      me.downloadShowDescReports("excel");
      }
      },
      {
      label: 'PDF',
      command: () => {
      const me = this;
      me.downloadShowDescReports("pdf");
      }
      }
      
    ]
    this.load(me.selectedAppName, me.geolocationService.getDuration());
  }

  load(selectedAppName, duration) {
    const me = this;
    me.topTransactionService.load(selectedAppName, duration).subscribe(
      (state: Store.State) => {
        console.log('state====>',state)
        if (state instanceof TopTransactionsLoadingState) {
          me.onTransactionLoading(state);
          return;
        }

        if (state instanceof TopTransactionsLoadedState) {
          me.onTransactionLoaded(state);
          return;
        }
      },
      (state: TopTransactionsLoadingErrorState) => {
        me.onTransactionLoadingError(state);
      }
    );
  }

  private onTransactionLoading(state: TopTransactionsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onTransactionLoadingError(state: TopTransactionsLoadingErrorState) {
    const me = this;

    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onTransactionLoaded(state: TopTransactionsLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    console.log('me.data===>',me.data)
    if (me.data) {
      me.empty = false;
      if (
        (!me.data.topTransaction.data && me.data.topTransaction.data == null) ||
        me.data.topTransaction.data.length == 0
      ) {
        me.emptyTable = true;
      }
       //To round off the top ten transaction table values.
       me.data.topTransaction.data.forEach(function (valueData, i) {
        me.data.topTransaction.headers[0].cols.forEach(function (value) {
          if(!isNaN(valueData[value.valueField] || 0)){
             me.data.topTransaction.data[i][value.valueField]  = Math.round(valueData[value.valueField] || 0);
            //me.data.topTransaction.data[i][value.valueField]  = valueData[value.valueField] || 0;
          }
        })
      });
    } else {
      me.empty = true;
    }

    me.cols = me.data.topTransaction.headers[0].cols;

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

  closeClick() {
    this.geoLocation.showTopTransactionJacket = false;
    this.geoLocation.viewStatistics = true;
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.topTransaction.data;
    let header = ['S No.'];
    let headerValueField = [];
    let colWidth = [125, 125, 125, 125];
    
    for (const c of me._selectedColumns){
    header.push(c.label)
    headerValueField.push(c.valueField)
    }
    
    let rowData:any []=[];
    for(let i =0;i<tableData.length;i++){
    let rData:string []=[];
    rData.push((i+1).toString());
    for(let j=0; j<headerValueField.length; j++){
    if(headerValueField[j] === 'no')
    continue;
    else if(headerValueField[j] === 'transaction')
    rData.push(tableData[i].transaction);
    else if(headerValueField[j] === 'tps')
    rData.push(tableData[i].tps);
    else if(headerValueField[j] === 'res')
    rData.push(tableData[i].res);
    }
    rowData.push(rData);
    }
    
    try {
    me.topTransactionService.downloadShowDescReports(label, rowData,header, colWidth).subscribe(
    (state: Store.State) => {
    if (state instanceof DownloadReportLoadingState) {
    me.onLoadingReport(state);
    
    return;
    }
    
    if (state instanceof DownloadReportLoadedState) {
    me.onLoadedReport(state);
    return;
    }
    },
    (state: DownloadReportLoadingErrorState) => {
    me.onLoadingReportError(state);
    
    }
    );
    } catch (err) {
    console.error("Exception in downloadShowDescReports method in metric description component :", err);
    }
    }
    private onLoadingReport(state: DownloadReportLoadingState) {
      const me = this;
      me.error = null;
      me.loading = true;
      }
      private onLoadedReport(state: DownloadReportLoadedState) {
      const me = this;
      me.error = null;
      me.loading = false;
      let path = state.data.path.trim();
      let url = window.location.protocol + '//' + window.location.host;
      path = url + "/common/" + path;
      window.open(path + "#page=1&zoom=85", "_blank");
      
      }
      private onLoadingReportError(state: DownloadReportLoadingErrorState) {
      const me = this;
      me.data = null;
      me.error = state.error;
      me.loading = false;
      }
}
