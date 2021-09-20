import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem , ConfirmationService, TableHeaderCheckbox} from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TemplateHeaderCols } from '../template/service/template.model';
import { SCHEDULES_TABLE_DATA } from './service/schedules.dummy';
import { SchedulesTable, SchedulesHeaderCols } from './service/schedules.model';
import { SchObj } from '../../reports/schedules/schedulereport/service/schedulereport.model'
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulesDeleteLoadedState, SchedulesDeleteLoadingErrorState, SchedulesDeleteLoadingState, StatusChangeLoadedState, StatusChangeLoadingErrorState, StatusChangeLoadingState, SchedulesTableLoadedState, SchedulesTableLoadingErrorState, SchedulesTableLoadingState, editTaskLoadingState, editTaskLoadedState, editTaskLoadingErrorState, onDownloadLoadingState, onDownloadLoadedState, onDownloadLoadingErrorState } from './service/scheduler.state';
import { environment } from 'src/environments/environment';
import { SchedulesService } from './service/schedules.service';
import {Message,MessageService} from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { AddReportService } from '../metrics/add-report/service/add-report.service';
import { ReportTimebarTimeLoadedState } from '../metrics/add-report/service/add-report.state';
import { ReportsService } from '../service/reports.service';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService,
    MessageService
  ]
})
export class SchedulesComponent implements OnInit {
  @ViewChild('schedule') schedule;
  @ViewChild(TableHeaderCheckbox) tableHeaderCheck: TableHeaderCheckbox; 
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  data: SchedulesTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isEdited: Boolean;
  isSwitched: Boolean;
  downloadOptions: MenuItem[];
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  isMultiDC: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  cols: SchedulesHeaderCols[] = [];
  _selectedColumns: SchedulesHeaderCols[] = [];
  globalFilterFields: string[] = [];
  globalDataFields: string[] = [];
  checked2: boolean = true;
  selectedRow = [];
  activeInactive = 'Active';
  responseArr = [];
  schObj: SchObj = {};
  rowForEdit = {};
  dialogVisible = false;
  featurePermission =7;
  filterReset;

  first = 0;
  rows = 10;
  
  constructor(
    private router: Router,
    private schedulesService: SchedulesService,
    public sessionService: SessionService,
    public confirmation: ConfirmationService,
    private messageService: MessageService,
    private addReportService: AddReportService,
    private reportsService: ReportsService

  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system' }, for bug id - 110253
      { label: 'My Library', routerLink: '/my-library/dashboards' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Schedule' },
    ];
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

    me.data = SCHEDULES_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
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
    me.loadAvailableSchedularTaskList();
    
    if(me.data.paginator.first !== 0){
      me.data.paginator.first = this.schedulesService.paginateEvent.first;
      me.data.paginator.rows = this.schedulesService.paginateEvent.rows;
    }
    const output = new Subject<TimebarValue>();
    this.addReportService.loadTime("LIVE10").subscribe(
      (state: Store.State) => {
        if (state instanceof ReportTimebarTimeLoadedState) {
          this.addReportService.srtTimeZero = state.data[1];
        }
      }
    );
  }

  @Input() get selectedColumns(): TemplateHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TemplateHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  addScheduleReport() {
    this.schedulesService.isScheduleReportButtonClicked = true;
    this.reportsService.fromReportUI = false;
    this.schedulesService.isEdit = false; 
    this.router.navigate(['/schedule-report'])
  }

  showTemplate() {
    SCHEDULES_TABLE_DATA.paginator.first = 0;
    SCHEDULES_TABLE_DATA.paginator.rows = 10;
    this.router.navigate(['/template'])
    }

  showSchedule() {
      SCHEDULES_TABLE_DATA.paginator.first = 0;
      SCHEDULES_TABLE_DATA.paginator.rows = 10;
      this.router.navigate(['/reports/metrics'])
    
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
    me.schedule.reset();
  }

  loadAvailableSchedularTaskList() {
    const me = this;
    const payload = {
      cctx: me.sessionService.session.cctx,
    };

    const path = environment.api.report.SchedulerAvailable.endpoint;
    me.schedulesService.loadAvailableSchedularTaskTable(path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof SchedulesTableLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof SchedulesTableLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: SchedulesTableLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: SchedulesTableLoadingState) {
    const me = this;

    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: SchedulesTableLoadingErrorState) {
    const me = this;

    me.empty = false;
    //me.error = true;
    me.loading = true;
  }

  private onLoaded(state: SchedulesTableLoadedState) {
    const me = this;
    let dataArr = [];

    let jsondata: any = state.data;
    dataArr = jsondata.addedReportTaskList;
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i]['taskDes'] = dataArr[i].taskDes;
      if (dataArr[i]['taskDes'] == "")
        dataArr[i]['taskDes'] = "NA";
        if(dataArr[i]['schTime'] == "null"){
          dataArr[i]['schTime'] = "NA";
        }
        if(dataArr[i]['cronStr'] == "null"){
          dataArr[i]['cronStr'] = "NA";
        }
        if(dataArr[i]['expiryTime'] == "0"){
          dataArr[i]['expiryTime'] = "NA";
        }
        if(dataArr[i]['schTime'].indexOf("Hourly") > -1){
          let arr = dataArr[i]['schTime'].split("_");
          dataArr[i]['schTime'] = arr[0];
          console.log('dataArr[i]',dataArr[i]['schTime']);
        }
        if(dataArr[i]['taskType'].indexOf("Alert") > -1){
          dataArr[i]['taskType'] = dataArr[i]['taskType'].substr(0, 12) + " " + dataArr[i]['taskType'].substr(12);
        }
    }

    SCHEDULES_TABLE_DATA.data = dataArr.sort(this.getSortOrder("lastModified","DES"));
    this.responseArr = SCHEDULES_TABLE_DATA.data;
    me.data = SCHEDULES_TABLE_DATA;
    me.empty = false;
    //me.error = false;
    me.loading = false;
  }
  getSortOrder(prop, order) {
    return function (a, b) {
      if (order == "DES") {
        if (a[prop] > b[prop]) {
          return -1;
        } else if (a[prop] < b[prop]) {
          return 1;
        }
        return 0;
      } else {
        if (a[prop] > b[prop]) {
          return 1;
        } else if (a[prop] < b[prop]) {
          return -1;
        }
        return 0;
      }
    }
  }

  onDelete() {
    const me = this;
    if (me.selectedRow.length == 0) {
      this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'schedules',
      message: "Please select atleast one row",
      header: "Error",
      accept: () => {
        this.dialogVisible = false;
      },
      rejectVisible: true
    });
      return;
    }
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'schedules',
      message: "Do you want to delete selected task?",
      header: "Confirmation",
      accept: () => { this.dialogVisible = false;
        if (me.selectedRow.length > 0) {
          me.schedulesService.getDeleteTask(me.selectedRow).subscribe(
            (state: Store.State) => {
              if (state instanceof SchedulesDeleteLoadingState) {
                me.deleteLoading(state);
                return;
              }
    
              if (state instanceof SchedulesDeleteLoadedState) {
                me.deleteLoaded(state);
                return;
              }
            },
            (state: SchedulesDeleteLoadingErrorState) => {
              me.deleteLoadingError(state);
            }
          );
        }
        return; },
      reject: () => { this.dialogVisible = false; return; },
      rejectVisible: true
    });
      
   
  }
  deleteLoading(state) { }

  deleteLoaded(state) {
    const me = this;
   
    for (let i = 0; i < me.selectedRow.length; i++) {
      for (let j = 0; j < me.data.data.length; j++) {
        if (me.selectedRow[i].taskId == me.data.data[j].taskId) {
          me.data.data.splice(j, 1);
          me.filterReset = "";
          break;
        }
      }
    }
    this.messageService.add({severity:"success", summary:"Task Delete", detail:"Task(s) deleted successfully." });
    me.selectedRow = [];
    me.isEnabledColumnFilter = false;
    me.schedule.reset();
  }

  deleteLoadingError(state) { }

  editTask(row) {
    const me = this;
    me.schedulesService.editTask(row).subscribe(
      (state: Store.State) => {
        if (state instanceof editTaskLoadingState) {
          me.editTaskLoading(state);
          return;
        }
        if (state instanceof editTaskLoadedState) {
          me.editTaskLoaded(state);

          return;
        }
      },
      (state: editTaskLoadingErrorState) => {
        me.editTaskLoadingError(state);
      }

    );
    this.createSchObj(row);
    
  }

  editTaskLoading(state) { }
  editTaskLoaded(state) {
    this.schedulesService.dataTobeEdit = state;
    this.schedulesService.isEdit = true;
    this.router.navigate(['/schedule-report']);
  }
  editTaskLoadingError(state) { }
  createSchObj(row){
    this.rowForEdit = row;
    this.schObj.taskId = row.taskId;
    this.schedulesService.rowDataFromParent = row;
  }
  
  statusChange(row, e) {
    const me = this;
    me.schedulesService.statusChange(row).subscribe(
      (state: Store.State) => {
        if (state instanceof StatusChangeLoadingState) {
          me.statusChangeLoading(state);
          return;
        }

        if (state instanceof StatusChangeLoadedState) {
          me.statusChangeLoaded(state);
          return;
        }
      },
      (state: StatusChangeLoadingErrorState) => {
        me.statusChangeLoadingError(state);
      }
    );
  }
  statusChangeLoading(state) { }

  statusChangeLoaded(state) {
    const me = this;
    for (let j = 0; j < me.data.data.length; j++) {
      if (me.responseArr[j].taskEnabled == true) {
        me.activeInactive == 'Active';
      }
      else {
        me.activeInactive == 'InActive';
      }
    }

  }

  statusChangeLoadingError(state) { }
  downloadTableData(type) {
    const me = this;
    let header = ['S No.'];
    let skipColumn = ['S No.'];
    for (const c of me.cols){
      header.push(c.label);
     if(!me.selectedColumns.includes(c)){
      skipColumn.push(c.label);
     }
    }
    header.push("Status");
    
    let tableData;
    if(isEmpty(this.schedule.filters)){
    tableData = me.data.data;
    }else{
    tableData = this.schedule.filteredValue;
    }
    if(this.selectedRow.length > 0){
      tableData = this.selectedRow;
    }
    let dataInfo = [...tableData];
    me.schedulesService.downloadTableData(type, dataInfo, header, skipColumn).subscribe(
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
    this.schedulesService.paginateEvent = event;
    this.first = event.first;
    this.rows = event.rows;
    const selectedEle = this.data.data.slice(this.first, this.first + this.rows);
    this.selectedRow = [...this.selectedRow, ...selectedEle];

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

}
