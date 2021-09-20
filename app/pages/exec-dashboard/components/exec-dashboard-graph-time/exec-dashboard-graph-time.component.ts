import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ExecDashboardUtil } from '../../utils/exec-dashboard-util';
import { ExecDashboardCommonRequestHandler } from '../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardConfigService } from '../../services/exec-dashboard-config.service';
import { ExecDashboardCommonKPIDataservice } from '../../services/exec-dashboard-common-kpi-data.service';
import { TIME_PERIOD } from '../../constants/exec-dashboard-graphTime-const';
import { EVENT_DAYS } from '../../constants/exec-dashboard-graphTime-const';
import { ExecDashboardGraphTimeDataservice } from '../../services/exec-dashboard-graph-time-data.service';
import { ExecDashboardGraphicalKpiService } from './../../services/exec-dashboard-graphical-kpi.service';

// Moment
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';

@Component({
  selector: 'app-exec-dashboard-graph-time',
  templateUrl: './exec-dashboard-graph-time.component.html',
  styleUrls: ['./exec-dashboard-graph-time.component.css']
})
export class ExecDashboardGraphTimeComponent implements OnInit {

  displayGTWindow: Boolean = false;

  // Event Days Variables
  timePeriodList: SelectItem[];
  selectedTimePeriod: string = this.graphTime.$appliedTimePeriod;
  eventDaysList: SelectItem[];
  selectedEventDay: string = EVENT_DAYS.BLACK_FRIDAY;
  selectedEventDayYear: number = new Date().getFullYear();
  eventDayYear: SelectItem[];
  // time period local label variable 
  timePeriod : string = this.graphTime.$appliedTimePeriod;
  // For Phase
  selectedPhase: string = "ALL";
  drpPhaseList: SelectItem[];
  isGKPI : boolean = false;

  appliedTimePeriod: String = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';

  errorMsgFrHours = 'Start/End hour field should not be greater than or equals to 24';
  errorMsgFrSeconds = 'Start/End Minutes/Seconds fields should not be greater or equals to 60';
  errorMsgFrStartTime = 'Invalid start time format.\n It should be in hh:mm:ss format.';
  errorMsgFrEndTime = 'Invalid end time format.\n It should be in hh:mm:ss format.';

  constructor(public requestHandler: ExecDashboardCommonRequestHandler,
    public _config: ExecDashboardConfigService, public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice,
    public graphTime: ExecDashboardGraphTimeDataservice,
  public _graphicalKpiService: ExecDashboardGraphicalKpiService, public _cavConfig: CavConfigService) { }

  ngOnInit() {
    let index = window.location.href.lastIndexOf('/');
    let component = window.location.href.substring(index + 1, window.location.href.length);
    //this.graphTime.$chkIncludeDiscontineGraph = false;
    if(component == 'graphicalKpi'){
      this.isGKPI = true;
      this.timePeriod = (sessionStorage.getItem('appliedGKPITime')) ? sessionStorage.getItem('appliedGKPITime') : 'Today';
    }
    if(component.includes("storeView")){ //for bug 87279 
     //console.log("ashish inside store View");
      if(!sessionStorage.getItem('storeViewParam') || sessionStorage.getItem('storeViewParam') == undefined || sessionStorage.getItem('storeViewParam') == "undefined")
        this.timePeriod = 'Last 10 Minutes';
     //console.log("ashish timePeriod",this.timePeriod);
    }
    this.selectedTimePeriod = this.graphTime.$appliedTimePeriod;
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

    let commonSubscriber = this._config.$commonSubscription.subscribe((response) => {  // this calls when doing some common handlings
      if (response["message"] == "GRAPH_TIME_DIALOG") {
          if (sessionStorage.appliedEDEventDay == undefined || sessionStorage.appliedEDEventDay.trim().length == 0 || sessionStorage.appliedEDEventDay.toLowerCase().includes("undefined") || response["data"] == 1) {
          this.graphTime.$previousTime = (this.selectedTimePeriod == 'Event Day') ? `${this.selectedTimePeriod}#${this.selectedEventDay}#${this.selectedEventDayYear}#${this._config.$appliedStartTime}#${this._config.$appliedEndTime}` : this.graphTime.$appliedTimePeriod;
          /*closing time period dialog */
          this.displayGTWindow = false;
        } else {
          this._config.showAlert("No data available for the applied period!");
        }
      } 
	else if (response["message"] == "GRAPH_LABEL_CHANGED") {
        if(response['data']=="Today" || response['data']=="Yesterday" || response['data']=="Last Week Same Day"){
          this.timePeriod = response['data'];
          this.graphTime.$gkpiAppliedTimePeriod = this.timePeriod;
        }
        else{
          if (response["data"] != undefined && response["data"].actTime == "Event Day") {

            this.selectedEventDay = response["data"].eventDay;
            this.selectedEventDayYear = response["data"].eventYear;
            this._config.$appliedStartTime = response["data"].startTime;
            this._config.$appliedEndTime = response["data"].endTime;
            
            this.timePeriod = `${this.selectedEventDay} ${this.selectedEventDayYear}`;
            this.selectedTimePeriod = response["data"].actTime;
	          this.graphTime.$gkpiAppliedTimePeriod = this.selectedTimePeriod;
          } else {
          this.timePeriod = "Today";
        this.graphTime.$gkpiAppliedTimePeriod = this.timePeriod;
        }
        }
        }
        else if (response["message"] == "CHANGE_GRAPHTIME_LABEL") {
          this.timePeriod = response["data"];
      }
    }
    ,
    ()=> {
      commonSubscriber.unsubscribe();
    }
    );
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
   * This method is responsible for opening graph time window
   */
  openGraphTimeWindow() {
    if (this.displayGTWindow) {
      this.displayGTWindow = false;
    } else {
      let tmpSelectedTimePeriod = sessionStorage.appliedGKPITime;
      if (tmpSelectedTimePeriod != undefined && !tmpSelectedTimePeriod.toLowerCase().includes("undefined")) {
        if (window.location.href.includes("graphicalKpi")) {
          this.selectedTimePeriod = tmpSelectedTimePeriod;
        }
      }
      this.displayGTWindow = true;
    }
  }

  /**
   * This function is responsible to perform action on time period change
   */
  changeTimePeriod() {
    try {
      
      this.graphTime.$chkIncludeDiscontineGraph = false;
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
        this.graphTime.$txtStartDate = date;
        this.graphTime.$txtStartDate.setMonth(date.getMonth());
        this.graphTime.$txtStartDate.setFullYear(date.getFullYear());
        // End Time
        this.graphTime.$txtEndDate = date;
        this.graphTime.$txtEndDate.setMonth(date.getMonth());
        this.graphTime.$txtEndDate.setFullYear(date.getFullYear());
        // start HH:MM:SS
        this.graphTime.setDefaultValueOfEndTime();
        this.graphTime.setDefaultValueOfStartTime();

      } else if (this.selectedTimePeriod === 'Event Day') {

        let url = this._config.getNodePresetURL() + `DashboardServer/RestService/KPIWebService/eventDate?eventDay=${this.selectedEventDay}&eventYear=${this.selectedEventDayYear}`;
        // Request to Get Event Date
        this.requestHandler.getDataFromGetTextRequest(url, data => {
          this.graphTime.$txtStartDate = new Date(data + "");
          this.graphTime.$txtEndDate = new Date(data + "");
   	  this._config.$appliedEventYear = this.selectedEventDayYear;
          this.graphTime.$txtStartTime = "00:00:00";
          this.graphTime.$txtEndTime = "23:59:59";
        });

      } else if (this.selectedTimePeriod === 'Custom Date') {
        // To check for value of single digit in case of hh mm ss
        // eg. it should be 01 not 1.

        // Start Time
        this.graphTime.$txtStartDate = date;
        this.graphTime.$txtStartDate.setMonth(date.getMonth());
        this.graphTime.$txtStartDate.setFullYear(date.getFullYear());
        // End Time
        this.graphTime.$txtEndDate = date;
        this.graphTime.$txtEndDate.setMonth(date.getMonth());
        this.graphTime.$txtEndDate.setFullYear(date.getFullYear());
    
        let time = '';
        time = time + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        time = ExecDashboardUtil.getTimeInHHMMSS(time);
    
        this.graphTime.$txtEndTime = time;
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
        || this.selectedTimePeriod.indexOf('By Phase') !== -1 ) {

        if (this.graphTime.$txtStartDate == null) {
          this._config.showAlert('No start date provided. \n Please select start date. ');
          isValid = false;
          return isValid;
        }

        let isStartTimeValid = ExecDashboardUtil.isEmpty(this.graphTime.$txtStartTime);
        
        if (isStartTimeValid) {
          this._config.showAlert('Start time is not provided. Please try again');
          isValid = false;
          return isValid;
        }

        if (!ExecDashboardUtil.validateTimeWithSecond(this.graphTime.$txtStartTime)) {
          this._config.showAlert(this.errorMsgFrStartTime);
          isValid = false;
          return isValid;
        }

        if (this.graphTime.$txtEndDate == null) {
          this._config.showAlert('No End date provided. \n Please select start date.');
          isValid = false;
          return isValid;
        }

        let isEndTimeValid = ExecDashboardUtil.isEmpty(this.graphTime.$txtEndTime);
        
        if (isEndTimeValid) {
          this._config.showAlert('End time is not provided. Please try again');
          isValid = false;
          return isValid;
        }

        if (!ExecDashboardUtil.validateTimeWithSecond(this.graphTime.$txtEndTime)) {
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
      // validating event year
      if(this.selectedTimePeriod === 'Event Day' && !this.validateEventDay(this.graphTime.$txtStartDate)){
        this._config.showAlert("Selected date is not available in test run.");
        return;
      }
      if ((this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Custom Date' || this.selectedTimePeriod === 'Last Week Same Day' || this.selectedTimePeriod === 'Event Day') && this.graphTime.$txtStartDate !== undefined) {
        if((this.graphTime.$txtStartDate.getMonth() + 1) < 10 && this.graphTime.$txtStartDate.getDate() < 10){
          sdate = `0${this.graphTime.$txtStartDate.getMonth() + 1}/0${this.graphTime.$txtStartDate.getDate()}/${this.graphTime.$txtStartDate.getFullYear()}`;
          ldate = `0${this.graphTime.$txtEndDate.getMonth() + 1}/0${this.graphTime.$txtEndDate.getDate()}/${this.graphTime.$txtEndDate.getFullYear()}`;
        }
        else if((this.graphTime.$txtStartDate.getDate() + 1) < 10){
          sdate = `${this.graphTime.$txtStartDate.getMonth() + 1}/0${this.graphTime.$txtStartDate.getDate()}/${this.graphTime.$txtStartDate.getFullYear()}`;
          ldate = `${this.graphTime.$txtEndDate.getMonth() + 1}/0${this.graphTime.$txtEndDate.getDate()}/${this.graphTime.$txtEndDate.getFullYear()}`;
        }
        else if((this.graphTime.$txtStartDate.getMonth() + 1) < 10){
          sdate = `0${this.graphTime.$txtStartDate.getMonth() + 1}/${this.graphTime.$txtStartDate.getDate()}/${this.graphTime.$txtStartDate.getFullYear()}`;
          ldate = `0${this.graphTime.$txtEndDate.getMonth() + 1}/${this.graphTime.$txtEndDate.getDate()}/${this.graphTime.$txtEndDate.getFullYear()}`;
        }
	else{
          sdate = `${this.graphTime.$txtStartDate.getMonth() + 1}/${this.graphTime.$txtStartDate.getDate()}/${this.graphTime.$txtStartDate.getFullYear()}`;          
	  ldate = `${this.graphTime.$txtEndDate.getMonth() + 1}/${this.graphTime.$txtEndDate.getDate()}/${this.graphTime.$txtEndDate.getFullYear()}`;
	}
      } else {
        sessionStorage.setItem('appliedEDStartTime', '');
        sessionStorage.setItem('appliedEDEndTime', '');
        sessionStorage.setItem('appliedEDEventDay', '');
      }

      // Handling for Yesterday, Custom and Last Week
      if (this.selectedTimePeriod === 'Yesterday' || this.selectedTimePeriod === 'Custom Date' || this.selectedTimePeriod === 'Last Week Same Day') {
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

      if (this.compareDatesForOthers(`${sdate} ${this.graphTime.$txtStartTime}`, "")) {
        this._config.showAlert("Start date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(`${ldate} ${this.graphTime.$txtEndTime}`, "")) {
        this._config.showAlert("End date/time cannot be greater than current date/time");
        return;
      }
      if (this.compareDatesForOthers(`${sdate} ${this.graphTime.$txtStartTime}`, `${ldate} ${this.graphTime.$txtEndTime}`)) {
        this._config.showAlert("Start date/time cannot be greater than end date/time");
        return;
      }

      // Filling Label of KPI Order Revenue
      if (this.selectedTimePeriod === 'Last Week Same Day') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${TIME_PERIOD[this.selectedTimePeriod]} ${sdate} ${this.graphTime.$txtStartTime} To ${ldate} ${this.graphTime.$txtEndTime}})`;
      } else if (this.selectedTimePeriod === 'Custom Date') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${sdate} ${this.graphTime.$txtStartTime} To ${ldate} ${this.graphTime.$txtEndTime})`;
      } else if (this.selectedTimePeriod === 'Event Day') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${this.selectedEventDay} ${sdate} ${this.graphTime.$txtStartTime} To ${ldate} ${this.graphTime.$txtEndTime})`;
      } else if (this.selectedTimePeriod === 'Total Test Run') {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (Total Test Run)`;
      } else if (this.selectedTimePeriod === 'Yesterday'){
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (Yesterday)`;
      }else {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ``;
      }

      this._config.$appliedStartTime = `${sdate} ${this.graphTime.$txtStartTime}`;
      this._config.$appliedEndTime = `${ldate} ${this.graphTime.$txtEndTime}`;
      this.graphTime.$previousActTime = this._config.$actTimePeriod; 
      this._config.$actTimePeriod = TIME_PERIOD[this.selectedTimePeriod];
      this._config.$appliedTimePeriodStr = this.selectedTimePeriod;


      /* Before applying time period setitng applied time period */
      this.graphTime.$appliedTimePeriod = (this.selectedTimePeriod == 'Event Day') ? `${this.selectedEventDay} ${this.selectedEventDayYear}` : this.selectedTimePeriod;     
      this.graphTime.$gkpiAppliedTimePeriod = (this.selectedTimePeriod == 'Event Day') ? `${this.selectedEventDay} ${this.selectedEventDayYear}` : this.selectedTimePeriod;   
      this.timePeriod = this.graphTime.$gkpiAppliedTimePeriod;
      if (this.selectedTimePeriod != 'Event Day') {
      /*closing time period dialog */
      this.displayGTWindow = false;
      }
	  
      if (window.location.href.indexOf('graphicalKpi') != -1) {
        let _tmpStartDate = new Date(this._config.$appliedStartTime);
        let _tmpEndDate = new Date(this._config.$appliedEndTime);
        let _graphKey = "";
        if (_tmpStartDate.toString() != "Invalid Date" && _tmpEndDate.toString() != "Invalid Date") {
          _graphKey = "SPECIFIED_TIME_" + _tmpStartDate.getTime() + "_" + _tmpEndDate.getTime();
        }
	this._cavConfig.$edGKPIQueryParam = {'graphKey': this._config.$actTimePeriod , 'graphTimeLabel': this.selectedTimePeriod};
        this.execDashboardKpiDataService.$blockUI = true;
        sessionStorage.appliedGKPITime = this._config.$actTimePeriod;
        this._graphicalKpiService.getGKPIData();
       }
       else if (window.location.href.indexOf('main/kpi') != -1){
	this._cavConfig.$edKPIQueryParam = {'graphKey': this._config.$actTimePeriod , 'graphTimeLabel': this.selectedTimePeriod};
        this.execDashboardKpiDataService.getKPIDataFromServer(this.execDashboardKpiDataService.$dcList, true);
       } else if (window.location.href.indexOf('/main/storeView') != -1) { 
         let obj = {
              'graphKey': this._config.$actTimePeriod,
              'graphTimeLabel': this.selectedTimePeriod,
              'appliedTimePeriod': this.graphTime.$appliedTimePeriod,
	      'startTime': this.validateDateTime(this._config.$appliedStartTime),
              'endTime': this.validateDateTime(this._config.$appliedEndTime),
              'prevTimePeriod': this.graphTime.$previousTime,
              'isIncDisGraph': this._config.$isIncDisGraph,
              'appliedEventDay': this._config.$appliedEventDay,
	      'appliedTimePeriodStr': this._config.$appliedTimePeriodStr
            }
        this._config.$appliedStartTime =  this.validateDateTime(this._config.$appliedStartTime);
        this._config.$appliedEndTime = this.validateDateTime(this._config.$appliedEndTime);

         this._graphicalKpiService.getStoreData(obj);
         if(this.timePeriod=='Custom Date'){
          this.timePeriod = this._config.$appliedStartTime + ' To ' + this._config.$appliedEndTime;
        }
      }	
      this.displayGTWindow=false;
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
      
      // If GKPI is opened, show only full day graph time options
      else if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length) === 'graphicalKpi') {
        arr1 = ["Today", "Event Day", "Yesterday", "Last Week Same Day"];
        arr2 = ["Today", "Event Day", "Yesterday", "Last Week Same Day", "By Phase", "Total Test Run"];
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
            return false;
          }
          else {
            if (eventDaySelected > dd) {
              return false;
            }
          }
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Comparing date
   * @param startDate 
   * @param endDate 
   */
  compareDatesForOthers(startDate, endDate) {
    if (startDate == "") {
      startDate = new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
    } else {
      startDate = new Date(moment(new Date(startDate), 'DD/MM/YYYY HH:mm:ss').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
    }

    if (endDate == "") {
      endDate = new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
    } else {
      endDate = new Date(moment(new Date(endDate), 'DD/MM/YYYY HH:mm:ss').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));
    }
    return (startDate > endDate);
  }

  resetFilter() {
    this.selectedTimePeriod = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
    if (new Date(sessionStorage.appliedEDStartTime).toString() != "Invalid Date") {
      let slicedStartDate = sessionStorage.appliedEDStartTime.split(" ");
      this.graphTime.$txtStartDate = new Date(slicedStartDate[0]);
      this.graphTime.$txtStartTime = slicedStartDate[1] && slicedStartDate[1].length?slicedStartDate[1]:"00:00:00";
    }

    if (new Date(sessionStorage.appliedEDEndTime).toString() != "Invalid Date") {
      let slicedEndDate = sessionStorage.appliedEDEndTime.split(" ");
      this.graphTime.$txtEndDate = new Date(slicedEndDate[0]);
      this.graphTime.$txtEndTime = slicedEndDate[1] && slicedEndDate[1].length?slicedEndDate[1]:"23:59:59";
    }
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



}
