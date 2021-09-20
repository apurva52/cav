import { ChartType } from './../widget/constants/chart-type.enum';
import { Observable, Subject, Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { LowerPanelTable } from '../../lower-tabular-panel/service/lower-tabular-panel.model';
import { DashboardComponent } from '../dashboard.component';
import { DashboardWidgetComponent } from '../widget/dashboard-widget.component';
import { DashboardWidgetLoadRes, ForEachGraphArgs, GraphData, MFrequencyTsDetails } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { DashboardUpdatingErrorState } from './dashboard.state';
import { WidgetDrillDownMenu } from '../widget/widget-menu/service/widget-menu.model';
//import { DbQueriesTable } from 'src/app/pages/dashboard-service-req/db-queries/service/db-queries.model';
import { DBReportData } from 'src/app/pages/dashboard-service-req/db-queries/service/db-queries.model';
import { Store } from 'src/app/core/store/store';
import * as _ from 'lodash';
/*GraphStats type for AVG*/
export const GRAPH_STATS_AVG = '0';
/*GraphStats type for MIN*/
export const GRAPH_STATS_MIN = '1';
/*GraphStats type for MAX*/
export const GRAPH_STATS_MAX = '2';
/*GraphStats type for COUNT*/
export const GRAPH_STATS_COUNT = '3';
/*GraphStats type for SUMCOUNT*/
export const GRAPH_STATS_SUMCOUNT = '4';

export const DATA_TYPE_SAMPLE = 0;
export const DATA_TYPE_RATE = 1;
export const DATA_TYPE_CUMULATIVE = 2;
export const DATA_TYPE_TIMES = 3;
export const DATA_TYPE_TIMES_STD = 4;
export const DATA_TYPE_SUM = 5;

export const GKPI_PLANNED_DATA_GROUPID = 19999;
export const GKPI_DIAL_GAUGE_CHART_TYPE = 110;

export class DashboardServiceInterceptor {
  avgCount: number = 1;
  avgCounter: number = 0;
  // lowerPanelDataArr: { [key: string]: any[] } = {};

  constructor(
    private dashboardService: DashboardService,
    private sessionService: SessionService
  ) { }


  //Method called whenver widget load call goes
  onDashboardWidgetLoaded(
    newData: DashboardWidgetLoadRes,
    previousData: DashboardWidgetLoadRes,
    dashboardComponent: DashboardComponent,
    widget: DashboardWidgetComponent,

    success: (data: DashboardWidgetLoadRes) => void,
    error: (error: AppError) => void
  ) {
    try {

      if (newData.grpData == null || newData.grpData == undefined) {
        // error(null);
        console.log("new data not present.")
        success(previousData);
        return;
      }

      const dashboardTime = dashboardComponent.getTime();

      if (dashboardTime && dashboardTime.graphTimeKey && dashboardTime.graphTimeKey.includes("SPECIFIED_TIME_")) {
        previousData = null;
      }

      // Calculate min freq & collect all graphs
      let minFrequency: MFrequencyTsDetails = null;
      let interval = this.sessionService.getInterval('progressInterval');

      if (newData.grpData.mFrequency) {
        for (const mFrequency of newData.grpData.mFrequency) {
          if (mFrequency.tsDetail.frequency < 0) {
            //console.log("frequency is negative and start time is zero")
            continue;
          }
          if (!minFrequency || (minFrequency && minFrequency.frequency >= mFrequency.tsDetail.frequency)) {
            minFrequency = mFrequency.tsDetail;
          }
        }
      }

      // if(widget && widget.widget.zoomInfo && widget.widget.zoomInfo.isZoom && widget.widget.zoomInfo.times.length >0){
      //   success(newData);
      // }

      //This is for calculating next sample start time
      // if (minFrequency && previousData)
      // previousData.grpData.lastSampleTimeStampWithInterval = (((minFrequency.frequency * (minFrequency.count - 1)) * 1000) + minFrequency.st);

      if ((previousData && !(widget && widget.widget.zoomInfo && widget.widget.zoomInfo.isZoom && widget.widget.zoomInfo.times.length > 0)) && (previousData && !(widget && widget.widget && widget.widget.compareZoomInfo))) {
        //case of percentile or slab
        const isCompare = widget.widget.compareData && !widget.widget.compareData.trendCompare;
        if (newData && newData.grpData) {
          let isSuccess: boolean;
          for (const [mFIndex, mFreq] of newData.grpData.mFrequency.entries()) {
            for (const [dIndex, mfdata] of mFreq.data.entries()) {
              if (mfdata.percentile || mfdata.slabCount) {
                ///always full data replace
                //console.log('data is percentile or slab');
                previousData.grpData.mFrequency[mFIndex].data[dIndex] = JSON.parse(JSON.stringify(mfdata));
                success(previousData);
                return;
              }
              if (widget.widget.compareData != null && widget.widget.compareData.trendCompare && widget.widget.compareData.trendCompare != null && widget.widget.compareData.trendCompare !== undefined) {
                if (dashboardComponent.mergeShowGraphInTree) {
                  isSuccess = true;
                  previousData.grpData.mFrequency[mFIndex].data[dIndex] = JSON.parse(JSON.stringify(mfdata));
                }
                else {
                  previousData.grpData.mFrequency[mFIndex].data[dIndex];
                  success(previousData);
                  return;
                }
              }
            }
          }
          if (isSuccess) {
            success(previousData);
            return;
          }
          //only incremental
          //iteratting for multiple frequency graphs
          for (const [mIndex, mFreq] of newData.grpData.mFrequency.entries()) {
            //checking for negative frequency case
            if (mFreq.tsDetail.frequency < 0 || mFreq.tsDetail.st == 0) {
              //console.log("frequency is negative and start time is zero")
              continue;
            }

            for (const [mpartialIndex, partialData] of mFreq.data.entries()) {
              const mgId = partialData.measure.mgId;
              const metricId = partialData.measure.metricId;
              const sName = partialData.subject.tags[0].sName;
              const prevDataIdx = previousData.grpData.mFrequency.map((element) => {
                return element.data.findIndex((subElement) => subElement.measure.mgId === mgId && subElement.measure.metricId === metricId && subElement.subject.tags[0].sName === sName)
              })
              const numOfSample = partialData.avg.length;
              let numOfActualSample = 0;

              if (previousData.grpData.mFrequency[mIndex].tsDetail.partial) {
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].avg.splice(previousData.grpData.mFrequency[mIndex].data[prevDataIdx[0]].avg.length - 1, 1);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].min.splice(previousData.grpData.mFrequency[mIndex].data[prevDataIdx[0]].min.length - 1, 1);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].max.splice(previousData.grpData.mFrequency[mIndex].data[prevDataIdx[0]].max.length - 1, 1);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].count.splice(previousData.grpData.mFrequency[mIndex].data[prevDataIdx[0]].count.length - 1, 1);


                if(numOfSample > 1 ){
                  previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].avg.splice(0, numOfSample - 1);
                  previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].min.splice(0, numOfSample - 1);
                  previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].max.splice(0, numOfSample - 1);
                  previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].count.splice(0, numOfSample - 1);
                  numOfActualSample = numOfSample - 1;

                }
              }
              else{

                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].avg.splice(0, numOfSample);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].min.splice(0, numOfSample);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].max.splice(0, numOfSample);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].count.splice(0, numOfSample);
                numOfActualSample = numOfSample ;
              }

              for (const [dataIndex, avgdata] of partialData.avg.entries()) {
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].avg.push(avgdata);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].min.push(partialData.min[dataIndex]);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].max.push(partialData.max[dataIndex]);
                previousData.grpData.mFrequency[mIndex].data[isCompare ? mpartialIndex : prevDataIdx[0]].count.push(partialData.count[dataIndex]);
              }

              previousData.grpData.mFrequency[mIndex].tsDetail.st =
              previousData.grpData.mFrequency[mIndex].tsDetail.st + (numOfActualSample * mFreq.tsDetail.frequency * 1000);


            }

            previousData.grpData.mFrequency[mIndex].tsDetail.partial = mFreq.tsDetail.partial;

          }
        }

        if (minFrequency) {
          previousData.grpData.viewBy =  minFrequency.frequency+"";
          if (minFrequency.partial) {
            previousData.grpData.lastSampleTimeStampWithInterval = (((minFrequency.frequency * (minFrequency.count - 2)) * 1000) + minFrequency.st);
          }
          else {
            previousData.grpData.lastSampleTimeStampWithInterval = (((minFrequency.frequency * (minFrequency.count - 1)) * 1000) + minFrequency.st);
          }
        }


      } else {
        /* if (widget && widget.widget.compareZoomInfo && widget.widget.compareZoomInfo.length == 0)
          widget.widget.compareZoomInfo = null; */
        //first time come here
        previousData = JSON.parse(JSON.stringify(newData));

        if (minFrequency) {
          previousData.grpData.viewBy =  minFrequency.frequency+"";
          if (minFrequency.partial) {
            previousData.grpData.lastSampleTimeStampWithInterval = (((minFrequency.frequency * (minFrequency.count - 2)) * 1000) + minFrequency.st);
          }
          else {
            previousData.grpData.lastSampleTimeStampWithInterval = (((minFrequency.frequency * (minFrequency.count - 1)) * 1000) + minFrequency.st);
          }
        }

        for (const [mIndex, mFreq] of previousData.grpData.mFrequency.entries()) {

          //gkpi special handling
          for (const [index, mfdata] of mFreq.data.entries()) {
            if (previousData.grpData.mFrequency[mIndex].data[index].measure.mgId == GKPI_PLANNED_DATA_GROUPID && widget.widget.settings.types.graph.type == GKPI_DIAL_GAUGE_CHART_TYPE) {

              this.calculateDialMeterExpForKPI(previousData.grpData.mFrequency[mIndex].data[index], widget);
            }
          }
        }
      }

      //handling for compare Measurement name
      if (newData.grpData.mFrequency && newData.grpData.mFrequency.length > 0){
        if (widget.widget.compareData != null && !widget.widget.compareData.trendCompare) {
          for (const [mFIndex, mFreq] of previousData.grpData.mFrequency.entries()) {
            mFreq['measurementName'] = widget.widget.compareData.compareData;
          }
        }
      }

      const type = _.get(widget, 'widget.settings.types.graph.type', null);
      if(DashboardService.PERCENTILE_GRAPH_TYPE.indexOf(type) > -1 || DashboardService.SLAB_GRAPH_TYPE.indexOf(type) > -1) {
        success(previousData);
      }else {
        this.lowerPanelCalculation(previousData, widget, success);
      }

      //  success(previousData);

    } catch (e) {
      console.error('error coming', e);

      success(previousData);
      return;
    }
  }


  //Method to provide updated array with new sample
  updateNewDataIncrementalCase(originalSampleData, incrementalData): any {
    try {
      let arr: GraphData = JSON.parse(JSON.stringify(originalSampleData));
      let sampleDataKeys = {
        avg: true,
        min: true,
        max: true,
        count: true,
        sumCount: true,
        sumSquare: true,
      };
      for (let key in originalSampleData) {
        if (sampleDataKeys[key] && Object.keys(originalSampleData).length > 0) {

          if (incrementalData && incrementalData[key] && incrementalData[key].length > 0)
            arr[key].splice(arr[key].length, 0, ...incrementalData[key]);
        }
      }

      return arr;
    } catch (e) {
      console.error('error in updateNewDataIncrementalCase', e);
    }
  }


  //Method called whenever lower panel button clicked
  onLowerPanelRender(
    table: LowerPanelTable,
    widget: DashboardWidgetComponent,
    success: () => void,
    error: (error: AppError) => void
  ) {

    ////special handling to be done for percentile
    // if (widget.widget.settings.dataFilter.includes(7)) {
    //   // console.log('percentile case', widget.widget.settings.types.graph.arrPct);

    //   // widget.data.grpData.mFrequency[j].incrementalData[i].percentile.indexOf(i)
    // }

    // console.log("table data  coming", table.data)
    // const me = this;
    // let i = 0;
    // widget.forEachGraph((args: ForEachGraphArgs) => {
    //   args.incrementalData.lowerPanelSummary[args.gsType] = me.lowerPanelDataArr[widget.uuid][args.globalGraphIndex];
    //   args.graph.lowerPanelSummary[args.gsType] = me.lowerPanelDataArr[widget.uuid][args.globalGraphIndex];
    //   // args.graph.summary = me.lowerPanelDataArr[widget.uuid][args.globalGraphIndex];
    // });
    success();
  }



  //Method for all lower panel calculation
  lowerPanelCalculation(
    previousData: DashboardWidgetLoadRes,
    widget: DashboardWidgetComponent,
    success
  ) {
    let isCall  = this.dashboardService.isMetricUsesSummaryDataForGraph(widget);
    if(isCall) {
      this.dashboardService.calculateLowerPanelData(previousData,widget);
    }
    // console.log("before final submission..data is ", previousData)
    success(previousData);
  }













  isEmptyORNaNSample(graphData) {
    try {
      //check for exponent and skip
      let testExponent = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/;

      /**
       * Checking for double value for NaN(Not a Number). If double value is NaN/Infinite
       * then it return true while comparing with != operator.
       */
      if (isNaN(graphData) || !isFinite(graphData) || graphData < 0 || testExponent.test(graphData))
        return true;

      return false;
    } catch (e) {
      console.error('isEmptyORNaNSample method', e);
      return false;
    }
  }

  calculateSumCountData(arrCountData) {
    try {
      let sumCountArr = [];
      if (arrCountData == null || arrCountData.length == 0) return 0;

      for (let i = 0; i < arrCountData.length; i++) {
        if (i > 0)
          sumCountArr[i] = sumCountArr[i - 1] + arrCountData[i];
        else
          sumCountArr[i] = arrCountData[i];
      }
      return sumCountArr;
    }
    catch (e) {
      console.error('calculateSumCountData method', e);
      return null;
    }
  }

  getSquareDoublesArray(arrData) {
    try {
      if (arrData == null)
        return null;

      let squareArray = [];
      for (let i = 0; i < arrData.length; i++) {
        squareArray[i] = arrData[i] * arrData[i];
      }
      return squareArray;
    }
    catch (e) {
      console.error('getSquareDoublesArray method', e);
      return null;
    }
  }

  calculateSimpleAvgValue(arrSampleData) {
    try {
      let total = 0;

      if (arrSampleData == null || arrSampleData.length == 0) return 0;

      for (let i = 0; i < arrSampleData.length; i++) {
        if (
          this.isEmptyORNaNSample(arrSampleData[i])
        )
          continue;

        total = total + arrSampleData[i];
      }

      var avgValue = total / arrSampleData.length;

      return avgValue;
    } catch (e) {
      console.error('calculateSimpleAvgValue method', e);
      return 0.0;
    }
  }

  calculateSumCountArray(arrSampleData) {
    try {
      let arrSumCount = [];
      if (arrSampleData == null || arrSampleData.length == 0) return [];

      if (arrSampleData.length == 1) {
        return arrSampleData;
      }
      else {
        arrSumCount[0] = arrSampleData[0];
        for (let i = 1; i < arrSampleData.length; i++) {
          if (this.isEmptyORNaNSample(arrSampleData[i])) continue;
          arrSumCount[i] = arrSumCount[i - 1] + arrSampleData[i];
        }

        return arrSumCount;
      }
    } catch (e) {
      console.error('calculateSumCountArray', e);
      return [];
    }
  }

  //Method to calculate Red,Yellow,Green zone values for GKPI
  calculateDialMeterExpForKPI(mfData, widget) {
    try {

      let arrSampleData = mfData.avg;
      let arrFields = [0, 1, 2, 3, 4, 5, 6];
      let result = 0;
      if (arrSampleData != null && arrSampleData.length > 0) {
        for (let i = 0; i < arrFields.length; i++) {
          if (this.isEmptyORNaNSample(arrSampleData[i]))
            continue;
          result = result + arrSampleData[i];
        }
      }

      let startPoint = 0.0 * result;
      let redValuePCT = 0.50 * result;
      let yellowValuePCT = 0.85 * result;
      let greenValuePCT = 1.25 * result;

      //setting $ in case of revenue graphs only
      if (mfData.measure.metricId == 8 || mfData.measure.metricId == 17)
        widget.widget.settings.types.graph.dialMeterExpForGkpi = [startPoint, redValuePCT, yellowValuePCT, greenValuePCT, '$'];
      else
        widget.widget.settings.types.graph.dialMeterExpForGkpi = [startPoint, redValuePCT, yellowValuePCT, greenValuePCT];
    }
    catch (e) {
      console.error("error in calculateDialMeterExpForKPI method", e);
      widget.widget.settings.types.graph.dialMeterExpForGkpi = [0, 0, 0, 0];
    }
  }


  //for DDR
  //toGetDrillDownMenu(
  //widgetDDRMenu: WidgetDrillDownMenu,
  //success: () => void,
  //error: (error: AppError) => void
  //) {
  // TODO: write DDR menu logic
  //success();
  //}
  getDecodedQuery(
    bdQueryData: DBReportData,
    success: () => void,
    error: (error: AppError) => void
  ) {
    for (const data of bdQueryData.panels[0].data) {
      if (data.sqlQuery != undefined) {
        const newQuery = data.sqlQuery.replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n")
      }
    }
    success();
  }
}
