import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, LazyLoadEvent } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { ExceptionData, ExceptionLoadPayload, ExceptionTableHeaderCols, AggregateExceptionTableHeaderCols, AggregateExceptionData, SourceCodePayload, DownloadSourceCodePayload } from './service/exception.model';
import { ExceptionService } from './service/exception.service';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { ExceptionLoadingState, ExceptionLoadedState, ExceptionLoadingErrorState, AggregateExceptionLoadingState, AggregateExceptionLoadedState, AggregateExceptionLoadingErrorState, SourceCodeLoadedState, SourceCodeLoadingErrorState, SourceCodeLoadingState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState, VarArgsLoadingState, VarArgsLoadingErrorState, VarArgsLoadedState } from './service/exception.state';
import { FilterUtils } from 'primeng/utils';
import { DrilldownService } from '../../drilldown/service/drilldown.service';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { Subscription } from 'rxjs/internal/Subscription';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExceptionComponent implements OnInit {

  dataException: ExceptionData;
  dataAggregate: AggregateExceptionData = {
    panels: []
  };
  dataSourceCode: string;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  downloadOptionsAggException: MenuItem[];
  downloadOptionsException: MenuItem[];
  menuOptions: MenuItem[];
  selectedException: any;
  inputValue: any;
  isShowSearch: boolean;
  isShowSearchException: boolean;
  tableHeader: string = "";
  stackTraceHeader: string = "";

  colsExc: ExceptionTableHeaderCols[];
  _selectedExcColumns: ExceptionTableHeaderCols[];
  colsAgg: AggregateExceptionTableHeaderCols[] = [];
  _selectedAggCols: AggregateExceptionTableHeaderCols[] = [];

  isCheckbox: boolean;

  globalFilterFields: string[] = [];

  globalFilterFieldsForExc: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  isshowsourcecode: boolean = false;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  colLabel: String = "Stack Trace";
  stateID: string;

  finalValue: any;
  stackTraceData: any;
  dataAggregateData = [];
  dataAggregateTemp = [];
  jsonView: any;
  json: any = {
    "type": 'object',
    "title": 'Object',
    "additionalProperties": false,
    "properties": {
      "string": {
        "type": 'string',
        "title": 'String',
      },
    },
  }
  classVarArgs: string;
  methodVarArgs: string;
  localVarArgs: string;
  ThreadLocalVarArgs: string;
  lastNLogs:String;
  totalLogs:number;
  stackTraceHeaderInfo: string;
  subscribeException: Subscription;
  classFileName: string = "";
  classMethodFileName: string = "";
  totalMethodVars: number = 0;
  toalClassVars: number = 0;
  totalLocalVars: number = 0;
  totalThreadVars: number = 0;
  breadcrumb: BreadcrumbService;

  constructor(private exceptionService: ExceptionService,
    private drillDownService: DrilldownService, private router: Router,
    private route: ActivatedRoute, private sessionService: SessionService,
    private f_ddr: DdrPipe,
    private dashboardServiceReqService: DashboardServiceReqService,
    breadcrumb: BreadcrumbService) {
      this.breadcrumb = breadcrumb;
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state'];
    });
  }

  ngOnInit() {
    const me = this;
    if(me.exceptionService.isSource == "widget") {
      me.breadcrumb.add({label: 'Exceptions', routerLink: '/dashboard-service-req/exception', queryParams: { state: me.stateID} } as MenuItem);
    }
    this.subscribeException = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.aggregateLoad();
    });
    me.aggregateLoad();
    // me.exceptionLoad(this.dataAggregate);
    me.menuOptions = [
      {
        label: 'Copy Source code',
        command: () => {
          const me = this;
          me.copySourceCode(me.dataSourceCode);
        }
      },
      {
        label: 'Download Method Body',
        command: () => {
          const me = this;
          me.downLoadSourceCode(1);
        }
      },
      {
        label: 'Download Class file',
        command: () => {
          const me = this;
          me.downLoadSourceCode(2);
        }
      }
    ]
    me.downloadOptionsAggException = [
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
          me.downloadShowDescReports1("pdf");
        }
      }
    ]
    me.downloadOptionsException = [
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
    this.jsonView = JSON.stringify(this.json, null, 2);
    this.tableHeader="";
    this.stackTraceHeader="";
  }

  getColumnData(data, columnName) {  // to handle click events.
    const me = this;
    if (columnName == "Exception Count") {
      console.log("row data Exception", data);
      this.exceptionLoad(data);
      this.tableHeader = '';
    this.stackTraceHeader = '';
    if (data['ExceptionClassName'] != 'NA'){
      this.tableHeader = ":" + data['ExceptionClassName'];
      this.stackTraceHeader = "Exception: " + data['ExceptionClassName'];
    }
    if (data['ThrowingClassName'] != 'NA'){
      this.tableHeader += ", Throwing Class: " + data['ThrowingClassName'];
      this.stackTraceHeader += ", Throwing Class: " + data['ThrowingClassName'];
    }
    if (data['ThrowingMethodName'] != 'NA'){
      this.tableHeader += ", Throwing Method: " + data['ThrowingMethodName'];
      this.stackTraceHeader += ", Throwing Method: " + data['ThrowingMethodName'];
    }
   if (data['URLName'] != 'NA'){
      this.tableHeader += ", BT: " + data['URLName'];
      this.stackTraceHeader += ", BT: " + data['URLName'];
    }
    if (data['Message'] && data['Message'] != 'NA' && data['Message'] != "-"){
      this.tableHeader += ", Message: " + data['Message'];
      // this.stackTraceHeader += ", Message: " + nodeData['message'];
    }
    if(this.tableHeader.startsWith(','))
    this.tableHeader = this.tableHeader.substring(1)

    if(this.stackTraceHeader.startsWith(','))
    this.stackTraceHeader = this.stackTraceHeader.substring(1)
    }
    if (columnName == "Throwing Method") {
      this.getStackTraceData(data);
    }
    if (columnName == 'Stack trace') {
      this.getSourceCode(data);
    }
    if (columnName == 'Exception Class') {
      this.openFpReport(data);
    }
  }

  aggregateLoad() {
    const me = this;
    me.exceptionService.aggregateLoad().subscribe(
      (state: Store.State) => {
        if (state instanceof AggregateExceptionLoadingState) {
          me.onAggregateExceptionLoading(state);
          return;
        }
        if (state instanceof AggregateExceptionLoadedState) {
          me.onAggregateExceptionLoaded(state);
          return;
        }
      },
      (state: AggregateExceptionLoadingErrorState) => {
        me.onAggregateExceptionLoadingError(state);
      }
    );
  }

  private onAggregateExceptionLoading(state: AggregateExceptionLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onAggregateExceptionLoadingError(state: AggregateExceptionLoadingErrorState) {
    const me = this;
    me.dataAggregate = null;
    me.error = state.error;
    me.loading = false;
  }

  private onAggregateExceptionLoaded(state: AggregateExceptionLoadedState) {
    const me = this;
    me.dataAggregate = state.data;
    me.error = null;
    me.loading = false;
    if (me.dataAggregate.panels[0].data.length === 0) {
      me.empty = true;
    } else {
      for (let i = 0; i < me.dataAggregate.panels.length; i++) {
        if (i == 0) {
          this.exceptionLoad(me.dataAggregate.panels[i].data[i]);
        }
      }
      // This is the case when we load aggregate table first time.so that filter criteria comes by default.
      for (let i = 0; i < me.dataAggregate.panels[0].data.length; i++) {
        if (i == 0) {
          let data = me.dataAggregate.panels[0].data[i];
          if (data['ExceptionClassName'] != 'NA'){
            this.tableHeader = ":" + data['ExceptionClassName'];
            this.stackTraceHeader = "Exception: " + data['ExceptionClassName'];
          }
          if (data['ThrowingClassName'] != 'NA'){
            this.tableHeader += ", Throwing Class: " + data['ThrowingClassName'];
            this.stackTraceHeader += ", Throwing Class: " + data['ThrowingClassName'];
          }
          if (data['ThrowingMethodName'] != 'NA'){
            this.tableHeader += ", Throwing Method: " + data['ThrowingMethodName'];
            this.stackTraceHeader += ", Throwing Method: " + data['ThrowingMethodName'];
          }
         if (data['URLName'] != 'NA'){
            this.tableHeader += ", BT: " + data['URLName'];
            this.stackTraceHeader += ", BT: " + data['URLName'];
          }
          if(this.tableHeader.startsWith(','))
    this.tableHeader = this.tableHeader.substring(1)

    if(this.stackTraceHeader.startsWith(','))
    this.stackTraceHeader = this.stackTraceHeader.substring(1) 
        }
      }
    }
    me.colsAgg = me.dataAggregate.panels[0].headers[0].cols;
    me._selectedAggCols = [];
    for (const c of me.dataAggregate.panels[0].headers[0].cols) {
      if (c.selected) {
        me._selectedAggCols.push(c);
        me.globalFilterFields.push(c.valueField);
      }
    }
  }

  loadPagination(event: LazyLoadEvent, index) {
    this.loading = true;
    setTimeout(() => {
      if (this.dataAggregate.panels[index].data) {
        this.dataAggregateTemp = this.dataAggregate.panels[index].data.filter(row => this.filterField(row, event.filters));

        for (let i = 0; i <= this.dataAggregateData.length; i++) {
          if (index == i) {
            this.dataAggregateData[index] = this.dataAggregateTemp.slice(event.first, (event.first + event.rows));

          }
        }
        this.loading = false;
      }
    }, 1000);
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
  @Input() get selectedAggCols(): AggregateExceptionTableHeaderCols[] {
    const me = this;
    return me._selectedAggCols;
  }

  set selectedAggCols(val: AggregateExceptionTableHeaderCols[]) {
    const me = this;
    me._selectedAggCols = me.colsAgg.filter((col) => val.includes(col));
  }


  exceptionLoad(payload) {
    const me = this;
    me.exceptionService.exceptionLoad(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ExceptionLoadingState) {
          me.onExceptionLoading(state);
          return;
        }
        if (state instanceof ExceptionLoadedState) {
          me.onExceptionLoaded(state);
          return;
        }
      },
      (state: ExceptionLoadingErrorState) => {
        me.onExceptionLoadingError(state);
      }
    );
  }

  private onExceptionLoading(state: ExceptionLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onExceptionLoadingError(state: ExceptionLoadingErrorState) {
    const me = this;
    me.dataException = null;
    me.error = state.error;
    me.loading = false;
  }

  private onExceptionLoaded(state: ExceptionLoadedState) {
    const me = this;
    me.dataException = state.data;
    me.error = null;
    me.loading = false;
    if (me.dataException.panels.length === 0) {
      me.empty = true;
    } else {
      me.getStackTraceData(me.dataException.panels[0].data[0]);
      me.dataSourceCode = "";
      //me.dashboardService.interceptor.
    }
    me.colsExc = me.dataException.panels[0].headers[0].cols;
    me._selectedExcColumns= [];
    for (const c of me.dataException.panels[0].headers[0].cols) {
      if (c.selected) {
        me._selectedExcColumns.push(c);
        me.globalFilterFieldsForExc.push(c.valueField);
      }
    }
  }

  @Input() get selectedColumns(): ExceptionTableHeaderCols[] {
    const me = this;
    return me._selectedExcColumns;
  }

  set selectedColumns(val: ExceptionTableHeaderCols[]) {
    const me = this;
    me._selectedExcColumns = me.colsExc.filter((col) => val.includes(col));
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

  clearFilters() {
    const me = this;
    me.inputValue = document.querySelector('.search-box');
    me.inputValue.value = '';
  }


  getStackTraceData(exceptionData) {
    const me = this;

    me.selectedException = exceptionData;
    let stackTrace = exceptionData['stackTrace'];
    // let exceptionClassName = exceptionData['exceptionClassName'];
    // let throwingMethodName = exceptionData['throwingMethodName'];
    // let lineNo = exceptionData['lineNumber'];

    me.dataException.panels[1].data = me.drillDownService.interceptor.createStackJson(stackTrace);

    me.colLabel = me.dataException.panels[1].headers[0].cols[0].label;

  }

  openFpReport(rowdata) {
    //console.log("rowdata comess---", rowdata);
    const me = this;
    //condition to set flowpath id's Exception summary table.
    const flowpathIDs = rowdata.flowPathInstance;
    //console.log("fpID---", flowpathIDs);
    /*setting reportID for Exception report in session service */
    me.sessionService.setSetting("reportID", "EXC");
    me.sessionService.setSetting("fpIDs", flowpathIDs);
    this.router.navigate(['/drilldown/flow-path'], { queryParams: { state: me.stateID } });
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

  getSourceCode(dataStackTrace) {
    const me = this;
    let data: String = dataStackTrace['stackTrace'];
    let type: String = '';
    var fqm;


    let srcCodeObj: SourceCodePayload = {
      fqm: '',
      j_uid: '',
      serverName: '',
      tierName: '',
      instanceName: '',
      testRun: ''
    };

    if (data.indexOf('%40') != -1) {
      type = '%40';
    }
    else
      type = '%70';

    if (type == '%40')
      fqm = data.substring(data.indexOf("%50") + 3, data.indexOf("%40"));
    else
      fqm = data.substring(0, data.indexOf('%70')) + "." + data.substring(data.indexOf('%70') + 3, data.length);

    srcCodeObj.fqm = fqm;
    var pcm = fqm.substring(0, fqm.indexOf("(")); //com.cavisson.nsecom.localVariablesServlet.methodWithLocalVarsUCE
    var pkgCls = pcm.substring(0, pcm.lastIndexOf("."));//com.cavisson.nsecom.localVariablesServlet
    var method = pcm.substring(pcm.lastIndexOf(".") + 1, pcm.length); //Method
    var cls = pkgCls.substring(pkgCls.lastIndexOf(".") + 1, pkgCls.length);//Class
    var pac = pkgCls.substring(0, pkgCls.lastIndexOf("."));
    var fileName = fqm.substring(fqm.indexOf("(") + 1, fqm.indexOf(")"));

    this.classFileName = cls + ".rtf";
    this.classMethodFileName = cls + "_" + method + ".rtf";
    this.stackTraceHeaderInfo = " [" + cls + "." + method + "(" + fileName + ")" + "]";


    if (type == '%40') {
      var uidArr = data.split("%4");
      var uid = uidArr[1].substring(1);
    }

    srcCodeObj.tierName = me.selectedException.tierName;
    srcCodeObj.serverName = me.selectedException.serverName;
    srcCodeObj.instanceName = me.selectedException.appName;
    srcCodeObj.j_uid = uid;

    me.sourcecodeload(srcCodeObj);
    me.varargsload(dataStackTrace['stackTrace']);

  }

  sourcecodeload(payload) {
    const me = this;
    me.exceptionService.sourceCodeLoad(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof SourceCodeLoadingState) {
          me.onSourceCodeLoading(state);
          return;
        }
        if (state instanceof SourceCodeLoadedState) {
          me.onSourceCodeLoaded(state);
          return;
        }
      },
      (state: SourceCodeLoadingErrorState) => {
        me.onSourceCodeLoadingError(state);
      }
    );
  }

  private onSourceCodeLoading(state: SourceCodeLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onSourceCodeLoadingError(state: SourceCodeLoadingErrorState) {
    const me = this;
    me.dataSourceCode = null;
    me.error = state.error;
    me.loading = false;
  }

  private onSourceCodeLoaded(state: SourceCodeLoadedState) {
    const me = this;
    me.dataSourceCode = state.data;
    me.dataSourceCode = me.drillDownService.interceptor.updatedSourceCode(me.dataSourceCode);
    if (me.dataSourceCode.length != 0) {
      me.isshowsourcecode = true;
    }
  }

  varargsload(payload: string) {
    const me = this;
    me.exceptionService.varargsload(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof VarArgsLoadingState) {
          me.onVarArgsLoading(state);
          return;
        }
        if (state instanceof VarArgsLoadedState) {
          me.onVarArgsLoaded(state);
          return;
        }
      },
      (state: VarArgsLoadingErrorState) => {
        me.onVarArgsLoadingError(state);
      }
    );
  }
  private onVarArgsLoading(state: VarArgsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onVarArgsLoadingError(state: VarArgsLoadingErrorState) {
    const me = this;
    me.dataSourceCode = null;
    me.error = state.error;
    me.loading = false;
  }

  private onVarArgsLoaded(state: VarArgsLoadedState) {
    const me = this;

    me.classVarArgs = state.data.classVariables;
    me.methodVarArgs = state.data.methodVariables;
    me.localVarArgs = state.data.localVariables;
    me.ThreadLocalVarArgs = state.data.threadLocalVariables;
    if(state.data.logs){
      me.totalLogs = me.countArgs(state.data.logs, '\n');
      me.lastNLogs = state.data.logs;
    }else{
      me.totalLogs = 0;
      me.lastNLogs = "No Logs Found";
    }


    me.totalMethodVars = me.countArgs(me.methodVarArgs, '\n');
    me.toalClassVars = me.countArgs(me.classVarArgs, '\n');
    me.totalLocalVars = me.countArgs(me.localVarArgs, '\n');
    me.totalThreadVars = me.countArgs(me.ThreadLocalVarArgs, '\n');


  }

  copySourceCode(data: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }

  countArgs(data, word) {
    return data.split(word).length - 1;
  }

  downLoadSourceCode(type: any) {
    const me = this;
    let dwnldsrcpayload ={
      downloadFileName:"",
      downloadType:""
    }
    if(type == 1){
      dwnldsrcpayload.downloadFileName = me.classMethodFileName;
      dwnldsrcpayload.downloadType = "1";
    }else{
      dwnldsrcpayload.downloadFileName = me.classFileName;
      dwnldsrcpayload.downloadType = "2";
    }
    me.exceptionService.downloadsourcecode(dwnldsrcpayload).subscribe(
      (state: Store.State) => {
        if (state instanceof DownloadReportLoadingState) {
          me.onSrcCodeLoading(state);
          return;
        }
        if (state instanceof DownloadReportLoadedState) {
          me.onSrcCodeLoaded(state);
          return;
        }
      },
      (state: DownloadReportLoadingErrorState) => {
        me.onSrcCodeLoadingError(state);
      }
    );

  }
  private onSrcCodeLoading(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onSrcCodeLoaded(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let codeDownloadURL = window.location.protocol + '//' + window.location.host + "/common/" + state.data;
    me.openDwnldWndw(codeDownloadURL);

  }
  private onSrcCodeLoadingError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.dataAggregate = null;
    me.error = state.error;
    me.loading = false;
  }


  openDwnldWndw(codeDownloadURL) {
    window.open(codeDownloadURL);
  }



  ngOnDestroy() {
    this.subscribeException.unsubscribe();
  }

  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.dataAggregate.panels[0].data;
    let header = [];
    header.push("S No.");

    for (const c of me.dataAggregate.panels[0].headers[0].cols)
      header.push(c.label);

    try {
      me.exceptionService.downloadShowDescReports(label, tableData, header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Exception report component :", err);
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
    me.dataAggregate = null;
    me.error = state.error;
    me.loading = false;
  }

  downloadShowDescReports1(label) {
    const me = this;
    let tableData1 = me.dataException.panels[0].data;
    let header1 = [];
    header1.push("S No.");

    for (const c of me.dataException.panels[0].headers[0].cols)
      header1.push(c.label);
    for (const c of me.dataException.panels[1].headers[0].cols)
      header1.push(c.label);
    try {
      me.exceptionService.downloadShowDescReports1(label, tableData1, header1).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Exception report component :", err);
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
    me.dataException = null;
    me.error = state.error;
    me.loading = false;
  }

}
