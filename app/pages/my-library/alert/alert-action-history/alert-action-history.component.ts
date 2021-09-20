import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment-timezone';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Store } from 'src/app/core/store/store';
import { AlertDownloadService } from '../service/alert-download.service';
import * as moment from 'moment-timezone';
import { TimebarTimeConfig } from 'src/app/shared/time-bar/service/time-bar.model';
import { DELETE_ACTIONS_HISTORY, GET_ACTIONS_HISTORY ,ACTION_HISTORY_TABLE_DATA} from './service/alert-action-history.dummy';
import { ActionHistory, ActionHistoryRequest, AlertActionHistoryTable, FilteredActionHistoryWithTag } from './service/alert-action-history.model';
import {AlertActionHistoryService} from './service/alert-action-history.service';
import { AlertHistoryLoadingState,AlertHistoryLoadingErrorState,AlertHistoryLoadedState} from './service/alert-action-history.state';
import { ObjectUtility } from 'src/app/shared/utility/object';
import {FormatDateTimePipe} from 'src/app/shared/pipes/dateTime/dateTime.pipe';
import { Observable, Subject, Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash'
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import { environment } from 'src/environments/environment';
import * as CONS from './../alert-constants'
import { AlertFilterService } from '../alert-filter/services/alert-filter.service';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState, GlobalTimebarTimeLoadingState } from 'src/app/shared/time-bar/service/time-bar.state';
import { PAYLOAD_TYPE } from '../alert-rules/alert-configuration/service/alert-config.dummy';
import { OnDestroy } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AdvancedConfigurationService } from '../alert-configuration/advanced-configuration/service/advanced-configuration.service';
import { Table } from 'primeng';

@Component({
  selector: 'app-alert-action-history',
  templateUrl: './alert-action-history.component.html',
  styleUrls: ['./alert-action-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    },
  ],
})
export class AlertActionHistoryComponent extends PageDialogComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  data: AlertActionHistoryTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  globalFilterVla = "";
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options: any[];
  options1: MenuItem[];
  filterDataMap = {};  
  timeOption: MenuItem[];
  visible : boolean;
  selectedHistoryActionData: any[];
  //ScheduleConfig:ScheduleConfig;
  timeRange:any;
  disableTimefield:boolean=false;
  fromHour;//=moment().subtract(60,'minutes').format('YYYY/MM/DD HH:mm:ss');;
  toHour;//= moment().format('YYYY/MM/DD HH:mm:ss');;;
  //preset;
  temp:any;
  isShowGui: boolean = false;
  public expandedRows = {};
  dataUsedToFilter: ActionHistory[];
  timeFrameData :Subscription;
  dateTimePipe: FormatDateTimePipe;
  
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  customEndTimeFrame: Moment[] = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  presets: SelectItem[];
  selectedPreset: string = '';
  st: number;
  et: number;
  @ViewChild('appConfirmationDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;
  @ViewChild('events') table: Table;
  constructor(
    private router: Router, 
    private alertDownloadService: AlertDownloadService,
    private AlertActionHistoryService :AlertActionHistoryService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private timebarService: TimebarService,
    private cd: ChangeDetectorRef,
    private alertFilterService: AlertFilterService, 
    private advConfigService: AdvancedConfigurationService
  ) { super();
    this.dateTimePipe = new FormatDateTimePipe(sessionService, advConfigService);  }

  ngOnInit(): void {
    const me = this;
    me.data = ACTION_HISTORY_TABLE_DATA;
    me.afterloadedData();
    me.presets = CONS.ALERT_PRESETS;
    me.downloadOptions = [
      { label: 'WORD', command: (event) => { me.downloadReport('worddoc') } },
      { label: 'PDF', command: (event) => { me.downloadReport('pdf'); } },
      { label: 'EXCEL', command: (event) => { me.downloadReport('excel'); } }
    ];
    me.selectedPreset = me.alertFilterService.syncPreset(me.timebarService, me.presets);

    if(me.selectedPreset == 'custom')
    {
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.timebarService.tmpValue, 'timePeriod.selected.id', '')
      );
      
      me.customTimeFrame = [
        moment(customTime.frameStart.value).zone(
          me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        moment(customTime.frameEnd.value).zone(
          me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
      ];
    }
    else
    {
      let diffTimeStamp = this.sessionService.selectedTimeZone?
      this.sessionService.selectedTimeZone.diffTimeStamp : 
      this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;
      me.customTimeFrame = [
        moment(new Date().getTime() - 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")  
      ];
    }
   }

  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
        }
      }
    });
  }
   
  onApply(refresh: boolean) {
    const me = this;
    if (me.selectedPreset == 'custom'){
      if (me.customTimeFrame && me.customTimeFrame.length === 2 && me.customTimeFrame[0] && me.customTimeFrame[1]){
        me.st = me.customTimeFrame[0].utc().valueOf();
        me.et = me.customTimeFrame[1].utc().valueOf();
        me.loadHistoryTable(refresh);
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide Start Date Time and End Date Time'});
        return;
      }
    }
    else
    {
      this.alertFilterService.loadTime(this.selectedPreset).subscribe(
        (state: Store.State) => {
          if (state instanceof GlobalTimebarTimeLoadingState) {
            
            return;
          }

          if (state instanceof GlobalTimebarTimeLoadedState) {
              me.st = state.data[1];
              me.et = state.data[2];
              me.loadHistoryTable(refresh);
          }
        },
        (state: GlobalTimebarTimeLoadingErrorState) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
  }

  private loadHistoryTable(refresh: boolean)
  {
    const me = this;

    let path;
    if (refresh)
      path = environment.api.alert.actionHistory.load.endpoint;
    else
      path = environment.api.alert.actionHistory.filter.endpoint;
    const payload: ActionHistoryRequest = {
      cctx: me.sessionService.session.cctx,
      opType: GET_ACTIONS_HISTORY,
      clientId: "dafault",
      appId: "dafault",
      st: me.st,
      et: me.et
    }
    me.AlertActionHistoryService.genericLoad(refresh, AlertHistoryLoadingState, AlertHistoryLoadedState, AlertHistoryLoadingErrorState, path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AlertHistoryLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof AlertHistoryLoadedState) {
          me.onLoaded(refresh, state);
          
          return;
        }
      },
      (state: AlertHistoryLoadingErrorState) => {
        me.onLoadingError(refresh, state);
      });
  }

  private onLoading(state: AlertHistoryLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.emptyTable = false;
  }

  private onLoadingError(refresh: boolean, state: AlertHistoryLoadingErrorState) {
    const me = this;
    me.data = null;
    me.emptyTable = false;
    me.error = state.error;
    me.loading = false;

    if (refresh)
      me.afterloadedData();

    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Alert Manager is refused to connect' });
  }

  private onLoaded(refresh: boolean, state: AlertHistoryLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    if (!state.data.data)
      state.data.data = [];
    if (refresh)
      me.data = state.data;
    else
      me.data.data = state.data.data;
    if (me.data.data.length == 0)
      me.emptyTable = true;
    if (refresh)
      me.afterloadedData(); 

    me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
    console.log(me.dataUsedToFilter); 

    me.totalRecords = me.data.data.length;
    if(me.data.status.code == 48)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: me.data.status.detailedMsg });
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: me.data.status.detailedMsg });
  }
  afterloadedData() {
    const me = this;
    me.cols = [];
    me._selectedColumns = [];
    me.globalFilterFields = [];
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  onPresetChange() {
    const me = this;
    if (me.selectedPreset != 'custom') {
      me.alertFilterService.loadTime(me.selectedPreset).subscribe(
        (state: Store.State) => {
          if (state instanceof GlobalTimebarTimeLoadingState)
            return;
          if (state instanceof GlobalTimebarTimeLoadedState) {
            me.st = state.data[1];
            me.et = state.data[2];
          }
        },
        (state: GlobalTimebarTimeLoadingErrorState) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
  }

  downloadReport(type: string) {
    const me = this;
    if (!me.selectedHistoryActionData || me.selectedHistoryActionData.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to download Alert Action.' });
      return;
    }

    me.alertDownloadService.filterDataMap = me.filterDataMap;
    me.alertDownloadService.globalFilterVla = me.globalFilterVla;
    me.alertDownloadService.downloadReport(type, me.selectedHistoryActionData, me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_ACTION_HISTORY,[]);
    me.selectedHistoryActionData = [];
  }

  deleteHistoryAction() {
    const me = this;
    if (!me.selectedHistoryActionData || me.selectedHistoryActionData.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one row.' });
      return;
    }
    else {
      me.confirmDialog.ifConfirmationNeeded = true;
      me.confirmDialog.body = 'Are you sure that you want to delete Action History(s).';
      me.confirmDialog.open();
    }
  }
  executeCommand(accept) {
    const me = this;
    if (accept) {
      const path = environment.api.alert.actionHistory.delete.endpoint;
      const payload: any = {
        cctx: me.sessionService.session.cctx,
        opType: DELETE_ACTIONS_HISTORY,
        clientId: "dafault",
        appId: "dafault",
        actionsHistory: me.selectedHistoryActionData,
      }
      me.AlertActionHistoryService.genericLoad(true, AlertHistoryLoadingState, AlertHistoryLoadedState, AlertHistoryLoadingErrorState, path, payload).subscribe(
        (state: Store.State) => {
          if (state instanceof AlertHistoryLoadingState) {
            me.onLoading(state);
            return;
          }
          if (state instanceof AlertHistoryLoadedState) {
            me.onLoadedDelete(state, me.selectedHistoryActionData);
            return;
          }
        },
        (state: AlertHistoryLoadingErrorState) => {
          me.onLoadingError(false, state);
        });
    }
    else {

    }
  }
  onLoadedDelete(state: AlertHistoryLoadedState, selectedHistoryActionData: any[]) {
    const me = this;
    me.error = null;
    me.loading = false;
    if (state.data.status.code == 49) {
      selectedHistoryActionData.forEach(selectedHistory => {
        for (let index = 0; index < me.data.data.length; index++) {
          const element = me.data.data[index];
          if (element.id == selectedHistory.id) {
            me.data.data.splice(index, 1);
            break;
          }
        }
      });
      me.selectedHistoryActionData = [];
      me.data.data = [...me.data.data];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: state.data.status.detailedMsg });
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: state.data.status.detailedMsg });
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

 
  show(){
    const me = this;
    me.data = ACTION_HISTORY_TABLE_DATA;
    me.afterloadedData();
    me.onApply(true);
    me.visible = true;
  }
 
  closeDialog(){
    const me = this;
    me.visible = false;
    me.data = null;
    me._selectedColumns = [];
    me.globalFilterFields = [];
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
  filter(value: any, field: any, matchMode: any)
  {
      const me = this;
      let dataUsedToFilter: ActionHistory[] = ObjectUtility.duplicate(me.dataUsedToFilter);
      
      if(field != "-1")
        me.filterDataMap[field] = {value: value};
      
      me._selectedColumns.forEach((col)=>{
      
      if(me.filterDataMap[col.label] != null)
      {
          me.data.data = dataUsedToFilter.filter((event) => {
          
          if(me.filterWithParameter(col, event, me.filterDataMap[col.label].value))
              return true;
          
      });
      
      dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
      }
      
      });
      
      if(field == "-1" || me.globalFilterVla)
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
      me.table._first = 0;
  }
  
  
  filterWithParameter(col: TableHeaderColumn, event: any, value: any){
      const me = this;
      
      if(col.valueField == 'selected')
         return false;
      
      else if(col.label == 'Action Time')
      {
          if(me.dateTimePipe.transform(event[col.valueField], 'default').toLowerCase().includes(value.toLowerCase()))
          return true;
      }
      else if(col.valueField === 'severity'){
          let temp = event[col.valueField] == '1' ? 'Minor' : (event[col.valueField] == '2') ? 'Major' : (event[col.valueField] == '3') ? 'Critical': 'Normal';
          if(temp.toLowerCase().includes(value.toLowerCase()))
            return true ;
      }
      else
      {
          if((event[col.valueField]? event[col.valueField] : "").toLowerCase().includes(value.toLowerCase()))
            return true;
      }
  }


  onChangeToggleColumn(event: any){
    const me = this;
    let isToggle: boolean = true;
    for (let index = 0; index < event.value.length; index++) {
      const element = event.value[index];
      if (element.label == event.itemValue.label){
          isToggle = false;
      }
    }
    if(isToggle){
    if (me.isEnabledColumnFilter) {
        for (let prop in me.filterDataMap) {
          if (event.itemValue.label == prop) {
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
 
}
