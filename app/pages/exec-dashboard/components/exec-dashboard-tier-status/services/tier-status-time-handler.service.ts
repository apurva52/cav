import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';
@Injectable()
export class TierStatusTimeHandlerService {

  // private appliedTimePeriod: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
  private appliedTimePeriod: string = 'Last 1 Hour';
  // private txtStartDate: Date = (sessionStorage.getItem('appliedEDStartTime')) ? new Date(moment(sessionStorage.getItem('appliedEDStartTime'), 'DD/MM/YYYY').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY')) : (this.txtStartDate) ? this.txtStartDate : new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
  private txtStartDate: Date;
  // private txtStartTime: string = (sessionStorage.getItem('appliedEDStartTime')) ? sessionStorage.getItem('appliedEDStartTime').split(' ')[1] : '00:00:00';
  private txtStartTime: string;
  // private txtEndDate: Date = (sessionStorage.getItem('appliedEDEndTime')) ? new Date(moment(sessionStorage.getItem('appliedEDEndTime'), 'DD/MM/YYYY').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss')) : new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
  private txtEndDate: Date ;
  // private txtEndTime: string = (sessionStorage.getItem('appliedEDEndTime')) ? sessionStorage.getItem('appliedEDEndTime').split(' ')[1] : '23:59:59';
  private txtEndTime: string;
  private chkIncludeDiscontineGraph: boolean = false;
  // private previousTime: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
  private previousTime: string;
  // private graphTimeLabel: string = (sessionStorage.getItem('graphTimeLabel')) ? (sessionStorage.getItem('graphTimeLabel')) :'Last 1 Hour';
  private graphTimeLabel: string;
  
  constructor(public _config: ExecDashboardConfigService ) { }


  getGraphTimeObject() {
    try {

      let object = this.$appliedTimePeriod.trim();
      let graphTimeObject = {};
      let tempTime = object.toLowerCase();

      if (tempTime.indexOf('last') > -1 && (tempTime.indexOf('hour') > -1 || tempTime.indexOf('minute') > -1)) {
        graphTimeObject['graphTimeLabel'] = object;
        let arr = tempTime.split(" ");
        if (tempTime.indexOf('hour') > -1) {
          graphTimeObject['graphTime'] = 'Last' + '_' + parseInt(arr[1]) * 60 + '_Minutes';
          let suffix = tempTime.indexOf('hours') != -1 ? "Hours" : "Hour"
          graphTimeObject['graphTimeLabel'] = 'Last ' + arr[1] + ' ' + suffix;
        }
        else {
          graphTimeObject['graphTime'] = 'Last' + '_' + arr[1] + '_Minutes';
        }
      }
      else if (tempTime.indexOf("today") > -1) {
        graphTimeObject['graphTime'] = "last_day";
        graphTimeObject['graphTimeLabel'] = "Today";
      }
      else {
        let tempStartTimeStamp = moment.tz(this._config.$appliedStartTime, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
        let tempEndTimeStamp = moment.tz(this._config.$appliedEndTime, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
        graphTimeObject['graphTime'] = "SPECIFIED_TIME_" + tempStartTimeStamp + "_" + tempEndTimeStamp;
        graphTimeObject['graphTimeLabel'] = this._config.$appliedStartTime + " To " + this._config.$appliedEndTime;
        graphTimeObject['strSpecialDay'] = (this._config.$appliedEventDay == '' || this._config.$appliedEventDay == undefined) ? "" : this._config.$appliedEventDay;
      }
      
      return graphTimeObject;
    } catch (error) {
      console.log('error in getGraphTimeObject ');
      console.log(error);
    }

  }
  public get $txtStartDate(): Date {
    return this.txtStartDate;
  }

  public set $txtStartDate(value: Date) {
    this.txtStartDate = value;
  }

  public get $txtEndDate(): Date {
    return this.txtEndDate;
  }

  public set $txtEndDate(value: Date) {
    this.txtEndDate = value;
  }

  public get $chkIncludeDiscontineGraph(): boolean {
    return this.chkIncludeDiscontineGraph;
  }

  public set $chkIncludeDiscontineGraph(value: boolean) {
    this.chkIncludeDiscontineGraph = value;
  }

  public get $txtStartTime(): string {
    return this.txtStartTime;
  }

  public set $txtStartTime(value: string) {
    this.txtStartTime = value;
  }

  public get $txtEndTime(): string {
    return this.txtEndTime;
  }

  public set $txtEndTime(value: string) {
    this.txtEndTime = value;
  }
  

  public get $previousTime(): string {
    return this.previousTime;
  }

  public set $previousTime(value: string) {
    this.previousTime = value;
  }
  public set $appliedTimePeriod(value:any) {
    sessionStorage.setItem('appliedEDGraphTime', value);    
    this.appliedTimePeriod = value;
  }
  public get $appliedTimePeriod(){
    return this.appliedTimePeriod;
  }
  public set $graphTimeLabel(value:any) {
    this.graphTimeLabel = value;
  }
  public get $graphTimeLabel() {
    return this.graphTimeLabel;
  }
  /*Setting default start time and end time values*/
  setDefaultValueOfStartTime = function () {
    this.txtStartTime = '00:00:00';
  }

  setDefaultValueOfEndTime = function () {
    this.txtEndTime = '23:59:59';
  }
}
