import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { TimebarValue } from 'src/app/shared/time-bar/service/time-bar.model';
import { AuditLogHeaderCols, AuditLogsTableLoadPayload, AuditLogTable, Session, User } from './service/audit-log.model';
import { AuditLogService } from './service/audit-log.service';
import { AuditLoadedState, AuditLoadingErrorState, AuditLogLoadingState } from './service/audit-log.state';
import { AuditLogFiltersComponent } from './audit-log-filters/audit-log-filters.component';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { isEmpty } from 'lodash';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingState,GlobalTimebarTimeLoadingErrorState} from './../../shared/time-bar/service/time-bar.state';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class AuditLogsComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  session: Session[];
  users: User[];
  selectedSession: Session;
  selectedUser: User;
  allUser: MenuItem[];
  allSelectedUser: MenuItem;
  groupBy = [{ label : "", value : ""}];
  data: AuditLogTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  globalFilterFields: string[] = [];
  cols: AuditLogHeaderCols[] = [];
  _selectedColumns: AuditLogHeaderCols[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isShow: boolean = false;
  inputValue: any;
  flowPathData = [];
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;
  isEnabledColumnFilter: boolean = false;
  isRefresh: boolean = false;
  filterTitle: string = 'Enable Filters';
  rowGroupMetadata: any;
  activeUsersNo: number = 0;
  activeSessions: number = 0;
  currentTimebarValue: TimebarValue;
  errorMessage : string = "Data not available.";
  sp: string = "LIVE3";
  include: boolean = true;
  activity : string[] = [];
  module  : string[] = [];
  selectedPresetLabel: string = "Last 1 Hour";
  startDate: string = "";
  endDate: string = "";
  showPaginator: boolean = false;
  colWidthInPixel: String
  isExpanded: boolean = false;
  rows: number =10;
  expandedRows = {};
  temDataLength: number = 0;
  keyword;
  dd2 : string='';
  grpData;
  flagForFilter:boolean = false;
  blockuiForAuditLog:boolean = false;

  @ViewChild('auditLog') auditLogStr;

  @ViewChild(AuditLogFiltersComponent, { read: AuditLogFiltersComponent })
  private auditLogFilter: AuditLogFiltersComponent;

  selectedGroupBy: {label: string , value: string} = {
    label : "Session Id",
    value: "sessionId"
  }
  lstPaginationIndex: any;

  constructor(private auditLogService: AuditLogService, private sessionService: SessionService, public timebarService: TimebarService) { }
  
  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Audit Logs' },
    ];

    me.allUser = [
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
      { label: 'ALL' },
    ];

    // me.downloadOptions = [
    //   { label: 'WORD', disabled: true },
    //   { label: 'PDF', disabled: true },
    //   { label: 'EXCEL', disabled: true },
    // ];

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
    // me.data = AUDIT_LOG_TABLE;
    //me.updateRowGroupMetaData();

    // me.cols = me.data.headers[0].cols;
    // for (const c of me.data.headers[0].cols) {
    //   if (c.selected) {
    //     me._selectedColumns.push(c);
    //   }
    // }

    const payload = {
      cctx: this.sessionService.session.cctx,
      groupBy: me.selectedGroupBy['value'],
              sp: me.sp,
              include: me.include,
              activity: me.activity,
              modules: me.module,
    }
    me.load(payload);
  }

  load(payload: AuditLogsTableLoadPayload) {
    const me = this;
    me.auditLogService.load(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AuditLogLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof AuditLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: AuditLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: AuditLogLoadingState) {
    const me = this;
    me.error = null;
    me.data = null;
    me.loading = true;
    this.timebarService.setLoading(true);
  }

  private onLoadingError(state: AuditLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.error.msg = "Error while loading data.";
    me.loading = false;
    this.timebarService.setLoading(false);
  }

  private onLoaded(state: AuditLoadedState) {
    const me = this;
    me.loading = true;
    me.data = null;
    me.data = state.data;
    if(state.data && state.data.status)
    me.errorMessage = state.data.status.msg;
    me.error = null;
   
    if(me.data){
    me.cols = me.data.headers[0].cols;
    if(me._selectedColumns.length == 0){
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected)
        me._selectedColumns.push(c);
    }
  }
    me.groupBy = [
      { value: 'activityTime', label: 'Activity Time'},
      { value: 'activityName', label: 'Activity Name'},
      { value: 'ip', label: 'IP Address'},
      { value: 'moduleName', label: 'Module Name'},
      { value: 'sessionId', label: 'Session Id'},
      { value: 'userName', label: 'User Name'},
      // { value: 'responseTime', label: 'Response Time'}
  ];
    if(me.data && me.data.extraLogsInfo){
      me.users = me.data.extraLogsInfo.users;
      me.session = me.data.extraLogsInfo.session;
      me.activeUsersNo = me.data.extraLogsInfo.activeUsers;
      me.activeSessions = me.data.extraLogsInfo.numberOfActiveSessions;
      me.selectedPresetLabel = me.data.extraLogsInfo.selectedLabel;
      me.startDate = me.data.extraLogsInfo.startDate;
      me.endDate = me.data.extraLogsInfo.endDate;
      me.auditLogService.st = me.data.extraLogsInfo.startDate;
      me.auditLogService.et = me.data.extraLogsInfo.endDate;
      
      if(me.data.data.length === 0)
      me.showPaginator = false;
      else{
        me.showPaginator = true;
        me.data.paginator.first = 0;
      }
    }else{
      me.showPaginator = false;
      try {
        me.timebarService.loadTime(me.auditLogService.getSelectedPreset()).subscribe(
          (state: Store.State) => {
            if (state instanceof GlobalTimebarTimeLoadingState) {
              me.onLoadingTime(state);
  
              return;
            }
  
            if (state instanceof GlobalTimebarTimeLoadedState) {
              me.onLoadedTime(state);
              return;
            }
          },
          (state: GlobalTimebarTimeLoadingErrorState) => {
            me.onLoadingTimeError(state);
  
          }
        );
      } catch (err) {
        console.error("Exception in loadTime method in audit-logs component :", err);
      }

    }
    me.data.paginator.first = me.lstPaginationIndex ? me.lstPaginationIndex :  me.data.paginator.first;
    this.grpData = this.data.data;
    me.updateRowGroupMetaData();
  }
  me.loading = false;
  me.blockuiForAuditLog = false;
  me.timebarService.setLoading(false);
  }
  onLoadingTime(state){}
  onLoadedTime(state){
    const me = this;
    me.auditLogService.st = moment(state.data[1]).format('MM/DD/YYYY HH:mm:ss:SSS');
    me.auditLogService.et = moment(state.data[2]).format('MM/DD/YYYY HH:mm:ss:SSS');
  }
  onLoadingTimeError(state){}
  searchGlobally(searchText){
    this.auditLogStr.filterGlobal(searchText,'contains');
    let wordSearch = this.dd2;
    setTimeout(() => {
      if (wordSearch == this.dd2) {
        if (this.dd2 && this.auditLogStr.filteredValue != null) {
          setTimeout(() => {
            setTimeout(() => {
              this.grpData = this.auditLogStr.filteredValue;
              this.updateRowGroupMetaData();
            }, 250);
          }, 500);
        }else{
          this.flagForFilter = true;
          this.grpData = this.data.data;
          this.data.paginator.first = 0;
          this.updateRowGroupMetaData();
        }
      }else{
        this.grpData = this.data.data;
      }
    }, 1000);
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  refreshData() {
    const me = this;
    me.isShowColumnFilter = false;
    me.isRefresh = true;
    me.data = null;
    me.loading  = true;
    me._selectedColumns = [];
    me.cols = null;
    me.selectedGroupBy = {
      label : "Session Id",
      value: "sessionId"
    }
    me.auditLogService.sp = "LIVE3";
    const payload = {
      cctx: this.sessionService.session.cctx,
      groupBy: me.selectedGroupBy['value'],
              sp: me.sp,
              include: me.include,
              activity: me.activity,
              modules: me.module,

    }
    me.load(payload);
  }

  updateRowGroupMetaData() {

    this.rowGroupMetadata = {};
    if (this.grpData) {
      for (let i = 0; i < this.grpData.length; i++) {
        let rowData = this.grpData[i];
        let groupData = rowData['groupData'].name;
        // let groupData = rowData.user;
      //  if(groupData){
        if (i == 0) {
          this.rowGroupMetadata[groupData] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.grpData[i - 1];
          let previousRowGroup = previousRowData.groupData.name;
          // let previousRowGroup = previousRowData.user;
          if (groupData === previousRowGroup)
            this.rowGroupMetadata[groupData].size++;
          else
            this.rowGroupMetadata[groupData] = { index: i, size: 1 };
        }
//      }
      }
    }
  }

  openFilter() {
    const me = this;
     me.auditLogFilter.show();
  }

  expandAll() {
    // console.log(this.data.data);
    // console.log(Object.keys(this.rowGroupMetadata));
    
   // if(!this.isExpanded){
     Object.keys(this.rowGroupMetadata).forEach((data) =>{
       this.expandedRows[data] = true;
       console.log(this.expandedRows);
       console.log(data);
      })

    // } else {
    //   this.expandedRows={};
    // }
    // this.isExpanded = !this.isExpanded;
  }

  onPageChange(event){
    console.log(this.rowGroupMetadata);
    const me = this;
    me.lstPaginationIndex = event.first;
    me.temDataLength = me.data.data.slice(event.first, event.first + 50).length;
    console.log(me.temDataLength);
    me.isExpanded = true;
    me.expandAll();
   me.expandedRows = {};    
  }

  @Input() get selectedColumns(): AuditLogHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: AuditLogHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  onChangeGroupBy(){
    const me = this;
    me.blockuiForAuditLog = true;
    me.loading = true;
    if(!me.auditLogService.getSelectedPreset() && !me.auditLogService.getInclude()){
      var payload: AuditLogsTableLoadPayload = {
        cctx: me.sessionService.session.cctx,
        groupBy: me.selectedGroupBy['value'],
        sp: me.sp,
        include: me.include,
        activity: [],
        modules: [],
      }
    }
    else{
      var payload: AuditLogsTableLoadPayload = {
        cctx: me.sessionService.session.cctx,
        groupBy: me.selectedGroupBy['value'],
        sp: me.auditLogService.getSelectedPreset(),
        include: me.auditLogService.getInclude(),
        activity: [],
        modules: [],
      }
    }

    if(me.data && me.data.data)
    me.data.data = null;
    //me._selectedColumns = [];
    me.cols = null;
    me.load(payload);
  }

  getAuditlogData()
  {
    const me = this;
    let obj = {
      _selectedColumns: me._selectedColumns,
      cols: me.cols,
      data: me.data,
      selectedGroupBy: me.selectedGroupBy
    }
    return obj;
  }

  downloadShowDescReports(label) {
    const me = this;
    let tableData;
    if(isEmpty(this.auditLogStr.filters)){
      tableData = me.data.data;
    }else{
      tableData = this.auditLogStr.filteredValue;
    }
    let header = ['S No.'];
    let headerValueField = [];
    let colWidth = [125, 125, 125, 125, 125, 125, 125, 125, 125];

    for (const c of me._selectedColumns){
      if(c.label === 'S No.')
        continue;
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
      else if(headerValueField[j] === 'time')
        rData.push(tableData[i].time);
      else if(headerValueField[j] === 'ipAddress')
        rData.push(tableData[i].ipAddress);
      else if(headerValueField[j] === 'user')
        rData.push(tableData[i].user);
      else if(headerValueField[j] === 'sessionID')
        rData.push(tableData[i].sessionID);
      else if(headerValueField[j] === 'module')
        rData.push(tableData[i].module);
      else if(headerValueField[j] === 'activity')
        rData.push(tableData[i].activity);
      else if(headerValueField[j] === 'description')
        rData.push(tableData[i].description);
      else if(headerValueField[j] === 'responseTime')
        rData.push(tableData[i].responseTime);
      }
      rowData.push(rData);
     }
     
    try {
      me.auditLogService.downloadShowDescReports(label, rowData,header, colWidth).subscribe(
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
