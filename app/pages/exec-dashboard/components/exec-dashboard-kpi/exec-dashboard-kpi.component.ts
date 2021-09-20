import { Component, OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExecDashboardCommonKPIDataservice } from './../../services/exec-dashboard-common-kpi-data.service';
import { ExecDashboardConfigService } from './../../services/exec-dashboard-config.service';
import { ExecDashboardCommonRequestHandler } from './../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardDownloadService } from './../../services/exec-dashboard-download.service';

import { ExecDashboardGraphTimeDataservice } from '../../services/exec-dashboard-graph-time-data.service';
import { Meta } from '@angular/platform-browser';

// Moment
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';

@Component({
  selector: 'app-exec-dashboard-kpi',
  templateUrl: './exec-dashboard-kpi.component.html',
  styleUrls: ['./exec-dashboard-kpi.component.css']
})

export class ExecDashboardKpiComponent implements OnInit,OnDestroy {
	
	// View object for kpi.
	tempJsonViewData;
        kpiInterval;       
	isValidUser = true; 

  constructor(public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice, public _httpService: HttpClient,
    public execDashboardConfigService: ExecDashboardConfigService,
    public requestHandler: ExecDashboardCommonRequestHandler,
    public _downloaddService: ExecDashboardDownloadService,
    public _cavConfig: CavConfigService, public graphTime: ExecDashboardGraphTimeDataservice,
    private readonly meta: Meta) {
        this.meta.removeTag("name='viewport'");
    this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=0.1'});
       
    }

  ngOnInit() {
     this.meta.removeTag("name='viewport'");
      this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=1'})
 
    if (this._cavConfig.$edKPIQueryParam !== undefined && Object.keys(this._cavConfig.$edKPIQueryParam).length === 0) {
      if (localStorage.getItem('kpi') !== null) {
        if (localStorage.getItem('kpi') === 'undefined') {
          this._cavConfig.$edKPIQueryParam = undefined;
         }else {
          this._cavConfig.$edKPIQueryParam = JSON.parse(localStorage.getItem('kpi'));
         }
        }else {
          this._cavConfig.$edKPIQueryParam = undefined;
    }

  }

    this.setTimePeriod(this._cavConfig.$edKPIQueryParam);
    this.execDashboardKpiDataService.$blockUI = true;
    // Getting View and DC list info from Server
    this.execDashboardKpiDataService.getKPIViewJSON(() => {


      // this.isValidUser 
      console.log("userName ====  ");
      console.log(this._cavConfig.$userName);
      console.log(this.execDashboardKpiDataService.kpiNegativeUser);

      // to check whether table will be visible to user or not
      let tempNegativeUser = this.execDashboardKpiDataService.kpiNegativeUser;
      if (tempNegativeUser && tempNegativeUser.length > 0){
      tempNegativeUser.forEach(element => {
        if(this._cavConfig.$userName.toLowerCase() == element.toLowerCase()){
          this.isValidUser = false;
        }
      });
      }
      console.log("this.isValidUser ----  ", this.isValidUser);

      this.execDashboardKpiDataService.$blockUI = false;
	  
      this.tempJsonViewData = this.execDashboardKpiDataService.$kpiViewJson.map(x => Object.assign([], x));
      this.tempJsonViewData = this.execDashboardKpiDataService.groupTable(this.tempJsonViewData);

      this.execDashboardKpiDataService.kpiTableGroup = this.tempJsonViewData;
	  
      //this array contains the list of all dc names in kpiviewconfig
      let dcNameList = this.getAllDCsName(this.execDashboardKpiDataService.$kpiViewJson);

      this.generateKPIObj(dcNameList);  // generate Service obj containing all DC Info
      this.execDashboardKpiDataService.getKPIDataFromServer(dcNameList);    // Generate data in service
      this.refrehKPIView();   // refresh KPI GUI on specific interval

    });

  }
  

  /**
   * This method is to get all Dcs Name list from KPIviewConfig file 
   * Used for rendering tables in GUI
   */
  getAllDCsName(kpiViewArr) {
    try {

      let dcNameList = [];
      for (let i = 0; i < kpiViewArr.length; i++) {
        let dc = kpiViewArr[i]['DCs'];
        if (dc.indexOf(',') != -1) {
          dcNameList.push(`${dc.split(',')[0]},${dc.split(',')[1]}`);
        } else {
          dcNameList.push(dc);
        }
      }

      // to remove multiple enteries
      let dcSet = new Set(dcNameList);
      dcNameList = Array.from(dcSet);

      this.execDashboardKpiDataService.$dcList = dcNameList;
      console.info('In method getAllDcsName. DC Name List -> ', dcNameList);
      return dcNameList;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * This method is resposible for generating main KPI Object containing All DCs blank Data Grid Array
   * @param dcNameList
   */
  generateKPIObj(dcNameList) {
    try {
      for (let i = 0; i < dcNameList.length; i++) {
        this.execDashboardKpiDataService.$kpiDataObj["grid_" + dcNameList[i]] = [];
      }
      this.execDashboardKpiDataService.$kpiDataObj["orderRev"] = [];
      console.info('In method generateKPIObj. KPI Data Obj -> ', this.execDashboardKpiDataService.$kpiDataObj);
    } catch (error) {
      console.error(error);
    }
  }

  private noUpdateList = [
    "Custom Date",
    "Event Day",
    "Custom Date",
    "Yesterday",
    "Last Week Same Day"
  ];
  /**
   * This function gets KPI Data on specific Intervals 
   */
  refrehKPIView() {
    this.kpiInterval =  setInterval(() => {
      if(!this.noUpdateList.includes(this.execDashboardConfigService.$appliedTimePeriodStr))
        this.execDashboardKpiDataService.getKPIDataFromServer(this.execDashboardKpiDataService.$dcList);
    }, this.execDashboardConfigService.$kpiRefreshInterval);
  }

  setTimePeriod(params) {
    if (params && params['graphKey'] && params['graphTimeLabel']) {
      if (!params['graphKey'].startsWith('SPECIFIED_TIME')) {
        let timePeriodList  = ["last_day", "Event Day", "Last_10_Minutes", "Last_30_Minutes", "Last_60_Minutes", "Last_120_Minutes", "Last_240_Minutes", "Last_360_Minutes", "Last_480_Minutes", "Last_720_Minutes", "Last_1440_Minutes", "Last Week Same Day", "Custom Date"];
        if (!timePeriodList.includes(params['graphKey'])) {
          params['graphKey'] = "Last 1 Hour";
          params['graphTimeLabel'] = "Last 1 Hour";
        } else {
          if (!["Event Day", "Last Week Same Day", "Custom Date"].includes(params['graphKey'])) {
            this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = '';
          }
        }
        this.execDashboardConfigService.$actTimePeriod = params['graphKey'];	// eg: LAST_60_MINUTES
        this.execDashboardConfigService.$appliedTimePeriodStr = params['graphTimeLabel'];	// eg: Last 1 Hour
        this.graphTime.$appliedTimePeriod = params['graphTimeLabel'];
	sessionStorage.setItem('appliedEDGraphTime', params['graphTimeLabel']);
	if (sessionStorage.appliedEDGraphTime == undefined) {
           this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = '';
        }
      } else {

        let graphKeySubStr = params['graphKey'];
        let graphTimeLabel = params['graphTimeLabel'];

        // Format of Time: SPECIFIED_TIME_1469338080000_1469352480000_600, done to extract date in format dd/mm/yyyy
        let splitLongDateArr = graphKeySubStr.split("_");
        let sDate: any = new Date(moment(parseInt(splitLongDateArr[2])).format("MM/DD/YYYY"));
        let eDate: any = new Date(moment(parseInt(splitLongDateArr[3])).format("MM/DD/YYYY"));
        let startDate = moment.tz(parseInt(splitLongDateArr[2]), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY");
        let endDate = moment.tz(parseInt(splitLongDateArr[3]), sessionStorage.getItem('timeZoneId')).format("MM/DD/YYYY");

        let startTime;
        let endTime;
        this.execDashboardConfigService.$actTimePeriod = "Custom Date";
        this.execDashboardConfigService.$appliedTimePeriodStr = "Custom Date";
        this.graphTime.$appliedTimePeriod = "Custom Date";
        sessionStorage.setItem('appliedEDGraphTime', "Custom Date");
        if (graphTimeLabel.trim().toLowerCase() == 'yesterday') {
          this.execDashboardConfigService.$actTimePeriod = "Yesterday";
          this.execDashboardConfigService.$appliedTimePeriodStr = "Yesterday";
          this.graphTime.$appliedTimePeriod = "Yesterday";
          sessionStorage.setItem('appliedEDGraphTime', "Yesterday");
          this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = `Yesterday`;
          startTime = moment.tz(parseInt(splitLongDateArr[2]), sessionStorage.getItem('timeZoneId')).format('HH:mm:ss');
          endTime = moment.tz(parseInt(splitLongDateArr[3]), sessionStorage.getItem('timeZoneId')).format('HH:mm:ss');
        }
        else {
          startTime = graphTimeLabel.split('To')[0].trim().split(' ')[1];
          endTime = graphTimeLabel.split('To')[1].trim().split(' ')[1];
        }
        // Setting data in ED services
        this.graphTime.$txtStartDate = new Date(startDate);
        this.graphTime.$txtEndDate = new Date(endDate);
        this.graphTime.$txtStartTime = startTime;
        this.graphTime.$txtEndTime = endTime;
        this.execDashboardConfigService.$appliedStartTime = `${startDate} ${startTime}`;
        this.execDashboardConfigService.$appliedEndTime = `${endDate} ${endTime}`;
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${this.execDashboardConfigService.$appliedStartTime} To ${this.execDashboardConfigService.$appliedEndTime})`;
      }
    } else {
      // Pass Last 1 hour by default
      if (sessionStorage.appliedEDGraphTime == undefined) {
        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = '';
      }
      this.execDashboardConfigService.$appliedTimePeriodStr = 'Last 1 Hour';
      this.execDashboardConfigService.$actTimePeriod = 'Last_60_Minutes';
      this.graphTime.$appliedTimePeriod = 'Last 1 Hour';
      sessionStorage.setItem('appliedEDGraphTime', 'Last 1 Hour');
    }
  }
  
  ngOnDestroy(){
     this.meta.removeTag("name='viewport'");
      this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=1'})
     this.stopUpdate();
  }
  stopUpdate() {
    clearInterval(this.kpiInterval);
  }
}
