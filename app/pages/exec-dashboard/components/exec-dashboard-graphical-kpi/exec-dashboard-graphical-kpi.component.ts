import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExecDashboardGraphicalKpiService } from './../../services/exec-dashboard-graphical-kpi.service';
import { WidgetConfiguration } from './../../containers/widget-configuration';
import { Widget } from './../../containers/widget';
import { ExecDashboardConfigService } from '../../services/exec-dashboard-config.service';
import { ExecDashboardWidgetDataService } from '../../services/exec-dashboard-widget-data.service';
import { ExecDashboardCommonKPIDataservice } from '../../services/exec-dashboard-common-kpi-data.service';
import { ExecDashboardDataContainerService } from '../../services/exec-dashboard-data-container.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { EVENT_DAYS } from '../../constants/exec-dashboard-graphTime-const';

import { ExecDashboardGraphTimeDataservice } from '../../services/exec-dashboard-graph-time-data.service';

// Moment
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
@Component({
  selector: 'app-exec-dashboard-graphical-kpi',
  templateUrl: './exec-dashboard-graphical-kpi.component.html',
  styleUrls: ['./exec-dashboard-graphical-kpi.component.css']
})
export class ExecDashboardGraphicalKpiComponent implements OnInit, OnDestroy {

  /*Data Subscriber of service.*/
  dataSubscription: Subscription;

  /* Widget Settings.  WidgetConfiguration */
  public widgetConf: WidgetConfiguration;
  display: boolean = false;
  /* Widgets Definition Array. */
  public widgets: Widget[];
  public chartData;
  private panelLayoutData: Object = {};
  currentPage: number;
  isGraphTime: false;
  graphicalKpiInterval;
  public singleViewHeaderTitle: string = ''; // binded with single view dialog's header title

  //chart Object for single window panel 
  chart;

  //for Last Sample Time label
  lastSampleTime: string = '';
  /*Observable sources for favorite data updation.*/
  private broadcaster = new Subject<string>();
  Observable$ = this.broadcaster.asObservable();

  constructor(public _graphicalKpiService: ExecDashboardGraphicalKpiService,
    public _edConfigService: ExecDashboardConfigService,
    public _widgetDataService: ExecDashboardWidgetDataService,
    public execDashboardCommonKpiDataService: ExecDashboardCommonKPIDataservice,
    public _dataContainer: ExecDashboardDataContainerService,
    public _cavConfig: CavConfigService, public graphTime: ExecDashboardGraphTimeDataservice) {
    this.widgetConf = _graphicalKpiService.getWidgetConfiguration();
    /**Because on tab switching it was getting previous applied last sample time */
    this._graphicalKpiService.setArrLastSampleTime([0, 0]);
  }

  ngOnInit() {

    if (this._cavConfig.$edGKPIQueryParam !== undefined && Object.keys(this._cavConfig.$edGKPIQueryParam).length === 0) {
      if (localStorage.getItem('graphicalKPI') !== null) {
        if (localStorage.getItem('graphicalKPI') === 'undefined') {
          this._cavConfig.$edGKPIQueryParam = undefined;
         }else {
          this._cavConfig.$edGKPIQueryParam = JSON.parse(localStorage.getItem('graphicalKPI'));
         }
        }else {
          this._cavConfig.$edGKPIQueryParam = undefined;
    }

  }
    let appliedGKPITimePeriod = sessionStorage.appliedGKPITime == undefined || sessionStorage.appliedGKPITime.toLowerCase().includes("undefined")? "Today":sessionStorage.appliedGKPITime.toLowerCase();
    // Filling Event Days Drop down
    let eventDays = [EVENT_DAYS.BLACK_FRIDAY, EVENT_DAYS.CHRISTMAS_DAY, EVENT_DAYS.CYBER_MONDAY, EVENT_DAYS.GOOD_FRIDAY, EVENT_DAYS.NEW_YEARS_DAY,
      EVENT_DAYS.PRESIDENTS_DAY, EVENT_DAYS.THANKS_GIVING_DAY, EVENT_DAYS.VALENTINES_DAY];
    let isEventDay = false;
    for (let i = 0; i < eventDays.length && appliedGKPITimePeriod.includes(eventDays[i]); i++) {
      isEventDay = true;
      break;
    }
    this._cavConfig.$edGKPIQueryParam = Object.assign({}, this._cavConfig.$edGKPIQueryParam);
      if (appliedGKPITimePeriod != "today" && appliedGKPITimePeriod != "yesterday" && !isEventDay && appliedGKPITimePeriod != "last week same day") {
        sessionStorage.appliedGKPITime = "Today";
      }
      this._edConfigService.$actTimePeriod = sessionStorage.appliedGKPITime;
      if (isEventDay) {
        this._edConfigService.$actTimePeriod = "Event Day";
        this._cavConfig.$edGKPIQueryParam.graphKey = "Event Day";
        this._edConfigService.$appliedTimePeriodStr = "Event Day";
      }
      this.graphTime.$previousActTime = "Today";
    this._cavConfig.$edGKPIQueryParam.graphKey = this._edConfigService.$actTimePeriod;
      this._cavConfig.$edGKPIQueryParam.graphTimeLabel = sessionStorage.appliedGKPITime;
      this.graphTime.$previousActTime = sessionStorage.appliedGKPITime;

    this.setTimePeriod(this._cavConfig.$edGKPIQueryParam);
    this.execDashboardCommonKpiDataService.$blockUI = true;
    this.dataSubscription = this._graphicalKpiService.gkpiProvider$.subscribe(
      action => {
        this.setGraphTimeFlag(true);
        this.getData(true);
        let tempUpdateInfo = this._graphicalKpiService.getUpdateDCSObject();
        for (const i in tempUpdateInfo) {
          tempUpdateInfo[i] = true;
        }        
        this._graphicalKpiService.setUpdateDCSObject(tempUpdateInfo);
      },
      err => {
        console.log('Error while getting compare data from server', err);
        this.dataSubscription.unsubscribe();
      },
      () => {
        console.log('Dashboard Data Request completed successfully.');
        /*unsubscribe/releasing resources.*/
        this.dataSubscription.unsubscribe();
      }
    );
    this._graphicalKpiService.getGraphicalKpiDCConfig(() => {
      this.getData();
    });

	this.startUpdate();
  }
  
  startUpdate() {
    this.graphicalKpiInterval = setInterval(() => {
      // to add check for preset
      let appliedTimePeriod = this._dataContainer.appliedTimePeriod.toLowerCase();
    /*
    refresh mode is not available in case of
      1. Event Day
      2. Yesterday
      3. Last Week Same Day
      4. Custom Date
      */
      let isRunningTime = appliedTimePeriod == undefined || appliedTimePeriod.toLowerCase().includes("undefined")?false:appliedTimePeriod.toLowerCase() == 'today';

      if(isRunningTime){
        if((appliedTimePeriod.indexOf('last') !== -1 && appliedTimePeriod.indexOf('week') === -1) || appliedTimePeriod.indexOf('whole') !== -1 || appliedTimePeriod.indexOf('today') !== -1) {
          this.execDashboardCommonKpiDataService.$blockUI = true;
          this._dataContainer.setExecDashboardFavoriteData([]);
          this._graphicalKpiService.setIsUpdate(true);
          this.getUpdateData();
        }
      }
    }, this._edConfigService.$kpiRefreshInterval);
  }

  stopUpdate() {
    clearInterval(this.graphicalKpiInterval);
  }

  /**Setting Exec-Dashboard configuration data. */
  public getGraphTimeFlag(): any {
    return this.isGraphTime;
  }

  /**Getting Exec-Dashboard configuration data. */
  public setGraphTimeFlag(value: any) {
    this.isGraphTime = value;
  }

  getData = function (isTimePeriodApplied?:boolean) {
    try {
      /**
       * in case of refresh lastsample time label should be blank
       */
      // this._dataContainer.setExecDashboardFavoriteData([]);
      if (this.getGraphTimeFlag()) {
        this._dataContainer.setExecDashboardFavoriteData([]);
        this._dataContainer.setappliedTimePeriod(this._edConfigService.$appliedTimePeriodStr);
        this._edConfigService.$actTimePeriod = this.graphTime.$previousActTime;
        this._cavConfig.$edGKPIQueryParam = { 'graphKey': this._edConfigService.$actTimePeriod, 'graphTimeLabel': this._cavConfig.$edGKPIQueryParam.graphTimeLabel };
        this._graphicalKpiService.setgraphTimeKey(this._edConfigService.$actTimePeriod);

        if (new Date(this._edConfigService.$appliedStartTime).toString() == "Invalid Date") {
          this._graphicalKpiService.setstartTime(moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY 00:00:00"));
        } else {
          this._graphicalKpiService.setstartTime(this._edConfigService.$appliedStartTime);
        }
        if (new Date(this._edConfigService.$appliedEndTime).toString() == "Invalid Date") {
          this._graphicalKpiService.setendTime(moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY hh:mm:ss"));
        } else {
          this._graphicalKpiService.setendTime(this._edConfigService.$appliedEndTime);
        }

        //this._graphicalKpiService.setstartTime(this._edConfigService.$appliedStartTime);
        //this._graphicalKpiService.setendTime(this._edConfigService.$appliedEndTime);
        // this._graphicalKpiService.seteventDay(this._edConfigService.$seteventDay);
        // this._graphicalKpiService.setArrLastSampleTime([0, 0]);
        // this._dataContainer.setPanelDataArr([]);
        // this._widgetDataService.setPanelsInfoArray([]);
		
		// stopping timer 
        this.stopUpdate();
      }
      this._graphicalKpiService.getDCsFavDataFromUrl((data) => {
        // this.execDashboardCommonKpiDataService.$blockUI = false;
        if(data != "err"){
          if (isTimePeriodApplied && sessionStorage.appliedEDEventDay != undefined && !sessionStorage.appliedEDEventDay.toLowerCase().includes("undefined")) {
            this._edConfigService.emmitSubscription({message: "GRAPH_TIME_DIALOG", data: 1});
          }
          this._graphicalKpiService.getPanelsData();
          this.getPanelLayoutData();
        }
        else{
          if (this._graphicalKpiService.$isDataAvailable == this._dataContainer.graphicalKPIDcInfo.length){
            this.graphTime.$appliedTimePeriod = this.graphTime.$previousTime;
            let prevData = this.graphTime.$previousTime;
            if (this.graphTime.$previousTime.startsWith("Event Day")) {
              let eventDayInfoArr = this.graphTime.$previousTime.split("#");
              prevData = {
                actTime: eventDayInfoArr[0],
                eventDay: eventDayInfoArr[1],
                eventYear: eventDayInfoArr[2],
                startTime: eventDayInfoArr[3],
                endTime: eventDayInfoArr[4]
              };
            }
            this._edConfigService.emmitSubscription({message: "GRAPH_LABEL_CHANGED", data: prevData});
          }
          if (isTimePeriodApplied && sessionStorage.appliedEDEventDay != undefined && !sessionStorage.appliedEDEventDay.toLowerCase().includes("undefined")) {
            this._edConfigService.emmitSubscription({message: "GRAPH_TIME_DIALOG", data: 0});
          }
        }
      });
    } catch (error) {
      console.log('error in getData');
      console.log(error);
    }
  }
  
  
    getUpdateData = function () {
    try {
      console.log('getUopdate method called ');
      this._graphicalKpiService.getDCsFavDataFromUrl(() => {
        // this.execDashboardCommonKpiDataService.$blockUI = false;
        console.log("inside callback of URL ");
	this.updateLastSampleTime();
        let msg = 'UPDATE_DATA_AVAILABLE';
        this.broadcaster.next(msg);
        // get Wiget componnent flow here.
        // this._graphicalKpiService.getPanelsData();
        // this.getPanelLayoutData();
      });
    } catch (error) {
      console.log("getUpdateData error ");
      console.log(error);

    }
  }


  updateLastSampleTime() {
    try {
      let lastSampleDCMap = this._graphicalKpiService.getLastSampleTimeObjOfDCs();
      this.lastSampleTime = '';
      for (var k in lastSampleDCMap) {
        const element = lastSampleDCMap[k];
        this.lastSampleTime = this.lastSampleTime + ' ' + k + ':' + moment.tz(element, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss');
      }
    } catch (error) {
      console.log("updateLastSampleTime called ");
      console.log(error);
    }
  }

  /*getting widgets array here & broadcasting for single windows panel for updations */
  getPanelLayoutData = function () {
    try {
		
	  if(this.getGraphTimeFlag()){
        this._graphicalKpiService.setIsUpdate(false);
        this.startUpdate();
	this.setGraphTimeFlag(false);
      }	
		
      this.widgets = this._graphicalKpiService.getWidgetsLayout();
      this.updateLastSampleTime();

      this.broadcaster.next(this.widgets);
    } catch (error) {
      console.log('error in getPanelLayoutData');
      console.log(error);
    }
    return null;
  }

  /**
   * onWidgetMaximize 
   */
  onWidgetMaximize(event, widget) {
    this._graphicalKpiService.setShowSingleWidget(true);
    this.display = this._graphicalKpiService.getShowSingleWidget();
    this.chart = Object.assign(widget);
    this.singleViewHeaderTitle = this._dataContainer.getPanelDataArr()[widget.pNum].panelTitle;
  }

  clearPreviousInformation = function () {
    this._dataContainer.setPanelDataArr([]);
    this._widgetDataService.setPanelsInfoArray([]);
  }

  onRefreshClick = function () {
    try {
      this.clearPreviousInformation();
      this.getData();
    } catch (error) {
      console.log('error in on refresh method ');
      console.log(error);
    }
  }
  public ngOnDestroy() {
    this._dataContainer.setappliedTimePeriod('Today');
    let startDate = moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY 00:00:00");
    let endDate = moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY hh:mm:ss");
    this._edConfigService.$appliedStartTime = `${startDate}`;
    this._graphicalKpiService.setstartTime(this._edConfigService.$appliedStartTime);
    this._edConfigService.$appliedEndTime = `${endDate}`;
    this._graphicalKpiService.setendTime(this._edConfigService.$appliedEndTime);
    this.stopUpdate();
    this.dataSubscription.unsubscribe();
  }

  setTimePeriod(params) {
    if (params && params['graphKey'] && params['graphTimeLabel']) {
      if (params['graphTimeLabel'].toLowerCase() == "today" || params['graphTimeLabel'].toLowerCase() == "yesterday" || params['graphTimeLabel'].toLowerCase() == "event day" || params['graphTimeLabel'].toLowerCase() == "last week same day") {
        let graphTimeLabel = params['graphTimeLabel'];
        let startDate = moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY 00:00:00");
        let endDate = moment.tz(new Date(), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY hh:mm:ss");

        if (graphTimeLabel.trim().toLowerCase() == 'yesterday') {
          this._edConfigService.$actTimePeriod = "Yesterday";
          this._edConfigService.$appliedTimePeriodStr = "Yesterday";
          this.graphTime.$appliedTimePeriod = "Yesterday";
          startDate = moment.tz(new Date().setHours(-1, 59, 59, 59), sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY 00:00:00');
          endDate = moment.tz(new Date().setHours(-1, 59, 59, 59), sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY 23:59:59');
        }
        else if (graphTimeLabel.trim().toLowerCase() == 'event day') {
          startDate = sessionStorage.appliedEDEndTime;
          endDate = sessionStorage.appliedEDStartTime;
          this._edConfigService.$actTimePeriod = 'Event Day';
          this._edConfigService.$appliedTimePeriodStr = "Event Day";
          this.graphTime.$appliedTimePeriod = "Event Day";
        } else if (graphTimeLabel.trim().toLowerCase() == 'last week same day'){
          startDate = moment.tz(new Date().setHours(-7 * 24 + 23, 59, 59), sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY 00:00:00');
          endDate = moment.tz(new Date().setHours(-7 * 24 + 23, 59, 59), sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY 23:59:59');
          this.graphTime.$appliedTimePeriod = "Last Week Same Day";
          this._edConfigService.$appliedTimePeriodStr = "Last Week Same Day";
          this._edConfigService.$actTimePeriod = 'Last Week Same Day';
        }
        // Setting data in ED services
        this._dataContainer.setappliedTimePeriod(this._edConfigService.$actTimePeriod);
        this.graphTime.$txtStartDate = new Date(startDate);
        this.graphTime.$txtEndDate = new Date(endDate);
        this.graphTime.$txtStartTime = startDate.split(" ")[1];
        this.graphTime.$txtEndTime = endDate.split(" ")[1];
        this._edConfigService.$appliedStartTime = `${startDate}`;
	this._graphicalKpiService.setstartTime(this._edConfigService.$appliedStartTime);
        this._edConfigService.$appliedEndTime = `${endDate}`;
	this._graphicalKpiService.setendTime(this._edConfigService.$appliedEndTime);
        this.execDashboardCommonKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${this._edConfigService.$appliedStartTime} To ${this._edConfigService.$appliedEndTime})`;
      } else {
        this._edConfigService.$actTimePeriod = 'Today';
        this._edConfigService.$appliedTimePeriodStr = 'Today';
        this.graphTime.$appliedTimePeriod = 'Today';
        this._dataContainer.setappliedTimePeriod('Today');
      }
    } else {
      this._edConfigService.$appliedTimePeriodStr = 'Today';
      this._edConfigService.$actTimePeriod = 'Today';
      this.graphTime.$appliedTimePeriod = 'Today';
      this._dataContainer.setappliedTimePeriod('Today');
    }
  }
} // End of File 
