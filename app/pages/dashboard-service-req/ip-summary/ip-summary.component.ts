import { Component, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Store } from 'src/app/core/store/store';
import { IpSummaryService } from './service/ip-summary.service';
import { IndIpData, IndIpTableHeaderCols, IpSummaryData, IpSummaryTableHeaderCols } from './service/ip-summary.model';
import { IpSummaryLoadingState, IpSummaryLoadedState, IpSummaryLoadingErrorState, IndIpLoadingState, IndIpLoadedState, IndIpLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState} from './service/ip-summary.state';
import { TableBoxTable } from 'src/app/pages/dashboard-service-req/ip-summary/table-box/service/table-box.model';
import { FilterUtils } from 'primeng/utils';
import { ActivatedRoute } from '@angular/router';
import { DrilldownService } from '../../drilldown/service/drilldown.service';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { DashboardServiceReqService } from 'src/app/pages/dashboard-service-req/service/dashboard-service-req.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../../pages/tools/actions/dumps/service/ddr-request.service';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import {MessageService} from 'primeng/api';
@Component({
  selector: 'app-ip-summary',
  templateUrl: './ip-summary.component.html',
  styleUrls: ['./ip-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IpSummaryComponent implements OnInit {
  data: IpSummaryData;
  dataindip :IndIpData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  displayBasic: boolean;
  displayBasicOpen: boolean;
  menuAll: MenuItem[];
  cols: IpSummaryTableHeaderCols[];
  indipcols:IndIpTableHeaderCols[];

  _selectedColumns: IpSummaryTableHeaderCols[];
  _indipselectedColumns:IndIpTableHeaderCols[];
  items: MenuItem[];
  itemsall: MenuItem[];
  downloadOptionsCalloutSummary: MenuItem[];
  downloadOptionsCalloutDetails: MenuItem[];
  displayDetails: boolean;

  isCheckbox: boolean;
  aggIpInfo : any[];
  ipInfoData: TableBoxTable;
  indBtPopupData : TableBoxTable[];
  isEnabledColumnFilter: boolean = false;
  isShowSearch: boolean;
  selectedBT: string = "";
  TotalCalloutCount: any;
  inputValue: any;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  flowPathRange:number = 10000;
  limit:number= 10000;

  finalValue: any;
  ipSummaryData =[];
  indIpData =[];
  totalRecords = 0;
  
  showAutoInstrPopUp:boolean = false;
  argsForAIDDSetting:any[];
  queryParams:any;
  testRun: string;
  productName: string;
  breadcrumb: BreadcrumbService;
  subscribeIpSummary:Subscription;
  showPaginationIpSum: boolean = false;
  showPaginationIndIp: boolean = false;
  @ViewChild("ipSummary") methodTiming: ElementRef;
  globalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  constructor(
    private ipSummaryService: IpSummaryService,
    private drillDownService: DrilldownService,
    private route : ActivatedRoute,
    private f_ddr:DdrPipe,
    private dashboardServiceReqService:DashboardServiceReqService,
    private ddrRequest:DDRRequestService,
    private sessionService: SessionService,
    private messageService: MessageService,
    breadcrumb: BreadcrumbService ) {
      this.breadcrumb = breadcrumb;
  }

  ngOnInit() {
    const me = this;
    me.testRun = this.sessionService.testRun.id; //testrun
    me.productName = this.sessionService.session.cctx.prodType; //product name
    this.queryParams = me.sessionService.getSetting("fpRowdata"); //stores current flowpath row data
    me.ipSummaryload();
    this.subscribeIpSummary = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.ipSummaryload();
  });
    me.itemsall = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.openAutoInstDialog();
        }
      }
    ]

    me.downloadOptionsCalloutSummary = [
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

    me.downloadOptionsCalloutDetails = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports1("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports1("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports1("pdf");
        }
      }
    ]

  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  closeBox() {
    this.displayBasic = false;
  }

  showInstrumentationDetails() {
    this.displayDetails = true;
    this.showAutoInstrPopUp =true;
  }

  ipSummaryload() {
    const me = this;
    me.ipSummaryService.ipSummaryload().subscribe(
      (state: Store.State) => {
        if (state instanceof IpSummaryLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof IpSummaryLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: IpSummaryLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: IpSummaryLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: IpSummaryLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: IpSummaryLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
   if( me.data.panels[0].data.length > me.data.panels[0].paginator.rows){
     me.showPaginationIpSum = true;
   }
    if (me.data.panels.length === 0) {
      me.empty = true;
    } else{
      for(let i=0;i<this.data.panels.length;i++){
        if(i==0){
          this.indipload(me.data.panels[i].data[i]);
        }
      }
    }

    for (const c of me.data.panels[0].headers[0].cols) {
      if (c.selected) {
        me.cols.push(c);
      }
    }
    // me.cols = me.data.panels[0].headers[0].cols;
    me._selectedColumns = me.cols;
  }


// need to confirm
  loadPagination(event: LazyLoadEvent, index) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.panels[index].data) {
        for (let i = 0; i <= this.ipSummaryData.length; i++) {
          if (index == i) {
            this.ipSummaryData[index] = this.data.panels[index].data.slice(event.first, (event.first + event.rows));

          }
        }
        this.ipSummaryData[index].sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
          );
        this.loading = false;
      }
    }, 1000);
  }

  loadIndIpPagination(event: LazyLoadEvent, index) {
    this.loading = true;
    setTimeout(() => {
      if (this.dataindip.panels[index].data) {
        for (let i = 0; i <= this.indIpData.length; i++) {
          if (index == i) {
            this.indIpData[index] = this.dataindip.panels[index].data.filter(row => this.filterField(row, event.filters));

          }
        }
        this.indIpData[index].sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
          );
        this.loading = false;
      }
    }, 1000);
  }

  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;
    
    if (field === 'minHttpCalloutCount' || field === 'maxHttpCalloutCount'|| field === 'totalHttpCalloutCount' || field === 'minDBCalloutCount' || field === 'maxDBCalloutCount' || field === 'totalDBCalloutCount' || field === 'minCalloutCount' || field === 'maxCalloutCount' || field === 'fpCount' || field === 'count' || field === 'mincount' || field === 'maxcount' || field === 'errorCount') {
    if (Number(rowA[field]) > Number(rowB[field])) return 1;
    else return -1;
    }
    else if (field === 'totalDuration' || field === 'avgDuration' || field === 'maxDuration' || field === 'minDuration' || field === 'avgNWDelay' || field === 'totalNWDelay') {
    if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
    else return -1;
    }
    else {
    return rowA[field].localeCompare(rowB[field]);
    }
    }
  
    filterField(row, filter) {
      let isInFilter = false;
      let noFilter = true;
      for (var columnName in filter) {
        if (row[columnName] == null) {
          return;
        }
        noFilter = false;
        let rowValue: String = row[columnName].toString().toLowerCase();
        let filterMatchMode: String = filter[columnName].matchMode;
        if (filterMatchMode.includes("contain") && rowValue.includes(filter[columnName].value.toLowerCase())) {
          isInFilter = true;
        } else if (filterMatchMode.includes("custom") && rowValue.includes(filter[columnName].value)) {
          isInFilter = true;
        }
      }
      if (noFilter) { isInFilter = true; }
      return isInFilter;
    }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): IpSummaryTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: IpSummaryTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  indipload(payload){
    console.log("payload",payload);
    const me = this;
    me.selectedBT = "[BT=" + payload.url;
    me.TotalCalloutCount=", Total Callout=" + payload.totalCalloutCount + "]"; 
    console.log("selectedBT" +me.selectedBT, "totalcount" +me.TotalCalloutCount);
    me.ipSummaryService.indipload(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof IndIpLoadingState) {
          me.onIndIpLoading(state);
          return;
        }
        if (state instanceof IndIpLoadedState) {
          me.onIndIpLoaded(state);
          return;
        }
      },
      (state: IndIpLoadingErrorState) => {
        me.onIndIpLoadingError(state);
      }
    );

  }
  private onIndIpLoading(state: IndIpLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onIndIpLoadingError(state: IndIpLoadingErrorState) {
    const me = this;
    me.dataindip = null;
    me.error = state.error;
    me.loading = false;
  }

  private onIndIpLoaded(state: IndIpLoadedState) {
    const me = this;
    me.dataindip = state.data;

    if(state.data.indBtPopupData){
      me.indBtPopupData = state.data.indBtPopupData;
      me.ipInfoData = me.drillDownService.interceptor.mappopupdata(me.dataindip.panels[0].data[0],me.indBtPopupData);
      me.aggIpInfo = [me.ipInfoData,me.dataindip.panels[0].data[0].renamebackendIPname];
    }
    me.error = null;
    me.loading = false;

    if( me.data.panels[0].data.length > me.data.panels[0].paginator.rows){
      me.showPaginationIndIp = true;
    }
    if (me.dataindip.panels.length === 0) {
      me.empty = true;
    } else {
      // let check = {}
      // me.loadPagination(check, 1);
      // this.totalRecords = this.data.panels[0].data.length;

    }
    for (const c of me.dataindip.panels[0].headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      // if (c.selected) {
      //   me.indipcols.push(c);
      // }
    }
    me.indipcols = me.dataindip.panels[0].headers[0].cols;
    me._indipselectedColumns = me.indipcols;
  }

  // clearFilters() {
  //   const me = this;
  //   me.inputValue = document.querySelector('.search-box');
  //   me.inputValue.value = '';
  // }

  @Input() get indIpselectedColumns(): IndIpTableHeaderCols[] {
    const me = this;
    return me._indipselectedColumns;
  }
  set indIpselectedColumns(val: IndIpTableHeaderCols[]) {
    const me = this;
    me._indipselectedColumns = me.indipcols.filter((col) => val.includes(col));
  }


  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  applyRangeFilter(){
    const me = this;
    me.ipSummaryService.flowpathRange = me.flowPathRange;
    me.ipSummaryService.limit = me.flowPathRange;
    me.indipload(me.data.panels[0].data[0]);
    this.displayBasic = false;
  }

  openAutoInstDialog() {
    let testRunStatus;
    let instanceType;
    let url;
    url = this.getHostUrl() + '/' + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.sessionService.testRun.id;
    console.log('url *** ', url);
    this.ddrRequest.getDataUsingGet(url).subscribe(resp => {
      let res = <any>resp;
      console.log("data for tr status === ", res);
      testRunStatus = res.data;
      if (testRunStatus.length != 0) {
        this.showAutoInstrPopUp = true;
        if (this.queryParams.Instance_Type.toLowerCase() == 'java')
          instanceType = 'Java';
        else if (this.queryParams.Instance_Type.toLowerCase() == 'dotnet')
          instanceType = 'DotNet';

        this.argsForAIDDSetting = [this.queryParams.appName, this.queryParams.appId, instanceType, this.queryParams.tierName,
        this.queryParams.serverName, this.queryParams.serverId, "-1", this.queryParams.businessTransaction, "IP", testRunStatus[0].status, this.sessionService.testRun.id];
      }
      else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running")
        return;
      }
    });
  }

  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
   // console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  startInstrumentation(result)
  {
    this.showAutoInstrPopUp = false;
    if (result.includes('started')) {
      this.messageService.add({ severity: 'success', summary: 'Service Message', detail: result });
    }
    else{
      this.messageService.add({ severity: 'warn', summary: 'Service Message', detail: result });
    }
  }

  closeAIDDDialog(isCloseAIDDDialog){
    this.showAutoInstrPopUp = isCloseAIDDDialog;
   }

  ngOnDestroy() {
    this.subscribeIpSummary.unsubscribe();
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.panels[0].data;
    let header = [];
    header.push("S No.");

    for (const c of me.data.panels[0].headers[0].cols)
        header.push(c.label);

    try {
      me.ipSummaryService.downloadShowDescReports(label, tableData,header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in IP Summary report component :", err);
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

  downloadShowDescReports1(label) {
    const me = this;
    let tableData1 = me.dataindip.panels[0].data;
    let header1 = [];
    header1.push("S No.");

    for (const c of me.dataindip.panels[0].headers[0].cols)
        header1.push(c.label);

    try {
      me.ipSummaryService.downloadShowDescReports1(label, tableData1,header1).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadReportLoadingState) {
            me.onLoadingReport1(state);

            return;
          }

          if (state instanceof DownloadReportLoadedState) {
            me.onLoadedReport1(state);
            return;
          }
        },
        (state: DownloadReportLoadingErrorState) => {
          me.onLoadingReportError1(state);

        }
      );
    } catch (err) {
      console.log("Exception in downloadShowDescReports method in IP Summary report component :", err);
    }
  }

  private onLoadingReport1(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadedReport1(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");

  }
  private onLoadingReportError1(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }
}
