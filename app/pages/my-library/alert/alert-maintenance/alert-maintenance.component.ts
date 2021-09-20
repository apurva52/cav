import { state } from '@angular/animations';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem, MessageService, ConfirmationService, SortEvent } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { IMPORT_EXPORT_MODULE_TYPE, IMPORT_EXPORT_FILEPATH, ALERT_EXPORT, ALERT_IMPORT, ALERT_MODULES} from 'src/app/pages/my-library/alert/alert-constants'
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PAYLOAD_TYPE } from '../alert-rules/alert-configuration/service/alert-config.dummy';
import { AlertDownloadService } from '../service/alert-download.service';
import { SelectedIndicesComponent } from './dialog/selected-indices/selected-indices.component';
import { ALERT_MAINTENANCE_TABLE } from './service/alert-maintenance-table.dummy';
import { MaintenanceTable, MaintenanceRequest, Maintenance, MaintenanceResponse } from './service/alert-maintenance.model';
import { AlertMaintenanceService } from './service/alert-maintenance.service';
import { GenericImportExportComponent } from 'src/app/shared/generic-import-export/generic-import-export.component'
import { MaintenanceAddLoadedState, MaintenanceAddLoadingErrorState, MaintenanceAddLoadingState, MaintenanceDataLoadedState, MaintenanceDataLoadingErrorState, MaintenanceDataLoadingState } from './service/alert-maintenance.state';
import { from } from 'rxjs';
import { GenericImportExportService } from 'src/app/shared/generic-import-export/services/generic-import-export.service';
import { SessionService } from 'src/app/core/session/session.service';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { Schedule } from 'src/app/shared/pipes/dateTime/alert/schedule.pipe';
import { ScheduleType } from 'src/app/shared/pipes/dateTime/alert/scheduleType.pipe';
import { UpcomingWindow } from 'src/app/shared/pipes/dateTime/alert/upcomingWindow.pipe';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AdvancedConfigurationService } from '../alert-configuration/advanced-configuration/service/advanced-configuration.service';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-alert-maintenance',
  templateUrl: './alert-maintenance.component.html',
  styleUrls: ['./alert-maintenance.component.scss'],
  providers: [ MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AlertMaintenanceComponent implements OnInit {

  //breadcrumb: MenuItem[] = [];
  activeTab: MenuItem;

  data: MaintenanceTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean = true;
  emptyTable: boolean;
  empty: boolean;
  isShowGui: boolean = false;

  cols: TableHeaderColumn[] = [];
  selectedMaintenances: any = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  _selectedRow: [];
  isEnabledColumnFilter: boolean;
  searchOptions: SelectItem[];

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  @ViewChild(SelectedIndicesComponent, { read: SelectedIndicesComponent })
  private SelectedIndicesComponent: SelectedIndicesComponent;

  @ViewChild('appConfirmationDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;

  @ViewChild('impExpComponent', { read: GenericImportExportComponent })
  impExpComponent: GenericImportExportComponent;
  dataUsedToFilter: Maintenance[];
  filterDataMap: any = {};
  schedule: Schedule;
  scheduleType: ScheduleType;
  upcomingWindow:UpcomingWindow;
  globalFilterVla: string;
  isOnlyReadable: boolean;

  constructor(private _alertMaintenanceService: AlertMaintenanceService,
              private router: Router,
              private impExpService: GenericImportExportService,
              private sessionService: SessionService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private alertDownloadService: AlertDownloadService,
              private advConfigService: AdvancedConfigurationService,
              private alertCapability: AlertCapabilityService,
              public breadcrumb: BreadcrumbService) {
                this.schedule = new Schedule(sessionService, advConfigService);
                this.scheduleType = new ScheduleType();
                this.upcomingWindow = new UpcomingWindow(sessionService, advConfigService);
              }

  ngOnInit(): void {
    const me = this;
    
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_MAINTENANCE);
    me.downloadOptions = [
      { label: 'WORD', command: (event) => { me.downloadReport('worddoc') } },
      { label: 'PDF', command: (event) => { me.downloadReport('pdf'); } },
      { label: 'EXCEL', command: (event) => { me.downloadReport('excel'); } }
    ]

    me.searchOptions = [
      {label:'All', value:'all'},
      {label:'History', value:'history'},
    ]

    me.breadcrumb.addNewBreadcrumb({ label: 'Alert Maintenance', routerLink: ['/alert-maintenance']});
    /* me.breadcrumb = [
      { label: 'Home', routerLink: ['/home']},
      { label: 'my-library', routerLink: ['/my-library'] },
      { label: 'Alert', routerLink: ['/my-library/alert'] },
      { label: 'Alert Maintenance', routerLink: ['/alert-maintenance']}
    ] */
    me.alertSetting = [
      {
        label: 'Active Alert',
        routerLink: ['/my-library/alert'],
        state: {isActHis: "active"},
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_EVENT)
      },
      {
        label: 'Alert History',
        routerLink: ['/my-library/alert'],
        state: {isActHis: "history"},
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_EVENT)
      },
      {
        label: 'Alert Configuration',
        routerLink: ['/alert-configure'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_CONFIGURATION)
      },
      {
        label: 'Alert Rules',
        routerLink: ['/alert-rules'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_RULE)
      },
      {
        label: 'Alert Actions',
        routerLink: ['/alert-actions'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_ACTION)
      }
    ]

    me.load();
    //me.data = ALERT_MAINTENANCE_TABLE;
    //this.totalRecords = me.data.data.length;
  }

  downloadReport(type: string) {
    const me = this;
    if (!me.selectedMaintenances || me.selectedMaintenances.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to download Alert Maintenance.' });
      return;
    }
  
    let colFilter = {};
    for (let prop in me.filterDataMap) { 
      for (const header of me._selectedColumns){
        if (header.valueField == prop){
            colFilter[header.label] = {value: me.filterDataMap[prop]['value']};
        }
      }
    }
    me.alertDownloadService.filterDataMap = colFilter;
    me.alertDownloadService.globalFilterVla = me.globalFilterVla;
    me.alertDownloadService.downloadReport(type, me.selectedMaintenances, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_MAINTENANACE, []);
    me.selectedMaintenances = [];
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  @Input() get selectedRow(): []{
    const me = this;
    return me._selectedRow;
  }
  set selectedRow(val : []){
    const me = this;

  }


  // openSelectedIndices() {
  //  this.SelectedIndicesComponent.open();
  // }

  onChangeToggleColumn(event: any){
    const me = this;
    let isToggle: boolean = true;
    for (let index = 0; index < event.value.length; index++) {
      const element = event.value[index];
      if (element.valueField == event.itemValue.valueField){
          isToggle = false;
      }
    }
    if(isToggle){
    if (me.isEnabledColumnFilter) {
        for (let prop in me.filterDataMap) {
          if (event.itemValue.valueField == prop) {
            if(me.globalFilterVla){
              me.filter(me.globalFilterVla, "-1", '');
              }
              else{
                me.filter('', "-1", '');
              }
          }
        }
    }
  }
    me.filterDataMap = {};
  }


  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';

      me.data.data = ObjectUtility.duplicate(me.dataUsedToFilter);
      me.filterDataMap = {};

      if(me.globalFilterVla)
        me.filter(me.globalFilterVla, "-1", "");
    }
  }

  load() {
    const me = this;
    me.loading = true;
    me._alertMaintenanceService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof MaintenanceDataLoadingState) {
          me.onMaintenanceLoading();
          return;
        }

        if (state instanceof MaintenanceDataLoadedState) {
          me.onMaintenaceLoaded(state);
          return;
        }
      },
      (state: MaintenanceDataLoadingErrorState) => {
        me.onMaintenanceLoadingError(state);
      }
    );
  }

  refreshMaintenance(){
    const me = this;

    if(me.isShowGui){
      return;
    }
    me.isShowGui = !me.isShowGui;
    me.loading = true;
    me._alertMaintenanceService.all().subscribe(
      (state: Store.State) => {
        if(state instanceof MaintenanceAddLoadingState){
          me.onMaintenanceAddLoading();
        }
        if(state instanceof MaintenanceAddLoadedState) {
          me.onMaintenanceAddLoaded();
          me.data.data = state.data.maintenances;
          me.selectedMaintenances = [];
          me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
          me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert maintenance(s) loaded succesfully.' });
          me.isShowGui = !me.isShowGui;
        }
      },
      (state: MaintenanceAddLoadingErrorState) => {
        me.onMaintenanceAddLoadingError(state);
        me.isShowGui = !me.isShowGui;
      }
    );

  }

  executeCommand(accept)
  {
    const me = this;
    console.log("accept === ", accept);
    if(accept)
    {
      me.loading = true;
      me._alertMaintenanceService.delete(me.selectedMaintenances).subscribe(
        (state: Store.State) => {
         if (state instanceof MaintenanceAddLoadingState) {
          me.onMaintenanceAddLoading();
        }
        else if (state instanceof MaintenanceAddLoadedState) {
          me.onMaintenanceAddLoaded();
          me.deleteRecordFromTable(state.data);
        }
        else if (state instanceof MaintenanceAddLoadingErrorState) {
          me.onMaintenanceAddLoadingError(state);
        }
      });
    }
    else
    {

    }
  }
  deleteRecordFromTable(data: MaintenanceResponse) {
    console.log("going to delete the selected record", data);
    const me = this;
    data.configStatus.forEach(config => {
      me.data.data.forEach((rowData, index) => {
        if (config.status.code == 200 && config.id == rowData.id) {
          me.data.data.splice(index, 1);
        }
      })
    })
    me.data.data = [...me.data.data];
    me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert Maintenance(s) deleted successfully' });
    me.selectedMaintenances = [];
  }

  deleteMaintenances(){
    const me = this;
    console.log("selected",me.selectedMaintenances);
    if (!me.selectedMaintenances || me.selectedMaintenances.length == 0){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record.' });
      return;
    }
    else{
      me.confirmDialog.ifConfirmationNeeded = true;
      me.confirmDialog.body = 'Are you sure that you want to delete the selected schedule(s).';
      me.confirmDialog.open();
    }
  }

  importExportMaintenance(imEx: number){
    const me = this;
    console.log("selecteddd",this.selectedMaintenances);
    me.impExpComponent.moduleType = me.impExpService.moduleType =  IMPORT_EXPORT_MODULE_TYPE.ALERT_MAINTENANCE;
    if(imEx == 1){
      if(!me.selectedMaintenances || me.selectedMaintenances == undefined || me.selectedMaintenances == null || me.selectedMaintenances.length == 0){
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record.' });
      }
      else{
      me.impExpService.request = me.makeRequestBody(me.selectedMaintenances);
        me.impExpComponent.openImportExportDialog("Maintenances", "maintenances", ALERT_EXPORT,"alert",IMPORT_EXPORT_FILEPATH);
      }
      this.selectedMaintenances = null;
    }
    else{
      me.impExpService.request = me.makeRequestBody();
      me.impExpComponent.openImportExportDialog("Maintenances", "maintenances", ALERT_IMPORT,"alert", IMPORT_EXPORT_FILEPATH);
      this.selectedMaintenances = null;
  }

  }

  makeRequestBody(maintenances?: Maintenance[]){
    const me = this;
    const session = me.sessionService.session;

    if(session){
      const cctx = {
        cck: session.cctx.cck,
        pk: session.cctx.pk,
        u: session.cctx.u,

    };
    const maintenanceReq: MaintenanceRequest ={
      cctx: cctx,
      opType: null,
      clientId:"-1",
      appId:"-1",
      maintenances: maintenances
    }
    return maintenanceReq;
  }

}

addImportedData(result: any){
  const me = this;
  if(result.configStatus[0].status.code == 200){
    me.data.data.push(result.maintenances[0]);
    me.data.data = [...me.data.data];
  }
}

  addData(data : any){
    const me = this;
    if(data.isEdit){
      me.data.data.forEach((element, index) => {
        if (element.id == data.maintenance.maintenances[0].id) {
          me.data.data[index] = data.maintenance.maintenances[0];

        }
      });
      me.messageService.add({ severity: 'success', summary: 'Success', detail: data.maintenance.status.detailedMsg });  
    }
    else{
    me.data.data.push(data.maintenance.maintenances[0]);
    me.data.data = [...me.data.data];
    me.messageService.add({ severity: 'success', summary: 'Success', detail: data.maintenance.status.detailedMsg });  
    }
  }

  searchChange(search: any){
    const me = this;
    if(search.value == 'history'){
    me._alertMaintenanceService.history().subscribe(
      (state: Store.State) => {
        if(state instanceof MaintenanceAddLoadingState){
          me.onMaintenanceAddLoading();
        }
        if(state instanceof MaintenanceAddLoadedState) {
          me.onMaintenanceAddLoaded();
          me.data.data = state.data.maintenances;
        }
      },
      (state: MaintenanceAddLoadingErrorState) => {
        me.onMaintenanceAddLoadingError(state);
        }
     );
    }else{
      me.refreshMaintenance();
    }
  }

  private onMaintenanceLoading() {
    const me = this;
    // me.dataTable.data = null;
    me.error = null;
    me.empty = false;
    me.emptyTable = false;
    me.loading = true;
  }

  private onMaintenanceLoadingError(state: MaintenanceDataLoadingErrorState) {
    const me = this;
    //me.dataTable.data = null;
    me.error = state.error;
    me.empty = false;
    me.loading = false;
  }

  private onMaintenaceLoaded(state: MaintenanceDataLoadedState) {
    const me = this;
    if(!state.data.data)
       state.data.data = [];

    me.data = state.data;
    console.log("me.data === ", me.data);
    me.totalRecords = me.data.data.length;
    if(me.totalRecords)
      me.emptyTable = false;
    else  
      me.emptyTable = true;


    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    if (me.data) {
      me.empty = !me.data.data;
    }
    
    me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
    // var filterFolderData = me.dataTable.data.filter(obj=> {return obj.data.path});
    // console.log("filterFolderData==========="+filterFolderData);
    me.error = state.error;
    me.loading = false;
    if (me.data.status.code == 0)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: me.data.status.detailedMsg });
    else
    this.messageService.add({ severity: 'error', summary: 'Error', detail: me.data.status.msg });
  }


  public onMaintenanceAddLoading() {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  public onMaintenanceAddLoadingError(state: MaintenanceAddLoadingErrorState) {
    const me = this;
    console.log("stateError",state.error);
    console.log("stateErrorMsg",state.error.message);
    me.error = state.error;
    me.loading = false;
  }

  public onMaintenanceAddLoaded() {
    const me = this;
    me.error = null;
    me.loading = false;
    me.router.navigate(['/alert-maintenance']);
  }

  filter(value: any, field: any, matchMode: any)
  {
    const me = this;

    if(field != "-1")
      me.filterDataMap[field] = {value: value};

    let dataUsedToFilter: Maintenance[] = ObjectUtility.duplicate(me.dataUsedToFilter);

    me._selectedColumns.forEach(col => {
      if(me.filterDataMap[col.valueField] != null)
      {
        me.data.data = dataUsedToFilter.filter((event) => {
          if(me.filterWithParameter(col, event, me.filterDataMap[col.valueField].value))
            return true;
        });

        dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
      }
    });

    if(me.globalFilterVla || field == "-1")
    {
      if(field == "-1")
        me.globalFilterVla = value;

        me.data.data = dataUsedToFilter.filter((event) => {
          for(let i = 0; i < me._selectedColumns.length; i++)
          {
            if(me.filterWithParameter(me._selectedColumns[i], event, me.globalFilterVla))
              return true;
          }
        });
    }
  }

  filterWithParameter(col: TableHeaderColumn, event: Maintenance, value: string)
  {
    const me = this;

    if(col.valueField =='name')
    {
      if(me.schedule.transform(event['attributes']['scheduleConfig']).toLowerCase().includes(value.toLowerCase()))
        return true;
    }
    else if(col.valueField =='type')
    {
      if(me.scheduleType.transform(event['attributes']['scheduleConfig'][col.valueField]).toLowerCase().includes(value.toLowerCase()))
        return true;
    }
    else if(col.valueField =='maintenanceWindow')
    {
      if(me.upcomingWindow.transform(event['attributes']['scheduleConfig']).toLowerCase().includes(value.toLowerCase()))
        return true;
    }
    else
    {
      if(event['attributes'][col.valueField].toLowerCase().includes(value.toLowerCase()))
        return true;
    }
  }

  customSort(events: SortEvent)
  {
    const me = this;

    events.data.sort((data1, data2) => {
      let value1 = null;
      let value2 = null;

      if(events.field == 'name')
      {
        value1 = me.schedule.transform(data1['attributes']['scheduleConfig']);
        value2 = me.schedule.transform(data2['attributes']['scheduleConfig']);
      }
      else if(events.field == 'type')
      {
        value1 = me.scheduleType.transform(data1['attributes']['scheduleConfig'][events.field]);
        value2 = me.scheduleType.transform(data2['attributes']['scheduleConfig'][events.field]);
      }
      else if(events.field == 'maintenanceWindow')
      {
        value1 = me.upcomingWindow.transform(data1['attributes']['scheduleConfig']);
        value2 = me.upcomingWindow.transform(data2['attributes']['scheduleConfig']);
      }
      else
      {
        value1 = data1['attributes'][events.field];
        value2 = data2['attributes'][events.field];
      }


      let result = null;

      if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
      else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (events.order * result);
    });
  }
}
