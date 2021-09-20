import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, MessageService, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { Router } from '@angular/router';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { HierarchialDataLoadedState, HierarchialDataLoadingErrorState, HierarchialDataLoadingState } from '../../service/alert.state';
import { HirarchyIndicesData, IndicesLevelList, Maintenance, MaintenanceRequest, MaintenanceResponse, MaintenanceTable } from '../service/alert-maintenance.model';
import { AlertMaintenanceService } from '../service/alert-maintenance.service';
import { day, days, MAINTENANCE_DATA, month, PRESET, PRESETS, week, weekMonthDays } from '../service/alert-maintenance.dummy';
import { AlertMaintenanceComponent } from '../alert-maintenance.component';
import { MaintenanceAddLoadedState, MaintenanceAddLoadingErrorState, MaintenanceAddLoadingState, MaintenanceEditLoadedState, MaintenanceEditLoadingErrorState, MaintenanceEditLoadingState} from '../service/alert-maintenance.state';
import { ALERT_MAINTENANCE_TABLE } from '../service/alert-maintenance-table.dummy';
import * as moment from 'moment-timezone';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import { environment } from 'src/environments/environment';
import { AdvancedConfigurationComponent } from '../../alert-configuration/advanced-configuration/advanced-configuration.component';
import { ScheduleConfig } from '../../alert-rules/alert-configuration/service/alert-config.model';
import { SCHEDULE } from '../../alert-configuration/advanced-configuration/service/advanced-configuration.dummy';
import { TimeZoneValueInfo } from 'src/app/core/session/session.model';
import { AdvancedConfigurationService } from '../../alert-configuration/advanced-configuration/service/advanced-configuration.service';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ALERT_MODULES } from '../../alert-constants';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-configure-maintenance',
  templateUrl: './configure-maintenance.component.html',
  styleUrls: ['./configure-maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    }
  ]
})
export class ConfigureMaintenanceComponent extends PageDialogComponent implements OnInit {

  indicesLevel: IndicesLevelList[] = [];
  arrIndLavel: HirarchyIndicesData[] = [];
  preset: SelectItem[];
  presets = PRESETS;
  day: SelectItem[];
  days: SelectItem[];
  week: SelectItem[];
  month: SelectItem[];
  weekMonthDays: SelectItem[];
  error: AppError;
  scheduleConfig: ScheduleConfig;
  scheduleType: number;
  loading: boolean;
  data: MaintenanceResponse;
  selectedValue: string = 'val1';
  customEndTimeFrame : Moment[] = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  indicesTimeFrame: Moment[] = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val: string;
  @Input() dashboard: DashboardComponent;
  @Input() alertMaintenanceComponent: AlertMaintenanceComponent;
  @Output() stateData = new EventEmitter<{maintenance: any, isEdit?: boolean}>();

  @ViewChild('appConfirmationDialog', { read: ConfirmationDialogComponent })
  confirmDialog: ConfirmationDialogComponent;

  tagList = [];
  tags = [];
  duration ;
  status: any ;
  metadataName: any;
  maintenanceTable : MaintenanceTable;
  maintenanceConfig : MaintenanceRequest ;
  isEdit: boolean = false;
  _selectedTimeZone: TimeZoneValueInfo;
  @ViewChild('advancedConfig') advancedConfig: AdvancedConfigurationComponent;
  isOnlyReadable: boolean;
  
  constructor(private timebarService: TimebarService,
              private router: Router,
              private _alertMaintenanceService: AlertMaintenanceService,
              public sessionService: SessionService,
              private messageService: MessageService,
              private alertCapability: AlertCapabilityService,
              private advConfigService: AdvancedConfigurationService) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_MAINTENANCE);
    me._selectedTimeZone = me.sessionService.selectedTimeZone? me.sessionService.selectedTimeZone : me.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset");

    me.preset = PRESET; 
    me.day = day;
    me.days = days;
    me.week = week;
    me.weekMonthDays = weekMonthDays;
    me.month = month;
    me.maintenanceConfig = MAINTENANCE_DATA;
    me.presets = PRESETS;
    let glbMgId = '01000100';
    const payLoad = this.makePayloadForGettingHierarchy(this.tagList, 1, glbMgId);

    this.getIndicesList(payLoad);
  }
  public onMaintenanceAddLoading(state: MaintenanceAddLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  openAdvancedConfig(isOpen, scheduleConfig: ScheduleConfig){
    const me = this;
    if (isOpen){
      setTimeout(() => {
        if(scheduleConfig)
          me.advancedConfig.open(true, [scheduleConfig], 1);
        else
          me.advancedConfig.open(true, null, 1);
      }, 2000);
    }
    else
    {
      if(scheduleConfig)
        me.advancedConfig.open(true, [scheduleConfig], 1);
      else
        me.advancedConfig.open(true, null, 1);
    }
  }

  public onMaintenanceAddLoadingError(state: MaintenanceAddLoadingErrorState) {
    const me = this;
    me.maintenanceConfig = null;
    me.error = state.error;
    me.loading = false;
  }

  public onMaintenanceAddLoaded(state: MaintenanceAddLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.data = state.data;
    me.stateData.emit({maintenance: me.data, isEdit: false});
    me.router.navigate(['/alert-maintenance']);
    this.closeDialog();
  }

  private onMaintenanceEditLoading(state: MaintenanceEditLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;

  }

  private onMaintenanceEditLoadingError(state: MaintenanceEditLoadingErrorState) {
    const me = this;
    me.maintenanceConfig = null;
    me.error = state.error;
    me.loading = false;
  }

  private onMaintenanceEditLoaded(state: MaintenanceEditLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.isEdit = false;
    /* me.customTimeFrame[0] = moment(state.data.maintenances[0].attributes.scheduleConfig.st);
    me.customTimeFrame[1] = moment(state.data.maintenances[0].attributes.scheduleConfig.et); */
    me.data= state.data;
    me.stateData.emit({maintenance: me.data, isEdit: true});
    console.log("state",state.data);
    me.router.navigate(['/alert-maintenance']);
    this.closeDialog();
  }

  getIndicesList(payload) {
    const me = this;
    this._alertMaintenanceService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof HierarchialDataLoadingState) {
          me.onIndLoading(state);
          return;
        }

        if (state instanceof HierarchialDataLoadedState) {
          me.onIndLoaded(state);
          return;
        }
      },
      (state: HierarchialDataLoadingErrorState) => {
        me.onIndLoadingError(state);
      }
    );


  }
  onIndLoadingError(state: HierarchialDataLoadingErrorState) {
    throw new Error('Method not implemented.');
  }
  onIndLoaded(state: HierarchialDataLoadedState) {

    const me = this;
    console.log("state.data == ", state.data);
    me.status = state.data['status'];
    me.populateGroupData(state.data);
    /* me.indicesLevel = state.data;
    me.error = null;
    me.loading = false;
    this.populateGroupData(me.dataHierarchial); */

    //throw new Error('Method not implemented.');
  }
  onIndLoading(state: HierarchialDataLoadingState) {
    throw new Error('Method not implemented.');
  }

  populateGroupData(dataToPopulate) 
  {
    let me = this;
    let json = dataToPopulate['hierarchy'];
    if (json.length == 0) {
      return;
    }
    me.indicesLevel = [];
    let vList = [];
   
    for (let i = 0; i < json.length; i++) {
      this.metadataName = json[i]['metadata']
      let metadataPresent = false;
      let count = 0;

      for (let j = 0; j < json[i].vectorList.length; j++) {
        me.indicesLevel.push({metaData: json[i].metadata,label: json[i].vectorList[j], value: json[i].vectorList[j] });
      }      
      me.indicesLevel.sort((a,b) => a.value.localeCompare(b.value));
    }

    me.indicesLevel.unshift({metaData:'All', label: 'ALL', value: 'ALL' },
          {metaData:'pattern', label: 'Select Pattern', value: 'pattern' });

    if(me.indicesLevel.length != 0)
        if(this.isEdit){
          me.arrIndLavel.push({indicesLevelList: me.indicesLevel, label: me.tagList[0].value, metaLabel: me.tagList[0].key});
          me.tagList.shift();
        }
        else{
           me.arrIndLavel.push({indicesLevelList: me.indicesLevel, label: "", metaLabel: this.metadataName});
        }
  }

  makePayloadForGettingHierarchy(taggs, level, glbMgId) {
    const payLoad =
    {
      "opType": "9",
      "tr": this.sessionService.testRun.id,
      "cctx": this.sessionService.session.cctx,
      "duration": this.getDuration(),
      "clientId": "Default",
      "appId": "Default",
      "glbMgId": "01000300",
      "levels": level,
      "subject": {
        "tags": taggs
      }
    }
    return payLoad;
  }

  isCustomDisable(){
    const me = this;
   if(this.selectedValue == 'val1'){
      return true;
    }
  }
  isDisable(){
    if(this.selectedValue == 'val2'){
      this.maintenanceConfig.maintenances[0].attributes.scheduleConfig.type = PRESETS.CUSTOM_EVENT_DAY;
      return true;
    }
  }

  getDuration() {
    try {
      if(this.timebarService.getValue())
      {
      //const dashboardTime: DashboardTime = this.dashboard.getTime();
      const startTime: number = this.timebarService.getValue().time.frameStart.value;
      const endTime: number = this.timebarService.getValue().time.frameEnd.value;
      const graphTimeKey: string = this.timebarService.getValue().timePeriod.selected.id;
      const viewBy: string =  this.timebarService.getValue().viewBy.selected.id;

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy: viewBy
      }
      return duration;
    } 
    else{
      const obj = JSON.parse(sessionStorage.getItem('timePresets'));

      const duration = {
        st: obj.times[0],
        et: obj.times[obj.times.length - 1],
        preset: obj.selectedPreset,
        viewBy: obj.selectedViewBy
      }

      return duration;
    }
  }
    catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }

  applyChanges(){
    try{
      const me = this;

      me.maintenanceConfig.maintenances[0].attributes.subject.tags = [];
      me.maintenanceConfig.cctx = this.sessionService.session.cctx;
      if(this.isEdit){
        me.tagList = [];
        me.tagList = me.tags;
      }
    for(let i = 0 ; i < this.tagList.length ;i++){
      me.maintenanceConfig.maintenances[0].attributes.subject.tags.push({key: this.tagList[i].key, value: this.tagList[i].value , mode: this.tagList[i].mode});
      }
    if(this.selectedValue == "val2"){
      if(me.customTimeFrame == null || me.customTimeFrame.length == 0 || !me.customTimeFrame){
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Custom Time Frame Cannot Be Empty' });
        return;
      }
      else{
      me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.type = PRESETS.CUSTOM_EVENT_DAY;
      me.scheduleType =  PRESETS.CUSTOM_EVENT_DAY;
      me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.st = me.customTimeFrame[0].valueOf() / 1000;
      me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.et = me.customTimeFrame[1].valueOf() / 1000;
      me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.zone = me._selectedTimeZone.value;
      me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.offset = me._selectedTimeZone.diffTimeStamp / 1000;
      }
    }

    if(this.validationMaintenance(me.maintenanceConfig.maintenances[0])){
      if(this.isEdit){
        me._alertMaintenanceService.edit(me.maintenanceConfig.maintenances).subscribe(
          (state: Store.State) => {
           if(state instanceof MaintenanceEditLoadingState){
             me.onMaintenanceEditLoading(state);
             return;
           }
           if (state instanceof MaintenanceEditLoadedState) {
            me.onMaintenanceEditLoaded(state);
            me.maintenanceTable = ALERT_MAINTENANCE_TABLE
            return;
            }
          },
          (state: MaintenanceEditLoadingErrorState) => {
            me.onMaintenanceEditLoadingError(state);
          }
        );
      }

      else{
        me.confirmDialog.ifConfirmationNeeded = true;
        me.confirmDialog.body = 'Are you sure that you want to apply the maintenance schedule';
        me.confirmDialog.open();
      
    }    
  } 
  
  }
    catch(error){
      console.error("Error is coming", error);
    }
  }

  executeCommand(accept){
    const me = this;
    if(accept){
      me.loading = true;
      me._alertMaintenanceService.add(me.maintenanceConfig.maintenances).subscribe(
        (state: Store.State) => {
          if (state instanceof MaintenanceAddLoadingState) {
            me.onMaintenanceAddLoading(state);
            return;
          }
  
          if (state instanceof MaintenanceAddLoadedState) {
            me.onMaintenanceAddLoaded(state);
            me.maintenanceTable = ALERT_MAINTENANCE_TABLE;
            return;
          }
        },
        (state: MaintenanceAddLoadingErrorState) => {
          me.onMaintenanceAddLoadingError(state);
        }
      );
    }
  }

  getScheduleConfigDay(scheduleConfig: ScheduleConfig){
    const me = this;
    if(scheduleConfig.day > 10 && scheduleConfig.week == 0){
      return scheduleConfig.day - 10;
    }
    if(this.isEdit){
     if(scheduleConfig.day < 10 && scheduleConfig.week == 0 && me.scheduleType != PRESET[1].value){
      return scheduleConfig.day + 10;
    }
    else{
      return scheduleConfig.day;
    }
  }
    else{
      return scheduleConfig.day;
    }
  }
  /* getScheduleConfigType(scheduleType:number,scheduleConfig: ScheduleConfig){
    const me  = this;
    if(scheduleType == PRESET[0].value){
      if (me.validateStartEndTime(scheduleConfig))
        return PRESETS.NON_OF_ABOVE;
      return PRESETS.EVERY_DAY;
    }
    else if(scheduleType == PRESET[1].value){
      if (!scheduleConfig.day) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week day.' });
          return PRESETS.NON_OF_ABOVE;
      } else if (me.validateStartEndTime(scheduleConfig))
          return PRESETS.NON_OF_ABOVE;
      return PRESETS.WEEKDAY_OF_EVERY_WEEK;
    }
    else if(scheduleType == PRESET[2].value){
      if (!scheduleConfig.day) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select day.' });
        return PRESETS.NON_OF_ABOVE;
      } else if (me.validateStartEndTime(scheduleConfig))
          return PRESETS.NON_OF_ABOVE;

      if (scheduleConfig.day.label == 'Last')
        return PRESETS.LAST_DAY_OF_EVERY_MONTH;
      else if (scheduleConfig.day.label == 'Sunday' || scheduleConfig.day.label == 'Monday' || scheduleConfig.day.label == 'Tuesday' || scheduleConfig.day.label == 'Wednesday' || scheduleConfig.day.label == 'Thursday' || scheduleConfig.day.label == 'Friday' || scheduleConfig.day.label == 'Saturday'){
        if (!scheduleConfig.week) {
            me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week.' });
            return PRESETS.NON_OF_ABOVE;
        }
        return PRESETS.WEEKDAY_OF_MONTH;
      }
      else
        return PRESETS.DAY_OF_MONTH;
    }
    else if(scheduleType == PRESET[3].value){
      if (!scheduleConfig.day) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select day.' });
        return PRESETS.NON_OF_ABOVE;
      } else if (!scheduleConfig.month) {
        me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select month.' });
        return PRESETS.NON_OF_ABOVE;
      } else if (me.validateStartEndTime(scheduleConfig))
        return PRESETS.NON_OF_ABOVE;

      if (scheduleConfig.day.label == 'Sunday' || scheduleConfig.day.label == 'Monday' || scheduleConfig.day.label == 'Tuesday' || scheduleConfig.day.label == 'Wednesday' || scheduleConfig.day.label == 'Thursday' || scheduleConfig.day.label == 'Friday' || scheduleConfig.day.label == 'Saturday'){
        if (!scheduleConfig.week) {
          me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select week.' });
          return PRESETS.NON_OF_ABOVE;
        }
        return PRESETS.WEEKDAY_OF_YEAR;
      }
      else
        return PRESETS.DAY_OF_A_YEAR;
    }
  } */

  validateStartEndTime(scheduleConfig: ScheduleConfig) {
    const me = this;
    if (!scheduleConfig.st) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid start time.' });
      return true;
    } else if (!scheduleConfig.et) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid end time.' });
      return true;
    }
    else
      return false;
  }

  validationMaintenance(maintenance: Maintenance){
    const me = this;
    let specialCharsForName = "|\\,";
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    let mailformat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/ ;
    if(!maintenance.name || maintenance.name.trim().length < 1){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Schedule Name field cannot be blank.'});
      return false;
    }
    if(maintenance.name.length > 63){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Schedule Name length cannot be greater than 63.'});
      return false;
    }
    if(maintenance.name.trim().match(format)){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Schedule Name with only special characters are not allowed. Please enter a valid schedule name.'});
      return false;
    }

    if(this.selectedValue == "val1")
    {
      let type = me.advancedConfig.addUpdateScheduler(true);
      if (type == SCHEDULE.NON_OF_ABOVE)
        return false;
    }

    if (specialCharsForName.length != 0) {
      for (let i = 0; i < specialCharsForName.length; i++) {
        if (maintenance.name.trim().indexOf(specialCharsForName[i]) > -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'These Charactars \\ , | and , are not allowed in Scedule name. Please enter a valid schedule name.' });
          return;
        }
      }
    }
    if(!maintenance.attributes.description || maintenance.attributes.description.trim().length < 1){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Description field cannot be blank.'});
      return false;
    }
    if(maintenance.attributes.description.trim().length > 64){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Description length cannot be greater than 64.'});
      return false;
    }
  
    if(maintenance.attributes.mail && !(maintenance.attributes.mail.trim().match(mailformat))){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Email Format.'});
      return false;
    }

      if(maintenance.attributes.subject.tags.length < 1) 
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Indices cannot be blank '});
        return false;
      }
    /* if(me.scheduleType == -1 || me.scheduleType == undefined){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: ' Select any Preset or Custom type'});
      return false;
    }
    if(maintenance.attributes.scheduleConfig.type == PRESETS.NON_OF_ABOVE){
      return false;
    }  */

    return true;
  }

  showDialog() {
    super.show();
  }

  onCustomChg()
  {
    const me = this;
    if(!me.isEdit)
    {
      let diffTimeStamp = this.sessionService.selectedTimeZone?
      this.sessionService.selectedTimeZone.diffTimeStamp : 
      this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;
      me.customTimeFrame = [
        moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
      ];
    }
  }

  open() {
    const me = this;

    me.scheduleConfig = null;
    this.openAdvancedConfig(false, me.scheduleConfig);
    this.maintenanceConfig.maintenances[0].attributes.description = "";
    this.maintenanceConfig.maintenances[0].attributes.mail = "";
    this.maintenanceConfig.maintenances[0].name = "";
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.type = -1;
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.day = 0;
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.week = 0;
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.month = 0;
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.st = 0;
    me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.st = 0;
    me.maintenanceConfig.maintenances[0].attributes.subject.tags = [];
    me.selectedValue = "val1";

    me.customTimeFrame = [
      moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
      moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
    ];

    /* me.scheduleConfig.day = 0;
    me.scheduleConfig.week = 0;
    me.scheduleConfig.month = 0;
    me.scheduleConfig.st = 0;
    me.scheduleConfig.et = 0; */
    this.scheduleType = -1;
    this.customTimeFrame = [];
    me.tagList = [];
    me.arrIndLavel = [];
    me.isEdit = false;
    const payLoad = this.makePayloadForGettingHierarchy(me.tagList, 1, null);
    this.getIndicesList(payLoad);
    this.visible = true;
  }

  editMaintenance(row: Maintenance){
    const me = this;
    this.isEdit = true;
    me.maintenanceConfig.maintenances[0] = ObjectUtility.duplicate(row);
    //me.scheduleType = me.getPreset(row);
    me.scheduleConfig = row.attributes.scheduleConfig;
    //me.scheduleConfig.week = row.attributes.scheduleConfig.week;
    me.tagList = [];
    me.tags = [];
    me.arrIndLavel = [];
    for(let i = 0 ; i < row.attributes.subject.tags.length+1 ; i++){
      if(i != 0){
        me.tagList.push(row.attributes.subject.tags[i-1]);
        me.tags.push(row.attributes.subject.tags[i-1]);
      }
    const payLoad = this.makePayloadForGettingHierarchy(me.tagList, 1, null);
    this.getIndicesList(payLoad);
    }
    if(row.attributes.scheduleConfig.type != PRESETS.CUSTOM_EVENT_DAY){
      me.openAdvancedConfig(false, me.scheduleConfig);
      this.selectedValue = 'val1';

      me.customTimeFrame = [
        moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
        moment(new Date().getTime() + 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
      ];
  }
  else{
    this.selectedValue = 'val2';
    me.openAdvancedConfig(false, null);
    me._selectedTimeZone = me.advConfigService.getTimeZoneInfo(me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.zone, "value");
    me.customTimeFrame = [
      moment(me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.st * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
      moment(me.maintenanceConfig.maintenances[0].attributes.scheduleConfig.et * 1000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
    ];
  }
    this.visible = true;
  }
  getPreset(row: Maintenance){
    const me = this;
    if(row.attributes.scheduleConfig.type == PRESETS.EVERY_DAY){
      //me.scheduleConfig.st = moment(row.attributes.scheduleConfig.st).zone(this.sessionService.selectedTimeZone.offset);
      //me.scheduleConfig.et = moment(row.attributes.scheduleConfig.et).zone(this.sessionService.selectedTimeZone.offset);
      return PRESET[0].value;
    }
    if(row.attributes.scheduleConfig.type == PRESETS.WEEKDAY_OF_EVERY_WEEK){
      me.scheduleConfig.day = row.attributes.scheduleConfig.day;
      return PRESET[1].value;
    }
    if(row.attributes.scheduleConfig.type >= PRESETS.DAY_OF_MONTH && row.attributes.scheduleConfig.type <= PRESETS.LAST_DAY_OF_EVERY_MONTH){
      return PRESET[2].value;
    }
    if(row.attributes.scheduleConfig.type >= PRESETS.DAY_OF_A_YEAR && row.attributes.scheduleConfig.type <= PRESETS.WEEKDAY_OF_YEAR){
      return PRESET[3].value;
    }
    else{
      return;
    }
  }

  deepCopy(element: Object)
  {
  return JSON.parse(JSON.stringify(element));
  }

  closeDialog() {
    this.isEdit = false;
    this.visible = false;
  }

  onTimeFilterCustomTimeChange() {
    /* const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    }); */
  }

  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.timeFilterEnableApply = false;

    me.timebarService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');

        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          me.timeFilterEnableApply = true;
          output.next(me.tmpValue);
          output.complete();
        } else {
          me.tmpValue = null;
          me.timeFilterEnableApply = false;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);

    return value;
  }

  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    const input: TimebarValueInput = {
      timePeriod: me.tmpValue.timePeriod.selected.id,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: me.tmpValue.running,
      discontinued: me.tmpValue.discontinued,
      includeCurrent: me.tmpValue.includeCurrent,
    };

    if (clearViewBy) {
      input.viewBy = null;
    }

    me.setTmpValue(input);
  }

  onChangeIndices(index: number)
  {
    let me = this;
    console.log("index == ",index);
    me.duration = [];
    if(index < (me.arrIndLavel.length - 1))
    {
      me.arrIndLavel.splice(index+1, me.arrIndLavel.length - index);
    }
    console.log("this.arrIndLavel == ", this.arrIndLavel);
    if(me.arrIndLavel[index].label != "pattern"){
       me.arrIndLavel[index].metaLabel = me.getKey(me.arrIndLavel[index].label, me.arrIndLavel[index].indicesLevelList);
    }
    me.tagList = me.gettingListOfTaggs(me.arrIndLavel);
    let glbMgId = '01000100';
    me.duration = me.getDuration();
    const payLoad = this.makePayloadForGettingHierarchy(me.tagList, 1, glbMgId);

    this.getIndicesList(payLoad);
  }

  gettingListOfTaggs(hirarchyData: HirarchyIndicesData[]) 
  {
    let me = this;
    me.tagList = [];
    if(me.arrIndLavel.length == 0)
    {
      return me.tagList;
    }

    hirarchyData.forEach((element, i) => {
      let mode = 1;  
      if (element.label == "ALL") {
        mode = 2;
      }
      if(element.label == 'pattern'){
        mode = 4;
        me.tagList.push(
          {
            "key": element.metaLabel,
            "value": element.selectedValue,
            "mode": mode
          }
        )
      }
      else{
      me.tagList.push(
        {
          "key": element.metaLabel,
          "value": element.label,
          "mode": mode
        }
      )
      }
    });
    
    console.log("tag list" , this.tagList)
    return me.tagList;
  }
  getKey(value: any, vList: any){
    const me = this;
    console.log("value ====== ",value);
    console.log("indices === ",vList);
    for(let i = 0 ; i < vList.length; i++){
      if(vList[i].label == value){
        return vList[i].metaData;
      }
    }
   
  }

}
