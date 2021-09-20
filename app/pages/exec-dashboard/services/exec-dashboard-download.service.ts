import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExecDashboardConfigService } from './exec-dashboard-config.service';
import { ExecDashboardGraphTimeDataservice } from './exec-dashboard-graph-time-data.service';
import { ExecDashboardCommonRequestHandler } from './exec-dashboard-common-request-handler.service';
import { ExecDashboardCommonKPIDataservice } from './exec-dashboard-common-kpi-data.service';
import { MULTIZONE_GRID_HEADER, FIELD_ICONS, ORDER_REVENUE_HEADER, UNZONED_GRID_HEADER, MULTIZONE_SELECTED_ZONE_GRID_HEADER } from '../constants/exec-dashboard-kpi-header-const';
import { ExecDashboardUtil } from '../utils/exec-dashboard-util';

@Injectable()
export class ExecDashboardDownloadService {

  order_header = ['Orders', '', '', '', '', '', '', '', '', ''];
  revenue_header = ['Revenue(USD)', '', '', '', '', '', '', '', '', ''];
  multizone_header = ['Tier Name', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)',
    'Total', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)',
    'Res Time (ms)  (green)', 'Res Time (ms)  (green)', 'Res Time (ms)  (green)', 'Res Time (ms)  (blue)', 'Res Time (ms)  (blue)', 'Res Time (ms)  (blue)', 'CPU(%)       (green)',
    'CPU(%)       (green)', 'CPU(%)       (green)', 'CPU(%)       (blue)', 'CPU(%)       (blue)', 'CPU(%)       (blue)'];
  multizone_green_header = ['Tier Name', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)', 'TPS       (green)',
    'Res Time (ms)  (green)', 'Res Time (ms)  (green)', 'Res Time (ms)  (green)', 'CPU(%)       (green)',
    'CPU(%)       (green)', 'CPU(%)       (green)'];
  multizone_blue_header = ['Tier Name', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)', 'TPS       (blue)',
    'Res Time (ms)  (blue)', 'Res Time (ms)  (blue)', 'Res Time (ms)  (blue)', 'CPU(%)       (blue)',
    'CPU(%)       (blue)', 'CPU(%)       (blue)'];
  singleDC_header = ['Tier Name', 'TPS', 'TPS', 'TPS', 'TPS', 'TPS', 'TPS', 'Res Time(ms)', 'Res Time(ms)',
    'Res Time(ms)', 'CPU Utilization(%)', 'CPU Utilization(%)', 'CPU Utilization(%)'];
  multiZoneGridHeader: any[] = [];
  orderRevenueHeader: any[] = [];

  constructor(public _config: ExecDashboardConfigService, public requestHandler: ExecDashboardCommonRequestHandler, public _http: HttpClient,
    public _graphTime: ExecDashboardGraphTimeDataservice, public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice) { }


  /**
  * For creating order rev data
  */
  getOrderRevenueData = function () {
    try {
      let tempData = this.execDashboardKpiDataService.$kpiDataObj['orderRev'];
      let orderRevObject = [];
      orderRevObject.push(this.orderRevenueHeader);
      orderRevObject.push(this.order_header);
      for (let i = 0; i < tempData.length; i++) {
        let tempObject = [];
        tempObject.push(tempData[i]['updated2Min']);
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['totalKohls']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['webstore']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['totalMobile']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['mcom']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['tablet']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['iphone']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['android']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['kiosk']));
        tempObject.push(this.execDashboardKpiDataService.modifyViewObject(tempData[i]['csc']));
        orderRevObject.push(tempObject);
      }
      orderRevObject.splice(6, 0, this.revenue_header);
      return orderRevObject;
    } catch (error) {
      console.log('error in getOrderRevenueData');
      console.log(error);
    }
  }

  /**
  * For creating empty header table
  */
  getHeaderTable(table_size : number, table_header : string){
    let dc_header = [];
    let Obj = [];
    dc_header[0] = table_header; 
    for(let i = 1; i < table_size; i++){
      dc_header[i] = "";
    }
    Obj.push(dc_header);
    return Obj;
  }

  /**
  * For creating single dc data
  */
  getSingleDCdata = function (viewObject) {
    try {
      let singleDCObject = [];
      let singleDCArr;
      let tablesData = this.execDashboardKpiDataService.$kpiDataObj;
      if (tablesData['grid_' + viewObject['DCs']]) {
        singleDCArr = tablesData['grid_' + viewObject['DCs']];
      }

      for (let i = 0; i < singleDCArr.length; i++) {
        let tempSubData = singleDCArr[i];
        let arr = [];
        for (var j in tempSubData) {
          if (j.startsWith('act') || j.startsWith('icon') || j.startsWith('no') || j.includes('tooltip')) {
            continue;
          }
          if (j.startsWith('tier'))
            arr.push(tempSubData[j]);
          else
            arr.push(this.getColDataForDownload(tempSubData[j]));
        }
        singleDCObject.push(arr);
      }
      singleDCObject.splice(0, 0, this.singleDC_header);

      //to add dc_name in header
      let Obj = this.getHeaderTable(singleDCObject[0].length, viewObject.header);

      //changes for updating header on time period apply

      let gridHeader = UNZONED_GRID_HEADER;
      gridHeader[2] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
      gridHeader[4] = this.getTimeBasedHeader(this._config.$actTimePeriod, true);
      gridHeader[8] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
      gridHeader[11] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);

      singleDCObject.splice(1, 0, UNZONED_GRID_HEADER);


      // to add dc_header in the table
      let table_data = [];
      table_data.push(Obj);
      table_data.push(singleDCObject);
      return table_data;
    } catch (error) {
      console.log('error in getSingleDCdata');
      console.log(error);
    }
  }

  /**
  * Creating key val pair of row data
  */
  getValueForKeys = function (arrOfTiers, zone: string) {
    try {
      let tempData = arrOfTiers;
      let result = [];
      for (let i = 0; i < tempData.length; i++) {
        let tempSubData = tempData[i];
        let arr = [];
        for (var j in tempSubData) {
          if (j.startsWith('act') || j.startsWith('icon') || j.startsWith('no') ) {
            continue;
          }
          if (zone == 'green') {
            if (j.includes(zone) || j.includes('tier')) {
              arr.push(tempSubData[j]);
            }
          }
          else if (zone == 'blue') {
            if (j.includes(zone) || j.includes('tier')) {
              arr.push(tempSubData[j]);
            }
          }
          else {
            arr.push(tempSubData[j]);
          }
        }
        result.push(arr);
      }
      return result;
    } catch (error) {
      console.log('error in getValueForKeys');
      console.log(error);
    }
  }

  /** modifyHeader
   * dcsObject gives all DCs information 
   */
  modifyHeader = function (dcsObject) {
    try {
      let arr = dcsObject['DCs'].split('_');
      let newheader;
      let selected_zone = sessionStorage.getItem(dcsObject['header'] + '_selectedZone');
      if (selected_zone == 'green') {
        newheader = [...this.multizone_green_header];
      }
      else if (selected_zone == 'blue') {
        newheader = [...this.multizone_blue_header];
      }
      else {
        newheader = [...this.multizone_header];
      }

      // TPS
      // newheader[4] = (newheader[4].indexOf(arr[0]) != -1) ? newheader[4] : newheader[4] + ' ' + arr[0];
      // newheader[11] = (newheader[11].indexOf(arr[0]) != -1) ? newheader[11] : newheader[11] + ' ' + arr[0] ? arr[0] : '';
      // // Res Time      
      // newheader[15] = (newheader[15].indexOf(arr[0]) != -1) ? newheader[15] : newheader[15] + ' ' + arr[0];
      // newheader[18] = (newheader[18].indexOf(arr[0]) != -1) ? newheader[18] : newheader[18] + ' ' + arr[0] ? arr[0] : '';
      // // CPU      
      // newheader[21] = (newheader[21].indexOf(arr[0]) != -1) ? newheader[21] : newheader[21] + ' ' + arr[0];
      // newheader[24] = (newheader[24].indexOf(arr[0]) != -1) ? newheader[24] : newheader[24] + ' ' + arr[0] ? arr[0] : '';
      return newheader;

    } catch (error) {
      console.log('error in modifyHeader');
      console.log(error);
    }
  }

  /**
  * For creating multi zone data
  */
  getMultiZoneData = function (viewObject) {
    try {
      let multiZoneData;
      let tablesData = this.execDashboardKpiDataService.$kpiDataObj;
      let selected_zone = sessionStorage.getItem(viewObject['header'] + '_selectedZone');
      if (tablesData['grid_' + viewObject['DCs']]) {
        let a = this.getValueForKeys(tablesData['grid_' + viewObject['DCs']], selected_zone);
        multiZoneData = a;
      }

      let header = this.modifyHeader(viewObject);
      multiZoneData.splice(0, 0, header);
      
      //to add dc_name in header
      let Obj = this.getHeaderTable(multiZoneData[0].length, viewObject.header);

      if (selected_zone == 'all' || selected_zone == null) { //selected zone is null when no zone is selected(by default null)
        //changes for updating header in report on applying time period
        this.multiZoneGridHeader[2] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[4] = this.getTimeBasedHeader(this._config.$actTimePeriod, true);
        this.multiZoneGridHeader[12] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[14] = this.getTimeBasedHeader(this._config.$actTimePeriod, true);
        this.multiZoneGridHeader[21] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[24] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[27] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[30] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
      }
      else {
        //changes for updating header in report on applying time period when a particular zone is selected
        this.multiZoneGridHeader[2] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[4] = this.getTimeBasedHeader(this._config.$actTimePeriod, true);
        this.multiZoneGridHeader[11] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
        this.multiZoneGridHeader[14] = this.getTimeBasedHeader(this._config.$actTimePeriod, false);
      }

      multiZoneData.splice(1, 0, this.multiZoneGridHeader);

      for (let i = 2; i < multiZoneData.length; i++) {
        for (let j = 1; j < multiZoneData[i].length; j++) {
          let d;
          if (selected_zone == 'all' || selected_zone==null) {
            if (j > 19 && j < 26) {
              d = this.getColDataForDownload(multiZoneData[i][j]*1000);
            }
            else{
              d = this.getColDataForDownload(multiZoneData[i][j]);
            }
          }
          else {
            if (j > 9 && j < 13) {
              d = this.getColDataForDownload(multiZoneData[i][j]*1000);
            }
            else{
              d = this.getColDataForDownload(multiZoneData[i][j]);
            }
          }
          multiZoneData[i][j] = d;
        }
      }

      // to add dc_header in the table
      let table_data = [];
      table_data.push(Obj);
      table_data.push(multiZoneData);
      return table_data;
    } catch (error) {
      console.log('error in getMultiZoneData');
      console.log(error);
    }
  }

  /**
  * Function called on download click
  */
  onDownload = function (fileType) {
    try {
      console.clear();
      //  for multi DCs header
      this.multiZoneGridHeader = [];
      let selected_zone = sessionStorage.getItem('MOSAIC-CENTRAL_selectedZone');

      if (selected_zone == 'all' || selected_zone==null) {
        this.multiZoneGridHeader = Object.assign([], MULTIZONE_GRID_HEADER);
      }
      else {
        this.multiZoneGridHeader = Object.assign([], MULTIZONE_SELECTED_ZONE_GRID_HEADER);
      }
      this.multiZoneGridHeader.unshift('');

      //  for order revenue header
      this.orderRevenueHeader = [];
      this.orderRevenueHeader = Object.assign([], ORDER_REVENUE_HEADER);
      this.orderRevenueHeader.unshift('Order/Revenue');

      let tablesData = this.execDashboardKpiDataService.$kpiDataObj;
      let orderRevObject = []; // order revenue object 
      let response = {}; // main respose
      let data = []; //  main jsonData.
      let tempKpiViewJson = this.execDashboardKpiDataService.kpiTableGroup;

      if (this.execDashboardKpiDataService.enableOrdRev) {
        orderRevObject = this.getOrderRevenueData();
        data.push(orderRevObject);
      }

      // looping on kpiViewInfoList list.
      let table = [];
      for (let i = 0; i < tempKpiViewJson.length; i++) {
        if (tempKpiViewJson[i]['type'] === 'multiZone' || tempKpiViewJson[i]['type'] === 'multiDC') {
          table = this.getMultiZoneData(tempKpiViewJson[i]);
          data.push(table[0]);
          data.push(table[1]);
        }
        if (tempKpiViewJson[i]['type'] === 'singleDC') {
          table = this.getSingleDCdata(tempKpiViewJson[i]);
          data.push(table[0]);
          data.push(table[1]);
        }
        if (tempKpiViewJson[i]['type'] === 'Stats') {
          table = this.getStatsTypeData(tempKpiViewJson[i]);
          data.push(table[0]);
          data.push(table[1]);
        }
      }
      let timePeriod: string = this._config.$appliedTimePeriodStr;
      if (this._config.$appliedTimePeriodStr === 'Yesterday' || this._config.$appliedTimePeriodStr === 'Custom Date')
        timePeriod = `${this._config.$appliedStartTime} To ${this._config.$appliedEndTime}`;
      else if (this._config.$appliedTimePeriodStr === 'Event Day' || this._config.$appliedTimePeriodStr === 'Last Week Same Day')
        timePeriod = this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev;

      this.commonDownload(fileType, 'Last Sample Time: ' + this.execDashboardKpiDataService.$sampleTime + " Applied Time: " + timePeriod, 'KPIReport_', this.renameArray, data, 'Executive Dashboard- KPI');
    } catch (error) {
      console.log('error in download');
      console.log(error);
    }
  }
  //method to provide header based on time period
  getTimeBasedHeader(_actualTimePeriodStr, isInstancePerSec) {
    try {
      if (_actualTimePeriodStr === 'Last_60_Minutes' || _actualTimePeriodStr === 'last_day') {
        return isInstancePerSec ? 'Last 1 Hr/VM' : 'Last 1 Hr';
      }
      else if (_actualTimePeriodStr === 'Last_120_Minutes') {
        return isInstancePerSec ? 'Last 2 Hrs/VM' : 'Last 2 Hrs';
      }
      else if (_actualTimePeriodStr === 'Last_240_Minutes') {
        return isInstancePerSec ? 'Last 4 Hrs/VM' : 'Last 4 Hrs';
      }
      else if (_actualTimePeriodStr === 'Last_360_Minutes') {
        return isInstancePerSec ? 'Last 6 Hrs/VM' : 'Last 6 Hrs';
      }
      else if (_actualTimePeriodStr === 'Last_480_Minutes') {
        return isInstancePerSec ? 'Last 8 Hrs/VM' : 'Last 8 Hrs';
      }
      else if (_actualTimePeriodStr === 'Last_720_Minutes') {
        return isInstancePerSec ? 'Last 12 Hrs/VM' : 'Last 12 Hrs';
      }
      else if (_actualTimePeriodStr === 'Last_1440_Minutes') {
        return isInstancePerSec ? 'Last 24 Hrs/VM' : 'Last 24 Hrs';
      }
      else if (_actualTimePeriodStr === 'Yesterday' || _actualTimePeriodStr === 'Event Day' || _actualTimePeriodStr === 'Last Week Same Day' || _actualTimePeriodStr === 'Custom Date') {
        return isInstancePerSec ? 'Average/VM' : 'Average';
      }
      else {
        return isInstancePerSec ? 'Last 1 Hr/VM' : 'Last 1 Hr';
      }
    }
    catch (error) {
      console.log('getting error inside getTimeBasedHeader() in KPI', error);
    }
  }

  getStatsTypeData(viewObject) {
    try {
      let dataObject = [];
      let tempHeader = [];
      let tempHeaderList = {};
      let finalData = [];
      dataObject = this.execDashboardKpiDataService.$kpiDataObj['grid_' + viewObject.header];
      tempHeaderList = this.execDashboardKpiDataService.kpiHeader[viewObject['headerType']];
      for (var key in tempHeaderList) {
        if (tempHeaderList.hasOwnProperty(key)) {
          tempHeader.push(key)
        }
      }

      //to add dc_name in header
      let Obj = this.getHeaderTable(tempHeader.length, viewObject.header);

      finalData.push(tempHeader);

      if (!dataObject) {
        return finalData;
      }
      dataObject.forEach(element => {
        let tempRow = [];
        for (var key in element) {
          if (element.hasOwnProperty(key)) {
            if (isNaN(parseFloat(element[key]))) {
              tempRow.push(element[key]);
            }
            else
              tempRow.push(this.getColDataForDownload(element[key]));
          }
        }
        finalData.push(tempRow)
      });

       // to add dc_header in the table
      let table_data = [];
      table_data.push(Obj);
      table_data.push(finalData);
      return table_data;
    } catch (error) {
      console.log("error in getStatsTypeData");
      console.log(error);
    }
  }

  /**
	 * method for all other than stats type. 
	 */
  getColDataForDownload(data) {
    // console.log("getColDataForOthers ---> ", data, typeof data);
    // return ExecDashboardUtil.numberToCommaSeperate(parseInt(value));
    if (typeof (data) === "string" && data.indexOf("/") !== -1) {
      let arr = data.split('/');
      let newValue = '';
      for (let index = 0; index < arr.length; index++) {
        let element = arr[index];
        if (element === 'undefined' || element === 'null')
          element = undefined;
        if (element != null) {
          if (index === 0) {
            newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element)) + '/';
          }
          else {
            newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element));
          }
        }
      }
      if (!newValue || newValue === '' || parseFloat(newValue) < 0)
        newValue = "-"
      return newValue;
    }
    else if((typeof (data) === "string" && data.indexOf("/") == -1)){
      return data;
    }

    if (parseFloat(data) > 0) {
      // for case of value less than 1;
      if (parseFloat(data) < 1) {
        return "< 1";
      }
      else {
        // tempObject[element] = Math.round(rowData[element] * 1000) / 1000;
        // return ExecDashboardUtil.numberToCommaSeperate(data);
        return ExecDashboardUtil.numberToCommaSeperate(Math.round(data));
      }
    }
    else if (data == 0) {
      //  for case of 0;
      return '0'
    } else {
      return '-'
    }
  }
  /**
   *In this method we create data to be posted on the server to download the file.
   * we add file type, other info in var filterCriteria, file name in strSrcFileName,
   * table data in [
   *                 [
   *                  [tableheaders],
   *                  ...[table data array]
   *                 ]
   *                ]
   * fileHeader in response['header']
   * @param downloadType 
   * @param varFilterCriteria 
   * @param strSrcFileName 
   * @param renameArray 
   * @param jsonData 
   * @param header 
   */
  commonDownload(downloadType, varFilterCriteria, strSrcFileName, renameArray, jsonData, header, host?) {
    try {
      let response = {};
      response['downloadType'] = downloadType;
      response['varFilterCriteria'] = varFilterCriteria;
      response['strSrcFileName'] = strSrcFileName;
      response['renameArray'] = renameArray;
      response['jsonData'] = jsonData;
      response['header'] = header;
      host = host ? host : this._config.$getHostUrl;
      let URL = this._config.getNodePresetURL() + 'DashboardServer/RestService/KPIWebService/KPIDownloadData';
      this._http.post(URL, response, { responseType: 'text' }).pipe(res =><any> res)
        .subscribe(res => {
          let path = res.toString().trim();
          if (path.startsWith("\"")) {
            path = path.toString().trim().slice(1,-1);
          }
          path = this._config.$getHostUrl + 'common/' + path;
          window.open(path);
        });
    }
    catch (e) {
      console.log('Getting error inside ExecDashboardDownloadDataService commonDownload()', e);
    }
  }
} // end of file
