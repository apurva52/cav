import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState } from './service/alert-rules.state';
import { AlertRule, AlertRuleTable, ConfirmMsg } from './service/alert-rules.model';
import { AlertRulesService } from './service/alert-rules.service';
import { SessionService } from 'src/app/core/session/session.service';
import { ALERT_RULE_DATA } from './service/alert-rules.dummy';
import { environment } from 'src/environments/environment';
import { RulePayload } from './alert-configuration/service/alert-config.model';
import { PAYLOAD_TYPE } from './alert-configuration/service/alert-config.dummy';
import { OverlayPanel, Table } from 'primeng';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AlertActionService } from '../alert-actions/service/alert-actions.service';
import { AlertDownloadService } from './../service/alert-download.service';
import { GenericImportExportService } from 'src/app/shared/generic-import-export/services/generic-import-export.service';
import { GenericImportExportComponent } from 'src/app/shared/generic-import-export/generic-import-export.component';
import { ALERT_EXPORT, ALERT_IMPORT, ALERT_MODULES, IMPORT_EXPORT_FILEPATH, IMPORT_EXPORT_MODULE_TYPE } from '../alert-constants';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-alert-rules',
  templateUrl: './alert-rules.component.html',
  styleUrls: ['./alert-rules.component.scss'],
  providers: [ MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AlertRulesComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  //breadcrumb: MenuItem[];
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  filterTitle: string = 'Enable Filters';
  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  alertSetting: MenuItem[];
  selectedRulesData: any[];
  isDisableRule: boolean = true;
  isEnableRule: boolean = false;
  isShowInputText: boolean;
  editRuleName: string;
  confirmMessage: ConfirmMsg;
  condiInfoList: any;
  @ViewChild('appConfirmationDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;
  @ViewChild('impExpComponent', { read: GenericImportExportComponent })
  impExpComponent: GenericImportExportComponent;
  opType: number;
  enableDisableRow: any; 
  @ViewChild('events') table: Table;
  globalFilterVal: any;
  isOnlyReadable: boolean;
  constructor(
    private router: Router, 
    public alertRulesService: AlertRulesService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private impExpService: GenericImportExportService,
    private actionServices: AlertActionService,
    private alertDownloadService: AlertDownloadService,
    private confirmationService: ConfirmationService,
    private alertCapability: AlertCapabilityService,
    public breadcrumb: BreadcrumbService) { }

  showConditionInfoList(event: any, row: any, coditionInfoOverlay: OverlayPanel){
      const me = this;
      me.condiInfoList = row.condiInfo;
      me.condiInfoList = [...me.condiInfoList];
      coditionInfoOverlay.toggle(event);
    }
  

  ngOnInit(): void {
    const me = this;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_RULE);

    //me.alertRulesService.data = ALERT_RULE_DATA;
    //me.totalRecords = me.alertRulesService.data.data.length;
    /* me.breadcrumb = [
      { label: 'Home', routerLink: ['/home']},
      { label: 'my-library', routerLink: ['/my-library'] },
      { label: 'Alert', routerLink: ['/my-library/alert'] },
      { label: 'Alert Rules', routerLink: ['/alert-rules']}
    ]; */

    me.breadcrumb.addNewBreadcrumb({ label: 'Alert Rules', routerLink: ['/alert-rules']});

    me.downloadOptions = [
      { label: 'WORD', command: (event) => { me.downloadReport('worddoc') } },
      { label: 'PDF', command: (event) => { me.downloadReport('pdf'); } },
      { label: 'EXCEL', command: (event) => { me.downloadReport('excel'); } }
    ]

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
        label: 'Alert Actions',
        routerLink: ['/alert-actions'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_ACTION)
      }
    ]
    me.alertRulesService.isHideProgress = true;
    me.refreshAlertRule(true);
  }
  refreshAlertRule(isLoadCall: boolean) {
    const me = this;
    let path;
    if (isLoadCall)
      path = environment.api.alert.rule.load.endpoint;
    else
      path = environment.api.alert.rule.all.endpoint;
    const payload: RulePayload = {
      cctx: me.sessionService.session.cctx,
      opType: PAYLOAD_TYPE.GET_RULES,
      clientId: "-1",
      appId: "-1"
    }
    if(!isLoadCall)
      me.alertRulesService.showProgressBar("Getting data from server, Please wait...");
    me.alertRulesService.genericLoad(isLoadCall, PAYLOAD_TYPE.GET_RULES, AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, path, payload).subscribe(
    (state: Store.State) => {
      if (state instanceof AlertRuleDataLoadingState) {
        me.onLoading(state);
        return;
      }
      if (state instanceof AlertRuleDataLoadedState) {
        me.onLoaded(isLoadCall, state);
        return;
      }
    },
    (state: AlertRuleDataLoadingErrorState) => {
      me.onLoadingError(isLoadCall, state);
    });
      
  }

  private onLoading(state: AlertRuleDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.emptyTable = false;
  }

  private onLoadingError(isLoadCall: boolean, state: AlertRuleDataLoadingErrorState) {
    const me = this; 
    const input: AlertRuleTable = {
      data: [],
      headers: ALERT_RULE_DATA.headers,
      paginator: ALERT_RULE_DATA.paginator,
      iconsField: 'icon',
      iconsFieldEvent: 'iconStruggling',
      tableFilter: true,
    };
    me.alertRulesService.data = input;
    me.error = state.error;
    me.loading = false;
    if (isLoadCall)
      me.afterloadedData();
    else{
      me.alertRulesService.progressValue = 100;
      me.alertRulesService.isHideProgress = true;
    }
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Alert Manager is refused to connect' });
  }

  private onLoaded(isLoadCall: boolean, state: AlertRuleDataLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.selectedRulesData = [];
    if(!state.data.data)
      state.data.data = [];

    if (isLoadCall){
      me.alertRulesService.data = state.data;
      me.afterloadedData();
    }
    else{
      me.alertRulesService.progressValue = 100;
      me.alertRulesService.isHideProgress = true;
      me.alertRulesService.data.data = state.data.data;
      me.alertRulesService.data.status = state.data.status;
      delete history.state.viewData;
    }
    if (me.alertRulesService.data.data.length == 0)
      me.emptyTable = true;
    else
      me.emptyTable = false;
    me.totalRecords = me.alertRulesService.data.data.length;

  if(history.state.viewData){
    if(history.state.viewData.callFrom){
      if(history.state.data.status.code == 0)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rule Updated Successfully and saved in Database' });
      else
        this.messageService.add({ severity: 'error', summary: 'Error', detail: history.state.data.status.msg });
    }
    else{
      if (history.state.data.status.code == 0)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: history.state.data.status.detailedMsg });
      else
        this.messageService.add({ severity: 'error', summary: 'Error', detail: history.state.data.status.msg });
    }
  }
    else{
      if (me.alertRulesService.data.status.code == 0)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: me.alertRulesService.data.status.detailedMsg });
      else
        this.messageService.add({ severity: 'error', summary: 'Error', detail: me.alertRulesService.data.status.msg });
      }
  }
  afterloadedData() {
    const me = this;
    me.cols = me.alertRulesService.data.headers[0].cols;
    for (const c of me.alertRulesService.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  enableDisableRule(row, event){
    const me = this;
    me.enableDisableRow = row;
    if (!me.enableDisableRow?(!me.selectedRulesData || me.selectedRulesData.length == 0):false){
     if(event)
          me.opType = PAYLOAD_TYPE.ENABLE_RULE;
        else
          me.opType = PAYLOAD_TYPE.DISABLE_RULE;
      me.confirmDialog.ifConfirmationNeeded = false;
      me.confirmDialog.body = "Please Select at least one record.";
      me.confirmDialog.open();
      return;
    }
    else{
        if(event)
          me.opType = PAYLOAD_TYPE.ENABLE_RULE;
        else
          me.opType = PAYLOAD_TYPE.DISABLE_RULE;        
        me.confirmDialog.ifConfirmationNeeded = true;
        me.confirmDialog.body = "Are you sure that you want to " + (me.opType == PAYLOAD_TYPE.ENABLE_RULE?'enable':'disable') +  " Rule(s).";
        me.confirmDialog.open();
    }
  }

  onLoadedEnableDisable(state: AlertRuleDataLoadedState, opType: any, tmpSelectedRuleList: any[]) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.alertRulesService.progressValue = 100;
    me.alertRulesService.isHideProgress = true;
    if (state.data.status.code == 0) {
      tmpSelectedRuleList.forEach(selectedRule => {
        for (let index = 0; index < me.alertRulesService.data.data.length; index++) {
          const element = me.alertRulesService.data.data[index];
          if (element.ruleId == selectedRule.id) {
            if(opType == PAYLOAD_TYPE.ENABLE_RULE){
              element.enable = true;
              element.rule.attributes.enable = true;
            }
            else{
              element.enable = false;
              element.rule.attributes.enable = false;
            }
          }          
        }
      });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.detailedMsg });
    }
    else
    {
      tmpSelectedRuleList.forEach(selectedRule => {
        for (let index = 0; index < me.alertRulesService.data.data.length; index++) {
          const element = me.alertRulesService.data.data[index];
          if (element.ruleId == selectedRule.id) {
            if(opType == PAYLOAD_TYPE.ENABLE_RULE)
              element.enable = true;
            else
              element.enable = false;
          }          
        }
      });

      this.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.detailedMsg });
    }
  }

  copyRule(){
    const me = this;
    if (!me.selectedRulesData || me.selectedRulesData.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to copy Alert Rule.' });
      return;
    }
    else if (me.selectedRulesData.length > 1){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select Only one record to copy Alert Rule.' });
      return;
    }
    else{
      me.isShowInputText = true;
      me.confirmMessage= {
        header: 'Copy Rule - ' + me.selectedRulesData[0].rule.name,
        display: true,
        icon: 'pi pi-exclamation-triangle',
        body: 'Rule Name: '
      };
    }
  }

  saveCopyRule(){
    const me = this;
    if (me.confirmMessage && me.confirmMessage.header == 'Export Window' ){
      me.impExpService.request = me.makeRequestBody(me.alertRulesService.data.data);
      me.alertRulesService.showProgressBar("Going to export all available records, Please wait...");
      me.impExpComponent.openImportExportDialog("Rules", "rules", ALERT_EXPORT, "alert", IMPORT_EXPORT_FILEPATH);
      me.closeCopyRule();
      return;
    }
    if (me.confirmMessage && me.confirmMessage.header == 'Download Window'){
      me.selectedRulesData.splice(0, me.table.first);
      me.selectedRulesData.splice(me.table.rows, me.table.totalRecords);
      const paraList: string[] = [];
      let colFilter = null;
      for (let prop in me.table.filters) {
        if (paraList.length == 0)
          paraList.push("Filters Applied");
        if (prop == 'global') {
          paraList.push("Global Filter: " + me.table.filters[prop]['value']);
        } else {
          for (const header of me._selectedColumns) {
            if (header.valueField == prop) {
              if (colFilter)
                colFilter += ", " + header.label + " : " + me.table.filters[prop]['value'];
              else
                colFilter = header.label + " : " + me.table.filters[prop]['value'];
            }
          }
        }
      }
      if (colFilter)
        paraList.push("Column Filter: " + colFilter);
      me.alertDownloadService.downloadReport(me.confirmMessage.type, me.selectedRulesData, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_RULE, paraList);
      me.confirmMessage = { display: false };
      me.editRuleName = null;
      me.selectedRulesData = [];
      return;
    }
    let specialCharsForName = "|\\,";
    if (!me.editRuleName) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name should not be empty. Please enter valid Rule Name.' });
      return;
    }
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (me.editRuleName.trim().match(format)) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name with only special character are not allowed. Please enter valid Rule Name.' });
      return;
    }

    if (specialCharsForName.length != 0) {
      for (let i = 0; i < specialCharsForName.length; i++) {
        if (me.editRuleName.indexOf(specialCharsForName[i]) > -1) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: 'This Charactars \\ , | and , are not allowed in rule name. Please enter a valid Rule name.' });
          return;
        }
      }
    }

    if (me.editRuleName.trim() === me.selectedRulesData[0].rule.name.trim()) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name already exists. Please enter another Rule Name.' });
      return;
    }

    let ruleAlreadyExist = false;
    for(var element of me.alertRulesService.data.data) {
    if(element.rule.name.trim() === me.editRuleName.trim()){
       me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule name already exists. Please enter another Rule Name.' });
       ruleAlreadyExist= true;
       break;
     }     
   }; 
     if(ruleAlreadyExist)
     return;

    if (me.editRuleName.length > 63) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rule Name should contain less than equal to 63 character. Please enter a valid Rule Name.' });
      return;
    }

    let copyTheRuleDetail = ObjectUtility.duplicate(me.selectedRulesData[0]);
    copyTheRuleDetail.rule.name = me.editRuleName;
    copyTheRuleDetail.rule.id = -1;
    const path = environment.api.alert.rule.add.endpoint;
    const payload: RulePayload = {
      cctx: me.sessionService.session.cctx,
      opType: PAYLOAD_TYPE.ADD_RULE,
      clientId: "-1",
      appId: "-1",
      rules: [copyTheRuleDetail.rule]
    }
    me.alertRulesService.showProgressBar("Going to apply New Rule. Please wait...");
    me.alertRulesService.genericLoad(false, PAYLOAD_TYPE.ADD_RULE, AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AlertRuleDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof AlertRuleDataLoadedState) {
          me.onLoadedCopyRule(state);
          return;
        }
      },
      (state: AlertRuleDataLoadingErrorState) => {
        me.onLoadingError(false, state);
      }
    );
  }
  onLoadedCopyRule(state: AlertRuleDataLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.alertRulesService.progressValue = 100;
    me.alertRulesService.isHideProgress = true;
    if (state.data.status.code == 0) {
      me.parseAlertRuleData(state.data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.detailedMsg });
      me.totalRecords = me.alertRulesService.data.data.length;
      me.closeCopyRule();
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.detailedMsg });
  }

  closeCopyRule() {
    const me = this;
    if (me.confirmMessage && me.confirmMessage.header == 'Download Window') {
      const paraList: string[] = [];
      let colFilter = null;
      for (let prop in me.table.filters) {
        if (paraList.length == 0)
          paraList.push("Filters Applied");
        if (prop == 'global') {
          paraList.push("Global Filter: " + me.table.filters[prop]['value']);
        } else {
          for (const header of me._selectedColumns) {
            if (header.valueField == prop) {
              if (colFilter)
                colFilter += ", " + header.label + " : " + me.table.filters[prop]['value'];
              else
                colFilter = header.label + " : " + me.table.filters[prop]['value'];
            }
          }
        }
      }
      if (colFilter)
        paraList.push("Column Filter: " + colFilter);
      me.alertDownloadService.downloadReport(me.confirmMessage.type, me.selectedRulesData, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_RULE, paraList);
      me.selectedRulesData = [];
    }
    me.confirmMessage = { display: false };
    me.editRuleName = null;
    me.selectedRulesData = [];
  }

  parseAlertRuleData(resdata: AlertRule): any {
    const me = this;
    resdata.rules.forEach(rule => {
      me.alertRulesService.updateRuleTableDataList(me.alertRulesService.data.data, rule);
    });
  }

  editAlertConfig(row: any)
  {
    const me = this;
    me.router.navigate(['/alert-configuration'], { state: { data: row.rule } });
    me.messageService.add({ severity: 'success', summary: 'Success', detail: me.alertRulesService.data.status.detailedMsg });
  }

  openAlertConfig(){
    const me = this;
    me.router.navigate(['/alert-configuration']);
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

  executeCommand(accept: any)
  {
    const me = this;
    if(accept)
    {
      let tmpSelectedRuleList: any[] = [];

      if(!me.enableDisableRow)
      {
        me.selectedRulesData.forEach(selectedRow => {
          me.alertRulesService.data.data.forEach((data, idx) => {
            if (data.ruleId == selectedRow.ruleId) {
              tmpSelectedRuleList.push(selectedRow.rule);
            }
          });
        });
      }
      else
      {
        tmpSelectedRuleList.push(me.enableDisableRow.rule);
      }

          var path;
          var payload: RulePayload = {
            cctx: me.sessionService.session.cctx,
            //opType: PAYLOAD_TYPE.DELETE_RULE,
            clientId: "-1",
            appId: "-1",
            rules: tmpSelectedRuleList 
          }

          if (me.opType == PAYLOAD_TYPE.ENABLE_RULE){
            me.alertRulesService.showProgressBar("Enabling rule, Please wait...");
            path = environment.api.alert.rule.enable.endpoint;
            payload.opType = PAYLOAD_TYPE.ENABLE_RULE;
          }

          if(me.opType == PAYLOAD_TYPE.DISABLE_RULE){
            me.alertRulesService.showProgressBar("Disabling rule, Please wait...");
            path = environment.api.alert.rule.disable.endpoint;
            payload.opType = PAYLOAD_TYPE.DISABLE_RULE;
          }

          if(me.opType == PAYLOAD_TYPE.DELETE_RULE){
            me.alertRulesService.showProgressBar("Going to delete rule data, Please wait...");
            path = environment.api.alert.rule.delete.endpoint;
            payload.opType = PAYLOAD_TYPE.DELETE_RULE;
          }

          me.alertRulesService.genericLoad(false, me.opType, AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, path, payload).subscribe(
            (state: Store.State) => {
              if (state instanceof AlertRuleDataLoadingState) {
                me.onLoading(state);
                return;
              }

              if (state instanceof AlertRuleDataLoadedState) {
                if(me.opType == PAYLOAD_TYPE.DELETE_RULE)
                  me.onLoadedDelete(state, tmpSelectedRuleList);
                else
                  me.onLoadedEnableDisable(state, me.opType, tmpSelectedRuleList);
                return;
              }
            },
            (state: AlertRuleDataLoadingErrorState) => {
              me.onLoadingError(false, state);
            }
          );
          me.selectedRulesData = [];
    }
    else
    {
      me.selectedRulesData = [];

      if (me.enableDisableRow)
        me.enableDisableRow.enable = !me.enableDisableRow.enable;
    }

    if(!me.enableDisableRow && me.opType == PAYLOAD_TYPE.ENABLE_RULE)
      me.isEnableRule = !me.isEnableRule;
    else if(!me.enableDisableRow && me.opType == PAYLOAD_TYPE.DISABLE_RULE)
      me.isDisableRule = !me.isDisableRule;
  }
  downloadReport(type: string) {
    const me = this;
    if (!me.selectedRulesData || me.selectedRulesData.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to download Alert Rule(s)' });
      return;
    }
    if (me.selectedRulesData.length > me.table.rows){
      me.isShowInputText = false;
      me.confirmMessage = {
        header: 'Download Window',
        display: true,
        icon: 'pi pi-exclamation-triangle',
        body: 'Do you want to download current page records only.',
        type: type
      };
    }
    else{
      const paraList: string[] = [];
      let colFilter = null;
      for (let prop in me.table.filters) {
        if (paraList.length == 0)
          paraList.push("Filters Applied");
        if (prop == 'global'){
          paraList.push("Global Filter: " + me.table.filters[prop]['value']);
        }else{
          for (const header of me._selectedColumns){
            if (header.valueField == prop){
              if (colFilter)
                colFilter += ", " + header.label + " : " + me.table.filters[prop]['value'];
              else 
                colFilter = header.label + " : " + me.table.filters[prop]['value'];
            }
          }
        }
      }
      if (colFilter)
        paraList.push("Column Filter: " + colFilter);
      me.alertDownloadService.downloadReport(type, me.selectedRulesData, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_RULE, paraList);
      me.selectedRulesData = [];
    }
  }
  deleteRules(){
    const me = this;
    if (!me.selectedRulesData || me.selectedRulesData.length == 0){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record.' });
      return;
    }
    else{
      me.opType = PAYLOAD_TYPE.DELETE_RULE;
      me.confirmDialog.ifConfirmationNeeded = true;
      me.confirmDialog.body = 'Are you sure that you want to delete Rule(s).';
      me.confirmDialog.open();
    }
  }
  onLoadedDelete(state: AlertRuleDataLoadedState, tmpSelectedRuleList: any[]) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.alertRulesService.progressValue = 100;
    me.alertRulesService.isHideProgress = true;
    if (state.data.status.code == 0)
    {
      tmpSelectedRuleList.forEach(selectedRule => {
        for (let index = 0; index < me.alertRulesService.data.data.length; index++) {
          const element = me.alertRulesService.data.data[index];
          if (element.ruleId == selectedRule.id) {
            me.alertRulesService.data.data.splice(index, 1);
            break;
          }          
        }
      });
      me.selectedRulesData = [];
      me.alertRulesService.data.data = [...me.alertRulesService.data.data];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.detailedMsg });
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.detailedMsg });
  }


  importExportRules(imEx: number){
    const me = this;
    me.impExpComponent.moduleType = me.impExpService.moduleType = IMPORT_EXPORT_MODULE_TYPE.ALERT_RULES;
    if(imEx == ALERT_EXPORT){
      if(!me.selectedRulesData || me.selectedRulesData == undefined || me.selectedRulesData == null || me.selectedRulesData.length == 0){
        //me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select one or more rules to export.' });
        me.isShowInputText = false;
        me.confirmMessage = {
          header: 'Export Window',
          display: true,
          icon: 'pi pi-exclamation-triangle',
          body: 'No record selected. Do you want to export all available records'
        };
      }
      else{
        me.impExpService.request = me.makeRequestBody(me.selectedRulesData);
        me.alertRulesService.showProgressBar("Going to export selected records, Please wait...");
        me.impExpComponent.openImportExportDialog("Rules", "rules", ALERT_EXPORT,"alert",IMPORT_EXPORT_FILEPATH);
      }
      me.selectedRulesData = [];
    }
    else{
      me.impExpService.request = me.makeRequestBody([]);
      me.impExpComponent.openImportExportDialog("Rules", "rules", ALERT_IMPORT,"alert", IMPORT_EXPORT_FILEPATH);
      me.selectedRulesData = [];
  }
  
  }
  makeRequestBody(selectedRulesData?: any[]){
    const me = this;
    let tmpSelectedRuleList: any[] = [];

    selectedRulesData.forEach(selectedRow => {
      tmpSelectedRuleList.push(selectedRow.rule);
    });
      
   
    const session = me.sessionService.session;
    if(session){
      const cctx = {
        cck: session.cctx.cck,
        pk: session.cctx.pk,
        u: session.cctx.u,
      };
      const alertReq: RulePayload ={
        cctx: cctx,
        opType: null,
        clientId:"-1",
        appId:"-1",
        rules: tmpSelectedRuleList
      }
      return alertReq;
    }
  }
  addImportedData(result: any) {
    const me = this;
    if (result.rules){
      result.rules.forEach(rule => {
        me.alertRulesService.updateRuleTableDataList(me.alertRulesService.data.data, rule);
      });      
    }
  }
}
