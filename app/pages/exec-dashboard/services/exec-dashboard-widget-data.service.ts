import { ExecDashboardChartProviderService } from './exec-dashboard-chart-provider.service';
import { Injectable } from '@angular/core';
import { ExecDashboardDataContainerService } from './exec-dashboard-data-container.service';
import { ExecDashboardPanelData } from '../interfaces/exec-dashboard-panel-data';

@Injectable()
export class ExecDashboardWidgetDataService {
  panelDataArr: ExecDashboardPanelData[] = [];
  dcsConfigInfo: [any];
  constructor(public _dataContainerService: ExecDashboardDataContainerService,
    public _chartProvider: ExecDashboardChartProviderService,
  ) { }

  /**
   * This method is to generate the fav json for graphical KPI
   */
  generateGraphicalFavData(favoriteData) {
    try {
      if (favoriteData == "" || favoriteData == undefined) {
        console.error("gwtting invalid fav data");
        if (favoriteData.errorCode > 0) {
          alert(favoriteData.errorMessage);
        }
      }

      else {
        let noOfPanel = favoriteData.panelData.length  // > secondFavData.panelData.length ? firstFavData.panelData.length : secondFavData.panelData.length;
        //  Iterating and Processing Each Panel. 
        for (let i = 0; i < noOfPanel; i++) {
          /* Getting and processing favorite panel Data. */
          if (!this.panelDataArr[i])
            this.panelDataArr[i] = new ExecDashboardPanelData();

          let tempFlag = true;// to be removed
          if (tempFlag) {
            this.panelDataArr[i] = this.processGraphWidget(favoriteData, i, this.panelDataArr[i]);
          }
          else {
            console.log("inside else of generateGraphicalFavData");
          }

        }

        this._dataContainerService.setPanelDataArr(this.panelDataArr);
      }
    } catch (error) {
      console.log("Error in generateGraphicalFavData");
      console.log(error);
    }
  }

  processGraphWidget(favData, panelNumber, panelData: ExecDashboardPanelData) {
    try {
      this.dcsConfigInfo = this._dataContainerService.getGraphicalKPIDcInfo();
      let refreshPanelGraphs = favData['refreshPanelGraphs'];
      let plannedPanel = this._dataContainerService.getPlannedPanel();
      let ordersPanel = this._dataContainerService.getPlannedOrderPanel();
      if ((favData.panelData !== null) && (favData.panelData[panelNumber] === null || favData.panelData[panelNumber].panelGraphs == null ||
        favData.panelData[panelNumber].panelGraphs.length === 0)) {

        /*Checking chart object of panelData  */
        if (panelData.chart == null) {
          panelData.chart = null; //this.getEmptyChart();
          panelData.panelNumber = panelNumber;

          if (favData.panelData[panelNumber] !== null &&
            (favData.panelData[panelNumber].panelCaption !== '' ||
              favData.panelData[panelNumber].panelCaption !== undefined)) {
            panelData.panelTitle = favData.panelData[panelNumber].panelCaption;
          }
        }
      } else {
        /* Here we are getting the chart data based on chart type in panel. */
        let chartType = favData.panelData[panelNumber].chartType;
        if (panelData.chart == null) {
          let tempChart = this._chartProvider.getChartObjectByChartType(chartType, favData, panelNumber, panelData);
	  if (tempChart === null || tempChart === undefined) {
            console.log("chart is undefined  ");
            return panelData;
          }
	  panelData.chart = tempChart;
        }
        //for chart updation
        else {
          let tempChart = this._chartProvider.getChartObjectByChartType(chartType, favData, panelNumber, panelData);
 	  if (tempChart === null || tempChart === undefined) {
            console.log("chart is undefined  ");
            return panelData;
          }
          let flag = true;
          let chartSeries = panelData.chart;
          let tmpChartData = null;
          if (chartSeries.length == undefined) {
            tmpChartData = this.getSeriesData(chartSeries, tempChart, panelNumber, plannedPanel, ordersPanel, favData);
            panelData.chart = tmpChartData.chart;
            flag = tmpChartData.flag;
          } else {
            let chartsArr: any[] = [];
            chartSeries.forEach((element, index) => {
              chartsArr.push(this.getSeriesData(element, tempChart[index], panelNumber, plannedPanel, ordersPanel, favData));
              panelData.chart[index] = chartsArr[index].chart;
              if (chartsArr[index].flag == false) {
                flag = false;
            }
            });
          }
          /** when second dc's data will come. It is not based on order */
          /* here need to find which dcs data it is.
          if(dc[0] === tempChart.series[i].name ){
            panelData.chart.series.unshift(tempChart.series[i]);
          }else{
            panelData.chart.series.push(tempChart.series[i]);
          }
          */
          if (flag) {
            for (let i = 0; i < tempChart.series.length; i++) {
              panelData.chart.series.push(tempChart.series[i]);
            }
          }

        }
        /**
         * For color changes:
         * #1164d8 - blue
         * #8cd0ff - light blue color for last element of planned panel
         * #0c9d10 - green color
         */
        let chartSeries = panelData.chart;
        if (chartSeries.length == undefined) {
          panelData = this.addChartsLineColor(chartSeries.series, panelNumber, plannedPanel, ordersPanel, panelData);
        } else {
          let tmpPanelData: ExecDashboardPanelData[] = [];
          chartSeries.forEach((element, index) => {
            tmpPanelData.push(this.addChartsLineColor(element, panelNumber, plannedPanel, ordersPanel, panelData));
            panelData.chart[index] = tmpPanelData[index].chart[index];
          });
        }

        panelData.panelNumber = panelNumber;
        panelData.panelTitle = favData.panelData[panelNumber].panelCaption;
      }

      return panelData;
    } catch (error) {
      console.log("Error in processGraphWidget");

      console.error(error);
    }
  }

  private getSeriesData(chart: any, tempChart: any, panelNumber, plannedPanel, ordersPanel, favData) {
    let _numberOfColumns = 3; // TODO: change this if number of columns increase in future
    let checkValue = panelNumber % _numberOfColumns;
    chart.title.text = tempChart.title.text;
    let flag = true;
    for (let i = 0; i < chart.series.length; i++) {
      for (let j = 0; j < tempChart.series.length; j++) {
        // code for updations
        if (chart.series[i].name === tempChart.series[j].name) {
          flag = false;
          /** In case of planned panel we redraw whole chart again || is case of refreshPanelGraphs = true */
          if (checkValue == plannedPanel || checkValue == ordersPanel) {
            chart.series[i].data = [];
            chart.series[i].data = chart.series[i].data.concat(tempChart.series[j].data);
          }
          else {
            let tempDataLength = tempChart.series[j].data.length;
            chart.series[i].data = chart.series[i].data.concat(tempChart.series[j].data);
            /**
             * If isMovingGraph is true, then we need to remove a
             * first element from series.
             */
            if (favData.isMovingGraph) {
              chart.series[i].data.splice(0, tempDataLength);
            }
          }
        }
      }
    }
    return {chart: chart, flag: flag};
  }

  private addChartsLineColor(chartSeries: any, panelNumber: number, plannedPanel: number, ordersPanel: number, panelData: any): any {
    let _numberOfColumns = 3; // TODO: change this if number of columns increase in future
    let checkValue = panelNumber % _numberOfColumns;
        for (let i = 0; i < chartSeries.length; i++) {
          if (i == 0) {
        if (checkValue == plannedPanel || checkValue == ordersPanel) {
              panelData.chart.series[i].color = '#1164d8'
              if (chartSeries[i].data != undefined && chartSeries[i].data.length > 0) {
                let tempObject = {};
                tempObject['x'] = chartSeries[i].data[chartSeries[i].data.length - 1][0];
                tempObject['y'] = chartSeries[i].data[chartSeries[i].data.length - 1][1];
                tempObject['color'] = '#8cd0ff',
                  tempObject['className'] = 'planedRevenue';
                panelData.chart.series[i].data[chartSeries[i].data.length - 1] = tempObject;
              }
            }
            else
              panelData.chart.series[i].color = '#73b7ef';
          }
          else if (i == 1) {
        if (checkValue == plannedPanel || checkValue == ordersPanel) {
              panelData.chart.series[i].color = '#0c9d10'
            }
            else
              panelData.chart.series[i].color = '#1164d8';
          } 
	  else if (i == 2){
            panelData.chart.series[i].color = '#8cc739';
          }
	  else {
	    panelData.chart.series[i].color = '#009933';
	  }
        }
      return panelData;
  }

  public getPanelsInfoArray(): any {
    return this.panelDataArr;
  }
  public setPanelsInfoArray(value: any) {
    this.panelDataArr = value;
  }

} // end of file.

