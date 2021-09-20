import { ExecDashboardGraphicalKpiService } from './../../../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardCommonKPIDataservice } from './../../../../services/exec-dashboard-common-kpi-data.service';
import { TierStatusDataHandlerService } from './../../services/tier-status-data-handler.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ExecDashboardUtil } from './../../../../utils/exec-dashboard-util';
import { ExecDashboardCommonRequestHandler } from './../../../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardConfigService } from './../../../../services/exec-dashboard-config.service';
import { TierStatusTimeHandlerService } from './../../services/tier-status-time-handler.service';
import { TIME_PERIOD, EVENT_DAYS } from './../../../../constants/exec-dashboard-graphTime-const';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
@Component({
  selector: 'app-tier-status-time-period',
  templateUrl: './tier-status-time-period.component.html',
  styleUrls: ['./tier-status-time-period.component.css']
})
export class TierStatusTimePeriodComponent implements OnInit {
  className: string = "TierStatusTimePeriodComponent";
  // Event Days Variables
  timePeriodList: SelectItem[];
  selectedTimePeriod: string = this.timeHandlerService.$appliedTimePeriod;
  eventDaysList: SelectItem[];
  selectedEventDay: string = EVENT_DAYS.BLACK_FRIDAY;
  selectedEventDayYear: number = new Date().getFullYear();
  eventDayYear: SelectItem[];
  selectedPhase: string = "ALL";
  drpPhaseList: SelectItem[];
  appliedTimePeriod: String = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
  displayTimeWindow: Boolean = false;
  /**Error messages for time period */
  errorMsgFrHours = 'Start/End hour field should not be greater than or equals to 24';
  errorMsgFrSeconds = 'Start/End Minutes/Seconds fields should not be greater or equals to 60';
  errorMsgFrStartTime = 'Invalid start time format.\n It should be in hh:mm:ss format.';
  errorMsgFrEndTime = 'Invalid end time format.\n It should be in hh:mm:ss format.';
  constructor(public timeHandlerService: TierStatusTimeHandlerService,
    public _config: ExecDashboardConfigService, public requestHandler: ExecDashboardCommonRequestHandler,
    public _tsDataHandlerService: TierStatusDataHandlerService, public _cavConfig: CavConfigService,
    public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice,
    public _graphicalKpiService:ExecDashboardGraphicalKpiService) { }

  ngOnInit() {
    this.selectedTimePeriod = this.timeHandlerService.$appliedTimePeriod;
    this.timePeriodList = this.generateSelectItems(this.getTimePeriodOnBasisOfEnv());

    // Filling Event Days Drop down
    let eventDays = [EVENT_DAYS.BLACK_FRIDAY, EVENT_DAYS.CHRISTMAS_DAY, EVENT_DAYS.CYBER_MONDAY, EVENT_DAYS.GOOD_FRIDAY, EVENT_DAYS.NEW_YEARS_DAY,
    EVENT_DAYS.PRESIDENTS_DAY, EVENT_DAYS.THANKS_GIVING_DAY, EVENT_DAYS.VALENTINES_DAY];
    this.eventDaysList = this.generateSelectItems(eventDays);

    // Filling Event Days's Year
    let currentYear = new Date().getFullYear();
    let eventDayYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
    this.eventDayYear = this.generateSelectItems(eventDayYears);

    //Filling Phase Drp
    let phaseList = ["All", "Ramp Up", "Stablize", "Ramp Down"];
    this.drpPhaseList = this.generateSelectItems(phaseList);
  }

  openTimePeriodWindow(){
    this.displayTimeWindow = true;
  }

  /**
   * Generate Select Item
   */
  generateSelectItems(list) {
    try {
      return ExecDashboardUtil.createSelectItem(list);
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * This is responsible for getting different options in Cont/Non Cont Env for Time period
   * 
   */
  getTimePeriodOnBasisOfEnv() {
    try {

      let arr1 = ["Today", "Event Day", "Last 10 Minutes", "Last 30 Minutes", "Last 1 Hour", "Last 2 Hours", "Last 4 Hours", "Last 6 Hours", "Last 8 Hours", "Last 12 Hours", "Last 24 Hours", "Yesterday", "Last Week Same Day", "Custom Date"];
      let arr2 = ["Today", "Event Day", "Last 10 Minutes", "Last 30 Minutes", "Last 1 Hour", "Last 2 Hours", "Last 4 Hours", "Last 6 Hours", "Last 8 Hours", "Last 12 Hours", "Last 24 Hours", "Yesterday", "Last Week Same Day", "Custom Date", "By Phase", "Total Test Run"];

      // If KPI is opened, remove Last 1 and 30 min from graph time options
      if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length) === 'kpi') {
        arr1 = ["Today", "Event Day", "Last 1 Hour", "Last 2 Hours", "Last 4 Hours", "Last 6 Hours", "Last 8 Hours", "Last 12 Hours", "Last 24 Hours", "Yesterday", "Last Week Same Day", "Custom Date"];
        arr2 = ["Today", "Event Day", "Last 1 Hour", "Last 2 Hours", "Last 4 Hours", "Last 6 Hours", "Last 8 Hours", "Last 12 Hours", "Last 24 Hours", "Yesterday", "Last Week Same Day", "Custom Date", "By Phase", "Total Test Run"];
      }

      if (this._config.$serverChk !== 'ND') {
        return arr2;
      } else {
        return arr1;
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  /**
   * validation for event day
   */
  validateEventDay(date) {
    try {

      var currDate = new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
      var eventDate = new Date(moment(date, 'DD/MM/YYYY').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
      var yyyy = currDate.getFullYear();
      var mm = currDate.getMonth() + 1;
      var dd = currDate.getDate();

      var eventYear = eventDate.getFullYear();
      var eventMonth = eventDate.getMonth() + 1;
      var eventDaySelected = eventDate.getDate();

      if (eventYear >= yyyy) {
        if (eventMonth >= mm) {
          if (eventMonth > mm) {
            this._config.showAlert("Data is not available for " + this.selectedEventDay + " " + eventYear);
            return;
          }
          else {
            if (eventDaySelected > dd) {
              this._config.showAlert("Data is not available for " + this.selectedEventDay + " " + eventYear);
              return;
            }
          }
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Comparing date
   * @param startDate 
   * @param endDate 
   */
  compareDatesForOthers(startDate, endDate) {
    var x = new Date(startDate);
    var y = new Date(endDate);

    return (x > y);
  }

  resetFilter() {
    this.selectedTimePeriod = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
  }

  validateDateTime(time) {
    let tempTime = time.trim();
    let arr = tempTime.split(' ');
    let date = arr[0];
    let ttime = arr[1];
    this.validateData(date);
    return this.validateData(date) + ' ' + arr[1];
  }

  validateData(date) {
    let arr = date.split('/');
    let tempData = '';
    for (let i = 0; i < arr.length; i++) {
      if (i !== arr.length - 1) {
        if (arr[i].length < 2) {
          tempData = tempData + '0' + arr[i] + '/'
        }
        else {
          tempData = tempData + arr[i] + '/';
        }
      } else {
        tempData = tempData + arr[i];
      }
    }
    return tempData;
  }

  /**
   * This function is responsible to perform action on time period change
   */
  changeTimePeriod() {
    try {

      let date = new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
      if (this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Last Week Same Day') {
        if (this.selectedTimePeriod === 'Yesterday') {
          // Getting Previous date
          date.setDate(date.getDate() - 1);
        } else if (this.selectedTimePeriod === 'Last Week Same Day') {
          // Getting Previous week date
          date.setDate(date.getDate() - 7);
        }
        // Start Time
        this.timeHandlerService.$txtStartDate = date;
        this.timeHandlerService.$txtStartDate.setMonth(date.getMonth());
        this.timeHandlerService.$txtStartDate.setFullYear(date.getFullYear());
        // End Time
        this.timeHandlerService.$txtEndDate = date;
        this.timeHandlerService.$txtEndDate.setMonth(date.getMonth());
        this.timeHandlerService.$txtEndDate.setFullYear(date.getFullYear());
        // start HH:MM:SS
        this.timeHandlerService.setDefaultValueOfEndTime();
        this.timeHandlerService.setDefaultValueOfStartTime();

      } 
      //getting event days on the basis of time period
      else if (this.selectedTimePeriod === 'Event Day') {

        //let url = `https://10.10.50.18/DashboardServer/RestService/KPIWebService/eventDate?eventDay=${this.selectedEventDay}&eventYear=${this.selectedEventDayYear}`;

        let url = this._config.$getHostUrl + `DashboardServer/RestService/KPIWebService/eventDate?eventDay=${this.selectedEventDay}&eventYear=${this.selectedEventDayYear}`;
        // Request to Get Event Date
        this.requestHandler.getEventDayDateFromGetRequest(url).subscribe(data => {
          this.timeHandlerService.$txtStartDate = new Date(data + "");
          this.timeHandlerService.$txtEndDate = new Date(data + "");
          // Event day validation
          this.validateEventDay(this.timeHandlerService.$txtStartDate);

          this._config.$appliedEventYear = this.selectedEventDayYear;
        });

      } else if (this.selectedTimePeriod === 'Custom Date') {
        // To check for value of single digit in case of hh mm ss
        // eg. it should be 01 not 1.

        // Start Time
        this.timeHandlerService.$txtStartDate = date;
        this.timeHandlerService.$txtStartDate.setMonth(date.getMonth());
        this.timeHandlerService.$txtStartDate.setFullYear(date.getFullYear());
        // End Time
        this.timeHandlerService.$txtEndDate = date;
        this.timeHandlerService.$txtEndDate.setMonth(date.getMonth());
        this.timeHandlerService.$txtEndDate.setFullYear(date.getFullYear());

        let time = '';
        time = time + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        time = ExecDashboardUtil.getTimeInHHMMSS(time);

        this.timeHandlerService.$txtEndTime = time;
      }
    } catch (err) {
      console.error(err)
    }
  }

  validateGraphTimeOptions() {
    try {
      let isValid = true;
      let isPresetNtValid = ExecDashboardUtil.isEmpty(this.selectedTimePeriod);

      if (isPresetNtValid) {
        this._config.showAlert('Time Period is not provided . Please provide time period');
        isValid = false;
        return isValid;
      }

      if (this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Custom Date'
        || this.selectedTimePeriod === 'Last Week Same Day' || this.selectedTimePeriod.indexOf('Event') !== -1
        || this.selectedTimePeriod.indexOf('By Phase') !== -1) {

        if (this.timeHandlerService.$txtStartDate == null) {
          this._config.showAlert('No start date provided. \n Please select start date. ');
          isValid = false;
          return isValid;
        }

        let isStartTimeValid = ExecDashboardUtil.isEmpty(this.timeHandlerService.$txtStartTime);

        if (isStartTimeValid) {
          this._config.showAlert('Start time is not provided. Please try again');
          isValid = false;
          return isValid;
        }

        if (!ExecDashboardUtil.validateTimeWithSecond(this.timeHandlerService.$txtStartTime)) {
          this._config.showAlert(this.errorMsgFrStartTime);
          isValid = false;
          return isValid;
        }

        if (this.timeHandlerService.$txtEndDate == null) {
          this._config.showAlert('No End date provided. \n Please select start date.');
          isValid = false;
          return isValid;
        }

        let isEndTimeValid = ExecDashboardUtil.isEmpty(this.timeHandlerService.$txtEndTime);

        if (isEndTimeValid) {
          this._config.showAlert('End time is not provided. Please try again');
          isValid = false;
          return isValid;
        }

        if (!ExecDashboardUtil.validateTimeWithSecond(this.timeHandlerService.$txtEndTime)) {
          this._config.showAlert(this.errorMsgFrEndTime);
          isValid = false;
          return isValid;
        }

      }
      return isValid;
    } catch (error) {
      console.error('errror in validateGraphTimeOptions ->', error);
    }
  }


  /**
  * Applying Time Period
  */
  applyTimePeriod() {
    try {

      let sdate = '';
      let ldate = '';
      let startTime;
      let endTime;

      let isGraphTimeValid = this.validateGraphTimeOptions();
      if (!isGraphTimeValid)
        return;

      if ((this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Custom Date' || this.selectedTimePeriod === 'Last Week Same Day' || this.selectedTimePeriod === 'Event Day') && this.timeHandlerService.$txtStartDate !== undefined) {
        sdate = `${this.timeHandlerService.$txtStartDate.getMonth() + 1}/${this.timeHandlerService.$txtStartDate.getDate()}/${this.timeHandlerService.$txtStartDate.getFullYear()}`;
        ldate = `${this.timeHandlerService.$txtEndDate.getMonth() + 1}/${this.timeHandlerService.$txtEndDate.getDate()}/${this.timeHandlerService.$txtEndDate.getFullYear()}`;
      } else {
        sessionStorage.setItem('appliedEDStartTime', '');
        sessionStorage.setItem('appliedEDEndTime', '');
        sessionStorage.setItem('appliedEDEventDay', '');
      }

      // Handling for Yesterday, Custom and Last Week
      if (this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Custom Date' || this.selectedTimePeriod === 'Last Week Same Day') {
        if (new Date(`${ldate} ${this.timeHandlerService.$txtEndTime}`) < new Date(`${sdate} ${this.timeHandlerService.$txtStartTime}`)) {
          this._config.showAlert("End date/time cannot be lesser than start date/time");
          return;
        }
        this._config.$appliedEventDay = '';
      } else if (this.selectedTimePeriod.startsWith('Event')) {
        this._config.$appliedEventDay = `${this.selectedEventDay} ${this.selectedEventDayYear}`;
      } else if (this.selectedTimePeriod === 'By Phase') {
        this._config.$appliedEventDay = this.selectedPhase;
      } else {
        this._config.$appliedStartTime = '';
        this._config.$appliedEndTime = '';
        this._config.$appliedEventDay = '';
      }

      if (this.compareDatesForOthers(`${sdate} ${this.timeHandlerService.$txtStartTime}`, new Date())) {
        this._config.showAlert("Start date/time cannot be greater than current date/time");
        return;
      }

      // Filling Label of KPI Order Revenue
      if (this.selectedTimePeriod === 'Last Week Same Day') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${TIME_PERIOD[this.selectedTimePeriod]} ${sdate} ${this.timeHandlerService.$txtStartTime} To ${ldate} ${this.timeHandlerService.$txtEndTime}})`;
      } else if (this.selectedTimePeriod === 'Custom Date') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${sdate} ${this.timeHandlerService.$txtStartTime} To ${ldate} ${this.timeHandlerService.$txtEndTime})`;
      } else if (this.selectedTimePeriod === 'Event Day') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${this.selectedEventDay} ${sdate} ${this.timeHandlerService.$txtStartTime} To ${ldate} ${this.timeHandlerService.$txtEndTime})`;
      } else if (this.selectedTimePeriod === 'Total Test Run') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (Total Test Run)`;
      } else if (this.selectedTimePeriod === 'Yesterday') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (Yesterday)`;
      } else {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ``;
      }

      this._config.$appliedStartTime = `${sdate} ${this.timeHandlerService.$txtStartTime}`;
      this._config.$appliedEndTime = `${ldate} ${this.timeHandlerService.$txtEndTime}`;

      this._config.$actTimePeriod = TIME_PERIOD[this.selectedTimePeriod];
      this._config.$appliedTimePeriodStr = this.selectedTimePeriod;


      /* Before applying time period setitng applied time period */
      this.timeHandlerService.$previousTime = this.timeHandlerService.$appliedTimePeriod;
      this.timeHandlerService.$appliedTimePeriod = (this.selectedTimePeriod == 'Event Day') ? `${this.selectedEventDay} ${this.selectedEventDayYear}` : this.selectedTimePeriod;

      /*closing time period dialog */
      this.displayTimeWindow = false;

      if (window.location.href.indexOf('graphicalKpi') != -1) {
        this._cavConfig.$edGKPIQueryParam = { 'graphKey': this._config.$actTimePeriod, 'graphTimeLabel': this.selectedTimePeriod };
        this.execDashboardKpiDataService.$blockUI = true;
        this._graphicalKpiService.getGKPIData();
      }
      else if (window.location.href.indexOf('main/kpi') != -1) {
        this._cavConfig.$edKPIQueryParam = { 'graphKey': this._config.$actTimePeriod, 'graphTimeLabel': this.selectedTimePeriod };
        this.execDashboardKpiDataService.getKPIDataFromServer(this.execDashboardKpiDataService.$dcList, true);
      } else if (window.location.href.indexOf('/main/storeView') != -1) {
        let obj = {
          'graphKey': this._config.$actTimePeriod,
          'graphTimeLabel': this.selectedTimePeriod,
          'appliedTimePeriod': this.timeHandlerService.$appliedTimePeriod,
          'startTime': this.validateDateTime(this._config.$appliedStartTime),
          'endTime': this.validateDateTime(this._config.$appliedEndTime),
          'prevTimePeriod': this.timeHandlerService.$previousTime,
          'isIncDisGraph': this._config.$isIncDisGraph,
          'appliedEventDay': this._config.$appliedEventDay,
          'appliedTimePeriodStr': this._config.$appliedTimePeriodStr
        }
        this._config.$appliedStartTime = this.validateDateTime(this._config.$appliedStartTime);
        this._config.$appliedEndTime = this.validateDateTime(this._config.$appliedEndTime);

        this._graphicalKpiService.getStoreData(obj);
      }
      else if (window.location.href.indexOf('/main/tierStatus') != -1){
        let obj = {
          'graphKey': this._config.$actTimePeriod,
          'graphTimeLabel': this.selectedTimePeriod,
          'appliedTimePeriod': this.timeHandlerService.$appliedTimePeriod,
          'startTime': this.validateDateTime(this._config.$appliedStartTime),
          'endTime': this.validateDateTime(this._config.$appliedEndTime),
          'prevTimePeriod': this.timeHandlerService.$previousTime,
          'isIncDisGraph': this._config.$isIncDisGraph,
          'appliedEventDay': this._config.$appliedEventDay,
          'appliedTimePeriodStr': this._config.$appliedTimePeriodStr
        }
        this._config.$appliedStartTime = this.validateDateTime(this._config.$appliedStartTime);
        this._config.$appliedEndTime = this.validateDateTime(this._config.$appliedEndTime);

        this._tsDataHandlerService.getTSData(obj);
      }

    } catch (err) {
      console.error(err);
    }
  }

}
