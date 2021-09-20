import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { AuditLogHeaderCols, AuditLogsTableLoadPayload, AuditLogTable } from '../service/audit-log.model';
import { Action } from './audit-log-filters.model';
import { SessionService } from 'src/app/core/session/session.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { AuditLogService } from '../service/audit-log.service';
import {TimebarTimeConfig, TimebarValueInput} from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { TimebarValue } from 'src/app/shared/time-bar/service/time-bar.model';
import * as moment from 'moment';
import { Moment } from 'moment-timezone';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { PayLoadData } from '../../geolocation/service/geolocation.model';

@Component({
  selector: 'app-audit-log-filters',
  templateUrl: './audit-log-filters.component.html',
  styleUrls: ['./audit-log-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class AuditLogFiltersComponent extends PageSidebarComponent
  implements OnInit {

  selectedItem;
  
  include: boolean = true;
  options: MenuItem[];
  selectedSessions: string[];
  selectedActions: Action;
  actions: Action[];
  data: AuditLogTable;
  error: AppError;
  loading: boolean;
  cols: AuditLogHeaderCols[] = [];
  _selectedColumns: AuditLogHeaderCols[] = [];
  @Input() auditLogsData: any;
  moduleList: Action[] = [];
  activityList: Action[] = [];
  selectedActivityList: Action[] = [];
  selectedModuleList: Action[] = [];
  selectedPreset: { label?: string; id?: string; } = { label: 'Last 1 Hour', id: 'LIVE3' }
  isAddedInList: boolean = false;
  
  preset: boolean = true;
  tmpValue: TimebarValue = null;
  value: TimebarValue = null;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  invalidDate: boolean = false;
  timeFilterEnableApply: boolean = false;
  presetData:TimebarValue = null;
  firstTime : boolean = false;
  isItems : boolean = false;
  startDate: string = "";
  endDate: string = "";

  rangeDates: any[];

  // tmpValue: TimebarValue = null;
  constructor(private session: SessionService, private auditLogService: AuditLogService, public timebarService: TimebarService,) {
    super();
    const me = this;
    me.loading = true;
    me.isItems = false;
    me.firstTime = true;
  }

  ngOnInit(): void {
    const me = this;
    
         let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
    if (timePreset)
      me.options = timePreset.slice(0,3);
      // this.startDate = me.auditLogsData.startDate;
      // this.endDate = me.auditLogsData.endDate;
    
    if (me.auditLogsData.data && me.auditLogsData.data.extraLogsInfo) {
      for (const index of me.auditLogsData.data.extraLogsInfo.activityList) {
        me.activityList.push({ name: index, icon: 'icons8 icons8-plus-math', tooltip: 'Click to add.' });
      }
      for (const index of me.auditLogsData.data.extraLogsInfo.moduleList) {
        // let tmp = index.split("::")[1] + "::" + index.split("::")[2];
        me.moduleList.push({ name: index, icon: 'icons8 icons8-plus-math', tooltip: 'Click to add.' });
      }
    }
  }

  // prepareValue(value: TimebarValue): TimebarValue {
  //   const me = this;

  //   MenuItemUtility.map((item: MenuItem) => {
  //     item.url = '';
  //     item.command = () => {
  //       if (!item.items) {
  //         me.tmpValue.timePeriod.selected = item;
  //         me.isItems = true;
  //         me.validateTimeFilter(true);
  //       }
  //     };

  //   }, value.timePeriod.options);

  //   MenuItemUtility.map((item: MenuItem) => {
  //     item.url = '';
  //     item.command = () => {
  //       if (!item.items) {
  //         me.tmpValue.viewBy.selected = item;
  //         me.isItems = true;
  //         me.validateTimeFilter();
  //       }
  //     };
  //   }, value.viewBy.options);

  //   value.timePeriod.options.splice(3,1);

  //   return value;
  // }
  prepareValue(){
   	
    const me = this;
    // let payload: AuditLogsTableLoadPayload = {
     
    //   cctx: me.session.session.cctx,
    //   groupBy: me.auditLogsData.selectedGroupBy['value'],
    //   include: me.include,
    //   sp: me.selectedPreset['id'],
    //     }
       
   
    // console.log("audittttttttttttttlogsdata", me.auditLogsData);
    
    MenuItemUtility.map((item: MenuItem) => {
    item.url = '';
    item.command = () => {
    if (!item.items)
    this.selectedPreset = item;
    const me = this;
    let payload: AuditLogsTableLoadPayload = {
     
      cctx: me.session.session.cctx,
      groupBy: me.auditLogsData.selectedGroupBy['value'],
      include: me.include,
      sp: me.selectedPreset['id'],
        }
    me.auditLogsData.load(payload);
    
    // this.startDate = me.auditLogsData.startDate;
    // this.endDate = me.auditLogsData.endDate;
    
    };
    }, this.options);
   
    

  
    }
   
  applyFilters() {
    const me = this;
    let activity = [];
    if (me.selectedActivityList) {
      for (let i of me.selectedActivityList)
        activity.push(i['name']);
    }
    let module = [];
    if (me.selectedModuleList) {
      for (let i of me.selectedModuleList)
        module.push(i['name']);
    }
    // moment(me.customTimeFrame[0]).zone(
    //   me.session.selectedTimeZone.offset
    //   )
    //   moment(me.customTimeFrame[1]).zone(
    //     me.session.selectedTimeZone.offset
    //     )
   
        
    let payload: AuditLogsTableLoadPayload = {
     
      cctx: me.session.session.cctx,
      groupBy: me.auditLogsData.selectedGroupBy['value'],
      // sp: me.selectedPreset['id'],
      include: me.include,
      activity: activity,
      modules: module,
        }
    if(this.preset)
    {
      payload['sp'] = me.selectedPreset['id'];
    }
    else{
      // payload.duration = {
      // let st = moment(me.customTimeFrame[0]).zone(
      //   me.session.selectedTimeZone.offset
      // ).valueOf();
      // let et = moment(me.customTimeFrame[1]).zone(
      //   me.session.selectedTimeZone.offset
      // ).valueOf();
        let st = Date.parse(me.rangeDates[0]);
        let et = Date.parse(me.rangeDates[1]);
        payload['sp'] = "SPECIFIED_TIME_" + st + "_" + et;
        // payload ['st'] = moment(me.customTimeFrame[0]).zone(
        //   me.session.selectedTimeZone.offset
        //   ).valueOf(),
        //  payload ['et'] = moment(me.customTimeFrame[1]).zone(
        //     me.session.selectedTimeZone.offset
        //     ).valueOf()
      // payload.duration['st']= moment(me.customTimeFrame[0]).zone(
      //   me.session.selectedTimeZone.offset
      //   ).valueOf();
      // payload.duration['et'] = moment(me.customTimeFrame[1]).zone(
      //   me.session.selectedTimeZone.offset
      //   ).valueOf() 
    }
    me.auditLogService.setSelectedPreset(me.selectedPreset['id']);
    me.auditLogService.setInclude(payload.include);
    if (me.auditLogsData.data && me.auditLogsData.data.data)
      me.auditLogsData.data.data = null;
    me.auditLogsData._selectedColumns = [];
    me.auditLogsData.cols = null;
    console.log("payloooooo",payload)
    if(me.auditLogsData.isShowColumnFilter){
      me.refreshDataForClmFilter();
      }
    me.auditLogsData.load(payload);
    super.hide();
  }
  refreshDataForClmFilter() {
    const me = this;
      me.auditLogsData.isShowColumnFilter = false;
      if(me.auditLogsData.auditLogStr && me.auditLogsData.auditLogStr.filters){
        let filterKeyArr = Object.keys(me.auditLogsData.auditLogStr.filters);
        if(filterKeyArr.length > 0){
          for(let i = 0; i < filterKeyArr.length; i++){
            me.auditLogsData.auditLogStr.filters[filterKeyArr[i]].value = "";
          }
        }
      }
  }

  resetFilters() {
    this.include = false;
    this.selectedActivityList = [];
    this.selectedModuleList = [];
    for (const index of this.activityList) {

      index.icon = 'icons8 icons8-plus-math';
      index.tooltip = 'Click to add.';
    }
    for (const index of this.moduleList) {

      index.icon = 'icons8 icons8-plus-math';
      index.tooltip = 'Click to add.';
    }
  }

  closeClick() {
    const me = this;
    super.hide();
  }

  remove(event) {
    const me = this;
   // console.log('called', event);
  }

  toggleActivityFilter(action) {
    
  //  let event: Action = action.value;
  let event: Action = action.option.value;
    for (const index of this.activityList) {
      if (index.name === event.name) {
        if (index.icon == 'icons8 icons8-plus-math') {
          index.icon = 'icons8 icons8-minus';
          index.tooltip = 'Click to remove.';
        }
        else {
          index.icon = 'icons8 icons8-plus-math';
          index.tooltip = 'Click to add.';
        }
      }
     
    }
   
  }
  toggleModuleFilter(action) {
    let event: Action = action.option.value;
    for (const index of this.moduleList) {
      if (index.name == event.name) {
        if (event.icon == 'icons8 icons8-plus-math') {
          index.icon = 'icons8 icons8-minus';
          index.tooltip = 'Click to remove.';
        }
        else {
          index.icon = 'icons8 icons8-plus-math';
          index.tooltip = 'Click to add.';
        }
      }
    }
  }
  onTimeFilterTypeChangeForAudit(){
    const me = this;
  
    try{
    if (!me.preset) {
      console.log("enetr1")
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );

      // const serverTime = moment(me.sessionService.time);
      const serverTime = moment(me.session.time).zone(
        this.session.selectedTimeZone.offset
      );

      // if (customTime) {
      let startTime = Date.parse(me.auditLogService.st);
      let endTime = Date.parse(me.auditLogService.et);
        me.rangeDates = [
          new Date(startTime),
          new Date (endTime)
        ];
      // }
      //code changed for Bug 106678 - LRM | Time Period :Applied Start/End Time should be selected
      // if user uncheck Custom Preset form Live preset time period applied.
      // else{
      
        
      //   me.customTimeFrame = [
      //     moment(me.tmpValue.time.frameStart.value).zone(
      //       this.session.selectedTimeZone.offset),
      //     moment(me.tmpValue.time.frameEnd.value).zone(
      //       this.session.selectedTimeZone.offset),
      //   ];
      // }

      if (!me.customTimeFrame || !me.customTimeFrame.length) {
        console.log("enetr4")
        me.customTimeFrame = [
          serverTime.clone().subtract(1, 'hour'),
          serverTime.clone(),
        ];
      }

      me.customTimeFrameMax = serverTime.clone();

      setTimeout(() => {
        me.onTimeFilterCustomTimeChange();
      });
    } else {
      me.validateTimeFilter();
    }
    }catch(e){
      console.log("Error in Filtering audit logs ",e);
    }

  }
  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    // TODO: make it dynamic
    if (me.tmpValue.timePeriod.selected.state.online) {
      me.tmpValue.running = true;
    } else {
      me.tmpValue.running = false;
    }
let previous =  me.tmpValue.timePeriod.previous;
let selected = me.tmpValue.timePeriod.selected;
let iscustom = me.isCustomTime(selected.id);
if(me.preset && me.firstTime && !iscustom){
  me.presetData = me.tmpValue;
}
if(me.preset && me.presetData && (me.firstTime|| iscustom)){
  me.tmpValue.timePeriod.selected = me.presetData.timePeriod.selected;
  me.tmpValue.viewBy.selected = me.presetData.viewBy.selected;
  me.tmpValue.running = me.presetData.running;
  me.tmpValue.discontinued = me.presetData.discontinued;
  me.tmpValue.includeCurrent = me.presetData.includeCurrent;
}
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
    me.firstTime = false;
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
          me.tmpValue = me.timebarService.getValue();
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
  isCustomTime(tp: string): boolean {
    return tp.startsWith('SPECIFIED_TIME_');
  }
  onTimeFilterCustomTimeChange() {
    const me = this;
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
    });
  }
  

}
