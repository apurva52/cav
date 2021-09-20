import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, TableHeaderCheckbox} from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SETTINGS_TABLE, SCHEDULER_TABLE } from './service/metrics.dummy';
import { MetricsHeaderCols, MetricsTable} from './service/metrics.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { Message, MessageService} from 'primeng/api'
import {
  MetricsTableLoadingState,
  MetricsTableLoadingErrorState,
  MetricsTableLoadedState,
  DeleteReportLoadedState,
  DeleteReportLoadingState,
  DeleteReportLoadingErrorState,
  ReuseReportLoadedState,
  ReuseReportLoadingState,
  ReuseReportLoadingErrorState,
  onDownloadLoadingState,
  onDownloadLoadedState,
  onDownloadLoadingErrorState
} from './service/metrics.state';
import { MetricsService } from './service/metrics.service';
import { ReportsService } from '../service/reports.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class MetricsComponent implements OnInit {
  @ViewChild('metrics') metrics;
  @ViewChild(TableHeaderCheckbox) tableHeaderCheck: TableHeaderCheckbox; 
  @ViewChild('schedulerMetric') schedulerMetricId;
  data: MetricsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: MetricsHeaderCols[] = [];
  _selectedColumns: MetricsHeaderCols[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any = [];

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  rowGroupMetadata: any;
  selectedReport = 'All Reports';
  reportListArr = [];
  dialogVisible: boolean = false;
  featurePermission = 7;
  totalRecord :number =0;

  first = 0;
  rows = 10;

  // mini table
  uniqueReportList = [];
  schDialogVisible : boolean = false;
  miniDataTable :MetricsTable;
  selectedSchedulerRow = [];
  miniTableHeader: any[];
  totalRecordMini : number = 0;

  firstCount = 0;
  rowsCount = 10;
  filterResetReports;

  isEnabledColumnFilterScheduler : boolean = false;

  colsScheduler: MetricsHeaderCols[] = [];
  _selectedColsScheduler: MetricsHeaderCols[] = [];

  constructor(private router: Router, 
    public sessionService: SessionService,
    private metricsService: MetricsService,
    private ref: ChangeDetectorRef, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportsService: ReportsService
  ) {

  }

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      {
        label: 'WORD', command: () => {
          this.downloadTableData('worddoc');
        }
      },
      {
        label: 'PDF', command: () => {
          this.downloadTableData('pdf');
        }
      },
      {
        label: 'EXCEL', command: () => {
          this.downloadTableData('excel');
        }
      }
    ]

    me.miniDataTable = SCHEDULER_TABLE;
    me.colsScheduler = SCHEDULER_TABLE.headers[0].cols;
    for (const p of SCHEDULER_TABLE.headers[0].cols) {
      // me.globalFilterFields.push(c.valueField);
      if (p.selected) {
        me._selectedColsScheduler.push(p);
      }
    }

    me.cols = SETTINGS_TABLE.headers[0].cols;
    for (const c of SETTINGS_TABLE.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    let stateSession = me.sessionService.session;
    if (stateSession) {
        if (stateSession.permissions || stateSession.permissions.length > 0) {
            if (stateSession.permissions[1].key === "WebDashboard") {
              if(stateSession.permissions[1].permissions || stateSession.permissions[1].permissions.length > 0){
              this.featurePermission = stateSession.permissions[1].permissions[32].permission;
            }
          }
        }
    }
    me.loadAvailableReportList();
      
  }
  loadAvailableReportList() {
    const me = this;
    me.metricsService.loadMetricsTable(null).subscribe(
      (state: Store.State) => {
        if (state instanceof MetricsTableLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof MetricsTableLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: MetricsTableLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  private onLoading(state: MetricsTableLoadingState) {
    const me = this;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.ref.detectChanges();
  }

  private onLoadingError(state: MetricsTableLoadingErrorState) {
    const me = this;
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: "availableReportDialogue'",
      message: "Available data is not present.",
      header: "Error",
      accept: () => {
        this.dialogVisible = false;
        me.empty = true;
        me.error = null;
        me.ref.detectChanges();
        return;
      },
      rejectVisible: false
    });
    return;
  }
  private onLoaded(state: MetricsTableLoadedState) {
    const me = this;
    let dataArr = [];
    let filterDataArr;
    me.loading = false;
    let jsondata: any = state.data;
    dataArr = jsondata.listGenRptInfo;
    me.reportListArr = dataArr;
    me.emptyTable = !dataArr.length;
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i]['groupData'] = { 'name': dataArr[i].uN };
      if (dataArr[i]['rS'] === 'Yes') {
        dataArr[i]['icon'] = 'icons8 icons8-alarm-clock';
      }
    }

    if (me.selectedReport === "All Reports" || me.selectedReport === "Stats" || me.selectedReport === "Compare" || me.selectedReport === "Excel"
      || me.selectedReport === "Hierarchical" || me.selectedReport === "Summary" ||me.selectedReport === "Scheduled") {

      filterDataArr = [];
      for (let i = 0; i < dataArr.length; i++) {
        if (me.selectedReport === 'Stats') {
          if (dataArr[i]['rT'] === 'Performance Stats (Tabular)' || dataArr[i]['rT'] === 'Performance Stats (WORD)'
            || dataArr[i]['rT'] === 'Performance Stats (HTML)' || dataArr[i]['rT'] === 'CustomPdf')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'Compare') {
          if (dataArr[i]['rT'] === 'Compare (Tabular)' || dataArr[i]['rT'] === 'Compare (HTML)' || dataArr[i]['rT'] === 'Compare (WORD)')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'Excel') {
          if (dataArr[i]['rT'] === 'Excel')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'Hierarchical') {
          if (dataArr[i]['rT'] === 'Hierarchical')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'Summary') {
          if (dataArr[i]['rT'] === 'Summary')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'Scheduled') {
          if (dataArr[i]['rS'] === 'Yes')
            filterDataArr.push(dataArr[i]);
        }
        else if (me.selectedReport === 'All Reports') {
          filterDataArr = dataArr;
        }
      }

    }

    dataArr = filterDataArr;
    SETTINGS_TABLE.data = dataArr;
    this.metricsService.reportListData = SETTINGS_TABLE;
    me.data = this.metricsService.reportListData;
    me.updateRowGroupMetaData();
    me.ref.detectChanges();
  }

  openReports(row) {
    const me = this;
    let testRun = me.sessionService.session.testRun.id;
    let productName = me.sessionService.session.cctx.prodType;
    let userName = me.sessionService.session.cctx.u;
    let productKey = me.sessionService.session.cctx.pk;
    let rptDirPath = "../../../logs/TR" + testRun + "/reports";
    let genReportFileName;
    let reportName;
    let genRptUrl;

    if (row['rNSuffix']) {//excel and scheduled report actual report name in that case
      genReportFileName = row['rN'] + row['rNSuffix'];
    } else {//non scheduled performance stats,compare,sumamry,hiererical 
      genReportFileName = row['rN'];
    }

    if (genReportFileName.indexOf(".") > -1) {//report name directory without extension for non scheduled performance stats,compare,excel,sumamry,hiererical
      reportName = genReportFileName.split(row['rNSuffix'])[0];
    } else {// report name directory for scheduled performance stats
      reportName = genReportFileName;
    }
  
    if (row["rT"] === "Performance Stats (HTML)") {
      genRptUrl = rptDirPath + "/htmlReports/" + reportName + "/index.html?productKey=" + productKey;
    } else if (row["rT"] === "Performance Stats (WORD)") {
      genRptUrl = rptDirPath + "/wordReports/" + reportName + '/' + genReportFileName + ".rtf?productKey=" + productKey;
    } else if (row["rT"] === "Excel") {
      if(row["rS"] === "Yes"){
        let idx = genReportFileName.lastIndexOf(".");
        let name = genReportFileName.substr(0,idx);
        genRptUrl = rptDirPath + "/excelReports/" + name + "/" + genReportFileName + "?productKey=" + productKey;
      }
      else{
      genRptUrl = rptDirPath + "/excelReports/" + reportName + "/" + genReportFileName + "?productKey=" + productKey;
      }
    } else if (row["rT"] === "Compare (Tabular)") {
      if(me.sessionService.preSession.multiDc){
      let master = me.sessionService.preSession.dcData.find((info) => {if(info.master){return info}});
        genRptUrl = master['tomcatURL']+this.pathForReportsAccordingProduct(productName) + "compareReport.html?reportSetName=" + reportName + "&testRun=" + testRun + "&productKey=" + productKey+ "&isFromUnified=true";
      }else{
      genRptUrl = this.pathForReportsAccordingProduct(productName)
        + "compareReport.html?reportSetName=" + reportName + "&testRun=" + testRun + "&productKey=" + productKey+ "&isFromUnified=true";
      }
    } else if (row["rT"] === "Hierarchical") {
      if(me.sessionService.preSession.multiDc){
         let master = me.sessionService.preSession.dcData.find((info) => {if(info.master){return info}});
         genRptUrl =  master['tomcatURL']+"/"+this.pathForReportsAccordingProductHire(productName) + "productUIRedirect.jsp?strOprName=openHirechicalReport&sesLoginName="
          + userName + "&productType=" + productName + "&testRun=" + testRun + "&productKey=" + productKey + "&reportSetName=" + reportName;
       }else{
        genRptUrl = this.pathForReportsAccordingProduct(productName) + "../productUIRedirect.jsp?strOprName=openHirechicalReport&sesLoginName="
        + userName + "&productType=" + productName + "&testRun=" + testRun + "&productKey=" + productKey + "&reportSetName=" + reportName;
      }
    }
    else if (row["rT"] === "Performance Stats (Tabular)") {
      let productNameForStats = "NS";
      if (productName === "netdiagnostics" || productName === "NetDiagnostics") {
        productNameForStats = "NDE";
      } else if (productName === "netcloud") {
        productNameForStats = "NC";
      } else if (productName === "netvision") {
        productNameForStats = "NVSM";
      }

      genRptUrl = this.pathForReportsAccordingProduct(productName) + "StatsReportGrid.html?rptName=" + reportName + "&testRun=" + testRun + "&host=//" + window.location.host + "/&productName=" + productNameForStats + "&productKey=" + productKey + "&isUnified=true";
    } else if (row["rT"] === "Compare (HTML)") {
      genRptUrl = rptDirPath + "/compareHTMLReports/" + reportName + "/index.html?testRun=" + testRun + "&WAN_ENV=0&radRunPhase=0&testMode=W" + "&productKey=" + productKey;
    } else if (row["rT"] === "Compare (WORD)") {
      genRptUrl = rptDirPath + "/compareWordReports/" + reportName + "/" + reportName + ".rtf";
    }
    else if (row["rT"] === "Summary") {
      let productNameForSummary = 'NS';
      if (productName === 'netdiagnostics' || productName === "NetDiagnostics") {
        productNameForSummary = 'NDE';
      } else if (productName === 'netcloud') {
        productNameForSummary = 'NC';
      } else if (productName === 'netvision') {
        productNameForSummary = 'NVSM';
      }
      genRptUrl = this.pathForReportsAccordingProduct(productName) + "summary_report.html?testRun=" + testRun + "&productName=" + productNameForSummary + "&rptName=" + reportName + "&productKey=" + productKey;
    }
    else if (row["rT"] === "Performance Stats (PDF)") {
      genRptUrl = rptDirPath + "/customPdfReport/" + reportName + "/" + genReportFileName + ".pdf";
    } else if (row["rT"] === "Alert Digest") {
      let idx = genReportFileName.lastIndexOf(".");
      let name = genReportFileName.substr(0,idx);
      genRptUrl = rptDirPath + "/alertDigestReports/" + name + "/" + genReportFileName;
    }

    window.open(genRptUrl);
  }

  pathForReportsAccordingProductHire(productName): string {
    let path = '';
    if (productName.toLowerCase() === 'nvsm' || productName.toLowerCase() === 'netstorm') {
      path = '../netstorm/analyze/';
    } else if (productName.toLowerCase() === 'netdiagnostics') {
      path = '../netdiagnostics/analyze/';
    } else if (productName.toLowerCase() === 'netcloud') {
      path = '../netcloud/analyze/';
    } else {
      path = '../netdiagnostics/analyze/';
    }
    return path;
  }

  pathForReportsAccordingProduct(productName): string {
    let path = '';
    if (productName.toLowerCase() === 'nvsm' || productName.toLowerCase() === 'netstorm') {
      path = '../netstorm/analyze/reports/';
    } else if (productName.toLowerCase() === 'netdiagnostics') {
      path = '../netdiagnostics/analyze/reports/';
    } else if (productName.toLowerCase() === 'netcloud') {
      path = '../netcloud/analyze/reports/';
    } else {
      path = '../netdiagnostics/analyze/reports/';
    }
    return path;
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  getIndex(customer) {
    return this.rowGroupMetadata[customer.rN + "_" + customer.rT].index;
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.data.data) {
      for (let i = 0; i < this.data.data.length; i++) {
        let rowData = this.data.data[i];
        let representativeName = rowData["rN"] + "_" + rowData["rT"];
        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.data.data[i - 1];
          let previousRowGroup = previousRowData["rN"];
          let previousRowGroupType = previousRowData["rT"];
          if (
            rowData["rN"] === previousRowGroup &&
            rowData["rT"] === previousRowGroupType
          )
            this.rowGroupMetadata[representativeName].size++;
          else
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
        }
      }
    }  
    console.log("this.rowGroupMetadata :",this.rowGroupMetadata);
    this.totalRecord = Object.keys(this.rowGroupMetadata).length;
    this.getUniqueListOfData();
  }


  @Input() get selectedColumns(): MetricsHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: MetricsHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedColsScheduler(): MetricsHeaderCols[] {
    const me = this;
    return me._selectedColsScheduler;
  }
  set selectedColsScheduler(val: MetricsHeaderCols[]) {
    const me = this;
    me._selectedColsScheduler = me.colsScheduler.filter((col) => val.includes(col));
  }

  showAddReport() {
    this.metricsService.reportType = this.selectedReport;
    if(this.selectedReport === 'Compare'){
      this.metricsService.checkForCompare=true;
      if(this.metricsService.checkForCompare){
        if(this.metricsService.takeDataOfEdit == null){
          this.router.navigate(['/add-report']);
        }
        if(this.metricsService.takeDataOfEdit != null){
          while(this.metricsService.takeDataOfEdit.length != 0){
            this.metricsService.takeDataOfEdit.pop();
          }
        }
      }
    }
    if(this.selectedReport && this.selectedReport === "Scheduled"){
      this.reportsService.fromReportUI = true;
      this.router.navigate(['/schedule-report']);
    }else{
      this.router.navigate(['/add-report']);
    }
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
    me.metrics.reset();
  }
  
  reuseReport(row) {
    const me = this;
    me.metricsService.getReuseReportData(row).subscribe(
      (state: Store.State) => {
        if (state instanceof ReuseReportLoadingState) {
          me.reuseLoading(state);
          return;
        }
        if (state instanceof ReuseReportLoadedState) {
          me.reuseLoaded(state);

          return;
        }
      },
      (state: ReuseReportLoadingErrorState) => {
        me.reuseLoadingError(state);
      }

    );
  }

  deleteReportRow() {
    const me = this;
    if (me.selectedRow.length == 0) {
      this.dialogVisible = true;
      this.confirmationService.confirm({
        key: "availableReportDialogue",
        message: "Please select atleast one row",
        header: "Error",
        accept: () => { this.dialogVisible = false; return; },
        reject: () => { this.dialogVisible = false; return; },
        rejectVisible: false
      });
      return;
    }
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: "availableReportDialogue",
      message: "Do you want to delete selected report?",
      header: "Confirmation",
      accept: () => {
        this.dialogVisible = false;
        if (me.selectedRow.length > 0) {
          me.metricsService.getDeleteReportData(me.selectedRow).subscribe(
            (state: Store.State) => {
              if (state instanceof DeleteReportLoadingState) {
                me.deleteLoading(state);
                return;
              }
              if (state instanceof DeleteReportLoadedState) {
                me.deleteLoaded(state);
                return;
              }
            },
            (state: DeleteReportLoadingErrorState) => {
              me.deleteLoadingError(state);
            }

          );
        }
        return;
      },
      reject: () => { this.dialogVisible = false; return; },
      rejectVisible: true
    });
  }

  deleteLoading(state) { }
  deleteLoaded(state) {
    const me = this;

    if (me.data && me.data.data && me.data.data.length > 0
      && me.selectedRow.length > 0) {
      for (let i = 0; i < me.selectedRow.length; i++) {
        for (let j = 0; j < me.data.data.length; j++) {
          if (me.selectedRow[i].rN == me.data.data[j].rN) {
            me.data.data.splice(j, 1);
            me.filterResetReports = "";
          }
        }
      }
    }
    
    me.messageService.add({key: 'reportToastKey', severity:"success", summary:"Report delete", detail:"Report(s) deleted successfully" });
    me.selectedRow = [];
    me.updateRowGroupMetaData();
    me.isEnabledColumnFilter = false;
    me.metrics.reset();
  }

  deleteLoadingError(state) { }
  reuseLoading(state) { }
  reuseLoaded(state) {
    this.metricsService.dataTobeEdit = state;
    this.metricsService.isEditCompare = true;
    this.router.navigate(['/add-report']);
  }
  reuseLoadingError(state) { }

  downloadTableData(type) {
    const me = this;
    let tableData;
    if(isEmpty(this.metrics.filters)){
    tableData = me.data.data;
    }else{
    tableData = this.metrics.filteredValue;
    }
    if(this.selectedRow.length > 0){
      tableData = this.selectedRow;
    }
    if(this.selectedSchedulerRow.length > 0){
      tableData = this.selectedSchedulerRow;
    }
    let dataInfo = [...tableData];
    let header = ['S No.'];
    let skipColumn = ['S No.'];
    for (const c of me.cols){
      header.push(c.label);
     if(!me.selectedColumns.includes(c)){
      skipColumn.push(c.label);
     }
    }
    me.metricsService.downloadTableData(type, dataInfo,header,skipColumn).subscribe(
      (state: Store.State) => {
        if (state instanceof onDownloadLoadingState) {
          me.downloadTableDataLoading(state);
          return;
        }
        if (state instanceof onDownloadLoadedState) {
          me.downloadTableDataLoaded(state);
          return;
        }
      },
      (state: onDownloadLoadingErrorState) => {
        me.downloadTableDataLoadingError(state);
      }

    );
  }

  downloadTableDataLoading(state) { }
  downloadTableDataLoaded(state) {
    let path = state.data.path.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");
  }
  downloadTableDataLoadingError(state) { }

  paginate(event) {
    console.log("event :", event);
    this.metricsService.paginateEventReport = event;
    this.first = event.first;
    this.rows = event.rows;
    const selectedEle = this.data.data.slice(this.first, this.first + this.rows);
    this.selectedRow = [...this.selectedRow, ...selectedEle];
    console.log("this.tableHeaderCheck :",this.tableHeaderCheck);
    if(!this.tableHeaderCheck.updateCheckedState()){
      this.selectedRow = [];
    }

    // if (this.tableHeaderCheck.updateCheckedState() === false) {
    //   this.selectedRow.splice(this.first, this.rows);
    //   console.log(this.selectedRow.map(v => v.name));
    // }
  }

  headerCheckToggle(event) {
    if (event.checked) {
      this.selectedRow = this.selectedRow.splice(this.first, this.rows);
    } else {
      this.selectedRow = [];
    }
  }

  getUniqueListOfData(){
    const arrData = this.data.data;
    let flagArr = [];
    this.uniqueReportList = [];
    console.log("arrData :", arrData);
    let result = arrData.filter(function (jsonObj) {
        var key = jsonObj.rN + '|' + jsonObj.rT;
        if (!flagArr[key]) {
          flagArr[key] = true;
          return true;
        }
    }, Object.create(null));

    console.log("result :",result);
    this.uniqueReportList = result;
  }

  showMiniTable(){
    this.schDialogVisible = true;
  }

  hideMiniTable(){
    this.schDialogVisible = false;
  }

  showMiniTableData(rowEvent) {
    console.log("row date", rowEvent);
    let dataTable = [];
    this.selectedSchedulerRow = [];
    this.selectedRow = [];
    let checkSchduler = this.checkListSchdularData(rowEvent);
    if (checkSchduler) {
      if (this.data && this.data.data && this.data.data.length > 0) {
        this.showMiniTable();
        let reprotListData = this.data.data;
        for (let i = 0; i < reprotListData.length; i++) {

          if (rowEvent.rN === reprotListData[i].rN && rowEvent.rT === reprotListData[i].rT) {
            dataTable.push(reprotListData[i]);
          }

        }
      }
      this.miniDataTable.data = dataTable;
      this.totalRecordMini = this.miniDataTable.data.length;
    }
    this.schedulerMetricId.reset();
  }

  checkListSchdularData(rowData){
    if(rowData.rS === "Yes"){
      return true;
    }
    return false;
  }

  closeDialog(event){
    console.log("closeDialog event :",event);
    this.hideMiniTable();
    this.selectedSchedulerRow = [];
    this.selectedRow = [];
  }

  getCount(rowData){
    let count = 0;
    let reportDataList = this.data.data;
    for(let i=0;i<reportDataList.length;i++){
      if(rowData.rN === reportDataList[i].rN && rowData.rT === reportDataList[i].rT){
        count = count + 1;
      }
    }
    return count;
  }

  paginateScheduleTable(event){
    console.log("event mini:", event);
    this.firstCount = event.first;
    this.rowsCount = event.rows;
    const selectedEle = this.miniDataTable.data.slice(this.firstCount, this.firstCount + this.rowsCount);
    this.selectedSchedulerRow = [...this.selectedSchedulerRow, ...selectedEle];
    console.log("this.tableHeaderCheck mini :",this.tableHeaderCheck);
    if(!this.tableHeaderCheck.updateCheckedState()){
      this.selectedSchedulerRow = [];
    }
  }

  headerCheckToggleSchedulerTable(event){
    if (event.checked) {
      this.selectedSchedulerRow = this.selectedSchedulerRow.splice(this.firstCount, this.rowsCount);
    } else {
      this.selectedSchedulerRow = [];
    }
  }


  deleteSchedulerReport() {
    const me = this;
    if (me.selectedSchedulerRow.length == 0) {
      this.dialogVisible = true;
      this.confirmationService.confirm({
        key: "availableReportDialogue",
        message: "Please select atleast one row",
        header: "Error",
        accept: () => { this.dialogVisible = false; return; },
        reject: () => { this.dialogVisible = false; return; },
        rejectVisible: false
      });
      return;
    }
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: "availableReportDialogue",
      message: "Do you want to delete selected report?",
      header: "Confirmation",
      accept: () => {
        this.dialogVisible = false;
        if (me.selectedSchedulerRow.length > 0) {
          me.metricsService.getDeleteReportData(me.selectedSchedulerRow).subscribe(
            (state: Store.State) => {
              if (state instanceof DeleteReportLoadingState) {
                me.deleteSchedulerLoading(state);
                return;
              }
              if (state instanceof DeleteReportLoadedState) {
                me.deleteSchedulerLoaded(state);
                return;
              }
            },
            (state: DeleteReportLoadingErrorState) => {
              me.deleteSchedulerLoadingError(state);
            }

          );
        }
        return;
      },
      reject: () => { this.dialogVisible = false; return; },
      rejectVisible: true
    });
  }

  deleteSchedulerLoading(state) { }
  deleteSchedulerLoaded(state) {
    const me = this;

    if (me.miniDataTable && me.miniDataTable.data && me.miniDataTable.data.length > 0
      && me.selectedSchedulerRow.length > 0) {
      for (let i = 0; i < me.selectedSchedulerRow.length; i++) {
        for (let j = 0; j < me.data.data.length; j++) {
          if (me.selectedSchedulerRow[i].rN === me.data.data[j].rN 
            && me.selectedSchedulerRow[i].cD === me.data.data[j].cD) {
            me.data.data.splice(j, 1);
            break;
          }
        }
      }
    }

    if(me.miniDataTable && me.miniDataTable.data && me.miniDataTable.data.length > 0
      && me.selectedSchedulerRow.length > 0){
      for (let i = 0; i < me.selectedSchedulerRow.length; i++) {
        for (let j = 0; j < me.miniDataTable.data.length; j++) {
          if (me.selectedSchedulerRow[i].rN == me.miniDataTable.data[j].rN
            && me.selectedSchedulerRow[i].cD === me.miniDataTable.data[j].cD) {
            me.miniDataTable.data.splice(j, 1);
            break;
          }
        }
      }
    }
    
    me.messageService.add({key: 'reportToastKey', severity:"success", summary:"Report delete", detail:"Report(s) deleted successfully" });
    me.selectedRow = [];
    me.selectedSchedulerRow = [];
    me.updateRowGroupMetaData();
    me.isEnabledColumnFilter = false;
    me.metrics.reset();
  }

  deleteSchedulerLoadingError(state) { }

  toggleFiltersScheduler() {
    const me = this;
    me.isEnabledColumnFilterScheduler = !me.isEnabledColumnFilterScheduler;
    if (me.isEnabledColumnFilterScheduler === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
    me.metrics.reset();
  }

}
