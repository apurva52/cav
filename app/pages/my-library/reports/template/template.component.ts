import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService, TableHeaderCheckbox } from 'primeng';
import { TemplateService } from './service/template.service';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TEMPLATE_TABLE_DATA } from './service/template.dummy';
import { TemplateHeaderCols, TemplateTable } from './service/template.model';
import {
  TemplateTableLoadingState, TemplateTableLoadedState,
  TemplateTableLoadingErrorState, DeleteTemplateLoadedState,
  DeleteTemplateLoadingState, DeleteTemplateLoadingErrorState, EditTemplateLoadingState,
  EditTemplateLoadedState, EditTemplateLoadingErrorState, onDownloadLoadingState, onDownloadLoadedState, onDownloadLoadingErrorState
} from './service/template.state';
import { AddReportSettingsService } from '../../reports/metrics/add-report-settings/service/add-report-settings.service';
import { AddTemplateService } from '../template/add-template/service/add-template.service'
import { SessionService } from 'src/app/core/session/session.service';
import { AddReportService } from '../metrics/add-report/service/add-report.service';
import {Message,MessageService} from 'primeng/api'
import { ReportsService} from './../../reports/service/reports.service';
import { SchedulerEnableLoadingState,SchedulerEnableLoadedState, SchedulerEnableLoadingErrorState} from '../service/reports.state';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class TemplateComponent implements OnInit {
  @ViewChild('template') template;
  @ViewChild(TableHeaderCheckbox) tableHeaderCheck: TableHeaderCheckbox; 
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  data: TemplateTable;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TemplateHeaderCols[] = [];
  colsRead:TemplateHeaderCols[] = [];
  _selectedColumns: TemplateHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow = [];
  dialogVisible: boolean = false;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  reportSetDataArr: any[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  templateName: any;
  featurePermission = 7;
  tip:string = "";

  first = 0;
  rows = 10;
  schBtnDisable: boolean= false;
  blockedDocument: boolean = true;
  filterResetTemplate;

  disableDeleteIcon = false;

  constructor(
    private router: Router,
    private templateService: TemplateService,
    private confirmationService: ConfirmationService,
    private addReportSettingsService: AddReportSettingsService,
    private addTemplateService: AddTemplateService,
    private sessionService:SessionService,
    public addReportService: AddReportService,
    private messageService: MessageService,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.addReportService.isHeirarchical = false;
    me.addReportService.isMultiLayot = true;
    me.addReportService.isCompareReport = false;
    me.addReportService.checkIncludeChart = true;
    me.addReportService.ischeckTrendCompare = false;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system' }, for bug id - 110253
      { label: 'My Library', routerLink: '/my-library/dashboards' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Template', routerLink: '/template' },
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
    if(me.featurePermission > 4){
      me.cols = TEMPLATE_TABLE_DATA.headers[0].cols;
      for (const c of TEMPLATE_TABLE_DATA.headers[0].cols) {
        me.globalFilterFields.push(c.valueField);
        if (c.selected) {
          me._selectedColumns.push(c);
        }
      }
    }
      else {
        me.colsRead = TEMPLATE_TABLE_DATA.headersRead[0].cols;
        for (const c of TEMPLATE_TABLE_DATA.headersRead[0].cols) {
          me.globalFilterFields.push(c.valueField);
          if (c.selected) {
            me._selectedColumns.push(c);
          }
        } 
      }
    
    if(me.data && me.data.data){
      me.data.data = [];
    }
    me.loadavailableTemplates();
    me.getIsSchedulerEnable();
  }

  @Input() get selectedColumns(): TemplateHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TemplateHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  addTemplate() {
    this.router.navigate(['/add-template']);
  }

  showSchedule() {
    TEMPLATE_TABLE_DATA.paginator.first=0;
    TEMPLATE_TABLE_DATA.paginator.rows=10;
    this.router.navigate(['/schedules']);
  }
  showTemplate() {
    TEMPLATE_TABLE_DATA.paginator.first=0;
    TEMPLATE_TABLE_DATA.paginator.rows=10;
    this.router.navigate(['/reports/metrics']);
  }
  toggleFilters() {
    const me = this;
    try {
      me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
      if (me.isEnabledColumnFilter === true) {
        me.filterTitle = 'Disable Filters';
      } else {
        me.filterTitle = 'Enable Filters';
      }
      me.template.reset();
    } catch (error) {
      console.error(error);
    }
  }
  loadavailableTemplates() {
    const me = this;

    try {
      me.templateService.loadTemplate().subscribe(
        (state: Store.State) => {
          if (state instanceof TemplateTableLoadingState) {
            me.onLoading(state);
            return;
          }
  
          if (state instanceof TemplateTableLoadedState) {
            me.onLoaded(state);
            return;
          }
        },
        (state: TemplateTableLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
      
    } catch (error) {
      console.error(error);
    }
  }
  onLoading(state) { 
    this.loading= true;
  }
  onLoaded(state) {
    const me = this;

    try {

      let jsondata: any = state.data;
      TEMPLATE_TABLE_DATA.data = jsondata.temList;
      me.templateService.templateList = TEMPLATE_TABLE_DATA.data;
      me.data = TEMPLATE_TABLE_DATA;

      // only exist system template in list
      me.disableDeleteIcon = false;
      if (!me.sessionService.isMultiDC) {
        if (me.data && me.data.data && me.data.data.length <= 6) {
          me.disableDeleteIcon = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
    this.loading= false;
  }
  onLoadingError(state) { 
    this.loading= false;
  }
  downloadTemplate(event) {
    const me = this;

    try {
      let isdownload = confirm("Do you want to download selected template.");
    if (isdownload == false)
      return;
    let url = window.location.protocol + '//' + window.location.host;
    if (event.type === 'Threshold') {
      url += "/templates/thresholdTemplates/" + event.tn + "." + event.ext;
    }
    else if (event.type === 'Excel') {
      url += "/templates/excel_templates/" + event.tn + "." + event.ext;
    }
    else if (event.type === 'AlertDigest') {
      url += "/templates/alertDigestTemplates/" + event.tn + "." + event.ext;
    }
    window.open(url);
    me.confirmationDialog("Successful","Template download successfully.");
      
    } catch (error) {
      console.error(error);
    }
  }
  deleteTemplate() {
    const me = this;

    try {
      if (me.selectedRow.length == 0) {
        this.dialogVisible = true;
        this.confirmationService.confirm({
          key: 'addTemplateDialog',
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
      this.confirmationService.confirm({
        key: 'addTemplateDialog',
        message: "Do you want to delete the selected template ?",
        header: "Confirmation",
        accept: () => {
          if (me.selectedRow.length > 0) {
            me.templateService.deleteTemplateList(me.selectedRow).subscribe(
              (state: Store.State) => {
                if (state instanceof DeleteTemplateLoadingState) {
                  me.deleteLoading(state);
                  return;
                }
  
                if (state instanceof DeleteTemplateLoadedState) {
                  me.deleteLoaded(state);
                  return;
                }
              },
              (state: DeleteTemplateLoadingErrorState) => {
                me.deleteLoadingError(state);
              }
            );
          }
          return;
        },
        reject: () => { this.dialogVisible = false; return; },
        rejectVisible: true
      });
      
    } catch (error) {
      console.error(error);
    }
  }
  deleteLoading(state) { }
  deleteLoaded(state) {
    const me = this;

    try {
      for (let i = 0; i < me.selectedRow.length; i++) {
        for (let j = 0; j < me.data.data.length; j++) {
          if (me.selectedRow[i].tn == me.data.data[j].tn) {
            me.data.data.splice(j, 1);
            this.filterResetTemplate = "";
            break;
          }
        }
      }
      this.messageService.add({severity:"success", summary:"Template delete", detail:"Template deleted successfully" });
      me.selectedRow = [];
      me.isEnabledColumnFilter = false;
      // only exist system template in list
      me.disableDeleteIcon = false;
      if (!me.sessionService.isMultiDC) {
        if (me.data && me.data.data && me.data.data.length <= 6) {
          me.disableDeleteIcon = true;
        }
      }
      me.template.reset();
    } catch (error) {
      console.error(error);
    }
  }
  deleteLoadingError(state) { }

  editTemplate(event) {
    const me = this;

    try {
      me.templateService.editTemplateList(event).subscribe(
        (state: Store.State) => {
          if (state instanceof EditTemplateLoadingState) {
            me.editLoading(state);
            return;
          }
          if (state instanceof EditTemplateLoadedState) {
            me.editLoaded(state);
            return;
          }
        },
        (state: EditTemplateLoadingErrorState) => {
          me.editLoadingError(state);
        }
      );
      
    } catch (error) {
      console.error(error);
    }
  }
  editLoading(state) { }
  editLoaded(state) {
    const me = this;

    try {
      me.templateService.editAddedTemplate = state;
    me.templateService.isEdit = true;
    me.router.navigate(['/add-template']);
      
    } catch (error) {
      console.error(error);
    }
  }
  editLoadingError(state) { }

  downloadTableData(type) {
    const me = this;
    let header = ['S No.'];
    let skipColumn = ['S No.'];
    let totalCol = me.cols;
    if(me.colsRead.length > 0){
      totalCol = me.colsRead;
    }
    for (const c of totalCol){
      header.push(c.label);
     if(!me.selectedColumns.includes(c)){
      skipColumn.push(c.label);
     }
    }
    try {
      let tableData;
      if(isEmpty(this.template.filters)){
      tableData = me.data.data;
      }else{
      tableData = this.template.filteredValue;
      }
      if (this.selectedRow.length > 0) {
        tableData = this.selectedRow;
      }
      let dataInfo = [...tableData];

      me.templateService.downloadTableData(type, dataInfo, header, skipColumn).subscribe(
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
      
    } catch (error) {
      console.error(error);
    }
  }
  downloadTableDataLoading(state) { }
  downloadTableDataLoaded(state) {
    let path = state.data.path.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");
  }
  
  downloadTableDataLoadingError(state) { }

  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: 'addTemplateDialog',
      message: msg,
      header: head,
      accept: () => { this.dialogVisible = false; return; },
      rejectVisible: false
    });
  }
  paginate(event) {
    console.log("event :", event);
    this.templateService.paginateEventTemplate = event;
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
      for (let i = this.selectedRow.length - 1; i >= 0; i--) {
        if (this.selectedRow[i].type === "Systemdefault") {
          this.selectedRow.splice(i, 1);
        }
      }
    } else {
      this.selectedRow = [];
    }
  }
  getIsSchedulerEnable(){
    const me = this;
    me.reportsService.getIsSchedulerEnable().subscribe(
      (state: Store.State) => {
        if (state instanceof SchedulerEnableLoadingState) {
          me.onLoadingSchedulerEnable(state);
          return;
        }
  
        if (state instanceof SchedulerEnableLoadedState) {
          me.onLoadedSchedulerEnable(state);
          return;
        }
      },
      (state: SchedulerEnableLoadingErrorState) => {
        me.onLoadingErrorSchedulerEnable(state);
      }
    );
    }
    onLoadingSchedulerEnable(state){}
    onLoadedSchedulerEnable(state){
      if(state.data.schedulerEnable){
        this.schBtnDisable = false;
        this.tip = "";
      }
      else{
        this.schBtnDisable = true;
        this.tip = "Disabled due to no configuration";
      }
    }
    onLoadingErrorSchedulerEnable(state){}
}
