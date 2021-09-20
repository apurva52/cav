import { ChartPlotOptions, PlotOptions, Dial, Pivot } from './../containers/chart-plot-options';
import { PaneOptions } from './../containers/pane-Options';
import { ChartOptions } from './../containers/chart-options';
import { ChartyAxis } from './../containers/charty-axis';
import { Chart, Series } from './../containers/chart';
import { ExecDashboardDataContainerService } from './exec-dashboard-data-container.service';
import { Injectable } from '@angular/core';
import { Highcharts } from '../constants/common-constants';
import * as highcharts from 'highcharts/highcharts.src';
import { ExecDashboardUtil } from './../utils/exec-dashboard-util';
import { HighchartMore } from '../constants/common-constants';
import {
  HighchartBoostCanvas, HighchartBoost, HighchartNoDataToDisplay,
  HighchartData, HighchartExport, HighchartExportOffline
} from
  '../constants/common-constants';
import { ChartType } from '../constants/chart-type.enum';
import { ExecDashboardPanelData } from '../interfaces/exec-dashboard-panel-data';

import { USAJSONMAP } from '../containers/usaMapJsonData';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import * as moment from 'moment';
// import * as jQuery from 'jquery';
import 'moment-timezone';

/*Adding Highchart More dependency Here. */
HighchartMore(highcharts);
HighchartData(highcharts);
HighchartBoostCanvas(highcharts);
//HighchartBoost(highcharts);
HighchartNoDataToDisplay(highcharts);
HighchartExport(highcharts);
HighchartExportOffline(highcharts);

/*Import highmap js */
// Highmap(highcharts);

/*Import Exporting js*/
HighchartExport(highcharts);


@Injectable()
export class ExecDashboardChartProviderService {
  className: string = "ExecDashboardChartProviderService";
  chartArr: any[] = [];
  alertChart:any;

  /*Defining Highcharts global. */
  Highcharts: any;

  constructor(public _dataContainerService: ExecDashboardDataContainerService
    ) {
    /* Assigning to current service. */
    this.Highcharts = Highcharts;
    /*Apply code for tooltip delay. */
    this.HighchartTooltipDelay(this.Highcharts);
  }

  private static subject = new Subject<any>();


  /**Method is used for delay in tooltip upto specified seconds. */
  HighchartTooltipDelay(H) {
    try {
      let timerId = {};
      H.wrap(H.Tooltip.prototype, 'refresh', function (proceed) {
        if (this.shared) {
          proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
          let seriesName;
          if (Array.isArray(arguments[1])) {
            /*Can be array in case that, it's shared tooltip.*/
            seriesName = 'not_have_now_clear_id';
          } else {
            seriesName = arguments[1].series.name;
          }
          let delayForDisplay = this.chart.options.tooltip.delayForDisplay ? this.chart.options.tooltip.delayForDisplay : 1000;

          if (timerId[seriesName]) {
            clearTimeout(timerId[seriesName]);
            delete timerId[seriesName];
          }

          timerId[seriesName] = window.setTimeout(function () {
            let point = this.refreshArguments[0];
            if (point === this.chart.hoverPoint || jQuery.inArray(this.chart.hoverPoint, point) > -1) {
              proceed.apply(this.tooltip, this.refreshArguments);
            }

          }.bind({
            refreshArguments: Array.prototype.slice.call(arguments, 1),
            chart: this.chart,
            tooltip: this
          }), delayForDisplay);
        }
      });
    } catch (e) {
      console.log('Error while applying tooltip delay in highchart object.', e);
    }
  }

  static xAxisLabel(timestamp, panelNumber, plannedPanel, ordersPanel) {
    try {
      let seconds = Math.trunc((timestamp / 1000) % 60);
      let minutes = Math.trunc((timestamp / (1000 * 60)) % 60);
      let hours = Math.trunc(timestamp / (1000 * 60 * 60));
      let getHour = (hours < 10) ? ('0' + hours) : hours;
      let getMinute = (minutes < 10) ? ('0' + minutes) : minutes;
      let getSecond = (seconds < 10) ? ('0' + seconds) : seconds;
      let totalColumns = 3; // TODO: make a getter setter to get the value
      let checkValue = panelNumber % totalColumns;
      if (checkValue == plannedPanel || checkValue == ordersPanel)
        return moment.tz(timestamp, sessionStorage.getItem('timeZoneId')).format('HH');
      else
        return moment.tz(timestamp, sessionStorage.getItem('timeZoneId')).format('HH:mm');
    } catch (error) {
      console.log('Error in xAxisLabel', error);
    }
  }



  static yAxisFormat(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

      ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
      // Six Zeroes for Millions
      : Math.abs(Number(labelValue)) >= 1.0e+6

        ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3

          ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

          : Math.abs(Number(labelValue));
  }

  static tooltipFormatter(title, name, xValue, yValue) {
    let tempYValue = Math.round(yValue)
    if (tempYValue > 0)
      tempYValue = ExecDashboardUtil.numberFormatWithDecimal(tempYValue, 0);
    if (title.indexOf('ms') !== -1) {
      return '<br> ' + moment.tz(xValue, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm') + '<br>' + tempYValue + ' (ms)' + '';
    }
    else if (title.toLowerCase().indexOf('pvs') !== -1) {
      return '<br> ' + moment.tz(xValue, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm') + '<br>' + tempYValue;
    }
    else if (title.toLowerCase().indexOf('cpu') !== -1) {
      return '<br> ' + moment.tz(xValue, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm') + '<br>' + tempYValue + ' (%)';
    }
    else if (title.toLowerCase().indexOf('revenue') !== -1) {
      return '<br> ' + moment.tz(xValue, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm') + '<br>' + '$ ' + tempYValue;
    }
    else {
      return '<br> ' + moment.tz(xValue, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm') + '<br>' + tempYValue;
    }
  }

  /* Method is used for getting chart based on chart type. */
  getChartObjectByChartType(chartType: number, favoriteData, panelNumber: number,
    panelData: ExecDashboardPanelData) {
    try {
      let chartObject;
      let orderRevDCs = this._dataContainerService.getOrderRevDCs();
      let FavDC = favoriteData.dcName;
      if (orderRevDCs.indexOf(FavDC) == -1 && (this._dataContainerService.getOrderRevPanel().includes(panelNumber) || panelNumber == this._dataContainerService.getPlannedPanel() || panelNumber == this._dataContainerService.getPlannedOrderPanel())) {
        this._dataContainerService.$panelGraphData[panelNumber] = null;
        return null;
      }

      /* Checking for Chart Type. */

      /**
       * For line stacked Bar
       */
      if (chartType === ChartType.LINE_STACKED || panelNumber == this._dataContainerService.getPlannedPanel() || panelNumber == this._dataContainerService.getPlannedOrderPanel()) {
        chartObject = this.getLineChart(chartType, favoriteData, panelNumber, panelData);
        for (let index = 0; index < chartObject.series.length; index++) {
          if (index == 0) {
            chartObject.series[index].type = "column";
          }
          else
            chartObject.series[index].type = "line";

        }
      }
      else if (chartType == ChartType.DIAL_CHART || this._dataContainerService.getOrderRevPanel().includes(panelNumber)) {
        /**creating data for dial chart
           * we had to create the data for dial seperately as we were creating 2 dial on the same panel
           * here we are iterating on the 2 graphs from current 'panel data' and creating two chart.
           * we are setting this array of series in datacontainer service.
           */
        chartObject = [];
        let dialArr = [];
        for (let i = 0; i < favoriteData.panelData[panelNumber].panelGraphs.length; i++) {
          chartObject.push(this.getDialChart(favoriteData, panelNumber, panelData, i));
          dialArr.push(chartObject[i]);
        }
        this._dataContainerService.setdialChartArr(dialArr, true);
      }
      else if (chartType == ChartType.LINE_CHART) {
        chartObject = this.getLineChart(chartType, favoriteData, panelNumber, panelData);
      } else {
        chartObject = this.getLineChart(chartType, favoriteData, panelNumber, panelData);
      }

      this._dataContainerService.$panelGraphData[panelNumber] = chartObject;
      return chartObject;
    } catch (e) {
      console.error('Error while creating chart object.', e);
      return null;
    }
  }
  getLineChart = function (chartType, favoriteData, panelNumber, panelData) {
    try {
      let labelForYaxis = ' ';
      let tickInterval = null;
      let plannedPanel = this._dataContainerService.getPlannedPanel();
      let ordersPanel = this._dataContainerService.getPlannedOrderPanel();
      let title = favoriteData.panelData[panelNumber].panelCaption;
      if (chartType == ChartType.LINE_STACKED) {
        tickInterval = 3600 * 1000;
      }
      let totalColumns = 3; // TODO: make a getter setter to get the value
      let checkValue = panelNumber % totalColumns;
      if (checkValue == plannedPanel) {
        labelForYaxis = '$';
      }
      return {
        chart: {
          spacingBottom: 15,
          /**
           * working on zoom and its button alignment
           */
          backgroundColor: null,
          zoomType: 'x',
          type: 'spline',
          resetZoomButton: {
            position: {
              verticalAlign: 'top', // by default
              x: 0,
              y: -38
            },
            theme: {
              display: true,
              zIndex: 0,
              fill: 'white',
              stroke: 'silver',
              r: 20,
              states: {
                hover: {
                  fill: '#41739D',
                  style: {
                    color: 'white'
                  }
                }
              }
            }
          },
          height: (50) + '%',
          width: 430,
        },
        title: {
          text: title,
          style: { "fontSize": "12px" },
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: 12
        },
        xAxis: {
          type: 'datetime',
          tickInterval: tickInterval,
          labels: {
            formatter: function () {
              let val = ExecDashboardChartProviderService.xAxisLabel(this.value, panelNumber, plannedPanel, ordersPanel);
              return val;
            }
          },
        },
        plotOptions: {
          line: {
            animation: false
          },
          series: {
            marker: {
              radius: 3, // to increase or decrease size of marker/ dots default:4
              enabled: true   //  to disable dots in line series.
            }
          }
        },
        credits: {
          enabled: false
        },
        //tooltip formatter
        tooltip: {
          formatter: function () {
            return ExecDashboardChartProviderService.tooltipFormatter(title, this.series.userOptions['name'], this.x, this.y);
          },
          backgroundColor: {
            linearGradient: [0, 0, 0, 60],
            stops: [
              [0, '#FFFFFF'],
              [1, '#E0E0E0']
            ]
          },
          borderWidth: 1,
          borderRadius: 10,
          padding: 4,
          style: {
            fontSize: '11px'
          }
        },
        yAxis: {

          labels: {
            formatter: function () {
              let val = ExecDashboardChartProviderService.yAxisFormat(this.value);
              return labelForYaxis + val;
            }
          },
          title: {
            text: ''
          }
        },
        exporting: { enabled: false },
        series: this.getSeriesData(favoriteData, panelNumber, chartType, panelData),
      }

    } catch (error) {
      console.log("inside getLineChart>>>>>>>>>>>>>>>>>>.", error);
    }
  }
  getDialChart = function (favoriteData, panelNumber, panelData, graphIndex) {
    try {
    let dialChartInfo = this.getDataSetForDialType(favoriteData, panelNumber, graphIndex);
    let data = new Array();
    data.push(dialChartInfo);

    let minimum = dialChartInfo[0];
    let warning = dialChartInfo[1];
    let critical = dialChartInfo[2];
    let maximum = dialChartInfo[3];
    let value = dialChartInfo[4]
    let title = dialChartInfo[5];
    let credit = false;
    let dcCenterPosition = ['50%', '50%'];
    if (title.toLowerCase().indexOf('revenue') !== -1) {
      // dcCenterPosition = ['60%', '50%'];
    } else {
      // dcCenterPosition = ['40%', '50%'];
    }
    let axisValue = '';

    let tempAxisValue = this.getMergeDataForDial(favoriteData, panelNumber, graphIndex);
    tempAxisValue = Math.trunc(tempAxisValue);
    maximum = this.updateRange(maximum, tempAxisValue);

    axisValue = this.numberToCommaSeperate(tempAxisValue);

      axisValue = (title.toLowerCase().indexOf('revenue') !== -1) ? '$' + axisValue: axisValue;
      
    /**
     * creating and returning the chart object.
     */
    return {
      chart: {
        height: (98) + '%',
        backgroundColor: null,
        width: 220, // width can only be set in pixels.
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: ''
      },
      exporting: { enabled: false },
      credits: {
        enabled: credit
      },
      pane: {
        startAngle: -140,
        endAngle: 140,
        size: '100%',
        background: [
          {
            backgroundColor: null,
            borderWidth: 1,
            outerRadius: '65%',
            innerRadius: '65%'
          }]
      },

      // the value axis
      yAxis: {
        min: minimum,
        max: maximum,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 0,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#FFF',
        labels: {
          step: 2,
          formatter: function () {
            if (this.value >= 1000000)
              return this.value.toFixed(0) / 1000000 + "M";
            else if (this.value >= 1000)
              return this.value.toFixed(0) / 1000 + "k";
            else
              return this.value;
          },
          rotation: 'auto',
          style: { "fontWeight": 'normal', "fontSize": "10px", "fontFamily": "'Roboto', sans-serif" }
        },
        title: {
          text: title,
            y: 10,
            style: { "fontSize": "9px", "margin": "10px", "transform": "translate(0px, 61%)"},
        },
        plotBands: [{
          from: minimum,
          to: warning,
          color: '#f55e5e' // red
        }, {
          from: warning,
          to: critical,
          color: '#ffc247' // yellow
        }, {
          from: critical,
          to: maximum,
          color: '#3abf94'// green
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + title + '</b><br>' + axisValue;
        }
      },
      series: [{
        name: title,
        data: [value],
        dataLabels: {
          format: '<span>' + axisValue + '</span>',
          style: { "fontSize": "11px", "fontFamily": "'Roboto', sans-serif" },
          borderRadius: 5,
          borderWidth: 0,
            y: 20
        }
      }]

    }
    } catch(error) {
      console.log('Error in getDialChart', error)
    }
  }


  /**
   * to get the series of graph
   */
  getSeriesData = function (favoriteData, panelNumber, chartType, panelData) {
    try {
      let noOfGraphs = favoriteData.panelData[panelNumber].panelGraphs.length;
      let arrTimeStamp: [any];
      let tempFavoriteData;
      let type = chartType;

      let plannedPanel = this._dataContainerService.getPlannedPanel();
      let ordersPanel = this._dataContainerService.getPlannedOrderPanel();
      let dcConfig = this._dataContainerService.getGraphicalKPIDcInfo();
      /**
       * getting chart type for series
       */
      let series = [];
      let seriesData;
      let totalColumns = 3; // TODO: make a getter setter to get the value
      let checkValue = panelNumber % totalColumns;
      for (let j = 0; j < noOfGraphs; j++) {
        if (favoriteData.panelData[panelNumber].hasOwnProperty("arrTimeStamp") && favoriteData.panelData[panelNumber]['arrTimeStamp'].length > 0) {
          arrTimeStamp = favoriteData.panelData[panelNumber].arrTimeStamp;
        }
        else {
          arrTimeStamp = favoriteData.arrTimestamp;
        }
        if ((checkValue == plannedPanel || checkValue == ordersPanel) && j == 1) {
          arrTimeStamp = this.getTimeStampArrayForOrderRevenue(favoriteData, panelNumber, chartType, panelData);
        }
        tempFavoriteData = favoriteData
        let data = []
        if (!tempFavoriteData.panelData[panelNumber].panelGraphs[j] || tempFavoriteData.panelData[panelNumber].panelGraphs[0]['graphData'] == null || tempFavoriteData.panelData[panelNumber].panelGraphs[0]['graphData'] == undefined) {
          continue;
        }

        if (checkValue == plannedPanel || checkValue == ordersPanel) {
          seriesData = this.getMergedDCsData(arrTimeStamp, favoriteData, j, panelNumber);
        }


        for (let i = 0; i < arrTimeStamp.length; i++) {

          let sampleValue
          if (checkValue == plannedPanel || checkValue == ordersPanel) {
            sampleValue = seriesData[i];
          }
          else {
            sampleValue = tempFavoriteData.panelData[panelNumber].panelGraphs[j]['graphData'][i];
          }

          let currentTimeStamp = arrTimeStamp[i];
          if (sampleValue < 0 || sampleValue === undefined || sampleValue === null) {
            sampleValue = null;
          }
          if (currentTimeStamp <= 0) {
            currentTimeStamp = null;
          }
          if (sampleValue !== null)
            sampleValue = parseFloat(sampleValue.toFixed(3));

          if (currentTimeStamp === null && sampleValue === null) {
          } else {
            data.push([currentTimeStamp, sampleValue]);
          }
        }
        series.push({ 'name': tempFavoriteData.panelData[panelNumber].panelGraphs[j].graphName, 'type': type, 'data': data })
      }
      return series
    }
    catch (error) {
      console.log("error in getSeries Data", error);
    }
  };

  /**
     * Get data set for dial chart type.
     */
  getDataSetForDialType(favData, panelNumber: number, graphIndex): Array<any> {
    try {
      /* Getting Data of Panel. */

      let panelData = favData.panelData[panelNumber];
      /*Getting chart type.*/
      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;
      let graphInfo = panelGraphs[graphIndex];
      /*Number of graphs*/
      let dialGraphExp = graphInfo.dialGraphExp;

      let arr, minimum, maximum, threshold, warning, critical;
      let data = new Array();

      if (dialGraphExp != null) {
        arr = dialGraphExp.split('_');
        minimum = parseFloat(arr[0]);
        warning = parseFloat(arr[1]);
        critical = parseFloat(arr[2]);
        maximum = parseFloat(arr[3]);
      }
      else {
        arr = this._dataContainerService.getExecDashboardFavoriteData()[this._dataContainerService.getOrderRevDCs()].panelData[1].panelGraphs[0].dialGraphExp.split('_');
        minimum = parseFloat(arr[0]);
        warning = parseFloat(arr[1]);
        critical = parseFloat(arr[2]);
        maximum = parseFloat(arr[3]);
      }
      let title = graphInfo.graphName;
      let value = graphInfo.lastSample;
      value = parseFloat(this.getValueWithoutDecimal(value, 0));
      minimum = parseFloat(this.getValueWithoutDecimal(minimum, 2));
      maximum = parseFloat(this.getValueWithoutDecimal(maximum, 2));
      critical = parseFloat(this.getValueWithoutDecimal(critical, 2));
      warning = parseFloat(this.getValueWithoutDecimal(warning, 2));

      data.push(minimum);//1
      data.push(warning);//4
      data.push(critical);//5
      data.push(maximum);//2
      data.push(value); // 0

      data.push(title); //7
      return data;
    } catch (e) {
      console.error('error while creating dial chart data.', e);
    }
  }
  /*This method is mainly used for Meter and Dial chart.
  * It returns the value without comma, as Dial and Meter chart
  * automatically applies the comma.
  */
  getValueWithoutDecimal(value, uptoDecimal) {
    try {
      let aDigits = value.toFixed(uptoDecimal).split('.');
      if (aDigits[0] <= 10) {
        return value.toFixed(uptoDecimal);
      } else {
        return aDigits[0];
      }
    } catch (e) {
      console.error('Getting Error in getValueWithoutDecimal()', e);
    }
  }
  /*
   * number format with comma seperate values
   */
  numberToCommaSeperate(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * get arrTimeStampForOrderRevenue
   */
  getTimeStampArrayForOrderRevenue = function (favoriteData, panelNumber, chartType, panelData) {
    try {
      let tempTimeStampArray = favoriteData.panelData[panelNumber].arrTimeStamp;
      let newTimeStampArray: Array<any> = [];
      if (tempTimeStampArray.length > 0) {
        let initialTimeStampValue = tempTimeStampArray[0];

        let initialTime = moment(initialTimeStampValue).utcOffset(0);
        let newTime = initialTime.clone().tz(this._dataContainerService.getTimeZone());

        newTime = newTime.startOf('date');

        let newTimeStampValue = newTime.utc().valueOf();
        newTimeStampArray.push(newTimeStampValue + 3600000);
        for (var index = 1; index < tempTimeStampArray.length; index++) {
          var element = newTimeStampArray[index - 1] + 3600000;
          newTimeStampArray.push(element);
        }
      }
      return newTimeStampArray;
    } catch (error) {
      console.log('Error in getTimeStampArrayForOrderRevenue ', error);
    }
  }

  getMergedDCsData(firstDCArrayTimeStamp, firstDCFavorite, graphNo, pNo) {
    try {
      let firstDcDataArray = firstDCFavorite.panelData[pNo].panelGraphs[graphNo].graphData;
      let arrFavData = this._dataContainerService.getExecDashboardFavoriteData();
      let secondDCFavData; // = this._dataContainerService.getExecDashboardFavoriteData();
      let orderRevDCs = this._dataContainerService.getOrderRevDCs();
      let DCArr = orderRevDCs.split(',');
      for (let i in DCArr) {
        if (DCArr[i] !== firstDCFavorite.dcName) {
          secondDCFavData = arrFavData[DCArr[i]];
        }
      }
      if (secondDCFavData === null || secondDCFavData === undefined) {
        return firstDcDataArray;
      }
      let secondDCsArrTimeStamp = secondDCFavData.panelData[pNo].arrTimeStamp;
      if (!secondDCFavData.panelData[pNo].hasOwnProperty('panelGraphs') || !secondDCFavData.panelData[pNo].panelGraphs[graphNo].hasOwnProperty('graphData')) {
        return firstDcDataArray;
      }
      let SecondDcDataArray = secondDCFavData.panelData[pNo].panelGraphs[graphNo].graphData;
      let finalOrdRevDataArray;
      // get first dc data array;
      for (let i = 0; i < firstDCArrayTimeStamp.length; i++) {
        let firstDCTime = moment(firstDCArrayTimeStamp[i]).utcOffset(0);
        for (let j = 0; j < secondDCsArrTimeStamp.length; j++) {
          let secondDCTime = moment(secondDCsArrTimeStamp[j]).utcOffset(0);
          if (firstDCTime.utc().hours() === secondDCTime.utc().hours()) {
            let firstDCSample;
            let secondDCSample;
            if (firstDcDataArray[i] < 0 || firstDcDataArray[i] === undefined || firstDcDataArray[i] === null) {
              firstDCSample = null;
            }
            else {
              firstDCSample = firstDcDataArray[i];
            }
            if (SecondDcDataArray[j] < 0 || SecondDcDataArray[j] === undefined || SecondDcDataArray[j] === null) {
              secondDCSample = null;
            }
            else {
              secondDCSample = SecondDcDataArray[j];
            }
            if (secondDCSample === null && firstDCSample === null) {
              firstDcDataArray[i] = null;
            }
            else {
              firstDcDataArray[i] = firstDCSample + secondDCSample;
            }
          }
        }
      }
      return firstDcDataArray;
    } catch (error) {
      console.log('error in getMergedDCsData', error);
    }
  }

  getMergeDataForDial(firstDCFavorite, panelNumber, graphIndex) {
    try {
      let firstAxisValue;
      let arrFavData = this._dataContainerService.getExecDashboardFavoriteData();
      let secondDCFavData;
      let orderRevDCs = this._dataContainerService.getOrderRevDCs();
      let DCArr = orderRevDCs.split(',');
      for (let i in DCArr) {
        if (DCArr[i] !== firstDCFavorite.dcName) {
          secondDCFavData = arrFavData[DCArr[i]];
        }
      }
      let firstValue = firstDCFavorite.panelData[panelNumber].panelGraphs[graphIndex].lastSample;
      if (firstValue !== null || firstValue !== undefined) {
        firstAxisValue = firstValue;
      }
      if (secondDCFavData === null || secondDCFavData === undefined) {
        return firstAxisValue;
      }
      let secondValue = secondDCFavData.panelData[panelNumber].panelGraphs[graphIndex].lastSample;
      if (secondValue !== null || secondValue !== undefined) {
        firstAxisValue = firstAxisValue + secondValue;
      }
      return firstAxisValue
    } catch (error) {
      console.log('error in getMergeDataForDial ', error);
    }
  }

  updateRange(greenValue, rangeValue) {
    if (greenValue <= rangeValue) {
      greenValue = greenValue + (greenValue * 0.10);
      this.updateRange(greenValue, rangeValue);
    }
    return greenValue;
  }

  /**
   * method to show message growl
   * { severity: 'error', summary: 'Error Message', detail: msg }
   */
  static msgs = [];
  static showMessageGrowl(severity: string, summary: string, detail: string) {
    //alert("no app available");
    this.msgs = [];
    this.msgs.push({ severity, summary, detail });
    return;
  }



  data=[
    {
        "value": 438,
        "code": "nj"
    },
    {
        "value": 387.35,
        "code": "ri"
    },
    {
        "value": 312.68,
        "code": "ma"
    },
    {
        "value": 271.4,
        "code": "ct"
    },
    {
        "value": 209.23,
        "code": "md"
    },
    {
        "value": 195.18,
        "code": "ny"
    },
    {
        "value": 154.87,
        "code": "de"
    },
    {
        "value": 114.43,
        "code": "fl"
    },
    {
        "value": 107.05,
        "code": "oh"
    },
    {
        "value": 105.8,
        "code": "pa"
    },
    {
        "value": 86.27,
        "code": "il"
    },
    {
        "value": 83.85,
        "code": "ca"
    },
    {
        "value": 72.83,
        "code": "hi"
    },
    {
        "value": 69.03,
        "code": "va"
    },
    {
        "value": 67.55,
        "code": "mi"
    },
    {
        "value": 65.46,
        "code": "in"
    },
    {
        "value": 63.8,
        "code": "nc"
    },
    {
        "value": 54.59,
        "code": "ga"
    },
    {
        "value": 53.29,
        "code": "tn"
    },
    {
        "value": 53.2,
        "code": "nh"
    },
    {
        "value": 51.45,
        "code": "sc"
    },
    {
        "value": 39.61,
        "code": "la"
    },
    {
        "value": 39.28,
        "code": "ky"
    },
    {
        "value": 38.13,
        "code": "wi"
    },
    {
        "value": 34.2,
        "code": "wa"
    },
    {
        "value": 33.84,
        "code": "al"
    },
    {
        "value": 31.36,
        "code": "mo"
    },
    {
        "value": 30.75,
        "code": "tx"
    },
    {
        "value": 29,
        "code": "wv"
    },
    {
        "value": 25.41,
        "code": "vt"
    },
    {
        "value": 23.86,
        "code": "mn"
    },
    {
        "value": 23.42,
        "code": "ms"
    },
    {
        "value": 20.22,
        "code": "ia"
    },
    {
        "value": 19.82,
        "code": "ar"
    },
    {
        "value": 19.4,
        "code": "ok"
    },
    {
        "value": 17.43,
        "code": "az"
    },
    {
        "value": 16.01,
        "code": "co"
    },
    {
        "value": 15.95,
        "code": "me"
    },
    {
        "value": 13.76,
        "code": "or"
    },
    {
        "value": 12.69,
        "code": "ks"
    },
    {
        "value": 10.5,
        "code": "ut"
    },
    {
        "value": 8.6,
        "code": "ne"
    },
    {
        "value": 7.03,
        "code": "nv"
    },
    {
        "value": 6.04,
        "code": "id"
    },
    {
        "value": 5.79,
        "code": "nm"
    },
    {
        "value": 3.84,
        "code": "sd"
    },
    {
        "value": 3.59,
        "code": "nd"
    },
    {
        "value": 2.39,
        "code": "mt"
    },
    {
        "value": 1.96,
        "code": "wy"
    },
    {
        "value": 0.42,
        "code": "ak"
    }
] ;



//data=JSON.parse(this.dataJson);



  getGeoMap = function () {
    let showToolTip:boolean=false;

    this.data.forEach(function (p) {
      p.code = p.code.toUpperCase();
      console.log("getGeoMap code is: ",p.code);
    });
    try {

      return {
        chart: {
          //map: 'countries/us/us-all',
          height: (60) + '%',
          backgroundColor: null,
          width: (window.innerWidth * 65) / 100, // width can only be set in pixels.
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        plotOptions: {
          mappoint: {
            stickyTracking: false,
          },
          series: {
            turboThreshold: 5000  //larger threshold or set to 0 to disable
          }
        },
        tooltip: {
          enabled: true,
          delayForDisplay: 200,
          formatter: function () {
            if(showToolTip){
            return "Store: " + this.point.options.storeName + '<br>' +
              "City: " + this.point.options.cityName + '<br>' +
              "State: " + this.point.options.stateName + '<br>' +
              "Critical: " + this.point.options.critical + '<br>' +
              "Major: " + (this.point.options.major + this.point.options.minor) + '<br>' +
              "TPS: " + ExecDashboardUtil.numberFormatWithDecimal(this.point.options.tps, 2, "custom") + '<br>' +
              "Resp Time (ms): " + ExecDashboardUtil.numberFormatWithDecimal(this.point.options.res, 2, "custom") + '<br>' +
              "Error (%): " + ExecDashboardUtil.numberFormatWithDecimal(this.point.options.eps, 2, "custom") + '<br>'
            // 'lat ' + this.point.options.lat + '<br>' +
            // 'lon ' + this.point.options.lon
          }else{
            return "State: " +this.point.name;
          }
        }
        },
        exporting: {
          enabled: false
        },
        legend: {
          layout: 'horizontal',
          floating: true,
          verticalAlign: 'bottom',
          x: 15,
          itemStyle: {
            fontWeight: 'bold 500',
            fontSize: '12px',
          }
        },
        mapNavigation: {
          enabled: true,
          enableDoubleClickZoom: false,
          buttonOptions: {
            verticalAlign: 'bottom'
          }

        },

        colorAxis: {
          min: 1,
          showInLegend: false,
          type: 'logarithmic',
          minColor: '#f2efe9',
          maxColor: '#f2efe9',
          stops: [
              [0, '#f2efe9'],
              // [0.67, '#d9ff66'],
              [1, '#f2efe9']
          ]
      },

        series: [{
          mapData: USAJSONMAP,
          showInLegend: false,
          borderColor: '#d7aed1',
         //borderWidth:'0.5px !important', 
         // marker: { enabled: false }
          data: this.data,
          dashStyle: 'dot',
          joinBy: ['postal-code', 'code'],
          dataLabels: {
              enabled: true,
              color: '#000000',
              format: '{point.name}',
              style:{
                color:"contrast",
                fontFamily:"sans-serif",
                fontSize:"11.2px",
                fontWeight:"",
                textOutline:"0.8px contrast"
                }
        
            }
            
              },
        {
          type: 'mappoint',
          name: 'Critical',
          color: '#f55e5e',
          marker: {
            lineColor: 'black',
            lineWidth: 1,
            symbol: "circle",
            radius: 4
          },
          visible:ExecDashboardDataContainerService.criticalVisible,
          data: this.createGeoMapSeries('r'),
          events: {
            legendItemClick: function() {
              ExecDashboardDataContainerService.criticalVisible=!ExecDashboardDataContainerService.criticalVisible;
            },
            mouseOver:function(){
              //alert("mouse Over");
              showToolTip=true;
            },
            mouseOut:function(){
              showToolTip=false;
            },
            
          },
          point: {
            events: {
              click: function () {
                ExecDashboardChartProviderService.geoMapExtendedClickEventHandler(this);
              }
            }
          },

        },
        {
          type: 'mappoint',
          name: 'Major',
          color: '#ffc247',
          marker: {
            lineColor: 'black',
            lineWidth: 1,
            symbol: "circle",
            radius: 4
          },
	  visible:ExecDashboardDataContainerService.majorVisible,
          data: this.createGeoMapSeries('y'),
	  events: {
            legendItemClick: function() {
              ExecDashboardDataContainerService.majorVisible=!ExecDashboardDataContainerService.majorVisible;
            }
          },
          point: {
            events: {
              click: function () {
                ExecDashboardChartProviderService.geoMapExtendedClickEventHandler(this);
              },
              mouseOver:function(){
                //alert("mouse Over");
                showToolTip=true;
              },
              mouseOut:function(){
                showToolTip=false;
              },
            }
          },

        },
        {
          type: 'mappoint',
          name: 'Normal',
          color: '#3abf94',
          marker: {
            lineColor: 'black',
            lineWidth: 1,
            symbol: "circle",
            radius: 4
          },
          visible:ExecDashboardDataContainerService.normalVisible,
          data: this.createGeoMapSeries('g'),
	  events: {
            legendItemClick: function() {
              ExecDashboardDataContainerService.normalVisible=!ExecDashboardDataContainerService.normalVisible;
            }
          },
          point: {
            events: {
              click: function () {
                ExecDashboardChartProviderService.geoMapExtendedClickEventHandler(this);
              },
              mouseOver:function(){
                //alert("mouse Over");
                showToolTip=true;
              },
              mouseOut:function(){
                showToolTip=false;
              },
            }
          },

        },
        {  //for  GREY
          type: 'mappoint',
          name: 'InActive',
          color: '#bfbfbf',
          marker: {
            lineColor: 'black',
            lineWidth: 1,
            symbol: "circle",
            radius: 4
          },
   	  visible:ExecDashboardDataContainerService.inactiveVisible,  //to hide initially
          data: this.createGeoMapSeries('gry'),
          events: {
            legendItemClick: function() {
              ExecDashboardDataContainerService.inactiveVisible=!ExecDashboardDataContainerService.inactiveVisible;
            }
          },
          point: {
            events: {
              click: function () {
                  ExecDashboardChartProviderService.showMessageGrowl('error', 'Error Message', 'No App available for this Store');
              },
              mouseOver:function(){
                //alert("mouse Over");
                showToolTip=true;
              },
              mouseOut:function(){
                showToolTip=false;
              },
            }
          },

        }


        ] // series end
      }
    } catch (error) {

    }
  }


  /**method to create pie chart for store view */
  getPieChart = function (gStore, bStore) {
    if(gStore == 0)
      gStore = null;
    if(bStore == 0)
      bStore = null;
    try {
      return {
        chart: {
          backgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: (50) + '%',
          width: 340,
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '',
          floating: false,
          align: 'left',
          verticalAlign: 'bottom',
          y: -10,
        },
        title: '',
        tooltip: {
          delayForDisplay: 200,
          formatter: function () {
            return this.point.name + ' : <b>' + ExecDashboardUtil.numberFormatWithDecimal(this.point.percentage, 2) + '%<b>';
          }
        },
        plotOptions: {
          pie: {
            //allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#f55e5e', '#3abf94'],
            dataLabels: {
              enabled: false
            },
            series: {
              allowPointSelect: false
          },
            showInLegend: true
          }
        },
        //to remove highchart water bubble
        credits: {
          enabled: false
        },
        lang: {
          goodStore: `Good Store: ${gStore == null ? 0:gStore}`,
          badStore: `Bad Store: ${bStore == null ? 0:bStore}`
        },
        //to remove context menu and adding labels
        exporting: {
          buttons: {
            contextButton: {
              enabled: false
            },
            exportButton: {
              _titleKey: "goodStore",
              text: `<span title = "Good Stores"><b>Good Stores: ${gStore == null ? 0:gStore}</b></span>`,
              onclick: function () {
                // console.log("good store clicked");
                ExecDashboardChartProviderService.createSubscriptionForStore('Total Good Stores', gStore);
              },
              align: 'left',
              y: 0
            },
            printButton: {
              _titleKey: "badStore",
              text: `<span title = ""><b>Bad Stores: ${bStore == null ? 0:bStore}</b></span>`,
              onclick: function () {
                ExecDashboardChartProviderService.createSubscriptionForStore('Total Bad Stores', bStore);
              },
              x: 0,
              align: 'left',
              y: 20
            },
          }
        },
        //to handle custom label background
        navigation: {
          buttonOptions: {
            theme: {
              'stroke-width': 0,
              stroke: '',
              fill: '',
              r: 0,
              states: {
                hover: {
                  fill: '#a4edba'
                },
                select: {
                  stroke: '#039',
                  fill: '#a4edba'
                }
              }
            }
          }
        },
        series: [{
          name: '',
          colorByPoint: true,
          data: [{
            name: 'Bad Stores',
            y: bStore
          }, {
            name: 'Good Stores',
            y: gStore
          }]
        }]
      }
    } catch (error) {
      console.log('getting error inside ExecDashboardChartProviderService.ts in method getPieChart()', error);
    }
  }

  static sendMessage(message: object) {
    ExecDashboardChartProviderService.subject.next({ data: message });
  }

  getMessage(): Observable<any> {
    return ExecDashboardChartProviderService.subject.asObservable();
  }

  /*This method is used to listen the point click event for Geo Map*/
  static geoMapExtendedClickEventHandler(chartObject) {
    try {
      let temp = Object.assign({}, chartObject);
      ExecDashboardChartProviderService.sendMessage(temp);
    } catch (error) {
      console.error('Exception while listen the series click event from chart panel. ', error);
    }
  }

  // here geomap series's data is created based on severity(color)
  createGeoMapSeries(alertColorType) {
    try {
      let tempGeoData;
      let jsonData = [];
      tempGeoData = this._dataContainerService.$storeData['geoStoreDTO']['storeInfoList'];

      let severityFlag = false;
      let filterValue = this._dataContainerService.$selectedGeoMapFilter;
      if (filterValue === 'Critical' || filterValue === 'Major') {
        severityFlag = true;
      }

      for (let i of tempGeoData) {
        if (i['color'].toLowerCase() === alertColorType && !severityFlag) {
          let tempObject = {};
          if (!i['lat'] || !i['lon']) {
            continue;
          }
          tempObject['storeName'] = i['storeName'];
          tempObject['dc'] = i['dc'];
          tempObject['lat'] = parseFloat(i['lat']);
          tempObject['lon'] = parseFloat(i['lon']);
          tempObject['cityName'] = i['cityName'];
          tempObject['stateName'] = i['stateName'];

          if(alertColorType == 'gry'){
            tempObject['tps'] = NaN;
            tempObject['res'] = NaN;
            tempObject['eps'] = NaN;

            tempObject['critical'] = NaN;
            tempObject['major'] = NaN;
            tempObject['minor'] = NaN;
          }
          else{
            tempObject['tps'] = i['tps'];
            tempObject['res'] = i['res'];
            tempObject['eps'] = i['eps'];

            tempObject['critical'] = i['critical'];
            tempObject['major'] = i['major'];
            tempObject['minor'] = i['minor'];
          }
          if (i['color'].toLowerCase() === 'r') {
            tempObject['color'] = '#f55e5e';
          } else if (i['color'].toLowerCase() === 'g') {
            tempObject['color'] = '#3abf94';
          }
          else if (i['color'].toLowerCase() === 'y') {
            tempObject['color'] = '#ffc247';
          }else if (i['color'].toLowerCase() === 'gry') {
            tempObject['color'] = '#bfbfbf';
          }
          let addPointObject = this.showFilterOptions(tempObject);
          if (addPointObject)
            jsonData.push(tempObject);
        }
        else if (severityFlag) {
          if (filterValue === 'Critical' && alertColorType !== 'r') {
          } else if (filterValue === 'Major' && alertColorType !== 'y') {
          } else {
            let tempObject = {};
            if (!i['lat'] || !i['lon']) {
              continue;
            }
            tempObject['lat'] = parseFloat(i['lat']);
            tempObject['lon'] = parseFloat(i['lon']);
            tempObject['storeName'] = i['storeName'];
            tempObject['tps'] = i['tps'];
            tempObject['res'] = i['res'];
            tempObject['eps'] = i['eps'];
            tempObject['cityName'] = i['cityName'];
            tempObject['stateName'] = i['stateName'];
            tempObject['critical'] = i['critical'];
            tempObject['major'] = i['major'];
            tempObject['minor'] = i['minor'];
            tempObject['dc'] = i['dc'];
            if(alertColorType == 'gry'){
              tempObject['tps'] = NaN;
              tempObject['res'] = NaN;
              tempObject['eps'] = NaN;

              tempObject['critical'] = NaN;
              tempObject['major'] = NaN;
              tempObject['minor'] = NaN;
            }

            if (filterValue === 'Critical') {
              tempObject['color'] = '#f55e5e';
            } else if (tempObject['color'] === 'Major') {
              tempObject['color'] = '#3abf94';
            }
            let addPointObject = this.showFilterOptions(tempObject);
            if (addPointObject)
              jsonData.push(tempObject);
          }
        }
      }

      return jsonData;
    } catch (error) {
      console.log('Error in createGeoMapSeries ', error);
    }
  }

  /**
   * red: #ff0000 critical
   * green: #009933 normal
   * yellow: #ffff00 major
   */
  /**
   * At the time of creating data
   * filtering is done here
   */
  showFilterOptions(Object) {
    try {
      let temp = false;
      let filterValue = this._dataContainerService.$selectedGeoMapFilter;
      if (filterValue == null || filterValue == undefined || filterValue === '' || filterValue === 'None') {
        return true;
      }
      if (filterValue === 'Critical' && Object['critical'] > 0) {
        temp = true;
      }
      else if (filterValue === 'Major' && (Object['major'] > 0 || Object['minor'] > 0)) {
        temp = true;
      }
      else if (filterValue === 'Store Name') {
        let tempText = this._dataContainerService.$geoFilterText
        tempText = tempText.trim().toLowerCase();
        if ((Object['storeName'].toLowerCase()).indexOf(tempText) !== -1) {
          temp = true;
        }

      }
      else if (filterValue === 'Store City') {
        let tempText = this._dataContainerService.$geoFilterText
        tempText = tempText.trim().toLowerCase();
        if ((Object['cityName'].toLowerCase()).indexOf(tempText) !== -1) {
          temp = true;
        }

      }
      else if (filterValue === 'State Name') {
        let tempText = this._dataContainerService.$geoFilterText;
        tempText = tempText.trim().toLowerCase();
        if ((Object['stateName'].toLowerCase()).indexOf(tempText) !== -1) {
          temp = true;
        }

      }
      return temp;
    } catch (error) {
      console.log('error in showFilterOptions ---- ', error);
    }
  }
  static createSubscriptionForStore(type, value) {
    try {
      let obj = Object.assign({}, { type, value })
      ExecDashboardChartProviderService.sendMessage(obj);
    }
    catch (e) {
      console.log('Getting error inside createSubscriptionForStore()', e);
    }
  }

    //tier status charts
    getDashboardData(graphData) {
      this.chartArr = this.getGraphsData(graphData);
    }

    getAlertChart(obj){

   this.alertChart=this.getAlertDonutChart(obj);

    }

  getTierInfoCharts(data) {
    try {
      let tempArr = [];
      data.forEach((element, index) => {
        tempArr[index] = this.getGraphsData(element['graphInfo'], true);
        tempArr[index].splice(0,0,this.getDonutChart(element['donut']));
      });
      return tempArr;
    } catch (error) {
      console.log('Error in getTierInfoCharts ', error);
    }
  }
  getGraphsData(graphtData, isTierInfo?: any) {
    let count;
    let tempArr = [];
    if (graphtData && graphtData.length > 0) {
      for (let index = 0; index < graphtData.length; index++) {
        if (graphtData[index]!=null && graphtData[index].name == "COUNT") {
          count = graphtData[index].count;
        }
      }
      for (let index = 0; index < graphtData.length; index++) {
        const element = graphtData[index];
        if (element !=null  && element.name == "COUNT") {
          continue;
        }
        tempArr.push(this.getGraphForMetrices(element, count, isTierInfo));
      }
    }
    return tempArr;
  }

    /**
   * Method to create graph series
   * @param obj
   */
  getMetricesSeriesData(obj) {
    try {
      let series = [];
      let tempObj: any = {};
      for (let seriesArr of obj.series) {
        series.push({'data': seriesArr.data });
      }
      return series;
    }
    catch (e) {
      console.log('getting exception in getMetricesSeriesData of', this.className, e);
    }
  }
  public set $chartArr(value: any) {
    this.chartArr = value;
  }
  public get $chartArr() {
    return this.chartArr;
  }


  public getAlertDonutChart(donutData) {
    try {
      return {
        chart: {
          backgroundColor: null,
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: null,
          width: null,
          marginTop: 20,
          marginLeft:-200
          // height: (100) + '%',
          // width: 400,
        },
        credits: {
          enabled: false
        },
        exporting: { enabled: false },
        title: {
          text: '',
          /* align: 'center',* /
          /* verticalAlign: 'middle',
          y: 40 */
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
          }
        },
        plotOptions: {
          pie: {

            dataLabels: {
              enabled: false,
              distance: -50,
              style: {
                fontWeight: 'bold',
                color: 'white'
              }
            },
            startAngle: -180,
            endAngle: 180,
            size: 85,
            center: ['22%', '40%']
          }
        },
        legend: {
          enabled:false,
          align: 'middle',
          layout: 'vertical',
          verticalAlign: 'bottom',
          x: 40,
          // y: 50
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
          innerSize: '70%',
          showInLegend: true,
          colors: ['#3abf94', 'orange', '#f55e5e'],
          dataLabels: {
            enabled: false
          },
          data: [
            // ['Normal', donutData[0][1]],
            // ['Major', donutData[1][1]],
            // ['Critical', donutData[2][1]]
            //['Minor', donutData.normal],
            //['Major', donutData.major],
            //['Critical', donutData.critical]
            // ['Normal', 10],
            // ['Major', 10],
            // ['Critical', 50]
            {
              name: 'Minor',
              y: donutData.normal,
              color: '#ffc247'
          },
          {
              name: 'Major',
              y: donutData.major,
              color: 'orange'
          },
          {
              name: 'Critical',
              y: donutData.critical,
              color: '#f55e5e'
          },
          {
            name: 'Normal',
            y: !donutData.critical && !donutData.critical && !donutData.normal?100:0,
            color: '#3abf94'
        }

          ]
        }]
      }

    } catch (error) {
      console.log('Error in getDonutChart method ', error);
    }
  }

  public getDonutChart(donutData) {
    try {
      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: (100) + '%',
          width: 390,
        },
        credits: {
          enabled: false
        },
        exporting: { enabled: false },
        title: {
          text: '',
          /* align: 'center',* /
          /* verticalAlign: 'middle',
          y: 40 */
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                fontWeight: 'bold',
                color: 'white'
              }
            },
            startAngle: -180,
            endAngle: 180,
            size: 130,
            center: ['26%', '40%']
          }
        },
        legend: {
          align: 'middle',
          layout: 'vertical',
          verticalAlign: 'bottom',
          x: 40,
          // y: 50
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
          innerSize: '70%',
          showInLegend: true,
          colors: ['#3abf94', 'orange', '#f55e5e'],
          dataLabels: {
            enabled: false
          },
          data: [
            ['Normal', donutData[0][1]],
            ['Major', donutData[1][1]],
            ['Critical', donutData[2][1]]
          ]
        }]
      }

    } catch (error) {
      console.log('Error in getDonutChart method ', error);
    }
  }


  getGraphForMetrices(obj, count, pannelNumber = -1, isTierInfo?:any) {
    let title = '';
    let tempHeight;
    let tempWidth;
    if (isTierInfo) {
      tempHeight = 59;
      tempWidth = 280
    }
    else {
      tempHeight = 45;
      // tempWidth = 440
      tempWidth = (window.innerWidth/3) - 20;
    }
    try {
      if ((obj['name'].toLowerCase() == "pvs") || (obj['name'].toLowerCase() == "tps")) {
        title = "Transaction Per Sec (count = " + ExecDashboardUtil.numberToCommaSeperate(obj['count']) + ", Avg = " + obj['avg'] + ")";
      }
      else if (obj['name'].toLowerCase() == "res") {
        title = "Response Time(ms) (Avg = " + obj['avg'] + ")";
      }
      else if (obj['name'].toLowerCase() == "cpu") {
        title = "CPU Utilization (Avg = " + obj['avg'] + ")";
      }
      console.log('title ======', title);
      let plannedPanel = this._dataContainerService.getPlannedPanel();
      let ordersPanel = this._dataContainerService.getPlannedOrderPanel();
      return {
        chart: {
          type: 'spline',
          zoomType: 'x',
          spacingBottom: 15,
          backgroundColor: 'white',
          height: tempHeight + '%',
          width: tempWidth,
        },
        title: {
          text: title,
          style: { "fontSize": "13px" },
        },
        legend: {
          enabled : false,
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: 12,
          alignColumns: false,
          itemStyle: {
              fontSize:'9px'
           }
        },
        xAxis: {
          type: 'datetime',
          tickInterval: null,//tickInterval,
          labels: {
            formatter: function () {
              let val = ExecDashboardChartProviderService.xAxisLabel(this.value, pannelNumber, plannedPanel, ordersPanel);
              return val;
            }
          },
        },
        plotOptions: {
          line: {
            animation: false
          },
          series: {
            color: '#A3C68C',
            marker: {
              radius: 3, // to increase or decrease size of marker/ dots default:4
              enabled: false   //  to disable dots in line series.
            }
          }
        },
        credits: {
          enabled: false
        },
        // tooltip formatter
        tooltip: {
          headerFormat : '',
          formatter: function () {
            return ExecDashboardChartProviderService.tooltipFormatter(title, this.series.userOptions['name'], this.x, this.y);
          },
          backgroundColor: {
            linearGradient: [0, 0, 0, 60],
            stops: [
              [0, '#FFFFFF'],
              [1, '#E0E0E0']
            ]
          },
          borderWidth: 1,
          borderRadius: 10,
          padding: 4,
          style: {
            fontSize: '11px'
          }
        },
        yAxis: {

          // labels: {
          //   formatter: function () {
          //     // let val = ExecDashboardChartProviderService.yAxisFormat(this.value);
          //     // return labelForYaxis + val;
          //   }
          // },
          title: {
            text: 'Units'
          }
        }, 
        exporting: { enabled: false },
        series: this.getMetricesSeriesData(obj),
      }
    }
    catch (e) {
      console.log('Getting error in getGraphForMetrices at ', this.className, e);
    }
  }


}//End of file
