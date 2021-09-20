import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FlowPathDialogComponent } from '../flow-path-dialog/flow-path-dialog.component';
import { RepeatedCalloutDetailsTable } from './service/repeated-callout-details.model';
import { RepeatedCalloutDetailsService } from './service/repeated-callout-details.service';
import { RepeatedCalloutDetailsLoadedState, RepeatedCalloutDetailsLoadingErrorState, RepeatedCalloutDetailsLoadingState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState } from './service/repeated-callout-details.state';

@Component({
  selector: 'app-repeated-callout-details',
  templateUrl: './repeated-callout-details.component.html',
  styleUrls: ['./repeated-callout-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RepeatedCalloutDetailsComponent implements OnInit {

  data: RepeatedCalloutDetailsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  isOn: number;

  selectedFilter = "Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All";
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  selectedRow: any;
  @Output() backClick =new EventEmitter<number>();
  showUI: boolean = false;
  downloadItems: MenuItem[];
  itemsall: MenuItem[];
  displayDetails: boolean;
  displayFlowpathInstance: boolean;

  // isEnabledColumnFilter: boolean = false;
  // filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  @Input() argsForRepeatedMethods: any;
  dataForRepeatedMethods: any;
  repeatedMethodtable: RepeatedCalloutDetailsTable;
  repeatedFQM:string="";
  substringFQM:string="";
  methodName: any;
  methodArguments: string="";
  showPagination: boolean = false;

  constructor(private repeatedCalloutDetailsService: RepeatedCalloutDetailsService,
    private f_ddr: DdrPipe) {
  }

  ngOnInit(): void {
    const me = this;
    me.loading = true;
    // me.load();

    me.downloadItems = [
      {
        label : 'Word',
        command: () => {
          const me = this;
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label : 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports("excel");
        }
      },
      {
        label : 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports("pdf");
        }
      }
    ]
   console.log("this.argsForRepeatedMethods<<<<<<<<<<<<<<<<****************>>>>>>>>>>>>>>>>",me.argsForRepeatedMethods);
   me.getRepeadtedData();

  }

  backDetails(){
    this.isOn = 1;
    this.backClick.emit(this.isOn)
  }
  showInstrumentationDetails(){
    this.displayDetails = true;
  }
  showFlowpathInstance(){
    this.displayFlowpathInstance = true;
  }
  getRepeadtedData(){
    const me = this;

    me.empty = false;
    me.dataForRepeatedMethods = me.argsForRepeatedMethods[0];
    me.repeatedMethodtable = me.argsForRepeatedMethods[1];
    console.log("this.dataForRepeatedMethods*****>>>>>>>>>>",me.dataForRepeatedMethods);
    console.log("this.repeatedMethodtable*****>>>>>>>>>>",me.repeatedMethodtable);
    if (me.dataForRepeatedMethods) {
      me.empty = false;
      me.repeatedFQM=me.dataForRepeatedMethods[0]['fqm'];
      me.methodName = (me.dataForRepeatedMethods[0]['methodName']).replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
      if(me.repeatedFQM  != "-")
      me.substringFQM=me.repeatedFQM;
      else
      me.substringFQM=this.methodName;
      if(me.repeatedFQM  != "-" && me.repeatedFQM.length >100 )
      me.substringFQM=me.repeatedFQM.substring(0,100)+"...";
      else if(me.methodName.length >100)
      me.substringFQM=me.methodName.substring(0,100)+"...";

      //for getting arguments at 0 index
      for (let i=0; i<me.dataForRepeatedMethods.length; i++){
	      if(i == 0){
          this.methodArguments = me.dataForRepeatedMethods[i]['methodArgument'];
          // console.log("default calll")
          // this.methodArguments =me.dataForRepeatedMethods[i]['threadName'];
         } 
      }

    if(!me.dataForRepeatedMethods && me.dataForRepeatedMethods == null){
        me.emptyTable = true;
      }

    } else {
      me.empty = true;
    }
    me.cols = me.repeatedMethodtable.headers[0].cols;
    me._selectedColumns =[];
    for(const c of me.repeatedMethodtable.headers[0].cols)
    if(c.selected)
    me._selectedColumns.push(c);
    me.loading = false;
    if( me.dataForRepeatedMethods.length > me.repeatedMethodtable.paginator.rows){
      me.showPagination = true;
    }
  }

  load() {
    const me = this;
    me.repeatedCalloutDetailsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof RepeatedCalloutDetailsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof RepeatedCalloutDetailsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: RepeatedCalloutDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

  }

  private onLoading(state: RepeatedCalloutDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: RepeatedCalloutDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;

  }

  private onLoaded(state: RepeatedCalloutDetailsLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.empty = false;
    if (me.data) {
      me.empty = false;
      if(!me.data.data && me.data.data == null){
        me.emptyTable = true;
      }

    } else {
      me.empty = true;
    }
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

  // toggleFilters() {
  //   const me = this;
  //   me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
  //   if (me.isEnabledColumnFilter === true) {
  //     me.filterTitle = 'Disable Filters';
  //   } else {
  //     me.filterTitle = 'Enable Filters';
  //   }
  // }
  showRowInfo(RowData){
    this.methodArguments = RowData.methodArgument;
  
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableHeader = me.repeatedMethodtable;
    let tableData = me.dataForRepeatedMethods;
    let header = [];
    let rowData:any []=[];

    header.push("S No.");

    for (const c of tableHeader.headers[0].cols)
        header.push(c.label);

    for (let i=0; i<tableData.length ; i++){
      let rData:string []=[];
        let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].methodArgument);
          rData.push(tableData[i].timeStamp);
          rData.push(tableData[i].wallTime);
          rData.push(tableData[i].percentage);
          rData.push(tableData[i].queueTime);
          rData.push(tableData[i].selfTime);
          rData.push(tableData[i].cpuTime);
          rData.push(tableData[i].waitTime);
          rData.push(tableData[i].syncTime);
          rData.push(tableData[i].ioTime);
          rData.push(tableData[i].suspensionTime);
          rData.push(tableData[i].threadId);
          rData.push(tableData[i].threadName);
          rData.push(tableData[i].lineNumber);
        rowData.push(rData);
    }

    try {
      me.repeatedCalloutDetailsService.downloadShowDescReports(label, rowData, header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in repeated callout details component :", err);
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
    let path = state.data.comment.trim();
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
