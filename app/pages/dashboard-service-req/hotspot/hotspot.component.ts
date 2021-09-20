import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, MenuItem,TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { HotspotData, HotspotLoadPayload, HotspotTableHeaderCols, HsIpCallsData, HsIpTableHeaderCols, StackTraceData, StackTraceHeaderCols } from './service/hotspot.model';
import { HotspotService } from './service/hotspot.service';
import {
  HotspotLoadingState,
  HotspotLoadedState,
  HotspotLoadingErrorState,
  StackTraceLoadingState,
  StackTraceLoadingErrorState,
  StackTraceLoadedState,
  DownloadReportLoadingState,
  DownloadReportLoadingErrorState,
  DownloadReportLoadedState,
  IpCallsLoadingErrorState,
  IpCallsLoadingState,
  IpCallsLoadedState
} from './service/hotspot.state';
import { FilterUtils } from 'primeng/utils';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { TableBoxTable } from 'src/app/pages/dashboard-service-req/ip-summary/table-box/service/table-box.model';
import { DrilldownService } from '../../drilldown/service/drilldown.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { GlobalDrillDownFilterService } from 'src/app/shared/global-drilldown-filter/service/global-drilldown-filter.service';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HotspotComponent implements OnInit {
  datahotspot: HotspotData;
  datastacktrace :StackTraceData;
  dataipcalls: HsIpCallsData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  menu: MenuItem[];

  hotspotData = [];
  stackData : TreeNode[];

  stacktracedata = [];
  ipCallsData = [];
  totalRecords = 0;

  cols: HotspotTableHeaderCols[];
  _selectedColumns: HotspotTableHeaderCols[];
  downloadOptionsHotspot: MenuItem[];
  downloadOptionsStackTrace: MenuItem[];
  downloadOptionsIPCalls: MenuItem[];
  HotspotDownloadOption:boolean = false;
  StackTraceDownloadOption:boolean = false;
  IPCallsDownloadOption:boolean = false;


  stCols : StackTraceHeaderCols[];
  _stselectedColumns: StackTraceHeaderCols[];

  ipCols: HsIpTableHeaderCols[];
  _ipselectedColumns: HsIpTableHeaderCols[];

  aggIpInfo : any[];
  ipCallsPopupData : TableBoxTable[];
  ipInfoData: TableBoxTable;

  qtd: any[] = [];

  isSource: any;
  reportID: any;
  isCheckbox: boolean;
  displayBasic: boolean;
  displayDetails: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  refreshTable: boolean = false;
  finalValue: any;
  subscribeHotspot:Subscription;
  hotspotCount: String;
  headerFilter: String;
  headerFilterToolTip: any;
  mergeFlag: boolean = false;
  isShowSearch: boolean;
  isIpShowSearch: boolean;
  inputValue: any;
  breadcrumb: BreadcrumbService;
  showPaginationHsSum: boolean = false;
  showPaginationIpCall: boolean = false;
  sideBarHotspot : Subscription;

  @ViewChild('ipcalls') ipcalls: ElementRef;
  @ViewChild('hotspot') hotspot: ElementRef;
  globalFilterFields: string[] = [];
  ipglobalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;
  @ViewChild('searchIpInput', { read: ElementRef, static: false })
  searchIpInput: ElementRef;

  constructor(private hotspotService: HotspotService,
    private f_ddr:DdrPipe,
    private drillDownService: DrilldownService,
    private dashboardServiceReqService: DashboardServiceReqService,
    private sessionService: SessionService, breadcrumb: BreadcrumbService,
    private globalDrillDownFilterService: GlobalDrillDownFilterService) {
      this.breadcrumb = breadcrumb;
     }

  ngOnInit() {
    const me = this;
    this.subscribeHotspot = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.hotspotload();
    });
    this.globalDrillDownFilterService.currentReport = "Hotspot";
    this.sideBarHotspot = this.globalDrillDownFilterService.sideBarUIObservable$.subscribe((temp) => {
      if (this.globalDrillDownFilterService.currentReport == "Hotspot") {
        me.hotspotload(temp);
      }
    })

    me.downloadOptionsHotspot = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsHotspot");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsHotspot");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsHotspot");
          me.downloadShowDescReports("pdf");
      }
    }
    ]

    me.downloadOptionsStackTrace = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsStackTrace");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsStackTrace");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionsStackTrace");
          me.downloadShowDescReports("pdf");
      }
    }
    ]
    me.downloadOptionsIPCalls = [
      {
        label: 'WORD', command: () => { const me = this; this.CheckDownoadOption("downloadOptionsIPCalls"); me.downloadShowDescReports("worddoc");}
      },
      {
        label: 'EXCEL', command: () => { const me = this; this.CheckDownoadOption("downloadOptionsIPCalls"); me.downloadShowDescReports("excel");}
      },
      {
        label: 'PDF', command: () => { const me = this; this.CheckDownoadOption("downloadOptionsIPCalls"); me.downloadShowDescReports("pdf");}
    }
    ]
    me.hotspotload();

    me.menu = [
      {
        label: 'Merge Stack Trace',
      },
    ];
  }

  closeBox() {
    this.displayBasic = false;
  }

  hotspotload(cqmFilter?) {
    const me = this;
    me.reportID= me.sessionService.getSetting("reportID");
    if(me.reportID =="ATF" || me.reportID =="isFromTrxnTableHST"){
      me.hotspotService.hotspotloadfrmTxnFM().subscribe(
        (state: Store.State) => {
          if (state instanceof HotspotLoadingState) {
            me.onHotSpotLoading(state);
            return;
          }
          if (state instanceof HotspotLoadedState) {
            me.onHotSpotLoaded(state);
            me.sessionService.setSetting("reportID","FP");
            return;
          }
        },
        (state: HotspotLoadingErrorState) => {
          me.onHotSpotLoadingError(state);
        }
      );
    } else {
        if(cqmFilter){
          me.hotspotService.hotspotloadFromCqm(cqmFilter).subscribe(
            (state: Store.State) => {
              if (state instanceof HotspotLoadingState) {
                me.onHotSpotLoading(state);
                return;
              }
              if (state instanceof HotspotLoadedState) {
                me.onHotSpotLoaded(state);
                return;
              }
            },
            (state: HotspotLoadingErrorState) => {
              me.onHotSpotLoadingError(state);
            }
          );
        }
        else {
          me.hotspotService.hotspotload().subscribe(
            (state: Store.State) => {
              if (state instanceof HotspotLoadingState) {
                me.onHotSpotLoading(state);
                return;
              }
              if (state instanceof HotspotLoadedState) {
                me.onHotSpotLoaded(state);
                return;
              }
            },
            (state: HotspotLoadingErrorState) => {
              me.onHotSpotLoadingError(state);
            }
          );
        }
    }
  }

  private onHotSpotLoading(state: HotspotLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onHotSpotLoadingError(state: HotspotLoadingErrorState) {
    const me = this;
    me.datahotspot = null;
    me.error = state.error;
    me.loading = false;
  }

  private onHotSpotLoaded(state: HotspotLoadedState) {
    const me = this;
    me.datahotspot = state.data;
    me.error = null;
    me.mergeFlag = false;
    me.loading = false;
    me.datahotspot.panels[0].tableFilter = false;
    console.log("datahotspot>>>>>>>>",me.datahotspot);
    if (me.datahotspot.panels.length === 0) {
      me.empty = true;
    } else {
      var hsData = me.datahotspot.panels[0]
      me.hotspotCount = " (Total Hotspot: "+hsData.data.length+")";
      me.getAppliedFilter(hsData.data[0].threadId, hsData.data[0].hotspotStartTimeStamp, hsData.data[0].hotspotDuration, hsData.data[0].threadName);
      if (hsData.data.length > 1) {
        me.mergeFlag = true;
      }
      me.hotspotData = me.datahotspot.panels[0].data;
      me.hotspotService.getMergeStackPayLoad(me.datahotspot.panels[0].data);
      // let check = {}
      // me.loadPagination(check, 1);
      // this.totalRecords = this.data.panels[0].data.length;
      for (let i = 0; i < me.datahotspot.panels.length; i++) {
        if (i == 0) {
          this.stacktraceload(me.datahotspot.panels[i].data[i]);
          this.ipcallsload(me.datahotspot.panels[i].data[i]);
        }
      }

    }
    me.cols = me.datahotspot.panels[0].headers[0].cols;
    for (const c of me.cols) {
      me.globalFilterFields.push(c.valueField);
      // if (c.selected) {
      //   me._selectedColumns.push(c);
      // }
    }
    me._selectedColumns = me.cols;

    if( hsData.data.length > hsData.paginator.rows){
      me.showPaginationHsSum = true;
    }
  
  }

  getColumnData(data, columnName) {
    const me = this;
    if (columnName == "Thread ID") {
      me.getAppliedFilter(data.threadId, data.hotspotStartTimeStamp, data.hotspotDuration, data.threadName);
      me.stacktraceload(data);
    }
  }
  // loadPagination(event: LazyLoadEvent) {
  //   this.loading = true;
  //   var index = 1;
  //   setTimeout(() => {
  //     if (this.datahotspot.panels[index].data) {
  //       console.log("inside-----");
  //       for (let i = 0; i <= this.hotspotData.length; i++) {
  //         if (index == i) {
  //           this.hotspotData[index] = this.datahotspot.panels[index].data.filter(row => this.filterField(row, event.filters));
  //           // this.datahotspot.panels[index].data.slice(event.first, (event.first + event.rows));
  //         console.log("----hotspotData---",this.hotspotData[index]);
  //         // this.hotspotService.getMergeStackPayLoad(this.hotspotData[index]);
  //         }
  //       }
  //       this.hotspotData[index].sort(
  //         (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
  //       );
  //       this.loading = false;
  //     }
  //   }, 1000);
  // }

  // loadStPagination(event: LazyLoadEvent, index) {
  //   this.loading = true;
  //   setTimeout(() => {
  //     if (this.datastacktrace.panels[index].data) {
  //       for (let i = 0; i <= this.stacktracedata.length; i++) {
  //         if (index == i) {
  //           this.stacktracedata[index] = this.datastacktrace.panels[index].data.filter(row => this.filterField(row, event.filters));
  //           // this.datastacktrace.panels[index].data.slice(event.first, (event.first + event.rows));

  //         }
  //       }
  //       this.loading = false;
  //     }
  //   }, 1000);
  // }

  // loadIpPagination(event: LazyLoadEvent, index) {
  //   this.loading = true;
  //   setTimeout(() => {
  //     if (this.dataipcalls.panels[index].data) {
  //       for (let i = 0; i <= this.ipCallsData.length; i++) {
  //         if (index == i) {
  //           this.ipCallsData[index] = this.dataipcalls.panels[index].data.filter(row => this.filterField(row, event.filters));
  //         }
  //       }
  //       this.loading = false;
  //     }
  //   }, 1000);
  // }
  sortColumnsOnCustom(event) {
    //for integer type data type

    if (event["field"] === "threadId" || event["field"] === "hotspotDuration" || event["field"] === "hsDurationInMs" ||
     event["field"] === "threadPriority" || event["field"] === "threadStackdepth" || event["field"] === "FlowPathInstance" ||
     event["field"] === "totalDuration" || event["field"] === "avgDuration" || event["field"] === "maxDuration" ||
     event["field"] === "minDuration" || event["field"] === "count" || event["field"] === "mincount" || 
     event["field"] === "maxcount" || event["field"] === "errorCount" || event["field"] === "avgNWDelay" ||
     event["field"] === "totalNWDelay" ) {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }else{
      var temp = (event["field"]);
      if (event.order == -1) {
      event.data = event.data.sort(function (a, b) {
        var value = a[temp];
        var value2 = b[temp];
          return value.localeCompare(value2);
        });
      }else{
        event.order = -1;
        event.data = event.data.sort(function (a, b) {
          var value = a[temp];
          var value2 = b[temp];
            return value2.localeCompare(value);
        });
      }
    }
  }
  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;

    if (field === 'threadId' || field === 'methods'|| field === 'threadPriority'|| field === 'threadStackdepth'|| field === 'FlowPathInstance') {
      if (Number(rowA[field]) > Number(rowB[field])) return 1;
      else return -1;
    }
    else if (field === 'hotspotDuration') {
      if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
      else return -1;
    }
    else if (field === 'hotspotStartTimeStamp') {
      if (Date.parse(rowA[field]) > Date.parse(rowB[field])) return 1;
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

  @Input() get selectedColumns(): HotspotTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: HotspotTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  getAppliedFilter(threadId: String, hsStartTimeStamp: String, hsDuration: String, threadName:String){
    const me = this;
    me.headerFilter = " (Thread Id: "+threadId +", HotSpot EntryTime: "+hsStartTimeStamp +", Hotspot Duration: "+hsDuration+" seconds)";
    me.headerFilterToolTip = "Thread Id: "+threadId +"\nThread Name: "+threadName+"\nHotSpot EntryTime: "+hsStartTimeStamp +"\nHotspot Duration: "+hsDuration+" seconds";
  }

  stacktraceload(payload) {
    const me = this;
    me.hotspotService.stacktraceload(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof StackTraceLoadingState) {
          me.onStackTraceLoading(state);
          return;
        }
        if (state instanceof StackTraceLoadedState) {
          me.onStackTraceLoaded(state);
          return;
        }
      },
      (state: StackTraceLoadingErrorState) => {
        me.onStackTraceLoadingError(state);
      }
    );
  }

  mergestacktraceload() {
    const me = this;
    me.hotspotService.mergeStackTraceLoad().subscribe(
      (state: Store.State) => {
        if (state instanceof StackTraceLoadingState) {
          me.onStackTraceLoading(state);
          return;
        }
        if (state instanceof StackTraceLoadedState) {
          me.onStackTraceLoaded(state);
          return;
        }
      },
      (state: StackTraceLoadingErrorState) => {
        me.onStackTraceLoadingError(state);
      }
    );
  }

  ipcallsload(payload){
    const me = this;
    me.hotspotService.ipcallsload(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof IpCallsLoadingState) {
          me.onIPCallsLoading(state);
          return;
        }
        if (state instanceof IpCallsLoadedState) {
          me.onIPCallsLoaded(state);
          return;
        }
      },
      (state: IpCallsLoadingErrorState) => {
        me.onIPCallsLoadingError(state);
      }
    );
  }

  private onIPCallsLoading(state: IpCallsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onIPCallsLoadingError(state: IpCallsLoadingErrorState) {
    const me = this;
    me.dataipcalls = null;
    me.error = state.error;
    me.loading = false;
  }

  private onIPCallsLoaded(state: IpCallsLoadedState) {
    const me = this;
    me.dataipcalls = state.data;
    console.log("dataipcalls>>>>>>>>",me.dataipcalls);
    if(state.data.indBtPopupData){
      me.ipCallsPopupData = state.data.indBtPopupData;
      me.ipCallsData = me.dataipcalls.panels[0].data;
      me.ipInfoData = me.drillDownService.interceptor.mappopupdata(me.dataipcalls.panels[0].data[0],me.ipCallsPopupData);
      me.aggIpInfo = [me.ipInfoData,me.dataipcalls.panels[0].data[0].renamebackendIPname];
      console.log("aggIpInfo>>>>>>>>",me.aggIpInfo);
    }
    me.error = null;
    me.loading = false;

    if (me.dataipcalls.panels.length === 0) {
      me.empty = true;
    } else {
      // let check = {}
      // me.loadPagination(check, 1);
      // this.totalRecords = this.data.panels[0].data.length;

    }
    // for (const c of me.dataipcalls.panels[0].headers[0].cols) {
    //   if (c.selected) {
    //     me.ipCols.push(c);
    //   }
    // }
    me.ipCols = me.dataipcalls.panels[0].headers[0].cols;
    for (const c of me.ipCols) {
      me.ipglobalFilterFields.push(c.valueField);
    }
    me._ipselectedColumns = me.ipCols;

    if( me.dataipcalls.panels[0].data.length > me.dataipcalls.panels[0].paginator.rows){
      me.showPaginationIpCall = true;
    }
  }

  @Input() get ipCallselectedColumns(): HsIpTableHeaderCols[] {
    const me = this;
    return me._ipselectedColumns;
  }

  set ipCallselectedColumns(val: HsIpTableHeaderCols[]) {
    const me = this;
    me._ipselectedColumns = me.ipCols.filter((col) => val.includes(col));
  }

  private onStackTraceLoading(state: HotspotLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onStackTraceLoadingError(state: HotspotLoadingErrorState) {
    const me = this;
    me.datastacktrace = null;
    me.error = state.error;
    me.loading = false;
  }

  private onStackTraceLoaded(state: HotspotLoadedState) {
    const me = this;
    me.datastacktrace = state.data;
    me.stackData = state.data.panels[0].data;
    me.datastacktrace.panels[0].tableFilter = false;
    console.log("datastacktrace>>>>>>>>",me.datastacktrace);
    me.error = null;
    me.loading = false;
    if (me.datastacktrace.panels.length === 0) {
      me.empty = true;
    } else {
      // let check = {}
      // me.loadPagination(check, 1);
      // this.totalRecords = this.data.panels[0].data.length;

    }
    // for (const c of me.datahotspot.panels[0].headers[0].cols) {
    //   if (c.selected) {
    //     me.stCols.push(c);
    //   }
    // }
    me.stCols = me.datastacktrace.panels[0].headers[0].cols
    me._stselectedColumns = me.stCols;
  }

  @Input() get stackTraceselectedColumns(): StackTraceHeaderCols[] {
    const me = this;
    return me._stselectedColumns;
  }

  set stackTraceselectedColumns(val: StackTraceHeaderCols[]) {
    const me = this;
    me._stselectedColumns = me.stCols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    // me.datastacktrace.panels[0].tableFilter = !me.datastacktrace.panels[0].tableFilter;
    // if (me.datastacktrace.panels[0].tableFilter === true) {
    //     me.filterTitle = 'Disable Filters';
    //   } else {
    //     me.filterTitle = 'Enable Filters';
    //   }
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  ngOnDestroy() {
    this.subscribeHotspot.unsubscribe();
    this.sideBarHotspot.unsubscribe();
  }
  downloadShowDescReports(label) {
    const me = this;
    // let rowData:any []=[];
    // let header = [];
    if(this.HotspotDownloadOption === true){
    let tableData = me.datahotspot.panels[0].data;
    var rowData:any []=[];
    var header = [];
    var title="Hotspot Summary report";
    header.push("S No.");
    //For Headers of HotspotSummary
    for (const c of me.datahotspot.panels[0].headers[0].cols)
        header.push(c.label);
    //For RowData of HotspotSummary
    for(let i =0;i<tableData.length;i++)
     {
          let rData:string []=[];
          let number = i+1;
            rData.push(number.toString());
            rData.push(tableData[i].threadId);
            rData.push(tableData[i].threadName);
            rData.push(tableData[i].tierName);
            rData.push(tableData[i].serverName);
            rData.push(tableData[i].appName);
            rData.push(tableData[i].hotspotStartTimeStamp);
            rData.push(tableData[i].hotspotDuration);
            rData.push(tableData[i].hsDurationInMs);
            rData.push(tableData[i].threadState);
            rData.push(tableData[i].threadPriority);
            rData.push(tableData[i].threadStackdepth);
            rData.push(tableData[i].FlowPathInstance);

          rowData.push(rData);
        }
      }

    if(this.StackTraceDownloadOption === true){
          let tableData = me.datastacktrace.panels[0].data;
          var rowData:any []=[];
          var header = [];
          var title = "Hotspot StackTrace Report"
          header.push("S No.");
          //For Headers of StackTrace
          for (const c of me.datastacktrace.panels[0].headers[0].cols)
              header.push(c.label);
          //For RowData of StackTrace
          for(let i =0;i<tableData.length;i++)
           {
                let rData:string []=[];
                let number = i+1;
                rData.push(number.toString());
                rData.push(tableData[i].data.methodName);
                rData.push(tableData[i].data.className);
                rData.push(tableData[i].data.lineNo);
                rData.push(tableData[i].data.packageName);
                rData.push(tableData[i].data.elapsedTime);
                rData.push(tableData[i].data.frameNo);
                rData.push(tableData[i].data.count);
              rowData.push(rData);
              }
    }

    if(this.IPCallsDownloadOption === true){
      let tableData = me.dataipcalls.panels[0].data;
      var rowData:any []=[];
      var header = [];
      var title = "Hotspot IPCalls Report"
      header.push("S No.");
      //For Headers of IPCalls
      for (const c of me.dataipcalls.panels[0].headers[0].cols)
          header.push(c.label);
      //For RowData of IPCalls
      for(let i =0;i<tableData.length;i++)
       {
            let rData:string []=[];
            let number = i+1;
            rData.push(number.toString());
            rData.push(tableData[i].renamebackendIPname);
            rData.push(tableData[i].actualbackendIPname);
            rData.push(tableData[i].backendType);
            rData.push(tableData[i].totalDuration);
            rData.push(tableData[i].avgDuration);
            rData.push(tableData[i].maxDuration);
            rData.push(tableData[i].minDuration);
            rData.push(tableData[i].count);
            rData.push(tableData[i].mincount);
            rData.push(tableData[i].maxcount);
            rData.push(tableData[i].errorCount);
            rData.push(tableData[i].avgNWDelay);
            rData.push(tableData[i].totalNWDelay);

          rowData.push(rData);
          }
}

    try {
      me.hotspotService.downloadShowDescReports(label, rowData, header, title).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Hotspot report component :", err);
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
    me.datahotspot = null;
    me.error = state.error;
    me.loading = false;
  }

  CheckDownoadOption(option){
    let optionValue = option;
    if(optionValue === "downloadOptionsHotspot"){
      this.HotspotDownloadOption = true;
      this.StackTraceDownloadOption = false;
      this.IPCallsDownloadOption = false;
    }
    if(optionValue === "downloadOptionsStackTrace"){
      this.HotspotDownloadOption = false;
      this.StackTraceDownloadOption = true;
      this.IPCallsDownloadOption = false;
    }
    if(optionValue === "downloadOptionsIPCalls"){
      this.HotspotDownloadOption = false;
      this.StackTraceDownloadOption = false;
      this.IPCallsDownloadOption = true;
    }
  }

  clickHandler(event, index) {
    if (index==0) {
      console.log("event---",event);
      const me = this;  
      me.refreshTable = true;
      let filteredhotspotdata = [];
      me.datahotspot.panels[0].data.forEach((val, index) => {
        if (val['threadState'] == event.point.name) {
          filteredhotspotdata.push(val);
        }
      });
      if (filteredhotspotdata.length > 0) {
        me.hotspotData = [];
        me.hotspotData = filteredhotspotdata;
        me.stacktraceload(filteredhotspotdata[0]);
        me.ipcallsload(filteredhotspotdata[0]);
        me.hotspotCount = " (Total Hotspot: "+me.hotspotData.length+")";
      }
    }
  }

  refreshData(){
    const me = this;
    me.refreshTable = false;
    me.hotspotData = [];
    me.hotspotData = me.datahotspot.panels[0].data;
    me.stacktraceload(me.datahotspot.panels[0].data[0]);
    me.ipcallsload(me.datahotspot.panels[0].data[0]);
    me.hotspotCount = " (Total Hotspot: "+me.hotspotData.length+")";
  }

}
