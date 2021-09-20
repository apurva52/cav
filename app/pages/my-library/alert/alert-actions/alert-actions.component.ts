import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AddActionComponent } from './add-action/add-action.component';
import { Action, ActionRequest, ActionResponse, ActionTable, Chart, Command, DiagnosticDump, Email, JFR, Report, SMS, SNMP, TcpDump } from './service/alert-actions.model';
import { AlertActionService } from './service/alert-actions.service';
import { ActionArrayDeletedState, ActionArrayDeletingErrorState, ActionArrayDeletingState, ActionDataLoadedState, ActionDataLoadingErrorState, ActionDataLoadingState, ActionLoadedState, ActionLoadingErrorState, ActionLoadingState, ActionResponseLoadedState, ActionResponseLoadeErrorState, ActionResponseLoadingState } from './service/alert-actions.state';
import * as CONS from './service/alert-action-constants'
import { ConfirmMsg } from '../alert-rules/service/alert-rules.model';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AlertDownloadService } from '../service/alert-download.service';
import { PAYLOAD_TYPE } from '../alert-rules/alert-configuration/service/alert-config.dummy';
import { Table } from 'primeng';
import { ALERT_EXPORT, ALERT_IMPORT, ALERT_MODULES, IMPORT_EXPORT_FILEPATH, IMPORT_EXPORT_MODULE_TYPE } from '../alert-constants';
import { GenericImportExportService } from 'src/app/shared/generic-import-export/services/generic-import-export.service';
import { SessionService } from 'src/app/core/session/session.service';
import { GenericImportExportComponent } from 'src/app/shared/generic-import-export/generic-import-export.component';
import * as DEFAULTACTIONDATA from './service/alert-actions.dummy'
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AlertRulesService } from '../alert-rules/service/alert-rules.service';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';


@Component({
  selector: 'app-alert-actions',
  templateUrl: './alert-actions.component.html',
  styleUrls: ['./alert-actions.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AlertActionsComponent implements OnInit, OnDestroy {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  //breadcrumb: MenuItem[];
  action: Action = new Action();
  data: ActionTable;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  selectedActions: Action[];
  isCheckbox: boolean;
  isShowInputText: boolean;
  confirmMessage: ConfirmMsg;
  isShowColumnFilter: boolean = false;
  newActionName: string;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  globalFilterVla = "";

  addActionOpen: boolean = false;

  @ViewChild('addActions', { read: AddActionComponent })
  addaction: AddActionComponent;

  @ViewChild('appConfirmationDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;

  @ViewChild('impExpComponent', { read: GenericImportExportComponent })
  impExpComponent: GenericImportExportComponent;

  visible: boolean;
  opType: number;
  isEdit: boolean;
  @ViewChild('events') table: Table;
  showD:any;
  isOnlyReadable: boolean;

  constructor(
    private router: Router,
    private alertActionService: AlertActionService,
    private messageService: MessageService,
    private impExpService: GenericImportExportService,
    private sessionService: SessionService,
    private alertDownloadService: AlertDownloadService,
    public breadcrumb: BreadcrumbService,
    public alertRuleService: AlertRulesService,
    public alertCapability: AlertCapabilityService
  ) { }

  ngOnDestroy(){
    this.showD.unsubscribe();
  }
  ngOnInit(): void {
    const me = this;

    me.data = DEFAULTACTIONDATA.ALERT_ACTION_DATA;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_ACTION);

    me.cols = me.data.headers[0].cols;
    for (const c of me.cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    this.showD = me.alertActionService.showActionDialog$.subscribe(visible => {
      this.addActionOpen = visible;
    });

    me.breadcrumb.addNewBreadcrumb({ label: 'Alert Actions', routerLink: ['/alert-actions'] });
    /* me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'my-library', routerLink: ['/my-library'] },
      { label: 'Alerts', routerLink: ['/my-library/alert'] },
      { label: 'Alert Action' },
    ]; */

    me.downloadOptions = [
      { label: 'WORD', command: (event) => { me.downloadReport('worddoc') } },
      { label: 'PDF', command: (event) => { me.downloadReport('pdf'); } },
      { label: 'EXCEL', command: (event) => { me.downloadReport('excel'); } }
    ];
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
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_MAINTENANCE)
      },
      {
        label: 'Alert Rules',
        routerLink: ['/alert-rules'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_RULE)
      }
    ]
    me.alertRuleService.isHideProgress = true;
    me.emptyTable = true;
    me.loadActionData(true);
  }
  showAddAction() {
    this.isEdit = false;
    this.addaction.initAction();
    this.alertActionService.showHideDialogue = true;
  }
  closeAddAction() {
    this.alertActionService.showHideDialogue = false;
  }
  editAction(rowData){
    this.isEdit = true;
    this.addaction.editAction(rowData);
    this.selectedActions=[];
  }

  downloadReport(type: string){
    const me = this;
    if (!me.selectedActions || me.selectedActions.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to download Alert Action.' });
      return;
    }

    let colFilter = {};
    //let globalFilterVla = '';
    for (let prop in me.table.filters) {
      if(prop == 'global')
        me.globalFilterVla = me.table.filters[prop]['value'];
      else{
        for (const header of me._selectedColumns){
          if (header.valueField == prop){
              colFilter[header.label] = {value: me.table.filters[prop]['value']};
          }
        }
      }
    } 
    
    me.alertDownloadService.filterDataMap = colFilter;
    me.alertDownloadService.globalFilterVla = me.globalFilterVla;
    me.alertDownloadService.downloadReport(type, me.selectedActions, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_ACTION, []);
    me.selectedActions = [];
  }

  loadActionData(onLoad:boolean) {
    const me = this;

    me.loading = true;
    if(!onLoad)
      me.alertRuleService.showProgressBar("Getting data from server, Please wait...");
    
    me.alertActionService.load(onLoad).subscribe(
      (state: Store.State) => {
        if (state instanceof ActionDataLoadingState) {
          me.onLoading();
          return;
        }
        if (state instanceof ActionDataLoadedState) {
          me.onLoaded(state.data, onLoad);
          me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert Action(s) loaded successfully' });
          return;
        }
      },
      (state: ActionDataLoadingErrorState) => {
        me.onLoadingError(state.error);
      }
    );
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  onChangeToggleColumn(event: any) {
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
          for (let prop in me.table.filters) {
            if (event.itemValue.valueField == prop) {
              me.table.filter('', prop, 'contains');
            }
          }
        
      }
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
  }
  private onLoading() {
    const me = this;
    me.error = null;
    me.loading = true;

  }
  private onLoaded(data: ActionTable, onLoad:boolean) {
    const me = this;
    me.error = null;
    if(onLoad){

      me.data = data;

      if(data.headers)
      {
        me.cols = [];
        me._selectedColumns = [];
        me.globalFilterFields = [];

        me.cols = me.data.headers[0].cols;
        for (const c of me.cols) {
          me.globalFilterFields.push(c.valueField);
          if (c.selected) {
            me._selectedColumns.push(c);
          }
        }
      }
    }
    else
    {
      if(data.data){
        me.data.data = [...data.data];
        me.emptyTable=false;
      }
      me.alertRuleService.progressValue = 100;
      me.alertRuleService.isHideProgress = true;
    }
    me.alertRuleService.extensionsList = [];
    if (data.extensions){
      data.extensions.forEach(extension => {
        me.alertRuleService.extensionsList.push({ icon: extension.extName, label: extension.displayName, value: extension.extName })
      });
    }
    if(!me.data.data)
      me.data.data=[];

    this.selectedActions=[];

    me.loading = false;
  }

  private onLoadingError(error: any) {
    const me = this;
    me.data = null;
    me.error = error;
    me.loading = false;
  }


  refreshAlertAction(refresh: boolean) {
    const me = this;
    me.loadActionData(false);
  }

  executeCommand(accept)
  {
    const me = this;
    console.log("accept === ", accept);
    if(accept)
    {
      me.alertActionService.delete(this.selectedActions).subscribe(res => {

        if (res instanceof ActionArrayDeletingState) {
          me.onLoading();
        }
        else if (res instanceof ActionArrayDeletedState) {
          me.deleteRecordFromTable(res.data);
        }
        else if (res instanceof ActionArrayDeletingErrorState) {
          me.onLoadingError(res.data);
        }
      });
      me.selectedActions = [];
    }
    else
    {

    }
  }


  deleteActions() {
    const me = this;
    if (!me.selectedActions || me.selectedActions.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one row.' });
      return;
    }
    else{
      me.opType = CONS.ACTION_OPERATONS.DELETE_ACTIONS;
      me.confirmDialog.ifConfirmationNeeded = true;
      me.confirmDialog.body = 'Are you sure that you want to delete Action(s).';
      me.confirmDialog.open();
    }
  }

  deleteRecordFromTable(data: ActionResponse) {
    console.log("going to delete the selected record", data);
    const me = this;
    let isDelete = false;
    data.configStatus.forEach(config => {
      me.data.data.forEach((rowData, index) => {
        if (config.status.code == 200 && config.id == rowData.id) {
          me.data.data.splice(index, 1);
          isDelete = true;
        }
      
      })
    })

    me.data.data = [...me.data.data];
    if(isDelete)
      me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert Action deleted successfully' });
    me.loading = false;
  }

  copyAction() {
    const me = this;
    console.log("selection data.....===", me.selectedActions);
    if (!me.selectedActions || me.selectedActions.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to copy Alert Action.' });
      return;
    }

    else if (me.selectedActions.length > 1) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select Only one record to copy Alert Action.' });
      return;
    }
    else {
      me.isShowInputText = true;
      me.confirmMessage = {
        header: 'Copy Action- ' + me.selectedActions[0].name,
        display: true,
        icon: 'pi pi-exclamation-triangle',
        body: 'Action Name: '
      };
    }
  }

  saveCopyAction() {
    const me = this;
    if (me.confirmMessage && me.confirmMessage.header == 'Export Window') {
      me.impExpService.request = me.makeRequestBody(me.data.data);
      me.impExpComponent.openImportExportDialog("Actions", "actions", ALERT_EXPORT, "action", IMPORT_EXPORT_FILEPATH);
      me.closeCopyAction();
      return;
    }
    let specialCharsForName = "|\\,";
    if (!me.newActionName) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name should not be empty. Please enter valid Action Name.' });
      return;
    }
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (me.newActionName.trim().match(format)) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name with only special character are not allowed. Please enter valid Action Name.' });
      return;
    }
    if (specialCharsForName.length != 0) {
      for (let i = 0; i < specialCharsForName.length; i++) {
        if (me.newActionName.indexOf(specialCharsForName[i]) > -1) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: 'This Charactars \\ , | and , are not allowed in rule name. Please enter a valid Action name.' });
          return;
        }
      }
    }
    if (me.newActionName.trim() === me.selectedActions[0].name.trim()) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name already exists. Please enter another Action Name.' });
      return;
    }
    
    let actionAlreadyExist = false;
    for(var element of me.data.data) {
    if(element.name.trim() === me.newActionName.trim()){
       me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action name already exists. Please enter another Action Name.' });
       actionAlreadyExist= true;
       break;
     }     
   }; 
     if(actionAlreadyExist)
     return;

    if (me.newActionName.length > 63) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Action Name should contain less then equal to 63 character. Please enter a valid Action Name.' });
      return;
    }

    let temp : Action = JSON.parse(JSON.stringify(me.selectedActions[0]));
    temp.id = -1;
    temp.name = me.newActionName;
    me.alertActionService.genericActionPayload([temp], CONS.ACTION_OPERATONS.ADD_ACTIONS).subscribe(
      (state: Store.State) => {
        if (state instanceof ActionResponseLoadingState) {
          me.onLoading();
          return;
        }
        if (state instanceof ActionResponseLoadedState) {
          me.onActionAdded(state.data);
          return;
        }
      },
      (state: ActionResponseLoadeErrorState) => {
        me.onLoadingError(state.data);
      }
    )
    me.closeCopyAction();
  }

  onActionAdded(res: ActionResponse) {
    const me = this;
    if(res.actions[0]){
      me.data.data.push(res.actions[0])
      me.data.data = [...me.data.data];
      me.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert action added successfully' });
    }
    else
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to add Alert action' })
  }

  closeCopyAction() {
    const me = this;
    me.confirmMessage = { display: false };
    me.newActionName = null;
    me.selectedActions = [];
  }

  updateActionTable(data: any) {
    const me = this;
    console.log("after adding action---->>>> ", data.actions[0])

    if (data.opType == CONS.ACTION_OPERATONS.ADD_ACTIONS)
      me.data.data.push(data.actions[0]);
    else {
      me.data.data.forEach((element, index) => {
        if (element.id == data.actions[0].id) {
          me.data.data[index] = data.actions[0];

        }
      });
    }

    me.data.data = [...me.data.data];
    me.selectedActions = [];
    console.log("final data is: ", me.data.data)
  }

  importExportAction(imEx: number){
    const me = this;

    me.impExpComponent.moduleType = me.impExpService.moduleType = IMPORT_EXPORT_MODULE_TYPE.ALERT_ACTION;
    if(imEx == 1){
      if(!me.selectedActions || me.selectedActions == undefined || me.selectedActions == null || me.selectedActions.length == 0){
          me.isShowInputText = false;
          me.confirmMessage = {
          header: 'Export Window',
          display: true,
          icon: 'pi pi-exclamation-triangle',
          body: 'No record selected. Do you want to export all available records'
        };
      }
      else{
      me.impExpService.request = me.makeRequestBody(me.selectedActions);
        me.impExpComponent.openImportExportDialog("Actions", "actions", ALERT_EXPORT,"alert",IMPORT_EXPORT_FILEPATH);
      }
      this.selectedActions = [];
    }
    else{
      me.impExpService.request = me.makeRequestBody();
      me.impExpComponent.openImportExportDialog("Actions", "actions", ALERT_IMPORT,"alert", IMPORT_EXPORT_FILEPATH);
      this.selectedActions = [];
  }

  }

  makeRequestBody(actions?: Action[]){
    const me = this;
    const session = me.sessionService.session;
    if(session){
      const cctx = {
        cck: session.cctx.cck,
        pk: session.cctx.pk,
        u: session.cctx.u,

    };
    const actionReq: ActionRequest ={
      cctx: cctx,
      opType: null,
      clientId:"-1",
      appId:"-1",
      actions: actions
    }
    return actionReq;
  }

}

addImportedData(result: any){
  const me = this;
  console.log("resultss -- ",result);
  result.configStatus.forEach(ele => {
    if(ele.status.code == 200){
      result.actions.forEach(action => {
        if(ele.id == action.id){
          me.data.data.push(action);
        }
     });
    }
  });
}

}
