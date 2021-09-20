import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FlowPathTable,
  FlowPathTableHeaderCols,
} from './service/flow-path.model';
import { AppError } from 'src/app/core/error/error.model';
import { FlowPathService } from './service/flow-path.service';
import { Store } from 'src/app/core/store/store';
import {
  FlowPathLoadingState,
  FlowPathLoadedState,
  FlowPathLoadingErrorState,
} from './service/flow-path.state';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { LazyLoadEvent, MenuItem, Table } from 'primeng';
import { FilterUtils } from 'primeng/utils';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { SessionService } from 'src/app/core/session/session.service';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { GlobalDrillDownFilterService } from 'src/app/shared/global-drilldown-filter/service/global-drilldown-filter.service';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  DownloadReportLoadingState,
  DownloadReportLoadedState,
  DownloadReportLoadingErrorState,
} from './service/flow-path.state';
import { TablePagination } from 'src/app/shared/table/table.model';
import { CommonServices } from "../../tools/actions/dumps/service/common.services";
import { DDRRequestService } from '../../tools/actions/dumps/service/ddr-request.service';
import { Message, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-flow-path',
  templateUrl: './flow-path.component.html',
  styleUrls: ['./flow-path.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe, MessageService],
})
export class FlowPathComponent implements OnInit {
  allOptions: MenuItem[];
  showModel: boolean = false;
  data: FlowPathTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number=0;
  cols: FlowPathTableHeaderCols[] = [];
  _selectedColumns: FlowPathTableHeaderCols[] = [];
  reportList: SelectItem[];
  deleteCachedFlag: boolean = false;
  selectedReport = "";
  productName: string;
  msgs: Message;
  selectedFilter =
    'Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All';
  name: string;
  downloadOptions: MenuItem[];
  selectedRow: any = [];
  showAutoInstrPopUp: boolean = false;
  argsForAIDDSetting: any[];
  testRun: string;
  isShow: boolean = false;
  inputValue: any;
  flowPathData = [];
  // flowPath: any;
  isCheckbox: boolean;
  boxDetails: boolean = false;
  displayDetails: boolean;
  searchBox: string;
  isShowSearch: boolean;
  isCompareFP: boolean;
  flowpathIDs: string;
  timeVarienceForNF: string = "900";
  isShowColumnFilter: boolean = false;
  finalValue: any;
  items1: MenuItem[];
  stateID: string;
  selectedRowData: any;
  flowPathDataTemp = [];
  globalFilterFields: string[] = [];
  defaultPaginationReq: TablePagination = {
    first: 0,
    rows: 50,
  };
  nvtondReport: boolean = false;
  breadcrumb: BreadcrumbService;
  copyFlowpathLink:string;
  showPagination : boolean = false;
  private subscribeFlowpath: Subscription;

  @ViewChild('flowPath') flowPath: Table;

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  @Input() widget: DashboardWidgetComponent;
  compareFPInfo: any;
  showCompareReport: boolean;

  constructor(
    private flowPathService: FlowPathService,
    private router: Router,
    private commonService: CommonServices,
    private globalDrillDownFilterService: GlobalDrillDownFilterService,
    private sessionService: SessionService,
    private f_ddr: DdrPipe,
    private route: ActivatedRoute,
    private ddrRequest:DDRRequestService,
    private messageService: MessageService,
    breadcrumb: BreadcrumbService
  ) {
    this.breadcrumb = breadcrumb;
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state'];
    });
  }
  ngOnInit(): void {
    const me = this;
    me.breadcrumb.add({label: 'Flowpaths', routerLink: '/drilldown/flow-path', queryParams: { state: me.stateID } } as MenuItem);
    me.productName = me.sessionService.session.cctx.prodType; // product name. 
    me.testRun = me.sessionService.testRun.id; //testrun
    me.flowPathService.nvPageId = null;
    me.flowPathService.nvSessionId = null
    me.flowPathService.ndSessionId = null;
    me.flowPathService.NVtoNDFilterForAngular = null;
    me.onPageChange(null, me.defaultPaginationReq);
    this.globalDrillDownFilterService.currentReport = "Flowpath";
    //me.load();
    this.subscribeFlowpath = this.globalDrillDownFilterService.sideBarUIObservable$.subscribe(
      (temp) => {
        if (this.globalDrillDownFilterService.currentReport == 'Flowpath') {
          me.load(temp);
        }
      }
    );
    me.allOptions = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.openAutoInstDialog();
        },
      },
      {
        label: 'Copy flowpath link',
        command: (event: any) => {
          this.copyLink();
        }
      },
      {
        label: 'Show all flowpath of selected Flowpath Session',
        command: (event: any) => {
          this.openFlowpathWithFilter('session');
        }
      },
      {
        label: 'Show all flowpath of selected Flowpath NV Session',
        command: (event: any) => {
          this.openFlowpathWithFilter('nvsession');
        }
      },
      {
        label: 'Show all flowpath of selected Flowpath PageInstance',
        command: (event: any) => {
          this.openFlowpathWithFilter('page');
        }
      },
      {
        label: 'Open aggregate method timing for selected flowpaths',
        command: (event: any) => {
          this.openAggMethodTiming();
        },
      },
      {
        label: 'Deleted cache data',
        command: (event: any) => {
          // this.openBox();
          this.deleteCachedFlag = true;
          this.selectedReport = "";
        },
      },
    ];
    me.items1 = [
      {
        label: 'Transaction Flowmap',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/transaction-flowmap']);
        },
      },
      {
        label: 'Dashboard Service Request',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/db-queries'], {
            queryParams: {
              state: me.stateID,
              rowID: me.selectedRowData.flowpathInstance,
            },
          });
        },
      },
    ];

    me.reportList = [
      { label: 'Flowpath', value: '2' },
      { label: 'DB Report', value: '6' },
      { label: 'Exception', value: '7,71' },
      { label: 'Method Timing', value: '9' },
      { label: 'Service Method Timing', value: '91' },
      { label: 'Hotspot', value: '8,81,82' },
      { label: 'IP Summary', value: '11' },
      { label: 'Http Report', value: '10' },
      { label: 'Method Details', value: '3' },
      { label: 'Sequence Diagram', value: '5' },
      { label: 'Transaction Flowmap', value: '4' }
    ];

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports('worddoc');
        },
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports('excel');
        },
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports('pdf');
        },
      },
    ];
  }

  onSelectedRow() {
    let tempflowpathIDs = [];
    if (this.selectedRow.length > 1) {
      this.isCompareFP = true;
      for (var obj of this.selectedRow) {
        tempflowpathIDs.push(obj.flowpathInstance);
      }
    }
    this.flowpathIDs = tempflowpathIDs.toString();
  }
  OpenCompare() {
    this.router.navigate(['/compare-flowpaths'], {
      queryParams: { rowID: this.flowpathIDs, id: 'Compare' },
    });
    this.isCompareFP = false;
  }

  openAggMethodTiming() {
    const me = this;
    let flowpathInstance = "";
    let tierName = "";
    let serverName = "";
    let appName = "";
    let tierId = "";
    let serverId = "";
    let appId = "";

    console.log("selectedRows", this.selectedRow);
    if (this.selectedRow == undefined) {
      alert("No Record Selected");
      return;
    } else {
      for (let i = 0; i < this.selectedRow.length; i++) {
        //flowpathInstance = this.flowpathIDs;
        flowpathInstance += this.selectedRow[i]["flowpathInstance"] + ",";
        if (tierName.indexOf(this.selectedRow[i]["tierName"]) == -1)
          tierName += this.selectedRow[i]["tierName"] + ",";
        if (serverName.indexOf(this.selectedRow[i]["serverName"]) == -1)
          serverName += this.selectedRow[i]["serverName"] + ",";
        if (appName.indexOf(this.selectedRow[i]["appName"]) == -1)
          appName += this.selectedRow[i]["appName"] + ",";
        if (tierId.indexOf(this.selectedRow[i]["tierId"]) == -1)
          tierId += this.selectedRow[i]["tierId"] + ",";
        if (serverId.indexOf(this.selectedRow[i]["serverId"]) == -1)
          serverId += this.selectedRow[i]["serverId"] + ",";
        if (appId.indexOf(this.selectedRow[i]["appId"]) == -1)
          appId += this.selectedRow[i]["appId"] + ",";

        console.log("tiernamee--", tierName, "serverName---", serverName, "appName", appName);
      }
    }
    let aggData = {};
    aggData['tierName'] = tierName.substring(0, tierName.length - 1);
    aggData['serverName'] = serverName.substring(0, serverName.length - 1);
    aggData['appName'] = appName.substring(0, appName.length - 1);
    aggData['tierId'] = tierId.substring(0, tierId.length - 1);
    aggData['serverId'] = serverId.substring(0, serverId.length - 1);
    aggData['appId'] = appId.substring(0, appId.length - 1);
    aggData['flowpathInstance'] = flowpathInstance.substring(0, flowpathInstance.length - 1);

    me.sessionService.setSetting("aggMtRowData", aggData);
    me.sessionService.setSetting('ddrSource', 'widget');
    me.sessionService.setSetting('reportID', 'FP');
    me.router.navigate(['/dashboard-service-req/method-timing'], { queryParams: { state: me.stateID, rowID: this.flowpathIDs, id: 'MT' } });
  }


  getColumnData(columnName, rowData) {
    const me = this;

    this.selectedRowData = rowData;
    //setting data in session for particular flowpath
    me.sessionService.setSetting('fpRowdata', this.selectedRowData);
    me.sessionService.setSetting('ddrSource', 'flowpath');
    if (columnName === 'Business Transaction') {
      this.router.navigate(['/dashboard-service-req/ip-summary'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'IP',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    } else if (columnName === 'URL') {
      this.router.navigate(['/dashboard-service-req/http-report'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'HTTP',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    } else if (columnName === 'Category') {
      this.router.navigate(['/dashboard-service-req/hotspot'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'HOTSPOT',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    } else if (columnName === 'Start Time') {
      this.router.navigate(['/dashboard-service-req/transaction-flowmap'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'ATF',
        },
      });
    } else if (columnName === 'CallOuts') {
      this.router.navigate(['/dashboard-service-req/transaction-flowmap'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'ATF',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    } else if (columnName === 'Total Response Time(ms)') {
      this.router.navigate(['/dashboard-service-req/method-timing'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'MT',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
      me.sessionService.setSetting('ddrSource','MTFromFP');
      me.sessionService.setSetting('reportID','MT_FP');
    } else if (columnName === 'FlowpathInstance') {
      this.router.navigate(['/dashboard-service-req/sequence-diagram'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'SD',
        },
      });
    } else if (columnName === 'Methods') {
      this.router.navigate(['/dashboard-service-req/method-call-details'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'MCD',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    } else if (columnName === 'DB Callouts') {
      this.router.navigate(['/dashboard-service-req/db-queries'], {
        queryParams: {
          state: me.stateID,
          rowID: rowData.flowpathInstance,
          id: 'DBR',
        },
      });
      me.breadcrumb.add({label: this.selectedRowData.flowpathInstance } as MenuItem);
    }
  }
  showInstrumentationDetails() {
    this.displayDetails = true;
  }
  showSessionButton() {
    this.isShow = true;
  }
  openBox() {
    this.boxDetails = true;
  }
  hideSession() {
    this.isShow = false;
  }
  open() {
    this.showModel = true;
  }
  close() {
    this.showModel = false;
  }

  load(cqmFilter?, def_pagination?: TablePagination) {
    const me = this;
    if (cqmFilter) {
      me.flowPathService.loadFromCqm(cqmFilter).subscribe(
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
    } else {
      console.log(def_pagination);

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
  }
  // clearFilters() {
  //   const me = this;
  //   me.inputValue = document.querySelector('.search-box');
  //   me.inputValue.value = '';
  // }
  private onLoading(state: FlowPathLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadingError(state: FlowPathLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.log(me.error);
  }
  private onLoaded(state: FlowPathLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    // this.flowPathData = this.data.data;
    if (me.data) {
      me.empty = false;
      if ((!me.data.data && me.data.data == null) || (me.data.data.length == 0)) {
        me.emptyTable = true;
      }
      // me.loadPagination();      
    } else {
      me.empty = true;
    }
    me.cols = me.data.headers[0].cols;
    me._selectedColumns = [];
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }    
    }
    me.totalRecords = me.data.count;
    me.createLinkForCopy();

    if( me.data.count > me.data.paginator.rows){
      me.showPagination = true;
    }
  }

  // sortField(rowA, rowB, field: string): number {
  //   if (rowA[field] == null) return 1;
  //   if (typeof rowA[field] === 'string') {
  //     return rowA[field].localeCompare(rowB[field]);
  //   }
  //   if (typeof rowA[field] === 'number') {
  //     if (rowA[field] > rowB[field]) return 1;
  //     else return -1;
  //   }
  // }

  createLinkForCopy(){
    const me =this;
    let url = window.location.protocol + '//' + window.location.host;

    me.copyFlowpathLink = url + '/UnifiedDashboard/ddrcopylink.html?requestFrom=DDR' + '&pk=' + me.flowPathService.cctx.pk + '&cck=' + me.flowPathService.cctx.cck +
    '&u='+me.flowPathService.cctx.u + '&prodType='+ me.flowPathService.cctx.prodType + '&testRun=' + me.flowPathService.testRun+
    '&tierName=' + me.flowPathService.tierName + '&serverName=' + me.flowPathService.serverName + '&appName=' + me.flowPathService.instanceName +
    '&flowpathID=' + me.flowPathService.flowpathID + '&startTime=' + me.flowPathService.startTime + '&endTime=' + me.flowPathService.endTime +
    '&sqlIndex=' + me.flowPathService.sqlIndex + '&urlIndex=' + me.flowPathService.urlIndex + '&btCategory=' + me.flowPathService.btCategory +
    '&urlName=' + me.flowPathService.btTransaction + '&first=' + me.defaultPaginationReq.first + '&rows' + me.defaultPaginationReq.rows;
  }

  tableState(event) {
    console.log(event);

  }

  sortColumnsOnCustom(event) {
    //for integer type data type
    if (event["field"] === "responseTime" ||
        event["field"] === "methods" ||
        event["field"] === "callOuts" ||
        event["field"] === "totalError" ||
        event["field"] === "dbCallouts" ||
        event["field"] === "Status" ||
        event["field"] === "coherenceCallOut" ||
        event["field"] === "jmsCallOut") {
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
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //for floating decimal points
    else if (event["field"] === "cpu" ||
             event["field"] === "waitTime" ||
             event["field"] === "syncTime" ||
             event["field"] === "iotime" ||
             event["field"] === "suspensiontime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = parseFloat(a[temp].replace(/,/g, ''));
          var value2 = parseFloat(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = parseFloat(a[temp].replace(/,/g, ''));
          var value2 = parseFloat(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    //for date format
    else if (event["field"] === "startTime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      var temp = (event["field"]);
      if (event.order == -1) {
        event.data = event.data.sort(function (a, b) {
          var value = a[temp];
          var value2 = b[temp];
          return value.localeCompare(value2);
        });
      } else {
        event.order = -1;
        event.data = event.data.sort(function (a, b) {
          var value = a[temp];
          var value2 = b[temp];
          return value2.localeCompare(value);
        });
      }
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
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
      if (
        filterMatchMode.includes('contain') &&
        rowValue.includes(filter[columnName].value.toLowerCase())
      ) {
        isInFilter = true;
      } else if (
        filterMatchMode.includes('custom') &&
        rowValue.includes(filter[columnName].value)
      ) {
        isInFilter = true;
      }
    }
    if (noFilter) {
      isInFilter = true;
    }
    return isInFilter;
  }
  //
  loadPagination(event?: LazyLoadEvent, def_pagination?: TablePagination) {
    const me = this;
    if (event != null) {
      const payload: TablePagination = {
        first: event.first,
        rows: event.rows,
      };
      me.load(null, payload);
    } else {
      me.load(null, def_pagination);
    }
    me.loading = true;
  }

  onPageChange(event, def_pagination?: TablePagination) {
    const me = this;

    if (event != null) {

      const payload: TablePagination = {
        first: event.first,
        rows: event.rows,
      };
      me.load(null, payload);
    } else {
      me.load(null, def_pagination);
    }
    me.loading = true;


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
  @Input() get selectedColumns(): FlowPathTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: FlowPathTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.data;
    let header = [];
    header.push('S No.');
    header.push('Business Transaction');
    header.push('URL');
    header.push('Category');
    header.push('Start Time');
    header.push('Total Response Time(ms)');
    header.push('CPU Time(ms)');
    header.push('Methods');
    header.push('CallOuts');
    header.push('DB Callouts');
    header.push('Status');

    // for (const c of me.data.headers[0].cols)
    //     header.push(c.label);
    try {
      me.flowPathService
        .downloadShowDescReports(label, tableData, header)
        .subscribe(
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
      console.log(
        'Exception in downloadShowDescReports method in flowpath report component :',
        err
      );
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
    path = url + '/common/' + path;
    window.open(path + '#page=1&zoom=85', '_blank');
  }
  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  compareFlowpath() {
    if (this.selectedRow.length < 2) {
      alert("Please select two flowpaths.");
      return;
    }
    else if (this.selectedRow.length > 2) {
      alert("Only two flowpaths can be compared.");
      return;
    }
    this.commonService.openCurrentFlowpathTab = true;
    this.commonService.showAllTabs = false;
    this.showCompareReport = true;
    this.commonService.mctData = {};
    this.commonService.openFlowpath = false;
    this.compareFPInfo = this.selectedRow;
    this.commonService.mctFlag = false;
    this.flowPathService.compareFlowpathData = this.compareFPInfo;
    this.router.navigate(['/drilldown-compare-flowpaths']);
  }

  openTierStatus(){
    const me = this;
    me.router.navigate(['/exec-dashboard/main/tierStatus']); 
  }

  openNetForest() {
    let flowpathInstance;
    let correlationId;
    let startTimeInMs;
    let duration;
    let ndSessionId;
    let nvPageId;
    let StartTimeArr = [];
    let EndTimeArr = [];
    let startTimeISO;
    let endTimeISO;
    let query;
    if (this.selectedRow.length == 0) {
      alert("No Record Selected");
      return;
    }
    if (this.selectedRow.length > 1) {
      query = "";
      for (let i = 0; i < this.selectedRow.length; i++) {
        flowpathInstance = this.selectedRow[i
            ][
                "flowpathInstance"
            ];
        startTimeInMs = this.selectedRow[i
            ][
                "startTimeInMs"
            ];
        duration = this.selectedRow[i
            ][
                "responseTime"
            ];
        let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
        let d2;

        if (duration == '< 1')
          d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
        else
          d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));

        StartTimeArr.push(d1);
        EndTimeArr.push(d2);

        query += "fpi:" + flowpathInstance + '%20OR%20';
        }
      / to get shortest timestamp as start time /
      StartTimeArr = StartTimeArr.sort(function (a, b) {
        var value = Number(a);
        var value2 = Number(b);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      / to get highest timestamp as end time /
      EndTimeArr = EndTimeArr.sort(function (a, b) {
        var value = Number(a);
        var value2 = Number(b);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });

      if (query.endsWith('20')) {
        query = query.substring(0, query.length - 8);
        query = "( " + query + " )";
        }
        // startTimeISO = new Date(StartTimeArr[0]).toISOString();
        // endTimeISO = new Date(EndTimeArr[0]).toISOString();
      startTimeISO = StartTimeArr[
            0
        ];
      endTimeISO = EndTimeArr[
            0
        ];
      console.log("query>>>>>>>>>>", query);
    } else {
      query = "";
      flowpathInstance = this.selectedRow[
            0
        ][
            "flowpathInstance"
        ];
      correlationId = this.selectedRow[
            0
        ][
            "correlationId"
        ];
      startTimeInMs = this.selectedRow[
            0
        ][
            "startTimeInMs"
        ];
      duration = this.selectedRow[
            0
        ][
            "responseTime"
        ];
      ndSessionId = this.selectedRow[
            0
        ][
            "ndSessionId"
        ];
      nvPageId = this.selectedRow[
            0
        ][
            "nvPageId"
        ];


      query = "fpi:" + flowpathInstance;
      console.log("duration = ", duration);
      let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
      let d2;

      if (duration == '< 1')
        d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      else
        d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      console.log("start time from FP To NF = " + d1);
      console.log("end time from FP To NF = " + d2);

      // startTimeISO = new Date(d1).toISOString();
        // endTimeISO = new Date(d2).toISOString();
      startTimeISO = d1;
      endTimeISO = d2;

      console.log("startTimeISO = ", startTimeISO,
        ", endTimeISO = ", endTimeISO);

      if (correlationId != "" && correlationId != "-")
        query += "%20AND%20corrid:\"" + correlationId + "\"";

      if (nvPageId != "" && nvPageId != "-")
        query += "%20AND%20pageid:" + nvPageId;

      if (ndSessionId != "" && ndSessionId != "-")
        query += "%20AND%20ndsessionid:" + ndSessionId;

      query = "( " + query + " )";
      console.log("query>>>>single case>>>>>>", query);
    }
    query = query.replaceAll("%20"," ");
    this.router.navigate([
        "/home/logs"
    ],
    { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO
        }
    });
  }

  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time)) //If time is in minute formate- xm eg:20m means 20 minute variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time)) //If time is in second formate- xs eg:200s means 200 second variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = Number(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = Number(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");
      return Number(900000); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return Number(timeVarianceInMs);
  }

  openNVFromND() {
    console.log("I am inside the nv session.......");
    if (sessionStorage.getItem("isMultiDCMode") != "true") {
      // if (this.NVUrl != 'NA') {
      if (this.selectedRow.length == 0) {
        alert("No Flowpath is Selected");
        return;
      }
      else if (this.selectedRow.length > 1) {
        alert("Select Only One Flowpath at a time");
        return;
      }
      else {
        let nvSessionId = 'NA';
        let nvPageId = 'NA';
        let urlForNV;
        if (this.selectedRow[0]['nvSessionId'] != '-' && this.selectedRow[0]['nvSessionId'] != '' && this.selectedRow[0]['nvSessionId'] != "0")
          nvSessionId = this.selectedRow[0]['nvSessionId'];
        else {
          alert('NV Session Id is not Available or' + this.selectedRow[0]['nvSessionId']);
          return;
        }
        if (this.selectedRow[0]['nvPageId'] != '-' && this.selectedRow[0]['nvPageId'] != '')
          nvPageId = this.selectedRow[0]['nvPageId'];
        this.router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });
      }
    }
    else {
      let nvSessionId = 'NA';
      let nvPageId = 'NA';
      //let urlForNV;

      // check only one fp is selected as in case of single dc

      if (this.selectedRow.length == 0) {
        alert("No Flowpath is Selected");
        return;
      }
      else if (this.selectedRow.length > 1) {
        alert("Select Only One Flowpath at a time");
        return;
      }

      if (this.selectedRow[0]['nvSessionId'] != '-' && this.selectedRow[0]['nvSessionId'] != '' && this.selectedRow[0]['nvSessionId'] != "0") {
        nvSessionId = this.selectedRow[0]['nvSessionId'];
      }
      else {
        alert('NV Session Id is not Available for ' + this.selectedRow[0]['nvSessionId']);
        return;
      }

      if (this.selectedRow[0]['nvPageId'] != '-' && this.selectedRow[0]['nvPageId'] != '' && this.selectedRow[0]['nvPageId'] != "0")
        nvPageId = this.selectedRow[0]['nvPageId'];
      sessionStorage.removeItem('__nvSessionData');
      this.router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });

    }
  }

  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  deletCachedData() {
    const me = this;
    let url = me.getHostUrl() + '/' + me.productName.toLowerCase().replace("/", "") + "/v1/cavisson/netdiagnostics/ddr/deleteCacheFile/" + me.sessionService.testRun.id + "?REPORT_ID=" + me.selectedReport;
    me.ddrRequest.getDataInStringUsingGet(url).subscribe(data => (me.doAssigndelete(data)));
  }

  onApply() {
    const me = this;
    me.deletCachedData();
    me.deleteCachedFlag = false;
  }

  doAssigndelete(res) {
    const me = this;
    console.log(res);
    if (res == 'true') {
      me.showDeleteNotification();
    } else {
      me.showErrorNotification();
    }
  }

  showDeleteNotification() {
    const me = this;
    me.msgs = {};
    me.msgs.severity = 'success';
    me.msgs.summary = 'Cached data cleared successfully';
    me.messageService.add(me.msgs);
  }

  showErrorNotification() {
    const me = this;
    me.msgs = {};
    me.msgs.severity = 'error';
    me.msgs.summary = 'No Data to delete from Cache';
    me.messageService.add(me.msgs);
  }
openAutoInstDialog() {
    console.log(" selectedRow  = ", this.selectedRow);
    console.log(" selectedRowData  = ", this.selectedRowData);

    if (this.selectedRow.length == 0) {
      alert("Please select atleast one row");
      return;
    }
    else if (this.selectedRow.length >= 2) {
      alert("Select only one row");
      return;
    }
    else {
      let testRunStatus;
      let instanceType;
      let url = this.getHostUrl() + '/' + this.productName.toLowerCase().replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.testRun;
      console.log('url *** ', url);
      this.ddrRequest.getDataUsingGet(url).subscribe(res => {
        console.log("data for tr status === ", res);
        testRunStatus = <any>res;
        testRunStatus = testRunStatus.data;
        if (testRunStatus.length != 0) {
          if (this.selectedRow[0]['Instance_Type'].toLowerCase() == 'java')
            instanceType = 'Java';
          else if (this.selectedRow[0]['Instance_Type'].toLowerCase() == 'dotnet')
            instanceType = 'DotNet';

          this.argsForAIDDSetting = [this.selectedRow[0]['appName'], this.selectedRow[0]['appId'], instanceType,
          this.selectedRow[0]['tierName'], this.selectedRow[0]['serverName'], this.selectedRow[0]['serverId'], '-1',
          this.selectedRow[0]['urlName'], 'DDR', testRunStatus[0].status, this.testRun];
          console.log('this.argsForAIDDSetting>>>>>>>>>>>>****', this.argsForAIDDSetting);
          this.showAutoInstrPopUp = true;
        }
        else {
          this.showAutoInstrPopUp = false;
          alert("Could not start instrumentation, test is not running")
          return;
        }
      });

    }
  }

startInstrumentaion(result) {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

closeAIDDDialog(isCloseAIDDDialog) {
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }

  openFlowpathWithFilter(filter: any) {
    const me = this;
    if (me.selectedRow.length == 0) {
      alert("No Record Selected.");
      return;
    } else {
      let ndSessionId = '';
      let nvPageId = '';
      let nvSessionId = '';
      for (let k = 0; k < me.selectedRow.length; k++) {
        if (filter == 'session') {
          let currentSessionId = me.selectedRow[k]["ndSessionId"];
          if (k == 0 && currentSessionId != '-' && currentSessionId != '')
            ndSessionId = currentSessionId
          else if (currentSessionId != '-' && currentSessionId != '' && ndSessionId.indexOf(currentSessionId) == -1)
            ndSessionId += ',' + currentSessionId;
        } else if (filter == 'page') {
          let currentNVSessionId = me.selectedRow[k]['nvSessionId'];
          if (k == 0 && currentNVSessionId != '' && currentNVSessionId != '-')
            nvSessionId = currentNVSessionId;
          else if (currentNVSessionId != '' && currentNVSessionId != '-' && nvSessionId.indexOf(currentNVSessionId) == -1)
            nvSessionId += "," + currentNVSessionId;
          let currentPageId = me.selectedRow[k]["nvPageId"];
          if (k == 0 && currentPageId != "" && currentPageId != "-")
            nvPageId = currentPageId;
          else if (currentPageId != "" && currentPageId != "-" && nvPageId.indexOf(currentPageId) == -1)
            nvPageId += "," + currentPageId;
        } else if (filter == 'nvsession') {
          let currentNVSessionId = me.selectedRow[k]['nvSessionId'];
          if (k == 0 && currentNVSessionId != '' && currentNVSessionId != '-')
            nvSessionId = currentNVSessionId;
          else if (currentNVSessionId != '' && currentNVSessionId != '-' && nvSessionId.indexOf(currentNVSessionId) == -1)
            nvSessionId += "," + currentNVSessionId;
        }
      }
      if (filter == 'session') {
        if (ndSessionId != '-') {
          me.flowPathService.nvPageId = "";
          me.flowPathService.nvSessionId = "";
          me.flowPathService.ndSessionId = ndSessionId;
          me.flowPathService.NVtoNDFilterForAngular = "1";
        }
        else {
          alert("ND Session  Id not available");
          return;
        }
      } else if (filter == 'nvsession') {
        if (nvSessionId != '-') {
          me.flowPathService.ndSessionId = "";
          me.flowPathService.nvPageId = "";
          me.flowPathService.nvSessionId = nvSessionId;
          me.flowPathService.NVtoNDFilterForAngular = "1";
        }
        else {
          alert("NV Session Id not available");
          return;
        }
      } else if (filter == 'page') {
        if (nvPageId != '-') {
          me.flowPathService.ndSessionId = "";
          me.flowPathService.nvPageId = nvPageId;
          me.flowPathService.nvSessionId = nvSessionId;
          me.flowPathService.NVtoNDFilterForAngular = "1";
        }
        else {
          alert("NV Page Id not available");
          return;
        }
      }
      me.nvtondReport = true;
      me.load(null, me.defaultPaginationReq);
    }
  }

  clickBack() {
    const me = this;
    me.nvtondReport = false;
    me.flowPathService.nvSessionId = null;
    me.flowPathService.nvPageId = null;
    me.flowPathService.ndSessionId = null;
    me.flowPathService.NVtoNDFilterForAngular = null;
    // this.fpLimit = this.prevLimit;
    // this.fpOffset = this.prevOffset;
    me.load(null, me.defaultPaginationReq);
  }
  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.copyFlowpathLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnDestroy() {
    this.subscribeFlowpath.unsubscribe();
  }

}
export interface SelectItem {
  label: string;
  value: any;
}
