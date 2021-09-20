import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExecDashboardCommonRequestHandler } from './exec-dashboard-common-request-handler.service';
import { ExecDashboardDataContainerService } from './exec-dashboard-data-container.service';
import { Widget } from './../containers/widget';
// for temporary we are getting favorite data from here.
import { ExecDashboardChartProviderService } from './exec-dashboard-chart-provider.service';
import { ExecDashboardWidgetDataService } from './exec-dashboard-widget-data.service';
import { ExecDashboardConfigService } from './exec-dashboard-config.service';
import { WidgetConfiguration } from './../containers/widget-configuration';
import { ExecDashboardCommonKPIDataservice } from './exec-dashboard-common-kpi-data.service';
import { ExecDashboardGraphTimeDataservice } from './exec-dashboard-graph-time-data.service';
import * as moment from 'moment';
import { CavConfigService } from '../../tools/configuration/nd-config/services/cav-config.service';


@Injectable()
export class ExecDashboardGraphicalKpiService {

  private widgets: any;
  private showSingleWidget: boolean = false;
  private isUpdate: boolean = false;
  favDataObject = {};
  //Array to contain dc's info from configuration file
  graphicalKPIDcInfo: any = [];
  private widgetConf = new WidgetConfiguration();

  /**Graph Time variables */
  host: string;
  port: string;
  startTime: string = `11/23/2017 07:00:00`;
  endTime: string = `11/23/2017 08:00:00`;
  graphTimeKey: string;
  eventDay: string = ``;
  avgCount = 1;
  lastSampleTime = 0;
  arrLastSampleTime = [0, 0];
  msgs = [];
  private emitter = new Subject;
  gkpiProvider$ = this.emitter.asObservable();
  lastSampleTimeObjOfDCs = {};
  isDataAvailable: any = false;
  updateCheckForDCs = {};
  private getStoreViewData = new Subject;
  $storeProvider = this.getStoreViewData.asObservable();
  updateCheckForStoreView = { storeFlag: true };

  constructor(public _http: HttpClient,
    private requestHandler: ExecDashboardCommonRequestHandler,
    public _dataContainer: ExecDashboardDataContainerService,
    public execDashboardChartProviderService: ExecDashboardChartProviderService,
    public _widgetDataService: ExecDashboardWidgetDataService,
    public _config: ExecDashboardConfigService, public graphTime: ExecDashboardGraphTimeDataservice,
    public execDashboardCommonKpiDataService: ExecDashboardCommonKPIDataservice, public cavConfig: CavConfigService) {
  }

  getStoreData(data) {
    this.getStoreViewData.next(data);
  }

  /* on GraphTime Apply */
  getGKPIData() {
    this.emitter.next();
  }

  /**
   * This method is use to get the DCs configuration from server
   */
  getGraphicalKpiDCConfig(callback) {
    try {
      /**
       * Clearing config data before setting it.
       */
      this._dataContainer.setPlannedOrderPanel(null);
      this._dataContainer.setPlannedPanel(null);
      this._dataContainer.setOrderRevPanel([]);
      this._dataContainer.setGraphicalKPIDcInfo([]);
      this.graphicalKPIDcInfo = [];
      this._dataContainer.setPanelDataArr([]);
      this._widgetDataService.setPanelsInfoArray([]);
      // let url = this._config.$getHostUrl + 'DashboardServer/RestService/KPIWebService/GraphicalKPIInfo'
      let url = this._config.getNodePresetURL() + "DashboardServer/RestService/KPIWebService/GraphicalKPIInfo";
      this.requestHandler.getDataFromGetRequest(url, (data) => {
        if (data.status === 404 || data == []) {
          console.error('Configuration Not Found', 'error');
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Configuration Not Found' });

          return;
        }
        this._dataContainer.$ordRevMaxRows = data['ordRevMaxRows'];
        for (const i in data) {
          if (data.hasOwnProperty(i)) {
            if (i == 'dataCenterMap') {
              const element = data[i];
              for (const j in element) {
                this.updateCheckForDCs[j] = true;
                if (element.hasOwnProperty(j)) {
                  const values = element[j];
                  this.graphicalKPIDcInfo.push(values);
                }
              }
            }
            else if (i == 'plannedPanel')
              this._dataContainer.setPlannedPanel(data[i]);
            else if (i == 'ordersPanel')
              this._dataContainer.setPlannedOrderPanel(data[i]);
            else if (i == 'orderRevPanel') {
              let tmpIndices = data[i];
              if (this._dataContainer.$ordRevMaxRows > 1) {
                let tmpOrdRevMaxRows = this._dataContainer.$ordRevMaxRows;
                let tmpOrdRevWidgetIndices = [];
                let _numberOfColumns = 3; // TODO: change this if number of columns increase in future
                let checkValue = 0;
                for (let j = 0; j < (tmpOrdRevMaxRows * _numberOfColumns); j++) {
                  checkValue = j % _numberOfColumns;
                  if (checkValue == tmpIndices) {
                    tmpOrdRevWidgetIndices.push(j);
            }
                }
                tmpIndices = tmpOrdRevWidgetIndices;
              } else  {
                tmpIndices = [tmpIndices];
              }
              this._dataContainer.setOrderRevPanel(tmpIndices);
            }
            else if (i == 'ordRevDcs') {
              this._dataContainer.setOrderRevDCs(data[i]);
            }
          }
          //setting dc
          this._dataContainer.setGraphicalKPIDcInfo(this.graphicalKPIDcInfo);
        }
        callback();
      });
    }
    catch (error) {
      console.log('getting error inside');
    }
  }

  dateFormatter(d) {
    var sMonth = d.split(" ")[0].split('/')[0];
    var sDay = d.split(" ")[0].split('/')[1];
    var time = d.split(" ")[1];
    if (time.split(":").length === 2) {
      time = time + ':00'
    }
    if (parseInt(sMonth) < 10 && sMonth.charAt(0) != '0') {
      sMonth = '0' + sMonth;
    }
    if (parseInt(sDay) < 10 && sDay.charAt(0) != '0') {
      sDay = '0' + sDay;
    }
    d = sMonth + "/" + sDay + "/" + d.split(" ")[0].split('/')[2] + " " + time;
    return d;
  }

  /**
   * This method is use to call the dcs for favorite data and push all fav data in array.
   */
  getDCsFavDataFromUrl(callback) {
    let tempArr = [];
    let url;
    this.$isDataAvailable = 0;

    if (this._dataContainer.getappliedTimePeriod().indexOf('Last Week') != -1 || this._dataContainer.getappliedTimePeriod().indexOf('Yesterday') != -1 || this._dataContainer.getappliedTimePeriod().indexOf('Custom') != -1 || this._dataContainer.getappliedTimePeriod().indexOf('Event') != -1) {
      this.endTime = this.dateFormatter(this.endTime);
      this.startTime = this.dateFormatter(this.startTime);
    } else { // Set empty in case Today
      this.setstartTime("");
      this.setendTime("");
    }

    for (let index = 0; index < this.graphicalKPIDcInfo.length; index++) {
      if (!this.updateCheckForDCs[this.graphicalKPIDcInfo[index].dataCenterName]) {
        continue;
      }
      else {
        this.updateCheckForDCs[this.graphicalKPIDcInfo[index].dataCenterName] = false;
      }
      let dcProperties = this.graphicalKPIDcInfo[index];
      if (sessionStorage.isMultiDCMode == "true") {
        url = this._config.getNodePresetURL([dcProperties.dataCenterName]);
      } else {
        url = `${dcProperties.protocol}://${dcProperties.dataCenterIP}:${dcProperties.dataCenterPort}/`
      }
      url =  url + 'DashboardServer/RestService/KPIWebService/graphicalKPIInfo?requestType=KPIData&GRAPH_KEY=&sessLoginName=netstorm&reqTestRunNum=' + this.graphicalKPIDcInfo[index]['testRunNo'] + '&dcName=' + this.graphicalKPIDcInfo[index].dataCenterName + '&serverType=0&isAll=' + this.graphicalKPIDcInfo[index].dataCenterName + '&isIncDisGraph=false&appliedTimePeriodStr=' + this._dataContainer.getappliedTimePeriod() + '&appliedStartTime=' + `${this.startTime}` + '&appliedEndTime=' + `${this.endTime}` + '&appliedEventDay=' + `${this.eventDay}` + '&LAST_SAMPLE_TIME=0&AVG_COUNT=' + `${this.avgCount}` + '&graphAxis=0';


      this.requestHandler.getDataForGKPI(url, (data) => {
        this.updateCheckForDCs[this.graphicalKPIDcInfo[index].dataCenterName] = true;
        let dcConfigInfo = this._dataContainer.getGraphicalKPIDcInfo();
        if (data == null || data.status == 404 || data == [] || data.displayMsg == 'ConnectionRefused') {
          console.error('Data Not Available', 'error');
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available for dc : ' + dcConfigInfo[index]['dataCenterName'];
          this.msgs = [];
          this.$isDataAvailable += 1;
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback("err");
        } else if (data.errorCode == 102 || data.errorCode == 101) {
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available for dc : ' + dcConfigInfo[index]['dataCenterName'];
          this.msgs = [];
          this.$isDataAvailable += 1;
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback("err");
        } else {

          if (this._dataContainer.getExecDashbaordLayoutData() == null || this._dataContainer.getExecDashbaordLayoutData() == undefined) {
          this._dataContainer.setExecDashboardLayoutData(data.dashboardLayoutData);
        }
        this.execDashboardCommonKpiDataService.$blockUI = false;
        //setting timezone
        this._dataContainer.setTimeZone(data['timeZoneId']);

        /*
         * setting DCs name in favorite
         * creating stter getter for favorite data as array 
         * This is done for last sample time label 
         */
        data['dcName'] = dcConfigInfo[index]['dataCenterName'];
        // setting lastSampleTime for updation.
        if (data.hasOwnProperty('lastSampleTime')) {
          this.arrLastSampleTime[index] = data.lastSampleTime;
          this.lastSampleTimeObjOfDCs[dcConfigInfo[index]['dataCenterName']] = data.lastSampleTime;
        }

        for (let i = 0; i < data.panelData.length; i++) {
          if (i !== 0 && i !== 1) {
            if ((data.panelData[i] !== null && data.panelData[i] !== undefined) && data.panelData[i].hasOwnProperty('panelGraphs')) {
              for (let j = 0; j < data.panelData[i]['panelGraphs'].length; j++) {
                //  if (data.panelData[i]['panelGraphs'][j] !== null && data.panelData[i]['panelGraphs'][j] !== undefined && data.panelData[i]['panelGraphs'].hasOwnProperty('graphName')) {
                //data.panelData[i]['panelGraphs'][j]['graphName'] = dcConfigInfo[index]['dataCenterName'];
                /*  }
                  else
                   continue;  */
              }
            }
          }
        }

        this.favDataObject[dcConfigInfo[index]['dataCenterName']] = data;
        console.log('favDataObject --- ', this.favDataObject);
        this._dataContainer.setExecDashboardFavoriteData(this.favDataObject);
        this._widgetDataService.generateGraphicalFavData(data);
        tempArr.push(data);
        callback();
        }
      });
    }
  }

  getGraphicalKpiDataOnLoad = function () {
    try {
      this._widgetDataService.generateGraphicalFavData();
    } catch (error) {
      console.log('error in getGraphicalKpiData ');
      console.log(error);
    }
  }


  getPanelDataByTitle(title) {
    let panelArray = this._dataContainer.getPanelDataArr();
    for (let i = 0; i < panelArray.length; i++) {
      if (panelArray[i] != undefined && panelArray[i].panelTitle == title) {
            return panelArray[i];
          }
    }
  }


  /* Creating widgets array  */
  getPanelsData = function () {
    try {
      let panelData = this._dataContainer.getPanelDataArr();
      let tempPanelLayout = this._dataContainer.getExecDashbaordLayoutData();
      let fitToScreen = tempPanelLayout['fitToScreen'];
      let widgetArr = tempPanelLayout['panelLayout']['widgets'];
      // for temporary, need to get no of panel based on pagination.
      let noOfPanel = widgetArr.length;
      this.widgets = new Array(noOfPanel);
      this.widgetConf.visible_cols = tempPanelLayout.columns;
      let colWidth = window.innerWidth / (tempPanelLayout.columns  + 10) - 3
      let rowHeight;
      if (fitToScreen) {
        let tempHeight = this.calcRowHeight();
        rowHeight = window.innerHeight / (tempHeight + 4.4);
      } else {
        rowHeight = window.innerHeight / (12 + 4.4);
      }
      this.widgetConf.col_width = colWidth;
      this.widgetConf.row_height = rowHeight;
      this.widgetConf.draggable = true;

      for (let i = 0; i < noOfPanel; i++) {
        /* Creating New Reference of Panel. */
        this.widgets[i] = new Widget();
        this.widgets[i]['col'] = widgetArr[i].col + 1;
        this.widgets[i]['row'] = widgetArr[i].row + 1;
        this.widgets[i]['sizex'] = widgetArr[i].sizeX;
        this.widgets[i]['sizey'] = widgetArr[i].sizeY;
        this.widgets[i]['widgetId'] = widgetArr[i].widgetId;
        this.widgets[i]['widgetName'] = widgetArr[i].name;
        this.widgets[i]['payload'] = i;
        if (!panelData[i])
          this.widgets[i]['options'] = null;
        else
          this.widgets[i]['options'] = panelData[i]['chart'];
        this.widgets[i]['pNum'] = i;
      }
      console.log('widgets Array --> ', this.widgets);

    } catch (error) {
      console.log('errr in getPanelsData ');
      console.log(error);
    }
  }

  calcRowHeight(): number {
    try {
      let dashboardLayoutInfo = this._dataContainer.getExecDashbaordLayoutData();
      let widgetArr = dashboardLayoutInfo['panelLayout']['widgets'];
      let colHeight = 0; // 12 -> bydefault

      for (let i = 0; i < widgetArr.length; i++) {
        let layoutWidgets = widgetArr[i];

        if (layoutWidgets.col === 0) {
          colHeight = colHeight + layoutWidgets.sizeY;
        }
      }

      if (colHeight === 0)
        colHeight = -1;

      return colHeight;
    }
    catch (e) {
      console.log('Exception calcRowHeight , e = ', e);
      return -1;
    }
  }

  /* Getting time ffrom web d */
  getTimePeriod(params) {
	let dcList  = [...this.cavConfig.getDCInfoObj()];
	console.log(dcList);
    let dcArr = dcList.map(e => e.dc);
	console.log(dcArr);
    let dcString = dcArr.toString();
	console.log(dcString);	
	let host = (sessionStorage.getItem('isMultiDCMode')) ? this.getHostIPForMultiDC(): this._config.$getHostUrl;
	console.log("host name is --- " + host);
	
    if (params && params['graphKey'] && params['graphTimeLabel']) {
      this._config.$actTimePeriod = params['graphKey'];    // eg: LAST_60_MINUTES
      this._config.$appliedTimePeriodStr = params['graphTimeLabel'];       // eg: Last 1 Hour	
      if (params['graphKey'].trim().startsWith('Last') && (params['graphKey'].trim().endsWith('Minute') || params['graphKey'].trim().endsWith('Minutes'))) {
	this.graphTime.$appliedTimePeriod = params['graphTimeLabel'];
	
	  if(sessionStorage.getItem('activeDC') === "ALL"){
	    console.log("inside activeDC check of last n hour case ---------------------- ");
        return host + "IntegratedServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr="  + params['graphTimeLabel'] + "&isAll=ALL&dcName=" + dcString;
      } else {
        return host + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + '&GRAPH_KEY=&appliedTimePeriodStr=' + params['graphTimeLabel'];
	  }
		
      } else {
	if (params['graphKey'].startsWith('SPECIFIED') || params['graphKey'].startsWith('Last Week Same') || params['graphKey'].startsWith('Custom D') || params['graphKey'].startsWith('Event D') || params['graphKey'].startsWith('Yester')) {
	  if (params['graphKey'].startsWith('SPECIFIED') || params['graphKey'].startsWith('Custom D')) {
	    this.graphTime.$appliedTimePeriod = "Custom Date";
	  } else {
	    this.graphTime.$appliedTimePeriod = params['graphKey'];
	  }
	  let start = "";
	  let end = "";
	  if (params['graphKey'].startsWith('SPECIFIED')) {
	    start = this.dateFormatter(params['graphTimeLabel'].split("To")[0].trim());
	    end = this.dateFormatter(params['graphTimeLabel'].split("To")[1].trim());
	  } else {
            start = this.dateFormatter(params['startTime']);
	    end = this.dateFormatter(params['endTime']);
	  }
	  
	  if(sessionStorage.getItem('activeDC') === "ALL"){
		  console.log("inside activeDC check of custom case 1 case ---------------------- ");
		  return host + "IntegratedServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedStartTime="  + start + "&appliedEndTime=" + end + "&appliedEventDay=" + params['appliedEventDay']  + '&appliedTimePeriodStr=Custom Date' + "&isAll=ALL&dcName=" + dcString;
      } else {
          return host + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedStartTime=" + start + "&appliedEndTime=" + end + "&appliedEventDay=" + params['appliedEventDay']  + '&appliedTimePeriodStr=Custom Date';
	  }
	} else {
	  this.graphTime.$appliedTimePeriod = params['graphTimeLabel'];
	  if(sessionStorage.getItem('activeDC') === "ALL"){
		  console.log("inside activeDC check of custom case last 1 hour case ---------------------- ");
		  return host + "IntegratedServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr=Last 10 Minutes" + "&isAll=ALL&dcName=" + dcString;
      } else {
	      return host + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr=Last 10 Minutes";
	  }
	}
      }
    } else {
      this.graphTime.$appliedTimePeriod = "Last 10 Minutes";
      this.graphTime.$appliedTimePeriod = "Last 10 Minutes";
      let obj = {
        'graphKey': 'Last_10_Minutes',
        'graphTimeLabel': "Last 10 Minutes",
      }
      this.cavConfig.$storeViewParam = obj;
      if(sessionStorage.getItem('activeDC') === "ALL"){
	console.log("inside activeDC from productUI ---------------------- ");
return host + "IntegratedServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr=" + this.graphTime.$appliedTimePeriod+ "&isAll=ALL&dcName=" + dcString;
      } else {
        return host + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr=" + this.graphTime.$appliedTimePeriod;
      }

    }
  }

  getHostIPForMultiDC() {
     let dc = (this.cavConfig.getActiveDC() === 'ALL') ? 'All' : this.cavConfig.getActiveDC();
     let obj = this._dataContainer.$DCsInfo[dc];
   
     if (obj) {
	return `${obj.protocol}//${obj.dataCenterIP}:${obj.dataCenterPort}/`;
     } else {
	return this._config.$getHostUrl;
     }
  }

  /**
   * method to get store data from first request
   */
  getStoreDataFromServer(callback) {
    let appName = this._dataContainer.$selectedGeoApp;
    var url = this.getTimePeriod(this.cavConfig.$storeViewParam);
    if (appName !== '' && appName !== 'All') {
      url = url + '&appName=' + appName;
    }

    if (!this.updateCheckForStoreView['storeFlag']) {
      return;
    } else {
      this.updateCheckForStoreView['storeFlag'] = true;
    }

    try {
      this.requestHandler.getDataFromGetRequest(url, (data) => {
        this.updateCheckForStoreView = { storeFlag: true };
        if (data === null || data.status === 404 || data == [] || data.displayMsg === 'ConnectionRefused') {
          console.error('Data Not Available', 'error');
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          //return;
	  callback('Error');
        }
        if (data.errorCode === 102 || data.errorCode === 101) {
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          //return;
	  callback('Error');
        }
    	if (!data.geoStoreDTO) {
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback('Error');
        }
        this._dataContainer.$storeData = data;
        console.log(this._dataContainer.$storeData);
        callback(data);
      });
    }
    catch (error) {
      console.log('getting error inside getStoreDataFromServer()', error);
    }
  }

  getUpdateDataForGeoMap() {
    try {
      console.log('getUpdateDataForGeoMap called');
      this.emitter.next('GeoMapUpdateAvailable');
    } catch (error) {
      console.log('error in getUpdateDataForGeoMap');
      console.log(error);
    }
  }
  getFilteredData(selectedApp) {
    try {
      console.log('getFilteredData', selectedApp);
      if (selectedApp != "All") {
        this._dataContainer.$tableArr = [];
        for (let x of this._dataContainer.$storeData['geoStoreDTO']['appInfoList']) {
          if (x.appName == selectedApp) {
            console.log('filtered table', x);
            this._dataContainer.$tableArr.push(x);
          }
        }
      }
      else if (selectedApp == "All") {
        this._dataContainer.$tableArr = this._dataContainer.$storeData['geoStoreDTO']['appInfoList'];
        console.log('all data', this._dataContainer.$tableArr);
      }
      this.emitter.next('FilterTable');
    }
    catch (e) {
      console.log('Error in getFilteredData');
      console.log(e);
    }
  }

  getMultiDCsUrl(params) {
    let tempURL = "";
    let saveJsonUrl = "";
    try {
      let selectedDCs = this._dataContainer.$MultiDCsArr && this._dataContainer.$MultiDCsArr.length ? this._dataContainer.$MultiDCsArr : [];
      let nodeServerInfo = this._config.getNodePresetObject(selectedDCs);
      let presetURI = this._config.getNodePresetURL([], nodeServerInfo) + nodeServerInfo.servletName;
      tempURL = presetURI + "/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + nodeServerInfo.testrunNumber;
      tempURL += '&dcName=' + selectedDCs.toString() + '&isAll=' + nodeServerInfo.isALL;
        // for save data
      saveJsonUrl = presetURI + '/RestService/KPIWebService/saveAppTierJson?requestType=geoMap&storeAlertType=' + this._dataContainer.$storeAlertType + '&reqTestRunNum=' + nodeServerInfo.testrunNumber;
      saveJsonUrl += '&dcName=' + selectedDCs.toString() + '&isAll=' + nodeServerInfo.isALL;
        this._dataContainer.$saveAppURL = saveJsonUrl;

      if (params && params['graphKey'] && params['graphTimeLabel']) {
        this._config.$actTimePeriod = params['graphKey'];    // eg: LAST_60_MINUTES
        this._config.$appliedTimePeriodStr = params['graphTimeLabel'];       // eg: Last 1 Hour	
        if (params['graphKey'].trim().startsWith('Last') && (params['graphKey'].trim().endsWith('Minute') || params['graphKey'].trim().endsWith('Minutes'))) {
    	  this.graphTime.$appliedTimePeriod = params['graphTimeLabel'];
          tempURL = tempURL + "&GRAPH_KEY=&appliedTimePeriodStr=" + params['graphTimeLabel'];
          return tempURL;
        } else {
          if (params['graphKey'].startsWith('SPECIFIED') || params['graphKey'].startsWith('Last Week Same') || params['graphKey'].startsWith('Custom D') || params['graphKey'].startsWith('Event D')  || params['graphKey'].startsWith('Yester')) {
	    if (params['graphKey'].startsWith('SPECIFIED') || params['graphKey'].startsWith('Custom D')) {
              this.graphTime.$appliedTimePeriod = "Custom Date";
            } else {
              this.graphTime.$appliedTimePeriod = params['graphKey'];
            }
            let start = "";
            let end = "";
            if (params['graphKey'].startsWith('SPECIFIED')) {
	      start = this.dateFormatter(params['graphTimeLabel'].split("To")[0].trim());
              end = this.dateFormatter(params['graphTimeLabel'].split("To")[1].trim());
            } else {
		start = this.dateFormatter(params['startTime']);
   	        end = this.dateFormatter(params['endTime']);
            }
            tempURL = tempURL + "&GRAPH_KEY=&appliedStartTime=" + start + "&appliedEndTime=" + end + '&appliedTimePeriodStr=Custom Date' + "&appliedEventDay=";
            if (params['appliedEventDay']) {
              tempURL = tempURL + params['appliedEventDay'];
            } 
            return tempURL;
	  } else { 
	  this.graphTime.$appliedTimePeriod = params['graphTimeLabel'];
          tempURL = this._config.$getHostUrl + "DashboardServer/RestService/KPIWebService/storeInfo?requestType=geoMap&storeAlertType=" + this._dataContainer.$storeAlertType + "&reqTestRunNum=" + sessionStorage.getItem('runningtest') + "&GRAPH_KEY=&appliedTimePeriodStr=Last 10 Minutes";
          return tempURL;
        }
      }
      } else {
   this.graphTime.$appliedTimePeriod = "Last 10 Minutes";
        this.graphTime.$appliedTimePeriod = "Last 10 Minutes";
        let obj = {
          'graphKey': 'Last_10_Minutes',
          'graphTimeLabel': "Last 10 Minutes",
        }
        this.cavConfig.$storeViewParam = obj;
    tempURL = tempURL + '&GRAPH_KEY=&appliedTimePeriodStr=Last 10 Minutes';
    return tempURL;
      }
    } catch (error) {
      console.log("error in getMultiDCsUrl");
      console.log(error);
    }
  }

  getMultiDCsData(callback) {
    let appName = this._dataContainer.$selectedGeoApp;
    let url = this.getMultiDCsUrl(this.cavConfig.$storeViewParam);
    this._config.emmitSubscription({message: "CHANGE_GRAPHTIME_LABEL", data: this.graphTime.$appliedTimePeriod});
    if (appName !== '' && appName !== 'All') {
      url = url + '&appName=' + appName;
    }

    if (!this.updateCheckForStoreView['storeFlag']) {
      return;
    } else {
      this.updateCheckForStoreView['storeFlag'] = true;
    }

    try {
      this.requestHandler.getDataFromGetRequest(url, (data) => {
	this.updateCheckForStoreView = { storeFlag: true };
        if (data === null || data.status === 404 || data == [] || data.displayMsg === 'ConnectionRefused') {
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          //return;
	  callback('Error');
        }
        if (data.errorCode === 102 || data.errorCode === 101) {
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          //return;
	  callback('Error');
        }
	if (!data.geoStoreDTO) {
          this.execDashboardCommonKpiDataService.$blockUI = false;
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
          callback('Error');
        }
        this._dataContainer.$storeData = data;
        callback(data);
      });

    } catch (error) {
      console.log('Error in getMultiDCsData ');
      console.log(error);
    }
  }
  
  dcConfigData: any[] = [];
  getDCConfigData(callback) {
    try {
      let url = this._config.getNodePresetURL() + "DashboardServer/RestService/KPIWebService/DCInfo";
      this.requestHandler.getDataFromGetRequest(url, (data) => {
	this.dcConfigData = data;
        if (data === null || data.status === 404 || data == [] || data.displayMsg === 'ConnectionRefused') {
          let msg = 'Data is not available';
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
	  callback(data);
          return;
        }
        this._dataContainer.$DCsInfo = data;
        callback(data);
      });
    } catch (error) {
      console.log('error in getDCConfigData');
      console.log(error);
    }
  }




  getWidgetConfiguration() {
    return this.widgetConf;
  }

  /**Getting Exec-Daahbaoard GraphicalKpi layout data. */
  public getWidgetsLayout(): any {
    return this.widgets;
  }

  public getShowSingleWidget(): boolean {
    return this.showSingleWidget;
  }
  public setShowSingleWidget(value: boolean) {
    this.showSingleWidget = value;
  }
  // isUpdate
  public getIsUpdate(): boolean {
    return this.isUpdate;
  }
  public setIsUpdate(value: boolean) {
    this.isUpdate = value;
  }

  // host
  public gethost(): string {
    return this.host;
  }
  public sethost(value: string) {
    this.host = value;
  }

  // port
  public getport(): string {
    return this.port;
  }
  public setport(value: string) {
    this.port = value;
  }

  // startTime
  public getstartTime(): string {
    return this.startTime;
  }
  public setstartTime(value: string) {
    this.startTime = value;
  }

  // endTime
  public getendTime(): string {
    return this.endTime;
  }
  public setendTime(value: string) {
    this.endTime = value;
  }

  // eventDay
  public geteventDay(): string {
    return this.eventDay;
  }
  public seteventDay(value: string) {
    this.eventDay = value;
  }

  //graphTimeKey
  public getgraphTimeKey(): string {
    return this.graphTimeKey;
  }
  public setgraphTimeKey(value: string) {
    this.graphTimeKey = value;
  }

  //arrLastSampleTime
  public getArrLastSampleTime(): any[] {
    return this.arrLastSampleTime;
  }
  public setArrLastSampleTime(value: any[]) {
    this.arrLastSampleTime = value;
  }

  // updateCheckForDCs
  public getUpdateDCSObject(): {} {
    return this.updateCheckForDCs;
  }
  public setUpdateDCSObject(value: {}) {
    this.updateCheckForDCs = value;
  }

  // maping with DCs 
  public getLastSampleTimeObjOfDCs(): {} {
    return this.lastSampleTimeObjOfDCs;
  }
  public setlastSampleTimeObjOfDCs(value: {}) {
    this.lastSampleTimeObjOfDCs = value;
  }

  public get $isDataAvailable(): any {
    return this.isDataAvailable;
  }

  public set $isDataAvailable(value: any) {
    this.isDataAvailable = value;
  }

  public clearErrorMsgs() {
    this.msgs = [];
  }


  getGraphTimeObject() {
    try {
      let object = this.cavConfig.$storeViewParam? this.cavConfig.$storeViewParam['graphTimeLabel'] : JSON.parse(sessionStorage.getItem('storeViewParam'))['graphTimeLabel'];
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
      // for case of custom time Period or phase or event day.
      else {
        let StartTime;
        let EndTime;
        let tempStartTimeStamp;
        let tempEndTimeStamp;
        // graphTimeLabel is custom (from time Period apply)
        if (tempTime.indexOf("custom") > -1) {
          StartTime = this.cavConfig.$storeViewParam['startTime'];
          EndTime = this.cavConfig.$storeViewParam['endTime'];
          graphTimeObject['startTime'] = this.cavConfig.$storeViewParam['startTime'];
          graphTimeObject['endTime'] = this.cavConfig.$storeViewParam['endTime'];
        }
        // graphTimeLabel is Specified Time ( custom time period from dashboard )
        else{
          let specifiedTime = this.cavConfig.$storeViewParam['graphTimeLabel'];
          let arr = specifiedTime.split("To").length == 2?specifiedTime.split("To"):[this.cavConfig.$storeViewParam['startTime'],this.cavConfig.$storeViewParam['endTime']];
          StartTime = arr[0];
          EndTime = arr[1];
          graphTimeObject['startTime'] = arr[0];
          graphTimeObject['endTime'] = arr[1];
        }
        tempStartTimeStamp = moment.tz(StartTime, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
        tempEndTimeStamp = moment.tz(EndTime, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();

        graphTimeObject['graphTime'] = "SPECIFIED_TIME_" + tempStartTimeStamp + "_" + tempEndTimeStamp;
        // graphTimeObject['graphTimeLabel'] = this._config.$appliedStartTime + " To " + this._config.$appliedEndTime;
        graphTimeObject['graphTimeLabel'] = 'Custom Date';
        graphTimeObject['strSpecialDay'] = (this._config.$appliedEventDay == '' || this._config.$appliedEventDay == undefined) ? "" : this._config.$appliedEventDay;
      }

      return graphTimeObject;
    } catch (error) {
      console.log('error in getGraphTimeObject ');
      console.log(error);
    }

  }

  
   /**
   * method to show message growl 
   * { severity: 'error', summary: 'Error Message', detail: msg }
   */
  showMessageGrowl(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity, summary, detail });
    return;
  }


}//end of File
