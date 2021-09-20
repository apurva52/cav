import { HierarchyInfo } from './../service/alert.model';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment-timezone';
import { MultiSelect, SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarTimeConfig, TimebarValue } from 'src/app/shared/time-bar/service/time-bar.model';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import { environment } from 'src/environments/environment';
import * as CONS from './../alert-constants'
import {AlertDownloadService} from '../service/alert-download.service';
import * as moment from 'moment-timezone';
import { AlertFilterService } from './services/alert-filter.service';
import { EventHistoryRequest, EventQuery, SeverityFilter } from './services/alert-filter.model';
import { Store } from 'src/app/core/store/store';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState, GlobalTimebarTimeLoadingState } from 'src/app/shared/time-bar/service/time-bar.state';
import { AlertFilterLoadedStatus, AlertFilterLoadingErrorStatus, AlertFilterLoadingStatus } from './services/alert-filter.state';
import { RulePayload } from '../alert-rules/alert-configuration/service/alert-config.model';
import { PAYLOAD_TYPE } from '../alert-rules/alert-configuration/service/alert-config.dummy';
import { SessionService } from 'src/app/core/session/session.service';
import { AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, AlertRuleDataLoadingState } from '../alert-rules/service/alert-rules.state';
import { AlertRulesService } from '../alert-rules/service/alert-rules.service';
import { Subject } from '../service/alert.model';
import { AlertEventService } from '../service/alert-event.service';
import * as _ from 'lodash';
import { AdvancedConfigurationService } from '../alert-configuration/advanced-configuration/service/advanced-configuration.service';

@Component({
  selector: 'app-alert-filter',
  templateUrl: './alert-filter.component.html',
  styleUrls: ['./alert-filter.component.scss'],
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
    },
  ],
})
export class AlertFilterComponent extends PageSidebarComponent
implements OnInit {
  classes = 'alert-page-sidebar';
  preset: SelectItem[];
  types: SelectItem[];
  allSeverity: SelectItem[];
  mmcSeverity: SelectItem[];
  endedSeverity: SelectItem[];
  upgradedOption: SelectItem[];
  downgradedOption: SelectItem[];
  clearedAlerts: SelectItem[];
  alertTypes: SelectItem[];
  other: SelectItem[];
  ruleList: SelectItem[] = [];
  panel: any;
  selectedPreset: string ='';
  customEndTimeFrame : Moment[] = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  newAlert: number[] = [];
  continuousAlert: number[] = [];
  endedAlert: number[] = [];
  upgrAlert: any[] = [];
  dwngAlert: any[] = [];
  clrAlert: number[] = [];
  aType: number[] = [];
  selectedRules: string[] = [];
  selectedOthers: number[] = [];
  options: SelectItem[];
  tier: string = '';
  server : string = '';
  instance: string = '';
  max: Moment = null;

  @ViewChild('multiSelect',{ read: MultiSelect })
  multiSelect: MultiSelect;

  @Output() upDateHistoryTable = new EventEmitter<any>();
  st: number;
  et: number;

  constructor(private timebarService: TimebarService,
    private router: Router,private alertDownloadService: AlertDownloadService, 
    private alertFilterService: AlertFilterService, private sessionService: SessionService, 
    private alertRulesService: AlertRulesService, 
    public _alertEventService: AlertEventService,
    private advConfigService: AdvancedConfigurationService
    ) { super();}

  ngOnInit(): void {
    const me = this;
    me.preset = CONS.ALERT_PRESETS;//[
    //   { label: 'Last 4 Hours', value:'LIVE5' },
    //   { label: 'Default Filters', value: 'default' },
    //   { label: 'Custom', value: 'custom' },
    // ];

    this.allSeverity = [
      {label: 'Critical', value: CONS.SEVERITY.CRITICAL},
      {label: 'Major', value: CONS.SEVERITY.MAJOR},
      {label: 'Minor', value: CONS.SEVERITY.MINOR},
      //{label: 'Normal', value: CONS.SEVERITY.NORMAL},
      //{label: CONS.SEVERITY.INFO_STRING, value: CONS.SEVERITY.INFO}
    ];

    this.mmcSeverity = [
      {label: 'Critical', value: CONS.SEVERITY.CRITICAL},
      {label: 'Major', value: CONS.SEVERITY.MAJOR},
      {label: 'Minor', value: CONS.SEVERITY.MINOR},
    ];

    this.endedSeverity = [
      {label: 'Critical', value: CONS.SEVERITY.CRITICAL},
      {label: 'Major', value: CONS.SEVERITY.MAJOR},
      {label: 'Minor', value: CONS.SEVERITY.MINOR},
      //{label: CONS.SEVERITY.INFO_STRING, value: CONS.SEVERITY.INFO}
    ];

    this.upgradedOption = [
      {label: 'Minor to Major', value: {prevSeverity: CONS.SEVERITY.MINOR, severity: CONS.SEVERITY.MAJOR}},
      {label: 'Minor to Critical', value: {prevSeverity: CONS.SEVERITY.MINOR, severity: CONS.SEVERITY.CRITICAL}},
      {label: 'Major to Critical', value: {prevSeverity: CONS.SEVERITY.MAJOR, severity: CONS.SEVERITY.CRITICAL}},
    ];

    this.downgradedOption = [
      {label: 'Critical to Major', value: {prevSeverity: CONS.SEVERITY.CRITICAL, severity: CONS.SEVERITY.MAJOR}},
      {label: 'Critical to Minor', value: {prevSeverity: CONS.SEVERITY.CRITICAL, severity: CONS.SEVERITY.MINOR}},
      {label: 'Major to Minor', value: {prevSeverity: CONS.SEVERITY.MAJOR, severity: CONS.SEVERITY.MINOR}},
      //{label: 'Critical to Info', value: {prevSeverity: CONS.SEVERITY.CRITICAL, severity: CONS.SEVERITY.INFO}},
      //{label: 'Major to Info', value: {prevSeverity: CONS.SEVERITY.MAJOR, severity: CONS.SEVERITY.INFO}},
      //{label: 'Major to Info', value: {prevSeverity: CONS.SEVERITY.MINOR, severity: CONS.SEVERITY.INFO}},
    ];

    this.setDefaultFilters();
    // this.newAlert.push(CONS.SEVERITY.CRITICAL);
    // this.newAlert.push(CONS.SEVERITY.MAJOR);
    // this.newAlert.push(CONS.SEVERITY.MINOR);

    // this.endedAlert.push(CONS.SEVERITY.CRITICAL);
    // this.endedAlert.push(CONS.SEVERITY.MAJOR);
    // this.endedAlert.push(CONS.SEVERITY.MINOR);

    // this.clrAlert.push(CONS.STATUS.FORCE_CLEAR);
    // this.clrAlert.push(CONS.STATUS.ClearDueToConfigChange);

    this.options = [
      {label: 'Critical', value: 3},
      {label: 'Major', value: 2},
      {label: 'Minor', value: 1},
      {label: 'Normal', value: 0}
    ];

    // me.alertTypes = [options
    //   { label: 'All', value: 2 },
    //   { label: 'Capacity', value: 0 },
    //   { label: 'Behaviour', value: 1 },
    //   { label: 'Others', value: 3 },
    // ];

    me.alertTypes = [
      { label: 'All', value:2 },
      { label: 'Capacity', value: 0 },
      { label: 'Others', value: 3 },
    ];

    this.other = [
      {label: 'Maintenance Window Changes', value: CONS.STATUS.MAINTENANCE_CONFIG_CHANGE },
      {label: 'Alert Configuration changes', value: CONS.STATUS.GLOBAL_CONFIG_CHANGE },
      {label: 'Action Changes', value: CONS.STATUS.ACTION_CONFIG_CHANGE },
      {label: 'Force clear alert', value: CONS.STATUS.FORCE_CLEAR},
      {label: 'Clear due to Rule Change', value: CONS.STATUS.CLEAR_DUE_TO_DISABLE_RULE},
      {label: 'Clear due to Configuration Change', value: CONS.STATUS.ENDED_DUE_TO_GLOBAL_CONFIG_CHANGE},
      // {label: 'Baseline Changes', value: CONS.OTHERS.TYPE_BASELINE }
    ]
      
    me.selectedPreset = me.alertFilterService.syncPreset(me.timebarService, me.preset);

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

    me.max = moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.offset : "+0530");

    me.getAlertRules();
    me._alertEventService.resetStateCount();
  }

  getAlertRules()
  {
    const me = this;
    const path = environment.api.alert.rule.all.endpoint;
    const payload: RulePayload = {
      cctx: this.sessionService.session.cctx,
      opType: PAYLOAD_TYPE.GET_RULES,
      clientId: "-1",
      appId: "-1"
    }

    me.alertRulesService.genericLoad(false,PAYLOAD_TYPE.GET_RULES, AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AlertRuleDataLoadingState) {

        }
        if (state instanceof AlertRuleDataLoadedState) {

          me.onLoaded(state);
          return;
        }
      },
      (state: AlertRuleDataLoadingErrorState) => {
        console.error("Error in auto update", state.error);
      });
    
  }

  onTimeFilterCustomTimeChange(){
    const me = this;
    /* setTimeout(() => {
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
            me.customTimeFrame[0].zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.offset : "+0530").valueOf(),
            me.customTimeFrame[1].zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.offset : "+0530").valueOf()
          );

         me.setTmpValue({
          timePeriod: timePeriod,
         });
        }
          
      }
    }); */
  }

  applyFilter()
  {
    const me = this;

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
    me._alertEventService.hierarchy = { label: 'Level0', value: -1 };
    me._alertEventService.level = -1; 
    me._alertEventService.resetStateCount();   
    
    me.timeFilterApply();
  }

  timeFilterApply()
  {
    let severityList: SeverityFilter [] = [];

    //creating rule array
    let ruleNames: string [] = [];
    if(this.selectedRules !=null || this.selectedRules != undefined || this.selectedRules.length != 0)
    {
      this.selectedRules.forEach(element =>{
        ruleNames.push(element);
      });
    }

    //creating severity filter
    if (this.newAlert.length != 0)
    {
      this.newAlert.forEach(element => {
        
        let severityF: SeverityFilter = {
          severity: element,
          reason: CONS.STATUS.STARTED,
          prevSeverity: CONS.SEVERITY.NORMAL
        }
        severityList.push(severityF);
      });
    }

    if (this.continuousAlert.length != 0)
    {
      this.continuousAlert.forEach(element => {
        
        let severityF: SeverityFilter = {
          severity: element,
          reason: CONS.STATUS.CONTINUOUS,
          prevSeverity: CONS.SEVERITY.NORMAL
        }
        severityList.push(severityF);
      });
    }

    if (this.endedAlert.length != 0)
    {
      this.endedAlert.forEach(element => {
        
        let severityF: SeverityFilter = {
          severity: CONS.SEVERITY.NORMAL,
          reason: CONS.STATUS.ENDED,
          prevSeverity: element
        }
        severityList.push(severityF);
      });
    }

    if (this.upgrAlert.length != 0)
    {
      this.upgrAlert.forEach(element => {
        let severityF: SeverityFilter = {
          severity: element.severity,
          reason: CONS.STATUS.UPGRADED,
          prevSeverity: element.prevSeverity
        }
        severityList.push(severityF);
      });
    }

    if (this.dwngAlert.length != 0)
    {
      this.dwngAlert.forEach(element => {
        let severityF: SeverityFilter = {
          severity: element.severity,
          reason: CONS.STATUS.DOWNGRADED,
          prevSeverity: element.prevSeverity
        }
        severityList.push(severityF);
      });
    }

    //creating tagInfo i.e., subject
    let tagsList: HierarchyInfo[] = [];
    if (this.tier.length != 0)
    {
      let tags: HierarchyInfo = {
      key : 'Tier',
      value : this.tier,
      }
      tagsList.push(tags)
    }
    if (this.server.length != 0)
    {
      let tags: HierarchyInfo = {
        key : 'Server',
        value : this.server,
        }
        tagsList.push(tags)
    }
    if (this.instance.length != 0)
    {
      let tags: HierarchyInfo = {
        key : 'Instance',
        value : this.instance,
        }
        tagsList.push(tags)
    }

    let subject: Subject = {
      tags: tagsList
    }

    if(subject.tags.length == 0)
    subject = null;


    let eventQuery: EventQuery = {
      ruleNames: ruleNames,
      others: this.selectedOthers,
      severityFilter: severityList,
      st: -1,
      et: -1,
      subject: subject
    }

    let payload: EventHistoryRequest = {
      cctx: null,
    opType: -1,
    clientId: '',
    appId: '',
    events: [],
    eventQuery: eventQuery
    }

    if(this.selectedPreset == 'custom')
    {
      console.log("this.customTimeFrame[0].utc().valueOf()---->>> ", this.customTimeFrame[0].utc().valueOf())
      console.log("this.customTimeFrame[1].utc().valueOf()---->>> ", this.customTimeFrame[1].utc().valueOf())

      let diffTimeStamp = this.sessionService.selectedTimeZone?
        this.sessionService.selectedTimeZone.diffTimeStamp : 
        this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

      this.st = this.customTimeFrame[0].valueOf();
      this.et = this.customTimeFrame[1].valueOf();
      payload.eventQuery.st = this.st;
      payload.eventQuery.et = this.et;

      this._alertEventService.applyFilters(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof AlertFilterLoadingStatus) {
  
          }
  
          if (state instanceof AlertFilterLoadedStatus) {
            this.upDateHistoryTable.next(state.data)
          }
        },
        (state: AlertFilterLoadingErrorStatus) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
    else
      this.onPresetApply(payload);
    // this.alertDownloadService.fromHour= moment(this.customTimeFrame[0]).format("YYYY/MM/DD HH:mm:ss");
    // this.alertDownloadService.toHour= moment(this.customTimeFrame[1]).format("YYYY/MM/DD HH:mm:ss");
    this.alertDownloadService.preset=this.selectedPreset;
    this.alertDownloadService.customTimeSelected=this.customTimeFrame;
    this.hide();
  }


  closeClick() {
    const me = this;
    //this.selectedPreset = me.preset[4].value;;
    me.hide();
  }

  open() {
    const me = this;

    let diffTimeStamp = this.sessionService.selectedTimeZone?
        this.sessionService.selectedTimeZone.diffTimeStamp : 
        this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;

    if(me.selectedPreset == 'custom')
    {
      if(me.st && me.et)
      {
        me.customTimeFrame = [
          moment(me.st).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
          moment(me.et).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")        
        ];
      }
      else
      {
        let browserTimeStamp = this.advConfigService.getTimeZoneInfo(new Date().toString().substr((new Date().toString().indexOf("GMT") + 3), 5), "offset").diffTimeStamp;
        me.customTimeFrame = [
          moment(new Date().getTime() - 3600000).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530"),
          moment(new Date().getTime()).zone(me.sessionService && me.sessionService.selectedTimeZone != null ? me.sessionService.selectedTimeZone.diffTimeStamp == 0? "-0000" : me.sessionService.selectedTimeZone.offset : "+0530")
        ];
      }
    }
    
    me.show();
  }

  onPresetChange()
  {
    const me = this;

    if(this.selectedPreset == 'custom')
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

  onPresetApply(payload: EventHistoryRequest)
  {
    if(this.selectedPreset != 'custom')
    {
      this.alertFilterService.loadTime(this.selectedPreset).subscribe(
        (state: Store.State) => {
          if (state instanceof GlobalTimebarTimeLoadingState) {
            
            return;
          }

          if (state instanceof GlobalTimebarTimeLoadedState) {

            if(payload)
            {
              payload.eventQuery.st = state.data[1];
              payload.eventQuery.et = state.data[2];
              this._alertEventService.applyFilters(payload).subscribe(
                (state: Store.State) => {
                  if (state instanceof AlertFilterLoadingStatus) {
          
                  }
          
                  if (state instanceof AlertFilterLoadedStatus) {
                    this.upDateHistoryTable.next(state.data)
                  }
                },
                (state: AlertFilterLoadingErrorStatus) => {
                  console.error("Error in auto update", state.error);
                }
              )
            }
          }
        },
        (state: GlobalTimebarTimeLoadingErrorState) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
  }

  onLoaded(state)
  {
    this.ruleList = [];
    state.data.data.forEach(element => {
      this.ruleList.push({ label: element.ruleName, value:element.ruleName });
    });
  }

  onLoading(state)
  {
    console.log("state.data.data--->>> ", state.data.data)

  }

  onLoadinError(state)
  {
    console.log("state.data.data--->>> ", state.data.data)

    
  }

  setDefaultFilters()
  {
    this.newAlert = [];
    this.newAlert.push(CONS.SEVERITY.CRITICAL);
    this.newAlert.push(CONS.SEVERITY.MAJOR);
    this.newAlert.push(CONS.SEVERITY.MINOR);

    this.endedAlert = [];
    this.endedAlert.push(CONS.SEVERITY.CRITICAL);
    this.endedAlert.push(CONS.SEVERITY.MAJOR);
    this.endedAlert.push(CONS.SEVERITY.MINOR);

    this.continuousAlert = [];
    this.upgrAlert = [];
    this.dwngAlert = [];
    this.selectedOthers = [];
    // this.clrAlert.push(CONS.STATUS.FORCE_CLEAR);
    // this.clrAlert.push(CONS.STATUS.CLEAR_DUE_TO_DISABLE_RULE);

    this.aType.push(CONS.ALERTTYPE.CAPACITY_ALERT);

    this.selectedPreset = this.preset[4].value;

    this.selectedRules = [];
    this.tier = '';
    this.server = '';
    this.instance = '';
  }

  clearFilters()
  {
    this.newAlert = [];
    this.continuousAlert = [];
    this.endedAlert = [];
    this.upgrAlert = [];
    this.dwngAlert = [];
    //this.clrAlert = [];
    this.aType = [];
    this.selectedRules = [];

    this.tier = '';
    this.server = '';
    this.instance = '';
    this.selectedOthers = [];
  }
  selectAllFilters(){
    this.newAlert=[];this.allSeverity.forEach((value,index)=>{this.newAlert.push(value.value)});
    this.continuousAlert=[];this.allSeverity.forEach((value,index)=>{this.continuousAlert.push(value.value)});
    this.endedAlert=[];this.allSeverity.forEach((value,index)=>{this.endedAlert.push(value.value)});
    this.upgrAlert=[];this. upgradedOption.forEach((value,index)=>{this.upgrAlert.push(value.value)});
    this.dwngAlert=[];this.downgradedOption.forEach((value,index)=>{this.dwngAlert.push(value.value)});
    this.selectedOthers=[];this.other.forEach((value,index)=>{this.selectedOthers.push(value.value)});

  }
}
