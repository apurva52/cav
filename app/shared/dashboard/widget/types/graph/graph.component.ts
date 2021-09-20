import { LowerPanelService } from './../../../../lower-tabular-panel/service/lower-tabular-panel.service';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  PipeTransform,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DashboardGraphData,
  DashboardSettingsCategoryGraphInfo,
  ForEachGraphArgs,
  GraphData,
  MFrequencyTsDetails,
  PlotBands,
  PlotLines,
} from '../../../service/dashboard.model';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import { Message } from 'primeng';
import { NumEnUsPipe } from 'src/app/shared/pipes/num-en-us/num-en-us.pipe';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as Highmap from 'highcharts/highmaps'
import Bullet from 'highcharts/modules/bullet';
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import more from 'highcharts/highcharts-more';
import { LowerTabularPanelComponent } from 'src/app/shared/lower-tabular-panel/lower-tabular-panel.component';
import { lte, indexOf } from 'lodash';
import { argv } from 'process';
import { retry } from 'rxjs/operators';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsBoost   from 'src/vendors/highchart/boost';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { GRAPH_MARKERS } from '../../constants/chartMarkers';
import { Measurement } from '../../../../compare-data/service/compare-data.model';
import { fadeOutCollapseOnLeaveAnimation } from 'angular-animations';
import { OP_TYPE_ZOOM, OP_TYPE_UNDOZOOM } from 'src/app/shared/actions.constants';
import MapModule from 'highcharts/modules/map';
import { ChartType } from '../../constants/chart-type.enum';
import { GraphStatsType } from '../../constants/widget-type.enum';
import { doubleQuotesVal } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/constants/log-mon-fieldSep-constants';
import { MAX_MIN } from 'src/app/pages/my-library/alert/alert-actions/service/alert-action-constants';
// To Support Guage chart this required
more(Highcharts);
HighchartsBoost(Highcharts);
HCSoldGauge(Highcharts);
Bullet(Highcharts);
NoDataToDisplay(Highcharts);
MapModule(Highmap);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  providers: [
    { provide: DashboardWidgetComponent, useExisting: GraphComponent },
    NumEnUsPipe,
  ],
  encapsulation: ViewEncapsulation.None,
})



export class GraphComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container widget-graph';
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  msgs: Message[] = [];
  displayChart: boolean = true;
  highchartInstance: Highcharts.Chart;
  graphData: GraphData;
  isEnableGridLineInChart: boolean = true;
  isEnableCrosshairInChart: boolean = true;
  zoomTimeToolTip: string = '';
  delayTimeToolTip: string = '';
  widgetWiseTimeToolTip: string = '';
  chartTitle: string = '';
  chartContainerId: string = null;
  pieChartVisible: boolean;
  graphInfo: any;
  zoomlength: number = 0;
  comparezoomTimeObj: any;
  isCompareZoom: boolean = false;
  @ViewChild('container', { read: ElementRef, static: false })
  container: ElementRef;
  @ViewChild('chartContainer', { read: ElementRef, static: false })
  chartContainer: ElementRef;
  @Input() visiblityMenu: any;
  seriesThreshold: number = 200;



  // widgets height and width
  get containerDimensions(): { width: number; height: number } {
    return {
      width: this.container.nativeElement.offsetWidth,
      height: this.container.nativeElement.offsetHeight,
    };
  }
  init() {
    const me = this;
  }
  render() {
    const me = this;
    // if (me.data)
    // console.log('dat:- ',me.data);
    // if(me.empty) console.log('Empty:- ',me.empty);
    if (!me.data) {
      me.empty = true;
      me.loading = false;
      return;
    }

    if (
      me.empty ||
      me.data.grpData == null ||
      me.data.grpData.mFrequency == null
    ) {
      me.empty = true;
      return;
    }
    // if(me.highchartInstance && me.widget.et === 0){
    //   let isUpdate = me.fillSeriesData();
    //   if(isUpdate){
    //     me.highchartInstance.redraw(false);
    //     return;
    //   }
    // }

    const isHighMapChart = me.checkHighMapChart(me.widget.settings.types.graph.type);
    let chartOptions: Highcharts.Options = {};
    if (me.chartContainer) {
      me.chartContainer.nativeElement.setAttribute(
        'chart-type',
        me.widget.settings.types.graph.type
      );
    }

    if(!isHighMapChart) {
      let legendNameArray = this.getLegendNameArray();
      const legendNameArr = this.getUniqueNamesOfGraphsToDisplay(legendNameArray, '>');
      const timeinfo = me.sessionService.getTimeInfo();
      chartOptions = me.getHighChartCommonOptions(legendNameArr);
      me.applyChartTypeOptions(chartOptions);
      if (me.chartContainer) {
          me.highchartInstance = Highcharts.chart(
            me.chartContainer.nativeElement,
            chartOptions
          );
      }
      //for zoom, widget wise, delay time features
      if (me.widget.zoomInfo && me.widget.zoomInfo.isZoom) {
        // let st = moment(me.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt).format(environment.formats.dateTime['default']);
        // let et = moment(me.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt).format(environment.formats.dateTime['default']);

        let st = me.sessionService.convertTimeToSelectedTimeZone(me.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt);
        let et = me.sessionService.convertTimeToSelectedTimeZone(me.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt);

        me.zoomTimeToolTip = `
        'Zoom  is applied'
        from ${(st)}
        to  ${(et)}
        `;
      }

      if (me.widget.compareZoomInfo && me.isCompareZoom) {
        let tooltip;
        console.log("me.widget.compareZoomInfo ", me.widget.compareZoomInfo);
        me.widget.compareZoomInfo[me.widget.compareZoomInfo.length - 1].forEach(comparezoomTimeObj => {
          if (tooltip)
            tooltip += '\n' + me.sessionService.convertTimeToSelectedTimeZone(comparezoomTimeObj.measurementObj.start) + " to " + me.sessionService.convertTimeToSelectedTimeZone(comparezoomTimeObj.measurementObj.end);
          else
            tooltip = me.sessionService.convertTimeToSelectedTimeZone(comparezoomTimeObj.measurementObj.start) + " to " + me.sessionService.convertTimeToSelectedTimeZone(comparezoomTimeObj.measurementObj.end);
        });
        me.zoomTimeToolTip = `
        'Zoom  is applied from'
        ${(tooltip)}
        `;
      }

    }else {
      chartOptions = me.getHighMapCommonOptions();
      me.applyChartTypeOptions(chartOptions);
    }

    me.postChartOperation(isHighMapChart, chartOptions);

  }

  postChartOperation(isHighMapChart: boolean , chartOptions:  Highcharts.Options) {
    const me = this;
    try {

      //Tooltip is changed as per QA
      // me.delayTimeToolTip = `
      // 'Delay time is applied'
      // 'Data is shifted back by ${(me.widget.settings.types.graph.selectedWidgetTimeDelay)} mins'
      // `;
      me.delayTimeToolTip = `
      'Delay time is applied with Time back ${(me.widget.settings.types.graph.selectedWidgetTimeDelay)} mins'
      `;
      if (me.widget.widgetWiseInfo) {
        let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
        let selectedTimePreset = MenuItemUtility.searchById(me.widget.widgetWiseInfo.duration.preset, timePreset);
        if (me.widget.widgetWiseInfo.duration.preset.startsWith("SPECIFIED_TIME_")) {
          me.getWidgetTimeInDateFormat(me.widget.widgetWiseInfo.duration.st, me.widget.widgetWiseInfo.duration.et)
        } else {
          me.widgetWiseTimeToolTip = `
        'Widget wise time is applied'
        ${selectedTimePreset.label}
       `;
        }
      }
    } catch (error) {
      console.error("Exception is coming in method postChartOperation " , error);
    }
  }
  getHighMapCommonOptions(): Highcharts.Options {
    const me = this;
    let chartOptions: Highcharts.Options = {
      chart: {
        animation: false,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: me.widget.settings.types.graph.bgColor,
        style: {
          // fontFamily: me.widget.settings.types.graph.displayWidgetFontFamily,
        },
        width: me.containerDimensions.width,
        height: me.containerDimensions.height,
      },
      title: null,
      credits: {
        enabled: false,
      }
    };
    return chartOptions;
  }

  getHighChartCommonOptions(legendNameArr): Highcharts.Options {
    const me = this;
    let chartOptions: Highcharts.Options = {
      chart: {
        animation: false,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: me.widget.settings.types.graph.bgColor,
        style: {
          // fontFamily: me.widget.settings.types.graph.displayWidgetFontFamily,
        },
        width: me.containerDimensions.width,
        height: me.containerDimensions.height,
      },
      title: null,
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#ffffff17',
        animation: false,
        followPointer: false,
        valueDecimals: 3,
        style: {
          width: 125,
          fontSize: '10px',
          whiteSpace: 'wrap',
        },
      },
      legend: {
        enabled: me.widget.settings.types.graph.showLegendOnWidget,
        align: me.widget.settings.types.graph.legendAlignmentOnWidget == "right" ? 'right' : me.widget.settings.types.graph.legendAlignmentOnWidget == "left" ? 'left' : 'center',
        verticalAlign: me.widget.settings.types.graph.legendAlignmentOnWidget == "center" ? 'bottom' : 'top',
        layout: me.widget.settings.types.graph.legendAlignmentOnWidget == "center" ? 'horizontal' : 'vertical',
        itemStyle: {
          color: '#333333',
          fontFamily: 'Product Sans',
          fontSize: '10px',
        },
        navigation: {
          arrowSize: 10,
          style: {
            fontWeight: 'bold',
            color: '#333',
            fontSize: '10px',
          },
        },
        labelFormatter : function () {
          const index = this['index'];
          console.log("legend index" + index);
          return legendNameArr[index];
        },
        // align: me.widget.settings.types.graph.legendAlignmentOnWidget
      },
      plotOptions: {
        pie: {
          borderWidth: 0,
          animation: false,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: me.widget.settings.types.graph.showLegendOnWidget,
        },
        gauge: {
          cursor: 'pointer',
          borderWidth: 0,
          dataLabels: {
            borderWidth: 0,
            y: 15,
          },
        },
        solidgauge: {
          borderWidth: 0,
          cursor: 'pointer',
          innerRadius: '40%',
        },
        spline: {
          cursor: 'pointer',
          animation: false,

          // pointInterval: me.getPointInterval(),
          // pointStart: me.getXAxisStartTime(),
        },
        column: {
          cursor: 'pointer',
          animation: false,
          // pointInterval: me.getPointInterval(),
          // pointStart: me.getXAxisStartTime(),
        },
        area: {
          cursor: 'pointer',
          animation: false,
          // pointInterval: me.getPointInterval(),
          // pointStart: me.getXAxisStartTime(),
        },
        series: {
          cursor: 'pointer',
          animation: false,
        },
      },
      xAxis: {
        visible: me.widget.settings.types.graph.xAxis,
        type: 'datetime',
        crosshair: true,
        dateTimeLabelFormats: me.getDateTimeLabelFormats(),
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
        // plotBands: me.addPlotBandsForxAxis(me.widget.settings.plotBandsxAxis)
      },
      yAxis: [
        {
          visible: me.widget.settings.types.graph.yAxis,
          crosshair: true,
          gridLineWidth: 1,
          labels: {
            style: {
              color: '#9b9b9b',
            },
          },
          title: {
            text: me.widget.settings.types.graph.primaryYAxisLabel,
            style: {
              color: me.widget.settings.types.graph.displayWidgetFontColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 60,
              height: 60,
              fontSize: '11px',
              textAlign: 'center',
              position: 'middle',
            },
          },
          plotLines: me.addPlotLine(),
        },
        // Secondary yAxis
        {
          visible: me.widget.settings.types.graph.yAxis,
          crosshair: true,
          gridLineWidth: 1,
          labels: {
            style: {
              color: '#9b9b9b',
            },
          },
          title: {
            text: me.widget.settings.types.graph.secondaryYAxisLabel,
            style: {
              color: me.widget.settings.types.graph.displayWidgetFontColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 60,
              height: 60,
              fontSize: '11px',
              textAlign: 'center',
              position: 'middle',
            },
          },
          opposite: true,
        },
      ],
      series: [] as Highcharts.SeriesOptionsType[],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 250,
            },
            chartOptions: {
              labels: {
                align: 'left',
                x: 0,
                y: -2,
              },
              title: {
                text: '',
              },
            },
          },
        ] as Highcharts.ResponsiveRulesOptions,
      } as Highcharts.ResponsiveOptions,
      time: {
        //timezone: timeinfo.zoneId,
        useUTC: true,
      },
      lang: {
        noData: 'Data Not Available',
        loading: 'Loading...',
        thousandsSep: ',',
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '11px',
          color: '#303030',
        },
      },
    };

    return chartOptions;
  }

  checkHighMapChart(type: number) {
    if(type == ChartType.GEO_MAP_AVG || type == ChartType.GEO_MAP_LAST || type == ChartType.GEO_MAP_MAX) {
      return true;
    }else {
      return false;
    }
  }
  resize() {
    const me = this;
    if (me.highchartInstance) {
      setTimeout(() => {
        me.highchartInstance.update({ chart: me.containerDimensions }, false,false,false);
      },0);
    }
  }
  // graphZoom(co: Highcharts.Options){
  //  co.chart = {
  // events: {
  //   selection: function(event){
  //     // me.isZoom = true;
  //   } as Highcharts.ChartSelectionCallbackFunction
  // },
  // zoomType: 'x',
  // resetZoomButton: {
  //   theme: {
  //     display: 'none'
  //   }
  // }
  //  }
  // }
  // Reset Button for graph zoom
  // resetZoom(){
  //   const me = this;
  //   me.isZoom = false;
  //   if (me.highchartInstance) {
  //     me.highchartInstance.zoomOut();
  //   }
  // }
  chartInstanceCreated(chart: Highcharts.Chart) {
    const me = this;
    me.highchartInstance = chart;
  }
  // Get Point Interval
  private getPointInterval(): number {
    return this.dashboard.dashboardTime.viewByMs || 600000; // Default 10 min //
  }
  // Get X-axis Start Time
  private getXAxisStartTime(): number {
    const me = this;
    if (me.data.grpData) {
      if (me.data.grpData.mFrequency) {
        for (const x of me.data.grpData.mFrequency) {
          return x.tsDetail.st;
        }
      }
    }
  }
  private applyChartTypeOptions(chartOptions: Highcharts.Options) {
    const me = this;
    const fnName = 'ACT_' + me.widget.settings.types.graph.type;
    if (me[fnName] && typeof me[fnName] === 'function') {
      (me[fnName] as (co: Highcharts.Options) => void).call(me, chartOptions);
    } else {
      console.error('GraphComponent.' + fnName + ' is missign.');
    }
  }
  // Get Data For Normal Graph
  private getNormalGraphData(graph: GraphData, gsType: string): number[] {
    const me = this;
    const gData: number[] = [];
    const dataFilter: string[] = me.widget.settings.graphStatsType.split(',');
    //for (const d of dataFilter) {
    if (graph) {
      if (gsType === '0') {
        for (const avgData of graph.avg) {
          gData.push(me.isCavissonNullVal(avgData));
        }
      } else if (gsType === '3') {
        for (const countData of graph.count) {
          gData.push(me.isCavissonNullVal(countData));
        }
      } else if (gsType === '4') {
        for (const sumCountData of graph.sumCount) {
          gData.push(me.isCavissonNullVal(sumCountData));
        }
      } else if (gsType === '1') {
        for (const minData of graph.min) {
          gData.push(me.isCavissonNullVal(minData));
        }
      } else if (gsType === '2') {
        for (const maxData of graph.max) {
          gData.push(me.isCavissonNullVal(maxData));
        }
      }
    } else {
      me.empty = true;
    }
    // }
    return gData;
  }
  // Get Data for Percentile Graph
  private getPercentileGraphData(graph: GraphData): number[] {
    const me = this;
    const percentileGraphData: number[] = [];
    if (graph) {
      if (graph.percentile) {
        for (const arrPct of me.widget.settings.types.graph.arrPct) {
          percentileGraphData.push(
            me.isCavissonNullVal(graph.percentile[arrPct - 1])
          );
        }
      }
    } else {
      me.empty = true;
    }
    return percentileGraphData;
  }
  // Get Data for Percentile line Graph
  private getPercentileGraphDataForLine(graph: GraphData): number[] {
    const me = this;
    const percentileGraphData: number[] = [];
    if (graph) {
      for (const percentile of graph.percentile) {
        if (percentile) {
          percentileGraphData.push(me.isCavissonNullVal(percentile));
        }
      }
    } else {
      me.empty = true;
    }
    return percentileGraphData;
  }
  // Get Data for Slab Graph
  private getSlabGraphData(graph: GraphData): number[] {
    const me = this;
    const slabGraphData: number[] = [];
    if (graph) {
      if (graph.slabCount) {
        for (const slabData of graph.slabCount) {
          slabGraphData.push(me.isCavissonNullVal(slabData));
        }
      }
    } else {
      me.empty = true;
    }
    return slabGraphData;
  }
  // Get Normal Data For Pie And Donut Graph
  private getNormalGraphDataForPieAndDonutChart(
    graph: GraphData,
    gsType: string
  ): number {
    const me = this;
    if (graph) {
      //for (const dataFilter of me.widget.settings.dataFilter) {
      if (gsType === '0') {
        return me.isCavissonNullVal(graph.lowerPanelSummary[gsType].avg);
      }
      if (gsType === '1') {
        return me.isCavissonNullVal(graph.lowerPanelSummary[gsType].min);
      }
      if (gsType === '2') {
        return me.isCavissonNullVal(graph.lowerPanelSummary[gsType].max);
      }
      if (gsType === '3') {
        return me.isCavissonNullVal(graph.lowerPanelSummary[gsType].count);
      }
      //  }
    } else {
      me.empty = true;
    }
  }
  // Get Data for Percentile Graph For Pie and Donut Chart
  private getPercentileAndSlabGraphDataForPieDonut(graph: GraphData): number {
    const me = this;
    const pctorSlabValue: number =
      me.widget.settings.types.graph.pctOrSlabValue;
    if (
      me.widget.settings.types.graph.type === 60 ||
      me.widget.settings.types.graph.type === 42
    ) {
      return me.isCavissonNullVal(graph.percentile[pctorSlabValue - 1]);
    } else if (
      me.widget.settings.types.graph.type === 46 ||
      me.widget.settings.types.graph.type === 53
    ) {
      return me.isCavissonNullVal(graph.slabCount[pctorSlabValue - 1]);
    }
  }
  private getSlabAndPercentileGraphDataForGauge(graph: GraphData): number {
    const me = this;
    const pctorSlabValue: number =
      me.widget.settings.types.graph.pctOrSlabValue;
    if (
      me.widget.settings.types.graph.type === 50 ||
      me.widget.settings.types.graph.type === 51
    ) {
      return me.isCavissonNullVal(graph.slabCount[pctorSlabValue - 1]);
    } else if (
      me.widget.settings.types.graph.type === 39 ||
      me.widget.settings.types.graph.type === 40
    ) {
      return me.isCavissonNullVal(graph.percentile[pctorSlabValue - 1]);
    }
  }

  addPlotBandsForxAxis(plotBandsxAxis: PlotBands[]): Highcharts.XAxisPlotBandsOptions[] {
    const me = this;

    if(!plotBandsxAxis)
    {
      plotBandsxAxis = [];
      return plotBandsxAxis;
    }

    let newPlotBandsxAxis = JSON.parse(JSON.stringify(plotBandsxAxis));

    newPlotBandsxAxis.forEach(element => {
      element.from = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(element.from);
      element.to = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(element.to);
    });

    return newPlotBandsxAxis;
  }

  public addPlotLinesForxAxis(plotLinesxAxis: PlotLines[]): Highcharts.XAxisPlotLinesOptions[]
  {
    const me = this;

    if(!plotLinesxAxis)
    {
      plotLinesxAxis = [];
      return plotLinesxAxis;
    }

    plotLinesxAxis.forEach(element => {
      element.value = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(element.value);
    });

    return plotLinesxAxis;
  }

  // Baseline trends graph
  private addPlotLine() {
    const me = this;
    const line = [];
    if (
      me.widget.settings.baselineCompare.critical > '0' ||
      me.widget.settings.baselineCompare.major > '0' ||
      me.widget.settings.baselineCompare.minor > '0'
    ) {
      line.push(
        {
          color: '#FF0000',
          value: me.widget.settings.baselineCompare.critical,
          width: 3,
        },
        {
          color: '#FF9900',
          value: me.widget.settings.baselineCompare.major,
          width: 3,
        },
        {
          color: '#FFFF00',
          value: me.widget.settings.baselineCompare.minor,
          width: 3,
        }
      );
    }
    return line;
  }
  // Get Data For Gauge Chart
  private getDataForGaugeChart(graphData: GraphData, val: number): Array<any> {
    const me = this;
    const dialGraphExp = me.widget.settings.types.graph.dialMeterExp;
    let arr, minimum, maximum, threshold, warning, critical;
    const data = [];
    if (dialGraphExp != null) {
      arr = dialGraphExp.split('_');
      minimum = parseFloat(arr[0]);
      maximum = parseFloat(arr[1]);
      threshold = arr[2];
      warning = parseFloat(arr[3]);
      critical = parseFloat(arr[4]);
    }
    const title = graphData.measure.metric;
    let value = val;
    value = parseFloat(value.toFixed(3));
    if (value > maximum) {
      maximum = value;
      const diffMin = ((maximum - minimum) / maximum) * 100;
      const diffWarn = ((maximum - warning) / maximum) * 100;
      const diffCri = ((maximum - critical) / maximum) * 100;
      minimum = minimum + (diffMin * minimum) / 100;
      warning = warning + (diffWarn * warning) / 100;
      critical = critical + (diffCri * critical) / 100;
    }
    if (value < minimum) {
      minimum = value;
    }
    value = parseFloat(value.toFixed(0));
    minimum = parseFloat(minimum.toFixed(2));
    maximum = parseFloat(maximum.toFixed(2));
    critical = parseFloat(critical.toFixed(2));
    warning = parseFloat(warning.toFixed(2));
    data.push(title);
    data.push(value);
    data.push(minimum);
    data.push(maximum);
    data.push(threshold);
    data.push(warning);
    data.push(critical);
    return data;
  }
  // Get Category Series
  private getSeriesForCategory(
    graphData: DashboardGraphData
  ): Highcharts.SeriesOptionsType[] {
    const me = this;
    const catGraphInfo: DashboardSettingsCategoryGraphInfo =
      me.dashboard.data.favDetailCtx.settings.categoryGraphInfo;
    const arrNormal = new Array();
    const arrSlow = new Array();
    const arrVerySlow = new Array();
    let normalRange;
    let slowRange;
    let verySlowRange;
    if (catGraphInfo === null) {
      return;
    } else {
      normalRange = catGraphInfo.catGraphThreshold[0].range;
      slowRange = catGraphInfo.catGraphThreshold[1].range;
      verySlowRange = catGraphInfo.catGraphThreshold[2].range;
    }
    //   /** Getting Data of Panel. */
    const panelData = graphData.mFrequency[0].data;
    /** Getting total samples. */
    let totalSamples = graphData.mFrequency[0].data[0].avg.length;
    /** Getting Timestamp array. */
    let arrTimestamp = graphData.mFrequency[0].tsDetail.st;
    let pointStart;
    let pointIntervl;
    // }
    for (let i = 0; i < totalSamples; i++) {
      /** Now getting Panel Graphs. */
      let normalCount = 0;
      let slowCount = 0;
      let verySlowCount = 0;
      const graphs = graphData.mFrequency[0].data;
      /** Iterating through Number of graphs. */
      // for (let k = 0; k < graphs.length; k++) {
      me.forEachGraph((args: ForEachGraphArgs) => {
        // const panelGraph = graphs[args.graphIndex];
        let value;
        /*Adding empty sample if graph has NaN values.*/
        if (args.graph.avg[i] === -123456789 || args.graph.avg[i] === -7111777111) {
          value = -1;
        } else {
          value = args.graph.avg[i];
        }


        if (typeof value === 'undefined') {
          value = -1;
        }
        if (value >= normalRange && value < slowRange) {
          normalCount++;
        } else if (value >= slowRange && value < verySlowRange) {
          slowCount++;
        } else if (value >= verySlowRange) {
          verySlowCount++;
        }
        pointStart = args.tsDetail.st;
        pointIntervl = args.tsDetail.frequency;
      });
      /*Adding count to array.*/
      arrNormal.push(normalCount);
      arrSlow.push(slowCount);
      arrVerySlow.push(verySlowCount);
    }
    const arrChartSeries = [];
    for (let i = 0; i < 3; i++) {
      let graphName = '';
      let color = '';
      if (i === 0) {
        graphName = catGraphInfo.catGraphThreshold[2].categoryGraphName;
        color = catGraphInfo.catGraphThreshold[2].categoryGraphColor;
      } else if (i === 1) {
        graphName = catGraphInfo.catGraphThreshold[1].categoryGraphName;
        color = catGraphInfo.catGraphThreshold[1].categoryGraphColor;
      } else if (i === 2) {
        graphName = catGraphInfo.catGraphThreshold[0].categoryGraphName;
        color = catGraphInfo.catGraphThreshold[0].categoryGraphColor;
      }
      let value;
      const arrChartSeriesData = [];
      for (let k = 0; k < totalSamples; k++) {
        const chartSerieData = { x: null, y: null };
        if (i === 0) {
          value = arrVerySlow[k];
        } else if (i === 1) {
          value = arrSlow[k];
        } else if (i === 2) {
          value = arrNormal[k];
        }
        chartSerieData.x = arrTimestamp[k];
        if (value === -123456789 || value === -7111777111) {
          chartSerieData.y = null;
        } else {
          chartSerieData.y = value;
        }
        arrChartSeriesData.push(chartSerieData);
      }
      /** Creating Object of one series. */
      const chartSeries = {
        data: null,
        name: null,
        color: null,
        marker: { enabled: false },
        pointStart: null,
        pointInterval: null
      };
      /** Now setting information in chart series. */
      chartSeries.data = arrChartSeriesData;
      chartSeries.name = graphName;
      chartSeries.color = color;
      chartSeries.pointInterval = pointIntervl * 1000;
      chartSeries.pointStart = pointStart;
      arrChartSeries.push(chartSeries);
    }
    return arrChartSeries;
  }
  // Legend Options for Pie charts
  private getLegendOptionsForPie() {
    const me = this;
    let legendNameArray = this.getLegendNameArray();
    const legendNameArr = this.getUniqueNamesOfGraphsToDisplay(legendNameArray, '>');
    const layout: string = me.widget.settings.types.graph.legendAlignmentOnWidget == "center" ? 'horizontal' : 'vertical';
    let align =null;
    let verticalAlign =null;
    if (me.containerDimensions.width <= 650 || me.containerDimensions.width >= 1302) {
      if(me.widget.settings.types.graph.legendAlignmentOnWidget === "center"){
        align ="bottom";
        verticalAlign ="bottom";
      }
      else{
        align =me.widget.settings.types.graph.legendAlignmentOnWidget;
        verticalAlign =me.widget.settings.types.graph.legendAlignmentOnWidget;
      }

      if (layout === 'vertical') {
        return {
          align: align,
          verticalAlign: verticalAlign,
          layout: layout,
          itemStyle: {
            color: '#333333',
            fontFamily: 'Product Sans',
            fontSize: '10px',
          },
          navigation: {
            arrowSize: 10,
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '10px',
            },
          },
           labelFormatter: function () {
            const index = this['index'];
            return legendNameArr[index];
           },
        } as Highcharts.LegendOptions;
      } else {
        return {
          align: me.widget.settings.types.graph.legendAlignmentOnWidget == "right" ? 'right' : me.widget.settings.types.graph.legendAlignmentOnWidget == "left" ? 'left' : 'center',
          verticalAlign: me.widget.settings.types.graph.legendAlignmentOnWidget == "center" ? 'bottom' : 'top',
          layout: layout,
          itemStyle: {
            color: '#333333',
            fontFamily: 'Product Sans',
            fontSize: '10px',
          },
          navigation: {
            arrowSize: 10,
            style: {
              fontWeight: 'bold',
              color: '#333',
              fontSize: '10px',
            },
          },
           labelFormatter: function () {
            const index = this['index'];
            return legendNameArr[index];
         },
        } as Highcharts.LegendOptions;
      }
    }
    return {};
  }
  // xAxis Slab for Correlated graph
  private getCorrelatedXAxisData(): Array<string> {
    const me = this;
    const xAxisArrayCat = [];
    for (
      let bucket_index = 0;
      bucket_index < me.data.grpData.mFrequency[0].bucketName.length - 1;
      bucket_index++
    ) {
      if (
        bucket_index ===
        me.data.grpData.mFrequency[0].bucketName.length - 2
      ) {
        xAxisArrayCat[bucket_index] =
          me.data.grpData.mFrequency[0].bucketName[bucket_index] + '';
        xAxisArrayCat[bucket_index + 1] =
          me.data.grpData.mFrequency[0].bucketName[bucket_index] + '+';
      } else {
        xAxisArrayCat[bucket_index] =
          me.data.grpData.mFrequency[0].bucketName[bucket_index] + '';
      }
    }
    return xAxisArrayCat;
  }
  // xAxis SlaName graphs
  private getGraphSlabName(): Array<string> {
    const me = this;
    const slabCategories: string[] = [];
    if (me.data.grpData.mFrequency[0].data[0].slabName) {
      for (const slabName of me.data.grpData.mFrequency[0].data[0].slabName) {
        slabCategories.push(slabName);
      }
    }
    return slabCategories;
  }
  // Check Not a Number
  private isCavissonNullVal(val: number): number {
    if (val === -123456789 || val === -7111777111) {
      return (val = 0);
    } else {
      return val;
    }
  }
  private getDateTimeLabelFormats(): Highcharts.AxisDateTimeLabelFormatsOptions {
    return {
      millisecond: '%H:%M:%S.%L',
      second: '%H:%M:%S',
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%e. %b',
      week: '%e. %b',
      month: "%b '%y",
      year: '%Y',
    };
  }
  // Create Data Label Formats
  private getDataLabelFormats(number) {
    // Units
    const POSTFIXES = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
    // what tier? (determines SI prefix)
    const tier = (Math.log10(Math.abs(number)) / 3) | 0;
    // if zero, we don't need a prefix
    if (tier === 0) {
      return number;
    }
    // get postfix and determine scale
    const postfix = POSTFIXES[tier];
    const scale = Math.pow(10, tier * 3);
    // scale the number
    const scaled = number / scale;
    // format number and add postfix as suffix
    let formatted = scaled.toFixed(0) + '';
    // remove '.0' case
    if (/\.0$/.test(formatted)) {
      formatted = formatted.substr(0, formatted.length - 2);
    }
    return formatted + postfix;
  }
  // Highlight Selected Graph
  private highlightSelectedGraph(selected: boolean, def?: any): any {
    const me = this;
    const LINE_AREA = [
      0,
      3,
      4,
      5,
      7,
      36,
      41,
      43,
      45,
      47,
      52,
      54,
      80,
      81,
      82,
      85,
      6,
      12,
      37,
      44,
      48,
      55,
      80,
      88,
      91,
      92,
      62,
      86,
      83
    ];
    const PIE_DONUT = [13, 14, 22, 23, 24, 25, 26, 27, 60, 46, 32, 33, 42, 53];
    const BAR_TYPE = [11,28,59,8,38,49];
    const type = me.widget.settings.types.graph.type;
    if (LINE_AREA.indexOf(type) !== -1) {
      if (selected === true) {
        const lineWidth = 4;
        return lineWidth;
      } else {
        return def;
      }
    } else if (PIE_DONUT.indexOf(type) !== -1) {
      if (selected === true) {
        return true;
      } else {
        return def;
      }
    } else if (BAR_TYPE.indexOf(type) !== -1) {
      if (selected === true) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  // LINE_CHART
  private ACT_0(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    // for the series boost threshold
    if(me.sessionService.dashboardConfigSettingData) {
       me.seriesThreshold = me.sessionService.dashboardConfigSettingData['seriesBoostThreshold'];
    }
    co.boost =  {
      seriesThreshold: me.seriesThreshold,
          useGPUTranslations: true,
          debug:{
          showSkipSummary:false,
          timeBufferCopy:false,
          timeSetup:false
          }
      }

      co.plotOptions = {
        series: {
          cursor: 'pointer',
          point: {
              events: {
                  click:  this.chartEventHandler.bind(this)
              }
          }
      },
      };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['plotBands'] = [...me.addPlotBandsForxAxis(me.widget.settings.plotBandsxAxis)];
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    // if(this.widget.compareZoomInfo &&this.widget.compareZoomInfo.length!=0 && this.isCompareZoom){
    //   co.subtitle = { text: this.getWidgetChartTitleForCompare(this.widget.compareZoomInfo[this.widget.compareZoomInfo.length - 1][0].measurementObj.start, this.widget.compareZoomInfo[this.widget.compareZoomInfo.length - 1][0].measurementObj.start, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
        events: {
          setExtremes: this.zoomEventHandler.bind(this)
        }
      };
      // for (const arr of me.widget.trendList) {
      //   co.xAxis.categories.push(arr.name);
      // }
      co.plotOptions = {
        area: {
          cursor: 'pointer',
          animation: false,
          stacking: 'normal',
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graph.baselineGraph === true) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          animation: false,
          dashStyle: 'ShortDot',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
          if (args.graph.lowerPanelChecked) {
            args.graphSettings.visible = false;
          }
          else {
            args.graphSettings.visible = true;
          }
          co.series.push({
            name: args.graphName,
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: { enabled: true },
            animation: false,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          } as Highcharts.SeriesOptionsType);
        }
        else {
          let colors: string = null;
          me.graphInfo = null;
          if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
            me.graphInfo = args.graph;
            colors = args.graph.compareColor;
            let time = null;
            let timezone = null;
            timezone = this.sessionService.session.defaults.timeInfo.zone;
            time = this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(args.graph.compareTime);
            co.xAxis = {
              visible: me.widget.settings.types.graph.xAxis,
              //categories: me.getTrendData(),
              crosshair: true,
              type: 'datetime',
              labels: {
                formatter: function () {
                  return Highcharts.dateFormat('%H:%M:%S', this.value);
                }
              },
              events: {
                setExtremes: this.zoomEventHandler.bind(this)
              }
            }
            co.tooltip = {
              shared: true,
              enabled: true,
              borderColor: '#2c3e50',
              animation: false,
              followPointer: false,
              valueDecimals: 3,
              style: {
                fontSize: '10px',
                whiteSpace: 'wrap',
              },
              formatter: function () {
                var points = this.points;
                var pointsLength = points.length;
                //let t = moment.tz(points[0].key + time, timezone).format('MM/DD/YY HH:mm:ss')
                //let t = Highcharts.dateFormat('%A:%b:%e:%Y:%H:%M:%S',args.graph.compareTime +points[0].key);
                var tooltipMarkup = pointsLength ? '<span style="font-size: 10px">' + '</span><br/>' : '';
                var index;
                var y_value_kwh;
                var t;
                for (index = 0; index < pointsLength; index += 1) {
                  y_value_kwh = points[index].y;
                  let zoomSt = points[index].series.options.className.split("&&");
                  if (zoomSt.length > 1){
                    t = moment.tz((points[0].key - Number(zoomSt[1])) + Number(zoomSt[0]), timezone).format('MM/DD/YY HH:mm:ss');
                  }
                  else{
                    t = moment.tz(points[0].key + Number(zoomSt[0]), timezone).format('MM/DD/YY HH:mm:ss');
                  }
                  //let t = Highcharts.dateFormat('%A:%b:%e:%Y:%H:%M:%S',time );
                  // tooltipMarkup += '<span style="color:' + points[index].series.name + '">\u25CF</span> ' + points[index].series.name + ': <b>' + y_value_kwh  + ' </b><br/>';
                  tooltipMarkup += t + '<span> - </span>' + '<span>' + points[index].series.name + ': <b>' + y_value_kwh + '</span>' + ' </b><br/>';
                }
                return tooltipMarkup;
              }
            }
            // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
            //   co.subtitle = { text: this.getWidgetChartTitleinCompare(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
            // }
            if (args.graph.lowerPanelChecked) {
              args.graphSettings.visible = false;
            }
            else {
              args.graphSettings.visible = true;
            }
          }
          else {
            colors = args.graphSettings.color;
          }
          co.series.push({
            name: args.graphName,
            className: args.graph.compareColor ? this.getCompareZoomStartTime(args.graph.compareTime, args.graph.compareZoomSt, me.widget.compareZoomInfo) + '' : '',
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: me.enableChartMarkersForFilters(args),
            animation: false,
            pointStart: args.graph.compareColor ? this.getCompareStartTime(args.graph.compareColor, args.tsDetail.st, me.widget.compareZoomInfo) : this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
            pointInterval: args.tsDetail.frequency * 1000,
            color: colors,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          } as Highcharts.SeriesOptionsType);
        }
      }
    });
    // if (_.every(co.series, ['visible', false]) === true) {
    //   me.empty = true;
    // } else {
    //   me.empty = false;
    // }
  }
  getWidgetChartTitleForCompare(startTime: any, endTime: any, selected: any): string {
    try {
      let st = moment(startTime).format(environment.formats.dateTime['default']);
      let et = moment(endTime).format(environment.formats.dateTime['default']);
      // if(this.widget.settings.types.graph.selectedWidgetTimeDelay > 0)
      // this.chartTitle =  'Data is shifted back by  ' + this.widget.settings.types.graph.selectedWidgetTimeDelay + '  mins';
      // else
      if (this.widget.compareZoomInfo && this.isCompareZoom) {
        this.chartTitle = 'Zoom is applied from  ' + st + ' to ' + et;
      }
      // else if((this.widget.widgetWiseInfo && this.widget.widgetWiseInfo.widgetWise)){
      //   this.chartTitle =  'Widget time is applied from   ' + st + ' to ' + et;
      // }
      return this.chartTitle;
    } catch (error) {
      console.error("error is getting widget chart title", error)
      return '';
    }
  }
  getWidgetChartTitleinCompare(startTime: number, endTime: number, selected: any): string {
    try {
      console.log("enter here in case of compare");
      let st = moment(startTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      let et = moment(endTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      // if(this.widget.settings.types.graph.selectedWidgetTimeDelay > 0)
      // this.chartTitle =  'Data is shifted back by  ' + this.widget.settings.types.graph.selectedWidgetTimeDelay + '  mins';
      // else
      let etNew: String[];
      let stNew: String[];
      stNew = st.split(" ");
      etNew = et.split(" ");
      if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
        this.chartTitle = 'Zoom is applied from  ' + stNew[1] + ' to ' + etNew[1];
      }
      // else if((this.widget.widgetWiseInfo && this.widget.widgetWiseInfo.widgetWise)){
      //   this.chartTitle =  'Widget time is applied from   ' + st + ' to ' + et;
      // }
      return this.chartTitle;
    } catch (error) {
      console.error("error is getting widget chart title", error)
      return '';
    }
  }
  getTooltipForCompare(tsDetail: MFrequencyTsDetails, graph: GraphData, gsType: string) {
    const me = this;
    const gData: number[] = [];
    let startTime = tsDetail.st;
    let arrTimeStamp: any[] = [];
    let st: number = tsDetail.st;
    let cst: any[] = [];
    let cet: any[] = [];
    let etTime: number = 0;
    const dataFilter: string[] = me.widget.settings.graphStatsType.split(',');
    console.log('working');
    //for (const d of dataFilter) {
    if (graph) {
      if (gsType === '0') {
        // if (me.data.grpData.mFrequency[0].measurementName) {
        //   for (let i = 0; i < me.data.grpData.mFrequency[0].measurementName.length; i++) {
        //     cst.push(me.data.grpData.mFrequency[0].measurementName[i].start);
        //     cet.push(me.data.grpData.mFrequency[0].measurementName[i].end);
        //   }
        //   for(let k=0;k<cst.length;k++){
        //     if(cst[k]<st1){
        //       st1 =cst[k];
        //     }
        //   }
        //   for(let j=0;j<cet.length;j++){
        //     if(cet[j]>etTime){
        //       etTime=cet[j];
        //     }
        //   }
        //   startTime = st1;
        //   console.log("startTime-------->",moment.tz(startTime+ "").format('HH:mm:ss'))
        //   //count = me.data.grpData.mFrequency[0].count;
        // //  console.log("count------->",count);
        // }
        for (let k = 0; k < me.data.grpData.mFrequency[0].measurementName.length; k++) {
          for (let i = 0; i < graph.avg.length; i++) {
            st = me.data.grpData.mFrequency[0].measurementName[k].start;
            gData[i] = st;
            arrTimeStamp[i] = moment.tz(gData[i] + "").format('MM/DD/YY HH:mm:ss')
            st = st + tsDetail.frequency;
            //gData.push(me.isCavissonNullVal(avgData));
          }
        }
      } else if (gsType === '3') {
        for (const countData of graph.count) {
          gData.push(me.isCavissonNullVal(countData));
        }
      } else if (gsType === '4') {
        for (const sumCountData of graph.sumCount) {
          gData.push(me.isCavissonNullVal(sumCountData));
        }
      } else if (gsType === '1') {
        for (const minData of graph.min) {
          gData.push(me.isCavissonNullVal(minData));
        }
      } else if (gsType === '2') {
        for (const maxData of graph.max) {
          gData.push(me.isCavissonNullVal(maxData));
        }
      }
    } else {
      me.empty = true;
    }
    // }
    console.log("arrTimeStamp------>", arrTimeStamp);
    return arrTimeStamp;
  }
  getCompareStartTime(compareColor: string, st: number, compareZoomInfo: any) {
    const me = this;
    try {
      if (compareZoomInfo && compareZoomInfo.length > 0) {
        st = Math.round(me.widget.compareZoomInfo[me.widget.compareZoomInfo.length - 1][0].zoomSt / 60000) * 60000;
      }
      else {
        if (compareColor) {
          st = 0;
        }

      }
    } catch (error) {
      console.error("error in get Compare Start Time For XAxis", error)
    }
    return st;
  }
  getCompareZoomStartTime(compareTime: number, compareZoomSt: number, compareZoomInfo: any): any {
    const me = this;
    let compareZoomTS:any;
    try {

      if (compareZoomInfo && compareZoomInfo.length > 0) {
        compareZoomTS = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(compareTime) + "&&" + compareZoomSt;
      }
      else {
         compareZoomTS = this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(compareTime);
      }
    } catch (error) {
      console.error("error in get Compare Start Time For XAxis", error)
    }
    return compareZoomTS;
  }
  //Method for showing markers on based of sample filters in widget settings
  enableChartMarkersForFilters(args: ForEachGraphArgs): Highcharts.PointMarkerOptionsObject {
    const me = this;
    let markerObj: { enabled: boolean, symbol?: string, radius?: number } = { enabled: false };
    if (me.widget.settings.graphFilter && me.widget.settings.graphFilter.length > 0) {
      const graphMarkersLength = GRAPH_MARKERS.length;
      const markervalue = args.globalGraphIndex % graphMarkersLength;
      for (let i = 0; i < me.widget.settings.graphFilter.length; i++) {
        if (args.graph.measure.metric == me.widget.settings.graphFilter[i].graphName) {
          markerObj.enabled = true;
          // console.log('markervalue', markervalue, GRAPH_MARKERS[markervalue]);
          markerObj.symbol = GRAPH_MARKERS[markervalue];
          markerObj.radius = 5;
        }
      }
    }
    return markerObj;
  }
  getTrendData(): string[] {
    const me = this;
    const trendList: string[] = [];
    if (me.data.grpData.mFrequency[0].measurementName) {
      for (let i = 0; i < me.data.grpData.mFrequency[0].measurementName.length; i++) {
        trendList.push(me.data.grpData.mFrequency[0].measurementName[i].name);
      }
    }
    return trendList;
  }
  // PIE_CHART_AVG_TOP5
  private ACT_14(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (_.every(pieSeries.data, ['visible', false]) === true) {
      me.pieChartVisible = false;
    } else {
      me.pieChartVisible = true;
    }
  }
  // PIE_CHART_LAST_TOP5
  private ACT_13(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_LAST_TOP10
  private ACT_22(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_AVG_TOP10
  private ACT_23(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_LAST_ALL
  private ACT_24(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_AVG_ALL
  private ACT_25(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_LAST_BOTTOM10
  private ACT_26(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // PIE_CHART_AVG_BOTTOM10
  private ACT_27(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // BAR_CHART_AVG_ALL
  private ACT_28(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };

    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          borderColor:'black'
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          borderColor:'black',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // BAR_CHART_AVG_TOP5
  private ACT_29(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // BAR_CHART_AVG_TOP10
  private ACT_30(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // BAR_CHART_AVG_BOTTOM10
  private ACT_31(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // AREA_CHART
  private ACT_6(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // DUAL_LINE_BAR
  private ACT_4(co: Highcharts.Options) {
    const me = this;
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        label: {
          connectorAllowed: false,
        },
        animation: false,
      },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (args.graphIndex === 0) {
        if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
          co.series.push({
            name: args.graphName,
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: { enabled: false },
            animation: false,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          } as Highcharts.SeriesOptionsType);
        }
        else {
          co.series.push({
            name: args.graphName,
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: { enabled: false },
            animation: false,
            type: 'column',
            yAxis: 1,
            pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
            pointInterval: args.tsDetail.frequency * 1000,
            color: colors,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
          } as Highcharts.SeriesOptionsType);
        }
      } else {
        if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
          co.series.push({
            name: args.graphName,
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: { enabled: false },
            animation: false,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          } as Highcharts.SeriesOptionsType);
        }
        else {
          co.series.push({
            name: args.graphName,
            data: me.getNormalGraphData(args.graph, args.gsType),
            marker: { enabled: false },
            animation: false,
            type: 'spline',
            pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
            pointInterval: args.tsDetail.frequency * 1000,
            color: colors,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          } as Highcharts.SeriesOptionsType);
        }
      }
    });
  }
  getTrendList(trendList: import("../../../../compare-data/service/compare-data.model").Measurement[]): string[] {
    const me = this;
    const trendListCategory: string[] = [];
    for (const arr of me.widget.trendList) {
      trendListCategory.push(arr.name);
    }
    me.data.grpData.mFrequency[0].data[0].trendList = trendListCategory;
    if (me.data.grpData.mFrequency[0].data[0].trendList) {
      for (const trend of me.data.grpData.mFrequency[0].data[0].trendList) {
        trendListCategory.push(trend);
      }
    }
    return trendListCategory;
  }
  // STACKED_AREA_CHART
  private ACT_12(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // STACKED_BAR_CHART
  private ACT_11(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.plotOptions = {
      column: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
      co.xAxis = {
        visible: me.widget.settings.types.graph.xAxis,
        categories: me.getTrendData(),
        crosshair: true,
        labels: {
          autoRotation: false,
          style: {
            color: '#9b9b9b',
          },
        },
      };
    }
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      if (me.widget.isTrendCompare && me.widget.isApplyCompare) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          borderColor:'black'
        } as Highcharts.SeriesOptionsType);
      }
      else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          color: colors,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
          borderColor:'black',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_GRAPH
  private ACT_7(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    // for the series boost threshold
    if(me.sessionService.dashboardConfigSettingData) {
      me.seriesThreshold = me.sessionService.dashboardConfigSettingData['seriesBoostThreshold'];
   }
   co.boost =  {
     seriesThreshold: me.seriesThreshold,
         useGPUTranslations: true,
         debug:{
         showSkipSummary:true,
         timeBufferCopy:true,
         timeSetup:false
         }
     }
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      // categories: [],
      min: 1,
      max: 100,
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    // for (const arr of me.widget.settings.types.graph.arrPct) {
    //   co.xAxis.categories.push(arr.toString());
    // }
    co.plotOptions = {
      series: {
        animation: false,
        pointStart: 1,
        cursor: 'pointer',
        label: {
          connectorAllowed: false,
        },
        point: {
          events: {
              click:  this.chartEventHandler.bind(this)
          }
      }
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      co.series.push({
        name: args.graphName,
        //// color: args.graphSettings.color,
        data: me.getPercentileGraphDataForLine(args.graph),
        marker: { enabled: false },
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_GRAPH
  private ACT_8(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        point: {
          events: {
              click:  this.chartEventHandler.bind(this)
          }
      },
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      let colors: string = null;
      if (args.graph.compareColor != null && args.graph.compareColor != undefined) {
        colors = args.graph.compareColor;
      }
      else {
        colors = args.graphSettings.color;
      }
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: colors,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        borderColor:'black'
      } as Highcharts.SeriesOptionsType);
    });
  }
  // DIAL_CHART_LAST
  private ACT_18(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'gauge';
    const pane = [];
    co.pane = pane as Highcharts.PaneOptions;
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.series = [];
    // let n: number = 0;
    // Formula (100/{COUNT OF GRAPHS})  /// to find to width of pane
    const count = me.widget.settings.multiDial.count;
    const length = me.data.grpData.mFrequency[0].data.length;
    let paneWidth: number;
    if (count > 1 && length > 1) {
      paneWidth = 100 / count;
    } else {
      paneWidth = 100 / length;
    }
    // Formula {PANE WIDTH}/2  /// to find to center of pane
    const paneCenter: number = paneWidth / 2;
    let n: number = 0;
    let i: number = 0;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (me.widget.settings.multiDial.enabled) {
        if (args.globalGraphIndex >= count) {
          return;
        }
        pane.push({
          startAngle: -140,
          endAngle: 140,
          background: [
            {
              backgroundColor: null,
              borderWidth: 0,
              outerRadius: '50%',
              innerRadius: '50%',
            },
          ],
          size: '75%',
          center: [paneCenter + paneWidth * i++ + '%', '50%'],
        });
        let dialChartInfo = [];
        dialChartInfo = me.getDataForGaugeChart(
          args.graph,
          me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType].lastSample)
        );
        let title = dialChartInfo[0];
        let value = dialChartInfo[1];
        const minimum = dialChartInfo[2];
        const maximum = dialChartInfo[3];
        const threshold = dialChartInfo[4];
        const warning = dialChartInfo[5];
        const critical = dialChartInfo[6];
        const color = dialChartInfo[7];
        let plotBandColor = [];
        if (threshold === '>') {
          plotBandColor = [
            { from: minimum, to: warning, color: '#55BF3B' },
            { from: warning, to: critical, color: '#DDDF0D' },
            { from: critical, to: maximum, color: '#C02316' },
          ];
        } else {
          plotBandColor = [
            { from: minimum, to: critical, color: '#C02316' },
            { from: critical, to: warning, color: '#DDDF0D' },
            { from: warning, to: maximum, color: '#55BF3B' },
          ];
        }
        yAxis.push({
          visible: args.graphSettings.visible,
          min: minimum,
          max: maximum,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',
          tickPixelInterval: 30,
          tickWidth: 1,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            distance: -20,
            rotation: 'auto',
            formatter: function () {
              return me.getDataLabelFormats(this.value);
            } as Highcharts.AxisLabelsFormatterCallbackFunction,
          } as Highcharts.YAxisLabelsLevelsOptions,
          plotBands: plotBandColor,
          pane: n,
        } as Highcharts.YAxisOptions);
        co.series.push({
          name: title,
          data: [value],
          yAxis: n,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              return numFormat.transform(value);
            },
          },
        } as Highcharts.SeriesOptionsType);
        n++;
      } else {
        if (args.graphIndex === 0) {
          pane.push({
            startAngle: -140,
            endAngle: 140,
            background: [
              {
                backgroundColor: null,
                borderWidth: 1,
                outerRadius: '50%',
                innerRadius: '50%',
              },
            ],
            size: '75%',
            center: [paneCenter + paneWidth * i++ + '%', '50%'],
          });
          let dialChartInfo = [];
          dialChartInfo = me.getDataForGaugeChart(
            args.graph,
            me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType].lastSample)
          );
          let title = dialChartInfo[0];
          let value = dialChartInfo[1];
          const minimum = dialChartInfo[2];
          const maximum = dialChartInfo[3];
          const threshold = dialChartInfo[4];
          const warning = dialChartInfo[5];
          const critical = dialChartInfo[6];
          const color = dialChartInfo[7];
          let plotBandColor = [];
          if (threshold === '>') {
            plotBandColor = [
              { from: minimum, to: warning, color: '#55BF3B' },
              { from: warning, to: critical, color: '#DDDF0D' },
              { from: critical, to: maximum, color: '#C02316' },
            ];
          } else {
            plotBandColor = [
              { from: minimum, to: critical, color: '#C02316' },
              { from: critical, to: warning, color: '#DDDF0D' },
              { from: warning, to: maximum, color: '#55BF3B' },
            ];
          }
          yAxis.push({
            min: minimum,
            max: maximum,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 1,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
              step: 2,
              distance: -20,
              rotation: 'auto',
              formatter: function () {
                return me.getDataLabelFormats(this.value);
              } as Highcharts.AxisLabelsFormatterCallbackFunction,
            },
            plotBands: plotBandColor,
          });
          co.series.push({
            name: title,
            data: [value],
            yAxis: n,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            dataLabels: {
              formatter: function () {
                const numFormat: PipeTransform = me.pipeService.getFormatter(
                  'num_en_us'
                );
                return numFormat.transform(value);
              },
            },
          } as Highcharts.SeriesOptionsType);
        }
      }
    });
  }
  // DIAL_CHART_AVG
  private ACT_17(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'gauge';
    co.chart.margin = 0;
    const pane = [];
    co.pane = pane as Highcharts.PaneOptions;
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.series = [];
    // Formula (100/{COUNT OF GRAPHS})  /// to find to width of pane
    const count = me.widget.settings.multiDial.count;
    const length = me.data.grpData.mFrequency[0].data.length;
    let paneWidth: number;
    if (count > 1 && length > 1) {
      paneWidth = 100 / count;
    } else {
      paneWidth = 100 / length;
    }
    // Formula {PANE WIDTH}/2  /// to find to center of pane
    const paneCenter: number = paneWidth / 2;
    let n: number = 0;
    let i: number = 0;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (me.widget.settings.multiDial.enabled) {
        if (args.globalGraphIndex >= count) {
          return;
        }
        pane.push({
          startAngle: -140,
          endAngle: 140,
          background: [
            {
              backgroundColor: null,
              borderWidth: 0,
              outerRadius: '50%',
              innerRadius: '50%',
            },
          ],
          size: '75%',
          center: [paneCenter + paneWidth * i++ + '%', '50%'],
        });
        let dialChartInfo = [];

        dialChartInfo = me.getDataForGaugeChart(
          args.graph,
          me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType].lastSample)
        );
        let title = dialChartInfo[0];
        let value = dialChartInfo[1];
        const minimum = dialChartInfo[2];
        const maximum = dialChartInfo[3];
        const threshold = dialChartInfo[4];
        const warning = dialChartInfo[5];
        const critical = dialChartInfo[6];
        const color = dialChartInfo[7];
        let plotBandColor = [];
        if (threshold === '>') {
          plotBandColor = [
            { from: minimum, to: warning, color: '#55BF3B' },
            { from: warning, to: critical, color: '#DDDF0D' },
            { from: critical, to: maximum, color: '#C02316' },
          ];
        } else {
          plotBandColor = [
            { from: minimum, to: critical, color: '#C02316' },
            { from: critical, to: warning, color: '#DDDF0D' },
            { from: warning, to: maximum, color: '#55BF3B' },
          ];
        }
        yAxis.push({
          visible: args.graphSettings.visible,
          min: minimum,
          max: maximum,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',
          tickPixelInterval: 30,
          tickWidth: 1,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            distance: -20,
            rotation: 'auto',
            formatter: function () {
              return me.getDataLabelFormats(this.value);
            } as Highcharts.AxisLabelsFormatterCallbackFunction,
          } as Highcharts.YAxisLabelsLevelsOptions,
          plotBands: plotBandColor,
          pane: n,
        } as Highcharts.YAxisOptions);
        co.series.push({
          name: title,
          data: [value],
          yAxis: n,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              return numFormat.transform(value);
            },
          },
        } as Highcharts.SeriesOptionsType);
        n++;
      } else {
        if (args.graphIndex === 0) {
          pane.push({
            startAngle: -140,
            endAngle: 140,
            background: [
              {
                backgroundColor: null,
                borderWidth: 1,
                outerRadius: '50%',
                innerRadius: '50%',
              },
            ],
            size: '75%',
            center: [paneCenter + paneWidth * i++ + '%', '50%'],
          });
          let dialChartInfo = [];
          let meterDialFormulaTypeValue = this.getFormulaTypebyGraphStats(me.widget.settings.graphStatsType);
          dialChartInfo = me.getDataForGaugeChart(
            args.graph,
            me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType][meterDialFormulaTypeValue])
          );
          let title = dialChartInfo[0];
          title = this.widget.description;
          let value = dialChartInfo[1];
          const minimum = dialChartInfo[2];
          const maximum = dialChartInfo[3];
          const threshold = dialChartInfo[4];
          const warning = dialChartInfo[5];
          const critical = dialChartInfo[6];
          const color = dialChartInfo[7];
          let plotBandColor = [];
          if (threshold === '>') {
            plotBandColor = [
              { from: minimum, to: warning, color: '#55BF3B' },
              { from: warning, to: critical, color: '#DDDF0D' },
              { from: critical, to: maximum, color: '#C02316' },
            ];
          } else {
            plotBandColor = [
              { from: minimum, to: critical, color: '#C02316' },
              { from: critical, to: warning, color: '#DDDF0D' },
              { from: warning, to: maximum, color: '#55BF3B' },
            ];
          }
          yAxis.push({
            min: minimum,
            max: maximum,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 1,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
              step: 2,
              distance: -20,
              rotation: 'auto',
              formatter: function () {
                return me.getDataLabelFormats(this.value);
              } as Highcharts.AxisLabelsFormatterCallbackFunction,
            } as Highcharts.YAxisLabelsLevelsOptions,
            plotBands: plotBandColor,
          });
          co.series.push({
            name: title,
            data: [value],
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            dataLabels: {
              formatter: function () {
                const numFormat: PipeTransform = me.pipeService.getFormatter(
                  'num_en_us'
                );
                return numFormat.transform(value);
              },
            },
          } as Highcharts.SeriesOptionsType);
        }
      }
    });
    co.lang = {
      noData: 'Data Not Available',
    };
    co.noData = {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030',
      },
    };
  }

  // METER_CHART_AVG
  private ACT_19(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'gauge';
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.series = [];
    const pane = [];
    co.pane = pane as Highcharts.PaneOptions;
    // Formula (100/{COUNT OF GRAPHS})  /// to find to width of pane
    const count = me.widget.settings.multiDial.count;
    const length = me.data.grpData.mFrequency[0].data.length;
    let paneWidth: number;
    if (count > 1 && length > 1) {
      paneWidth = 100 / count;
    } else {
      paneWidth = 100 / length;
    }
    // Formula {PANE WIDTH}/2  /// to find to center of pane
    const paneCenter: number = paneWidth / 2;
    let n: number = 0;
    let i: number = 0;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (me.widget.settings.multiDial.enabled) {
        if (args.globalGraphIndex >= count) {
          return;
        }
        pane.push({
          startAngle: -45,
          endAngle: 45,
          background: null,
          size: '75%',
          center: [paneCenter + paneWidth * i++ + '%', '70%'],
        });
        let dialChartInfo = [];
        dialChartInfo = me.getDataForGaugeChart(
          args.graph,
          me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType].avg)
        );
        let title = dialChartInfo[0];
        let value = dialChartInfo[1];
        const minimum = dialChartInfo[2];
        const maximum = dialChartInfo[3];
        const threshold = dialChartInfo[4];
        const warning = dialChartInfo[5];
        const critical = dialChartInfo[6];
        const color = dialChartInfo[7];
        let plotBandColor = [];
        if (threshold === '>') {
          plotBandColor = [
            { from: minimum, to: warning, color: '#55BF3B' },
            { from: warning, to: critical, color: '#DDDF0D' },
            { from: critical, to: maximum, color: '#C02316' },
          ];
        } else {
          plotBandColor = [
            { from: minimum, to: critical, color: '#C02316' },
            { from: critical, to: warning, color: '#DDDF0D' },
            { from: warning, to: maximum, color: '#55BF3B' },
          ];
        }
        yAxis.push({
          visible: args.graphSettings.visible,
          min: minimum,
          max: maximum,
          minorTickColor: 'black',
          tickColor: 'black',
          minorTickLength: 10,
          minorTickPosition: 'outside',
          minorTickWidth: 1,
          tickPositions: [minimum, critical, warning, maximum],
          tickPixelInterval: 80,
          tickLength: 10,
          tickPosition: 'inside',
          labels: {
            step: 1,
            rotation: 'auto',
            formatter: function () {
              return me.getDataLabelFormats(this.value);
            } as Highcharts.AxisLabelsFormatterCallbackFunction,
            distance: 20,
            style: {
              fontWeight: 'normal',
              fontSize: '10px',
              fontFamily: '',
              fill: '#000000',
              color: '#000000',
            },
          },
          plotBands: plotBandColor,
          pane: n,
        });
        co.series.push({
          name: title,
          data: [value],
          yAxis: n,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              return numFormat.transform(value);
            },
          },
        } as Highcharts.SeriesOptionsType);
        n++;
      } else {
        if (args.graphIndex === 0) {
          pane.push({
            startAngle: -45,
            endAngle: 45,
            background: null,
            size: '75%',
            center: [paneCenter + paneWidth * i++ + '%', '70%'],
          });
          let dialChartInfo = [];

          let meterDialFormulaTypeValue = this.getFormulaTypebyGraphStats(me.widget.settings.graphStatsType);


          dialChartInfo = me.getDataForGaugeChart(
            args.graph,
            me.isCavissonNullVal(args.graph.lowerPanelSummary[args.gsType][meterDialFormulaTypeValue])
          );
          let title = dialChartInfo[0];
          let value = dialChartInfo[1];
          const minimum = dialChartInfo[2];
          const maximum = dialChartInfo[3];
          const threshold = dialChartInfo[4];
          const warning = dialChartInfo[5];
          const critical = dialChartInfo[6];
          const color = dialChartInfo[7];
          let plotBandColor = [];
          if (threshold === '>') {
            plotBandColor = [
              { from: minimum, to: warning, color: '#55BF3B' },
              { from: warning, to: critical, color: '#DDDF0D' },
              { from: critical, to: maximum, color: '#C02316' },
            ];
          } else {
            plotBandColor = [
              { from: minimum, to: critical, color: '#C02316' },
              { from: critical, to: warning, color: '#DDDF0D' },
              { from: warning, to: maximum, color: '#55BF3B' },
            ];
          }
          yAxis.push({
            visible: args.graphSettings.visible,
            min: minimum,
            max: maximum,
            minorTickColor: 'black',
            tickColor: 'black',
            minorTickLength: 10,
            minorTickPosition: 'outside',
            minorTickWidth: 1,
            tickPositions: [minimum, critical, warning, maximum],
            tickPixelInterval: 80,
            tickLength: 10,
            tickPosition: 'inside',
            labels: {
              step: 1,
              rotation: 'auto',
              formatter: function () {
                return me.getDataLabelFormats(this.value);
              } as Highcharts.AxisLabelsFormatterCallbackFunction,
              distance: 20,
              style: {
                fontWeight: 'normal',
                fontSize: '10px',
                fontFamily: '',
                fill: '#000000',
                color: '#000000',
              },
            },
            plotBands: plotBandColor,
            pane: n,
          });
          co.series.push({
            name: title,
            data: [value],
            yAxis: n,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            dataLabels: {
              formatter: function () {
                const numFormat: PipeTransform = me.pipeService.getFormatter(
                  'num_en_us'
                );
                return numFormat.transform(value);
              },
            },
          } as Highcharts.SeriesOptionsType);
          n++;
        }
      }
    });
    co.lang = {
      noData: 'Data Not Available',
    };
    co.noData = {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030',
      },
    };
  }

  // DUAL_AXIS_LINE
  private ACT_3(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          animation: false,
          type: 'spline',
          yAxis: 1,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // DONUT_CHART_LAST
  private ACT_32(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    co.legend = me.getLegendOptionsForPie();
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    let visiblePlotOption: boolean;
    if (_.every(pieSeries.data, ['visible', false]) === true) {
      visiblePlotOption = false;
    } else {
      visiblePlotOption = true;
    }
    co.plotOptions = {
      pie: {
        borderWidth: 0,
        cursor: 'pointer',
        allowPointSelect: true,
        animation: false,
        innerSize: 50,
        depth: 45,
        dataLabels: {
          enabled: false,
        },
        visible: visiblePlotOption,
      },
    };
  }
  // DONUT_CHART_AVG
  private ACT_33(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    co.legend = me.getLegendOptionsForPie();
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: me.getNormalGraphDataForPieAndDonutChart(args.graph, args.gsType),
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    let visiblePlotOption: boolean;
    if (_.every(pieSeries.data, ['visible', false]) === true) {
      visiblePlotOption = false;
    } else {
      visiblePlotOption = true;
    }
    co.plotOptions = {
      pie: {
        borderWidth: 0,
        cursor: 'pointer',
        allowPointSelect: true,
        animation: false,
        innerSize: 50,
        depth: 45,
        dataLabels: {
          enabled: false,
        },
        visible: visiblePlotOption,
      },
    };
  }
  // GEO_MAP_AVG
  private ACT_16(co: Highmap.Options) {
    this.createGeoMap(co);
  }

  getArrayofInterval(scaleBarValue: number, isGeoMapThresholdValue: boolean) {
    let arrInterval = null;
    let NUM_DIVISON = 5;
    try {

      if(this.sessionService.dashboardConfigSettingData['numOfDivisionForScaleInGeoMap']) {
        NUM_DIVISON = Number(this.sessionService.dashboardConfigSettingData['numOfDivisionForScaleInGeoMap']);
      }

      if(isGeoMapThresholdValue)
      {
        NUM_DIVISON = NUM_DIVISON -1 ;
        arrInterval = new Array(NUM_DIVISON+2);
      }
      else
      {
        arrInterval = new Array(NUM_DIVISON+1);
      }

      let interval = Number((scaleBarValue / NUM_DIVISON).toFixed(3));
      arrInterval[0] = 0;
      for (let i = 1; i < arrInterval.length; i++)
      {
        arrInterval[i] = Number((arrInterval[i - 1] + interval).toFixed(3));
      }

   } catch (error) {
     console.error("Exception is coming in getArrayofInterval method " , error);
     return null;
   }

   return arrInterval;
  }
  getGeoMapDataSet(me: this , geoMapChartType: number): any {
    let data = [];
    let geoMapobj = {};
    let weightedAvg = 0;
    let sumCount = 0;
    try {
      me.forEachGraph((args: ForEachGraphArgs) => {

        console.log("args = " , args);
        let json = {};
        let graphName = args.graphName;
        json['graphName'] = graphName;
        let vectorName = "";
        let graphNameWithoutVector = "";
        if(graphName.indexOf("-") !== -1) {
          let graphNameArr = graphName.split("-");
          if(graphNameArr && graphNameArr.length > 0) {
            graphNameWithoutVector = graphNameArr[0].trim();
            vectorName = graphNameArr[1].trim();
            json['vectorName'] = vectorName;
            let locationName = "";
            if(vectorName.indexOf(">") !== -1) {
              let stateNameArr = vectorName.split(">");
              locationName = stateNameArr[stateNameArr.length -1];
              let stateName = "";
              if(locationName.indexOf(",") !== -1) {
                stateName = locationName.split(",")[0];
                let stateNameKey = locationName.split(",")[0];
                if (stateName === 'NewYork') {
                  stateNameKey = 'New York';
                }
                if (stateName === 'NorthCarolina') {
                  stateNameKey = 'North Carolina';
                }
                if (stateName === 'SouthCarolina') {
                  stateNameKey = 'South Carolina';
                }
                if (stateName === 'NorthDakota') {
                  stateNameKey = 'North Dakota';
                }
                if (stateName === 'SouthDakota') {
                  stateNameKey = 'South Dakota';
                }
                if (stateName === 'WestVirginia') {
                  stateNameKey = 'West Virginia';
                }
                if (stateName === 'NewMexico') {
                  stateNameKey = 'New Mexico';
                }
                if (stateName === 'NewHampshire') {
                  stateNameKey = 'New Hampshire';
                }
                if (stateName=== 'NewJersey') {
                  stateNameKey = 'New Jersey';
                }
                if (stateName === 'RhodeIsland') {
                  stateNameKey = 'Rhode Island';
                }
                json['name'] = stateName;
                json['key'] = stateNameKey
              }

            }
          }

        }

        let graphObj = args.graph;
        let measure = graphObj.measure;
        if(measure) {
          json['groupName'] = measure.mg;
          json['metricName'] = measure.metric;
          json['groupId'] = measure.mgId;
        }

        let value = null;
        let count = 0;
        if(args.graph.lowerPanelSummary) {
          let gsType = args.gsType;
          if(geoMapChartType == ChartType.GEO_MAP_AVG) {
            value =  me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].avg);
          }else if(geoMapChartType == ChartType.GEO_MAP_LAST) {
            value =  me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].lastSample);
          }else if(geoMapChartType == ChartType.GEO_MAP_MAX) {
            value =  me.isCavissonNullVal(args.graph.lowerPanelSummary[gsType].max);
          }

          count = args.graph.lowerPanelSummary[gsType].count;
          weightedAvg = weightedAvg + (value * count);
          sumCount = sumCount + count;
        }
        if(value == 0) {
          value = null;
        }else {
          value = Number(value.toFixed(3));
        }
        json['value'] = value;
        json['count'] = count;

        data.push(json);
      });

      geoMapobj['data'] = JSON.parse(JSON.stringify(data));
      if(sumCount > 0) {

        let result = weightedAvg/sumCount;
        geoMapobj['weightedAvg'] = Number(result.toFixed(3));
      }

    } catch (error) {
      console.error("Exception in making Geo Map Data " , error);
      return null;
    }

    return geoMapobj;
  }
  // GEO_MAP_LAST
  private ACT_65(co: Highcharts.Options) {
    const me = this;
    console.log("width" , me.containerDimensions.width, "height", me.containerDimensions.height);

    const mapKey = 'countries/us/us-all';

    me.httpClient.get('./assets/dummyData/geo-location-data/'+mapKey+'.geo.json').subscribe(geoData =>{


     const drillMapData: any = geoData;


    // const drillMapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);

    const widgetMap = Highcharts.geojson(drillMapData);

    co.chart = {
      map: widgetMap,
      renderTo: 'chartContainer',
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      marginTop: -30,
      width: me.containerDimensions.width,
      height: me.containerDimensions.height + 40,
    };

    co.mapNavigation = {
      enabled: true,
    };

    co.xAxis = {
      visible: false,
    };

    co.yAxis = {
      visible: false,
    };

    (co.colors = [
      'rgba(19,64,117,0.05)',
      'rgba(19,64,117,0.2)',
      'rgba(19,64,117,0.4)',
      'rgba(19,64,117,0.5)',
      'rgba(19,64,117,0.6)',
      'rgba(19,64,117,0.8)',
      'rgba(19,64,117,1)',
    ]),
      (co.legend = {
        title: {
          text: '',
          style: {
            color:
              // theme
              (Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.title &&
                Highcharts.defaultOptions.legend.title.style &&
                Highcharts.defaultOptions.legend.title.style.color) ||
              'black',
          },
        },
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        layout: 'vertical',
        backgroundColor:
          // theme
          (Highcharts.defaultOptions &&
            Highcharts.defaultOptions.legend &&
            Highcharts.defaultOptions.legend.backgroundColor) ||
          'rgba(255, 255, 255, 0.85)',
        symbolRadius: 0,
        symbolHeight: 14,
      });

    (co.colorAxis = {
      dataClasses: [
        {
          to: 3,
        },
        {
          from: 3,
          to: 10,
        },
        {
          from: 10,
          to: 30,
        },
        {
          from: 30,
          to: 100,
        },
        {
          from: 100,
          to: 300,
        },
        {
          from: 300,
          to: 1000,
        },
        {
          from: 1000,
        },
      ],
    }),

    co.series = [
      {
        type: 'map',
        data: widgetMap,
        mapData: drillMapData,
        joinBy: 'hc-key',
        showInLegend: false,
        color: '#FFFFFF',
        borderWidth: 0.2,
      },
      {
        name: 'Separators',
        type: 'mapline',
        nullColor: '#707070',
        showInLegend: false,
        enableMouseTracking: false,
      },
      {
        // Specify points using lat/lon
        type: 'mappoint',
        name: 'Cities',
        marker: {
          enabled: true,
          fillColor: '#53b771',
          radius: 3,
        },
        color: Highcharts.getOptions().colors[1],
        data: [
          {
            lat: 44.500000,
            lon: -89.500000,
          },
          {
            lat: 39.000000,
            lon: -80.500000,
          },
          {
            lat: 44.000000,
            lon: -72.699997,
          },
          {
            lat: 31.000000,
            lon: -100.000000,
          },
          {
            lat: 44.500000,
            lon: -100.000000,
          },
          {
            lat: 41.700001,
            lon: -71.500000,
          },
          {
            lat: 44.000000,
            lon: -120.500000,
          },
          {
            lat: 43.000000,
            lon: -75.000000,
          },
        ],
      },
    ];
  })
  }
  // GEO_MAP_MAX
  private ACT_67(co: Highmap.Options) {
    this.createGeoMap(co);
  }
  // GEO_MAP_MAX_OF_AVG
  private ACT_84(co: Highcharts.Options) {
    const me = this;
  }
  // GEO_MAP_LAST
  private ACT_15(co: Highmap.Options) {
    this.createGeoMap(co);
  }

  // GEO_MAP_EXTENDED_LAST
  private ACT_64(co: Highcharts.Options) {
    const me = this;
  }
  // GEO_MAP_EXTENDED_MAX
  private ACT_66(co: Highcharts.Options) {
    const me = this;
  }
  // LINE_STACKED
  private ACT_5(co: Highcharts.Options) {
    const me = this;
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          animation: false,
          type: 'spline',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: me.enableChartMarkersForFilters(args),
          animation: false,
          type: 'column',
          yAxis: 1,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // MIN_MAX_GRAPH
  private ACT_21(co: Highcharts.Options) {
    const me = this;
    me.displayChart = false;
  }
  // PERCENTILE_BAR_CHART
  private ACT_59(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: [],
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    for (const arr of me.widget.settings.types.graph.arrPct) {
      co.xAxis.categories.push(arr.toString());
    }
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        stacking: null,
        point: {
          events: {
              click:  this.chartEventHandler.bind(this)
          }
      },
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphData(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        borderColor:'black'
      } as Highcharts.SeriesOptionsType);
    });
  }
  // PERCENTILE_PIE_CHART
  private ACT_60(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: me.getPercentileAndSlabGraphDataForPieDonut(args.graph),
        //y: args.graph.percentile[me.widget.settings.types.graph.pctOrSlabValue],
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    // if (_.every(pieSeries.data, ['visible', false]) === true) {
    //   me.pieChartVisible = false;
    // } else {
    //   me.pieChartVisible = true;
    // }
  }
  // PERCENTILE_DUAL_LINE_BAR
  private ACT_36(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      crosshair: true,
      gridLineWidth: 1,
      min: 1,
      max: 100,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        pointStart: 1,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          type: 'spline',
          name: args.graphName,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          type: 'column',
          name: args.graphName,
          yAxis: 1,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_STACKED_AREA_CHART
  private ACT_37(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      min: 1,
      max: 100,
      gridLineWidth: 1,
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      area: {
        animation: false,
        stacking: 'normal',
        cursor: 'pointer',
        pointStart: 1,
        label: {
          connectorAllowed: false,
        },
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphDataForLine(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // PERCENTILE_STACKED_BAR_CHART
  private ACT_38(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: [],
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    for (const arr of me.widget.settings.types.graph.arrPct) {
      co.xAxis.categories.push(arr.toString());
    }
    co.plotOptions = {
      column: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphData(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        borderColor:'black'
      } as Highcharts.SeriesOptionsType);
    });
  }
  // PERCENTILE_DIAL_CHART
  private ACT_39(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'gauge';
    const pane = [];
    co.pane = pane as Highcharts.PaneOptions;
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.series = [];
    // Formula (100/{COUNT OF GRAPHS})  /// to find to width of pane
    const count = me.widget.settings.multiDial.count;
    const length = me.data.grpData.mFrequency[0].data.length;
    let paneWidth: number;
    if (count > 1 && length > 1) {
      paneWidth = 100 / count;
    } else {
      paneWidth = 100 / length;
    }
    // Formula {PANE WIDTH}/2  /// to find to center of pane
    const paneCenter: number = paneWidth / 2;
    let n: number = 0;
    let i: number = 0;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (me.widget.settings.multiDial.enabled) {
        if (args.globalGraphIndex >= count) {
          return;
        }
        pane.push({
          startAngle: -140,
          endAngle: 140,
          background: [
            {
              backgroundColor: null,
              borderWidth: 0,
              outerRadius: '50%',
              innerRadius: '50%',
            },
          ],
          size: '75%',
          center: [paneCenter + paneWidth * i++ + '%', '50%'],
        });
        let dialChartInfo = [];
        dialChartInfo = me.getDataForGaugeChart(
          args.graph,
          me.getSlabAndPercentileGraphDataForGauge(args.graph)
        );
        const title = dialChartInfo[0];
        const value = dialChartInfo[1];
        const minimum = dialChartInfo[2];
        const maximum = dialChartInfo[3];
        const threshold = dialChartInfo[4];
        const warning = dialChartInfo[5];
        const critical = dialChartInfo[6];
        const color = dialChartInfo[7];
        let plotBandColor = [];
        if (threshold === '>') {
          plotBandColor = [
            { from: minimum, to: warning, color: '#55BF3B' },
            { from: warning, to: critical, color: '#DDDF0D' },
            { from: critical, to: maximum, color: '#C02316' },
          ];
        } else {
          plotBandColor = [
            { from: minimum, to: critical, color: '#C02316' },
            { from: critical, to: warning, color: '#DDDF0D' },
            { from: warning, to: maximum, color: '#55BF3B' },
          ];
        }
        yAxis.push({
          visible: args.graphSettings.visible,
          min: minimum,
          max: maximum,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',
          tickPixelInterval: 30,
          tickWidth: 1,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            distance: -20,
            rotation: 'auto',
            formatter: function () {
              return me.getDataLabelFormats(this.value);
            } as Highcharts.AxisLabelsFormatterCallbackFunction,
          } as Highcharts.YAxisLabelsLevelsOptions,
          plotBands: plotBandColor,
          pane: n,
        } as Highcharts.YAxisOptions);
        co.series.push({
          name: title,
          data: [value],
          yAxis: n,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              return numFormat.transform(value);
            },
          },
        } as Highcharts.SeriesOptionsType);
        n++;
      } else {
        if (args.graphIndex === 0) {
          pane.push({
            startAngle: -140,
            endAngle: 140,
            background: [
              {
                backgroundColor: null,
                borderWidth: 1,
                outerRadius: '50%',
                innerRadius: '50%',
              },
            ],
            size: '75%',
            center: [paneCenter + paneWidth * i++ + '%', '50%'],
          });
          let dialChartInfo = [];
          if(args.graph.percentile){
            dialChartInfo = me.getDataForGaugeChart(
              args.graph,
              args.graph.percentile[me.widget.settings.types.graph.pctOrSlabValue]
            );
          }
          else{
          dialChartInfo = me.getDataForGaugeChart(
            args.graph,
            args.graph.slabCount[me.widget.settings.types.graph.pctOrSlabValue]
          );
          }
          const title = dialChartInfo[0];
          const value = dialChartInfo[1];
          const minimum = dialChartInfo[2];
          const maximum = dialChartInfo[3];
          const threshold = dialChartInfo[4];
          const warning = dialChartInfo[5];
          const critical = dialChartInfo[6];
          const color = dialChartInfo[7];
          let plotBandColor = [];
          if (threshold === '>') {
            plotBandColor = [
              { from: minimum, to: warning, color: '#55BF3B' },
              { from: warning, to: critical, color: '#DDDF0D' },
              { from: critical, to: maximum, color: '#C02316' },
            ];
          } else {
            plotBandColor = [
              { from: minimum, to: critical, color: '#C02316' },
              { from: critical, to: warning, color: '#DDDF0D' },
              { from: warning, to: maximum, color: '#55BF3B' },
            ];
          }
          yAxis.push({
            min: minimum,
            max: maximum,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 1,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
              step: 2,
              distance: -20,
              rotation: 'auto',
              formatter: function () {
                return me.getDataLabelFormats(this.value);
              } as Highcharts.AxisLabelsFormatterCallbackFunction,
            } as Highcharts.YAxisLabelsLevelsOptions,
            plotBands: plotBandColor,
          });
          co.series.push({
            name: title,
            data: [value],
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            dataLabels: {
              formatter: function () {
                const numFormat: PipeTransform = me.pipeService.getFormatter(
                  'num_en_us'
                );
                return numFormat.transform(value);
              },
            },
          } as Highcharts.SeriesOptionsType);
        }
      }
    });
  }
  // PERCENTILE_METER_CHART
  private ACT_40(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'gauge';
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.series = [];
    const pane = [];
    co.pane = pane as Highcharts.PaneOptions;
    // Formula (100/{COUNT OF GRAPHS})  /// to find to width of pane
    const count = me.widget.settings.multiDial.count;
    const length = me.data.grpData.mFrequency[0].data.length;
    let paneWidth: number;
    if (count > 1 && length > 1) {
      paneWidth = 100 / count;
    } else {
      paneWidth = 100 / length;
    }
    // Formula {PANE WIDTH}/2  /// to find to center of pane
    const paneCenter: number = paneWidth / 2;
    let n: number = 0;
    let i: number = 0;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (me.widget.settings.multiDial.enabled) {
        if (args.globalGraphIndex >= count) {
          return;
        }
        pane.push({
          startAngle: -45,
          endAngle: 45,
          background: null,
          size: '75%',
          center: [paneCenter + paneWidth * i++ + '%', '70%'],
        });
        let dialChartInfo = [];
        dialChartInfo = me.getDataForGaugeChart(
          args.graph,
          me.getSlabAndPercentileGraphDataForGauge(args.graph)
        );
        let title = dialChartInfo[0];
        let value = dialChartInfo[1];
        const minimum = dialChartInfo[2];
        const maximum = dialChartInfo[3];
        const threshold = dialChartInfo[4];
        const warning = dialChartInfo[5];
        const critical = dialChartInfo[6];
        const color = dialChartInfo[7];
        let plotBandColor = [];
        if (threshold === '>') {
          plotBandColor = [
            { from: minimum, to: warning, color: '#55BF3B' },
            { from: warning, to: critical, color: '#DDDF0D' },
            { from: critical, to: maximum, color: '#C02316' },
          ];
        } else {
          plotBandColor = [
            { from: minimum, to: critical, color: '#C02316' },
            { from: critical, to: warning, color: '#DDDF0D' },
            { from: warning, to: maximum, color: '#55BF3B' },
          ];
        }
        yAxis.push({
          visible: args.graphSettings.visible,
          min: minimum,
          max: maximum,
          minorTickColor: 'black',
          tickColor: 'black',
          minorTickLength: 10,
          minorTickPosition: 'outside',
          minorTickWidth: 1,
          tickPositions: [minimum, critical, warning, maximum],
          tickPixelInterval: 80,
          tickLength: 10,
          tickPosition: 'inside',
          labels: {
            step: 1,
            rotation: 'auto',
            formatter: function () {
              return me.getDataLabelFormats(this.value);
            } as Highcharts.AxisLabelsFormatterCallbackFunction,
            distance: 20,
            style: {
              fontWeight: 'normal',
              fontSize: '10px',
              fontFamily: '',
              fill: '#000000',
              color: '#000000',
            },
          },
          plotBands: plotBandColor,
          pane: n,
        });
        co.series.push({
          name: title,
          data: [value],
          yAxis: n,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              return numFormat.transform(value);
            },
          },
        } as Highcharts.SeriesOptionsType);
        n++;
      } else {
        if (args.graphIndex === 0) {
          pane.push({
            startAngle: -45,
            endAngle: 45,
            background: null,
            size: '75%',
            center: [paneCenter + paneWidth * i++ + '%', '70%'],
          });
          let dialChartInfo = [];
          if(args.graph.percentile){
          dialChartInfo = me.getDataForGaugeChart(
            args.graph,
            me.isCavissonNullVal(
              args.graph.percentile[
              me.widget.settings.types.graph.pctOrSlabValue
              ]
            )
          );
            }
            else{
              dialChartInfo = me.getDataForGaugeChart(
                args.graph,
                me.isCavissonNullVal(
                  args.graph.slabCount[
                  me.widget.settings.types.graph.pctOrSlabValue
                  ]
                )
              );
            }
          let title = dialChartInfo[0];
          let value = dialChartInfo[1];
          const minimum = dialChartInfo[2];
          const maximum = dialChartInfo[3];
          const threshold = dialChartInfo[4];
          const warning = dialChartInfo[5];
          const critical = dialChartInfo[6];
          const color = dialChartInfo[7];
          let plotBandColor = [];
          if (threshold === '>') {
            plotBandColor = [
              { from: minimum, to: warning, color: '#55BF3B' },
              { from: warning, to: critical, color: '#DDDF0D' },
              { from: critical, to: maximum, color: '#C02316' },
            ];
          } else {
            plotBandColor = [
              { from: minimum, to: critical, color: '#C02316' },
              { from: critical, to: warning, color: '#DDDF0D' },
              { from: warning, to: maximum, color: '#55BF3B' },
            ];
          }
          yAxis.push({
            visible: args.graphSettings.visible,
            min: minimum,
            max: maximum,
            minorTickColor: 'black',
            tickColor: 'black',
            minorTickLength: 10,
            minorTickPosition: 'outside',
            minorTickWidth: 1,
            tickPositions: [minimum, critical, warning, maximum],
            tickPixelInterval: 80,
            tickLength: 10,
            tickPosition: 'inside',
            labels: {
              step: 1,
              rotation: 'auto',
              formatter: function () {
                return me.getDataLabelFormats(this.value);
              } as Highcharts.AxisLabelsFormatterCallbackFunction,
              distance: 20,
              style: {
                fontWeight: 'normal',
                fontSize: '10px',
                fontFamily: '',
                fill: '#000000',
                color: '#000000',
              },
            },
            plotBands: plotBandColor,
            pane: n,
          });
          co.series.push({
            name: title,
            data: [value],
            yAxis: n,
            color: args.graphSettings.color,
            visible: args.graphSettings.visible,
            selected: args.graphSettings.selected,
            dataLabels: {
              formatter: function () {
                const numFormat: PipeTransform = me.pipeService.getFormatter(
                  'num_en_us'
                );
                return numFormat.transform(value);
              },
            },
          } as Highcharts.SeriesOptionsType);
          n++;
        }
      }
    });
  }
  // PERCENTILE_DUAL_AXIS_LINE
  private ACT_41(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      min: 1,
      max: 100,
      crosshair: true,
      gridLineWidth: 1,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      spline: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
        pointStart: 1,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphDataForLine(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // PERCENTILE_DONUT_CHART
  private ACT_42(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    co.legend = me.getLegendOptionsForPie();
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: args.graph.percentile[me.widget.settings.types.graph.pctOrSlabValue],
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    let visiblePlotOption: boolean;
    if (_.every(pieSeries.data, ['visible', false]) === true) {
      visiblePlotOption = false;
    } else {
      visiblePlotOption = true;
    }
    co.plotOptions = {
      pie: {
        borderWidth: 0,
        cursor: 'pointer',
        allowPointSelect: true,
        animation: false,
        innerSize: 50,
        depth: 45,
        dataLabels: {
          enabled: false,
        },
        visible: visiblePlotOption,
      },
    };
  }
  // PERCENTILE_LINE_STACKED_BAR
  private ACT_43(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      crosshair: true,
      min: 1,
      max: 100,
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        pointStart: 1,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          type: 'spline',
          name: args.graphName,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          type: 'column',
          name: args.graphName,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_AREA_CHART
  private ACT_44(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      crosshair: true,
      gridLineWidth: 1,
      min: 1,
      max: 100,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        pointStart: 1,
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphDataForLine(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_LINE_CHART
  private ACT_45(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    // for the series boost threshold
    if(me.sessionService.dashboardConfigSettingData) {
      me.seriesThreshold = me.sessionService.dashboardConfigSettingData['seriesBoostThreshold'];
   }
   co.boost =  {
     seriesThreshold: me.seriesThreshold,
         useGPUTranslations: true,
         debug:{
         showSkipSummary:true,
         timeBufferCopy:true,
         timeSetup:false
         }
     }
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
        rotation:40,
      },
    };
    co.plotOptions = {
      spline: {
        cursor: 'pointer',
        animation: false,
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_PIE_CHART
  private ACT_46(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    co.legend = me.getLegendOptionsForPie();
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: me.getPercentileAndSlabGraphDataForPieDonut(args.graph),
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    if (
      pieSeries.data === [] ||
      pieSeries.data === undefined ||
      pieSeries.data === null
    ) {
      me.empty = true;
    }
  }
  // SLAB_COUNT_DUAL_LINE_BAR
  private ACT_47(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'column',
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_STACKED_AREA_CHART
  private ACT_48(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      crosshair: true,
      categories: me.getGraphSlabName(),
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
          events: {
              click:  this.chartEventHandler.bind(this)
          }
      },
        animation: false,
        stacking: 'normal',
        label: {
          connectorAllowed: false,
        },
        showInLegend: true,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_STACKED_BAR_CHART
  private ACT_49(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      column: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        borderWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        borderColor:'black'
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_DIAL_CHART
  private ACT_50(co: Highcharts.Options) {
    const me = this;
    me.ACT_39(co);
  }
  // SLAB_COUNT_METER_CHART
  private ACT_51(co: Highcharts.Options) {
    const me = this;
    me.ACT_40(co);
  }
  // SLAB_COUNT_DUAL_AXIS_LINE
  private ACT_52(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'spline';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      spline: {
        cursor: 'pointer',
        animation: false,
        stacking: null,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_DONUT_CHART
  private ACT_53(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'pie';
    co.legend = me.getLegendOptionsForPie();
    const pieSeries: Highcharts.SeriesPieOptions = {
      name: 'Series',
      data: new Array<Highcharts.PointOptionsObject>(),
    } as Highcharts.SeriesPieOptions;
    me.forEachGraph((args: ForEachGraphArgs) => {
      pieSeries.data.push({
        name: args.graphName,
        y: me.getPercentileAndSlabGraphDataForPieDonut(args.graph),
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        sliced: me.highlightSelectedGraph(args.graphSettings.selected, false),
      } as Highcharts.PointOptionsObject);
    });
    co.series = [pieSeries];
    let visiblePlotOption: boolean;
    if (_.every(pieSeries.data, ['visible', false]) === true) {
      visiblePlotOption = false;
    } else {
      visiblePlotOption = true;
    }
    co.plotOptions = {
      pie: {
        borderWidth: 0,
        cursor: 'pointer',
        allowPointSelect: true,
        animation: false,
        innerSize: 50,
        depth: 45,
        dataLabels: {
          enabled: false,
        },
        visible: visiblePlotOption,
      },
    };
  }
  // SLAB_COUNT_LINE_STACKED_BAR
  private ACT_54(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      column: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      spline: {
        animation: false,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'column',
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_AREA_CHART
  private ACT_55(co: Highcharts.Options) {
    const me = this;
    me.ACT_8(co);
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
        rotation:40,
      },
    };
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
      } as Highcharts.SeriesOptionsType);
    });
  }
  // NORMAL_GRAPH_TYPE
  private ACT_56(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getNormalGraphData(args.graph, args.gsType),
        marker: me.enableChartMarkersForFilters(args),
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
        pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
        pointInterval: args.tsDetail.frequency * 1000,
      } as Highcharts.SeriesOptionsType);
    });
  }
  // PERCENTILE_GRAPH_TYPE
  private ACT_57(co: Highcharts.Options) {
    const me = this;
    me.ACT_44(co);
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: [],
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    for (const arr of me.widget.settings.types.graph.arrPct) {
      co.xAxis.categories.push(arr.toString());
    }
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getPercentileGraphData(args.graph),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
      } as Highcharts.SeriesOptionsType);
    });
  }
  // SLAB_COUNT_GRAPH_TYPE
  private ACT_58(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
        rotation:40,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getSlabGraphData(args.graph),
        marker: { enabled: false },
        animation: false,
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
      } as Highcharts.SeriesOptionsType);
    });
  }
  // DUAL_AXIS_STACKED_BAR
  private ACT_83(co: Highcharts.Options) {
    const me = this;
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.globalGraphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          yAxis: 1,
          type: 'column',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_DUAL_AXIS_STACKED_BAR
  private ACT_89(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      min: 1,
      max: 100,
      crosshair: true,
      gridLineWidth: 1,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
        pointStart: 1,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          type: 'spline',
          name: args.graphName,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          type: 'column',
          name: args.graphName,
          yAxis: 1,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_DUAL_AXIS_STACKED_BAR
  private ACT_90(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        stacking: 'normal',
        animation: false,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'column',
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // DUAL_AXIS_STACKED_AREA
  private ACT_88(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'spline',
          marker: { enabled: false },
          animation: false,
          yAxis: 1,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'area',
          marker: { enabled: false },
          animation: false,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_DUAL_AXIS_STACKED_AREA
  private ACT_91(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: [],
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    for (const arr of me.widget.settings.types.graph.arrPct) {
      co.xAxis.categories.push(arr.toString());
    }
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          type: 'spline',
          data: me.getPercentileGraphData(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          type: 'area',
          data: me.getPercentileGraphData(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_DUAL_AXIS_STACKED_AREA
  private ACT_92(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // DUAL_AXIS_AREA_LINE
  private ACT_80(co: Highcharts.Options) {
    const me = this;
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
      },
    };
    co.series = [];
    //for zoom feature
    co.chart.zoomType = 'x';
    co.xAxis['events'] = { setExtremes: this.zoomEventHandler.bind(this) }
    // if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
    //   co.subtitle = { text: this.getWidgetChartTitle(this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomSt, this.widget.zoomInfo.times[this.widget.zoomInfo.times.length - 1].zoomEt, me.widget.settings.viewBy?me.widget.settings.viewBy.selected:60) };
    // }
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          type: 'area',
          yAxis: 1,
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          pointStart: this.getStartTimeForXAxis(args.tsDetail.st, me.widget.zoomInfo, me.widget.settings.types.graph.selectedWidgetTimeDelay),
          pointInterval: args.tsDetail.frequency * 1000,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // PERCENTILE_DUAL_AXIS_AREA_LINE
  private ACT_81(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      crosshair: true,
      gridLineWidth: 1,
      min: 1,
      max: 100,
      labels: {
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        pointStart: 1,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          type: 'area',
          name: args.graphName,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          type: 'spline',
          name: args.graphName,
          yAxis: 1,
          data: me.getPercentileGraphDataForLine(args.graph),
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SLAB_COUNT_DUAL_AXIS_AREA_LINE
  private ACT_82(co: Highcharts.Options) {
    const me = this;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getGraphSlabName(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'area',
          yAxis: 1,
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getSlabGraphData(args.graph),
          marker: { enabled: false },
          animation: false,
          type: 'spline',
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // CATEGORY_STACKED_BAR_CHART
  private ACT_61(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'column';
    co.plotOptions = {
      column: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    if (me.data.grpData.mFrequency[0].data) {
      co.series = me.getSeriesForCategory(me.data.grpData);
    }
  }
  // CATEGORY_STACKED_AREA_CHART
  private ACT_62(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'area';
    co.plotOptions = {
      area: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    if (me.data.grpData) {
      co.series = me.getSeriesForCategory(me.data.grpData);
    }
  }
  // CORRELATED_MULTI_AXES_CHART_LINE
  private ACT_85(co: Highcharts.Options) {
    const me = this;
    const yAxis = [];
    co.yAxis = yAxis as Highcharts.YAxisOptions;
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      categories: me.getCorrelatedXAxisData(),
      crosshair: true,
      labels: {
        autoRotation: false,
        style: {
          color: '#9b9b9b',
        },
      },
    };
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        yAxis.push({
          title: null,
        } as Highcharts.YAxisOptions);
      } else if (args.graph === me.data.grpData.mFrequency[0].data[1]) {
        yAxis.push({
          title: {
            text: args.graphName.split('-')[1],
            style: {
              color: me.widget.settings.types.graph.displayWidgetFontColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 60,
              height: 60,
              fontSize: '11px',
            },
          },
        } as Highcharts.YAxisOptions);
      } else {
        yAxis.push({
          title: {
            text: args.graphName.split('-')[1],
            style: {
              color: me.widget.settings.types.graph.displayWidgetFontColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 60,
              height: 60,
              fontSize: '11px',
            },
          },
          opposite: true,
        } as Highcharts.YAxisOptions);
      }
    });
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
      },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          type: 'spline',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else if (args.graphIndex === 1) {
        co.series.push({
          name: args.graphName,
          // color: args.graphSettings.color,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'area',
          yAxis: 1,
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'spline',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // CORRELATED_MULTI_AXES_CHART_AREA
  private ACT_86(co: Highcharts.Options) {
    const me = this;
    me.ACT_85(co);
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          // color: args.graphSettings.color,
          type: 'area',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else if (args.graphIndex === 1) {
        co.series.push({
          name: args.graphName,
          // color: args.graphSettings.color,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'area',
          yAxis: 1,
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          // color: args.graphSettings.color,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'area',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // CORRELATED_MULTI_AXES_CHART_BAR
  private ACT_87(co: Highcharts.Options) {
    const me = this;
    me.ACT_85(co);
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.graphIndex === 0) {
        co.series.push({
          name: args.graphName,
          type: 'column',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      } else if (args.graphIndex === 1) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'area',
          yAxis: 1,
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          lineWidth: me.highlightSelectedGraph(args.graphSettings.selected, 2),
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'column',
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  // SCATTER_CHART
  private ACT_121(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'scatter';
    co.xAxis = {
      visible: me.widget.settings.types.graph.xAxis,
      title: {
        // text: me.widget.settings.types.graph.primaryYAxisLabel
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
      labels: {
        style: {
          color: '#9b9b9b',
        },
      },
    };
    co.plotOptions = {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)',
            },
          },
        },
        animation: false,
        cursor: 'pointer',
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:  this.chartEventHandler.bind(this)
            }
        }
    },
    };
    co.series = [];
    me.forEachGraph((args: ForEachGraphArgs) => {
      co.series.push({
        name: args.graphName,
        data: me.getNormalGraphData(args.graph, args.gsType),
        marker: { enabled: false },
        color: args.graphSettings.color,
        visible: args.graphSettings.visible,
        selected: args.graphSettings.selected,
      } as Highcharts.SeriesOptionsType);
    });
  }
  // REVENUE_PREDICTION_CHART
  private ACT_122(co: Highcharts.Options) {
    const me = this;
    me.displayChart = false;
  }
  // SOLID_GAUGE_CHART
  private ACT_110(co: Highcharts.Options) {
    const me = this;
    co.chart.type = 'solidgauge';
    co.plotOptions = {
      solidgauge: {
        cursor: 'pointer',
        innerRadius: '65%',
      },
    };
    let firstGraph: ForEachGraphArgs;
    let lastGraph: ForEachGraphArgs;
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.globalGraphIndex === 0) {
        firstGraph = args;
      } else {
        lastGraph = args;
      }
    });
    if (firstGraph && lastGraph) {
      co.pane = {
        startAngle: -90,
        endAngle: 90,
        background: [
          {
            backgroundColor: '#EEE',
            borderWidth: 0,
            outerRadius: '100%',
            innerRadius: '65%',
            shape: 'arc',
          },
        ],
        size: '140%',
        center: ['50%', '80%'],
      };
      const dialGraphExp = me.widget.settings.types.graph.dialMeterExp;
      const dialGraphExpForKPI =
        me.widget.settings.types.graph.dialMeterExpForGkpi;
      let minimum, maximum, warning, critical, prefix;
      if (dialGraphExp != null) {
        prefix = dialGraphExp;
      }
      if (dialGraphExpForKPI != null) {
        minimum = dialGraphExpForKPI[0];
        warning = dialGraphExpForKPI[1];
        critical = dialGraphExpForKPI[2];
        maximum = dialGraphExpForKPI[3];
        if (dialGraphExpForKPI[4]) {
          prefix = dialGraphExpForKPI[4];
        }
      }
      const plotBandColor = [
        {
          from: minimum,
          to: warning,
          color: '#C02316',
          outerRadius: '111%',
        },
        {
          from: warning,
          to: critical,
          color: '#DDDF0D',
          outerRadius: '111%',
        },
        {
          from: critical,
          to: maximum,
          color: '#55BF3B',
          outerRadius: '111%',
        },
      ];
      co.yAxis = {
        min: minimum,
        max: maximum,
        lineWidth: 1,
        zIndex: 4,
        labels: {
          y: 15,
          distance: -15,
          rotation: 'auto',
        } as Highcharts.YAxisLabelsLevelsOptions,
        plotBands: plotBandColor,
      } as Highcharts.YAxisOptions;
      co.series = [
        {
          name: firstGraph.graphName.split('-')[0],
          data: [firstGraph.graph.lowerPanelSummary[firstGraph.gsType].lastSample],
          dataLabels: {
            formatter: function () {
              const numFormat: PipeTransform = me.pipeService.getFormatter(
                'num_en_us'
              );
              if (dialGraphExpForKPI[4]) {
                return (
                  '<span style="color:#339">' +
                  prefix +
                  numFormat.transform(firstGraph.graph.lowerPanelSummary[firstGraph.gsType].lastSample) +
                  '/' +
                  prefix +
                  numFormat.transform(lastGraph.graph.lowerPanelSummary[lastGraph.gsType].avg) +
                  '</span><br/>'
                );
              } else {
                return (
                  '<span style="color:#339">' +
                  numFormat.transform(firstGraph.graph.lowerPanelSummary[firstGraph.gsType].lastSample) +
                  '/' +
                  numFormat.transform(lastGraph.graph.lowerPanelSummary[lastGraph.gsType].avg) +
                  '</span><br/>'
                );
              }
            },
          },
        },
      ] as Highcharts.SeriesOptionsType[];
    }
  }
  // LINE_BAR_COMBINED_CHART
  private ACT_111(co: Highcharts.Options) {
    const me = this;
    co.series = [];
    co.legend = {
      enabled: me.widget.settings.types.graph.showLegendOnWidget,
      reversed: true,
      itemStyle: {
        color: '#333333',
        fontFamily: 'Product Sans',
        fontSize: '11px',
        textOverflow: 'ellipsis',
        width: 110
      },
      labelFormatter: function () {
        return this.name.split('-')[0];
      },
    };
    co.plotOptions = {
      series: {
        cursor: 'pointer',
        animation: false,
        stacking: 'normal',
      },
    };
    me.forEachGraph((args: ForEachGraphArgs) => {
      if (args.globalGraphIndex === args.globalTotalGraphs) {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'spline',
          marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[6],
            fillColor: 'white',
          },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          pointStart: args.tsDetail.st,
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      } else {
        co.series.push({
          name: args.graphName,
          data: me.getNormalGraphData(args.graph, args.gsType),
          type: 'column',
          yAxis: 1,
          marker: { enabled: false },
          color: args.graphSettings.color,
          visible: args.graphSettings.visible,
          selected: args.graphSettings.selected,
          pointStart: args.tsDetail.st,
          pointInterval: args.tsDetail.frequency * 1000,
        } as Highcharts.SeriesOptionsType);
      }
    });
  }
  getWidgetChartTitle(startTime, endTime, viewBy) {
    try {
      let st = moment(startTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      let et = moment(endTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      // if(this.widget.settings.types.graph.selectedWidgetTimeDelay > 0)
      // this.chartTitle =  'Data is shifted back by  ' + this.widget.settings.types.graph.selectedWidgetTimeDelay + '  mins';
      // else
      if (this.widget.zoomInfo && this.widget.zoomInfo.isZoom) {
        this.chartTitle = 'Zoom is applied from  ' + st + ' to ' + et;
      }
      // else if((this.widget.widgetWiseInfo && this.widget.widgetWiseInfo.widgetWise)){
      //   this.chartTitle =  'Widget time is applied from   ' + st + ' to ' + et;
      // }
      return this.chartTitle;
    } catch (error) {
      console.error("error is getting widget chart title", error)
      return '';
    }
  }
  getWidgetTimeInDateFormat(startTime, endTime, viewBy?) {
    try {
      const me = this;
      let st = moment(startTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      let et = moment(endTime).zone(this.sessionService.selectedTimeZone.offset).format(environment.formats.dateTime['default']);
      if ((this.widget.widgetWiseInfo && this.widget.widgetWiseInfo.widgetWise)) {
        me.widgetWiseTimeToolTip = `
        'Widget wise time is applied from
        ${st} to ${et}'
       `;
      }
      return this.widgetWiseTimeToolTip;
    } catch (error) {
      console.error("error is getting widget wise time in date format", error)
      return '';
    }
  }
  getStartTimeForXAxis(startTime: number, zoomInfo, delayTime: number) {
    try {
      // if (zoomInfo && zoomInfo['times'] && zoomInfo.times.length > 0) {
      //   startTime = zoomInfo.times[zoomInfo.times.length - 1].zoomSt - delayTime;
      // }
      // console.log("delayTime === ", delayTime)
      // else
      if (delayTime > 0 && !(zoomInfo && zoomInfo['times'] && zoomInfo.times.length > 0))
        startTime = startTime - (delayTime * 60 * 1000);
      startTime = this.sessionService.adjustTimeAccToTimeZoneOffSetDiff(startTime);
    } catch (error) {
      console.error("error in getStartTimeForXAxis", error)
    }
    return startTime;
  }
  public zoomEventHandler($event) {
    try {
      let me = this;
      me.zoomlength = 0;
      let zoomFlag: boolean = false;
      if (me.widget.isCompareData) {
        let measurementObj: any;
        measurementObj = null;
        me.dashboard.compareSnapShot.compareData = [];
        if (this.widget.compareZoomInfo && this.widget.compareZoomInfo.length > 0) {
          this.comparezoomTimeObj = [];
          let d = this.widget.compareZoomInfo.length - 1;
          for (let k = 0; k < this.widget.compareZoomInfo[d].length; k++) {
            measurementObj = {
              start: this.widget.compareZoomInfo[d][k].measurementObj.start + (parseInt($event.min, 0) - this.widget.compareZoomInfo[d][k].zoomSt),
              end: this.widget.compareZoomInfo[d][k].measurementObj.start + (parseInt($event.max, 0) - this.widget.compareZoomInfo[d][k].zoomSt),
              name: this.widget.compareZoomInfo[d][k].measurementObj.name,
              preset: this.widget.compareZoomInfo[d][k].measurementObj.preset,
              rowBgColorField: this.widget.compareZoomInfo[d][k].measurementObj.rowBgColorField,
              presetlabel: this.widget.compareZoomInfo[d][k].measurementObj.presetlabel
            }
            // measurementObj.start = this.sessionService.reveseTimeToUTCTimeZone(measurementObj.start);
            //measurementObj.end = this.sessionService.reveseTimeToUTCTimeZone(measurementObj.end);
            me.dashboard.compareSnapShot.compareData.push(measurementObj);
            let timesObject = {
              start: this.widget.compareZoomInfo[d][k].measurementObj.start,
              end: this.widget.compareZoomInfo[d][k].measurementObj.end,
              zoomSt: parseInt($event.min, 0),
              zoomEt: parseInt($event.max, 0),
              measurementObj: measurementObj
            }
            this.comparezoomTimeObj.push(timesObject);
          }
          if (this.comparezoomTimeObj[0].zoomEt - this.comparezoomTimeObj[0].zoomSt < 60000) {
            console.log("start and end are same, so zoom will not apply");
            zoomFlag = true;
            return;
          }

          if (!zoomFlag) {
            this.isCompareZoom = true;
            this.widget.compareZoomInfo.push(this.comparezoomTimeObj);
            me.zoomlength = this.widget.compareZoomInfo.length;
            this.load();
          }
        }
        else {
          if (!this.widget.compareZoomInfo) {
            this.widget.compareZoomInfo = [];
            this.comparezoomTimeObj = [];
          }
          for (let i = 0; i < me.data.grpData.mFrequency[0].measurementName.length; i++) {
            measurementObj = {
              start: me.data.grpData.mFrequency[0].measurementName[i].start + parseInt($event.min, 0),
              end: me.data.grpData.mFrequency[0].measurementName[i].start + parseInt($event.max, 0),
              name: me.data.grpData.mFrequency[0].measurementName[i].name,
              preset: me.data.grpData.mFrequency[0].measurementName[i].preset,
              rowBgColorField: me.data.grpData.mFrequency[0].measurementName[i].rowBgColorField,
              presetlabel: me.data.grpData.mFrequency[0].measurementName[i].presetlabel
            }
            //measurementObj.start = this.sessionService.reveseTimeToUTCTimeZone(measurementObj.start);
            //measurementObj.end = this.sessionService.reveseTimeToUTCTimeZone(measurementObj.end);
            me.dashboard.compareSnapShot.compareData.push(measurementObj);
            let timesObject = {
              zoomSt: parseInt($event.min, 0),
              zoomEt: parseInt($event.max, 0),
              start: me.data.grpData.mFrequency[0].measurementName[i].start,
              end: me.data.grpData.mFrequency[0].measurementName[i].end,
              measurementObj: measurementObj
            }
            this.comparezoomTimeObj.push(timesObject);
          }
          if (this.comparezoomTimeObj[0].zoomEt - this.comparezoomTimeObj[0].zoomSt < 60000) {
            console.log("start and end are same, so zoom will not apply");
            zoomFlag = true;
            return;
          }
          if (!zoomFlag) {
            this.isCompareZoom = true;
            this.widget.compareZoomInfo.push(this.comparezoomTimeObj);
            me.zoomlength = this.widget.compareZoomInfo.length;
          }
        }
      }
      else {
        /*Getting zoom start time.*/
        let startTime = parseInt($event.min, 0);
        /*Getting zoom end time.*/
        let endTime = parseInt($event.max, 0);
        if ((endTime - startTime) < 60000) {
          console.log("start and end are same, so zoom will not apply")
          return;
        }
        else {
          const zoomTimeObj = {
            zoomSt: this.sessionService.reveseTimeToUTCTimeZone(startTime),
            zoomEt: this.sessionService.reveseTimeToUTCTimeZone(endTime)
          };
          if (!this.widget.zoomInfo) {
            this.widget.zoomInfo =
            {
              isZoom: true,
              widgetId: this.widget.widgetIndex,
              times: []
            }
          }
          this.widget.zoomInfo.times.push(zoomTimeObj);
          sessionStorage.setItem('opName' , OP_TYPE_ZOOM);
          this.widget.opName = OP_TYPE_ZOOM;
          me.zoomlength = this.widget.zoomInfo.times.length;
        }
      }
      sessionStorage.setItem('opName', OP_TYPE_ZOOM);
      this.widget.opName = OP_TYPE_ZOOM;
      this.load();
    } catch (e) {
      console.error("error in zoom event method", e);
    }
  }
  public undoZoomEventHandler() {
    try {
      if (this.widget.isCompareData) {
        this.zoomlength = this.widget.compareZoomInfo.length;
        this.dashboard.compareSnapShot.compareData = [];
        let d = this.widget.compareZoomInfo.length - 1;
        this.widget.compareZoomInfo[this.widget.compareZoomInfo.length - 1];
        for (let k = 0; k < this.widget.compareZoomInfo[d].length; k++) {
          let measurementObj = {
            start: this.widget.compareZoomInfo[d][k].start,
            end: this.widget.compareZoomInfo[d][k].end,
            name: this.widget.compareZoomInfo[d][k].measurementObj.name,
            preset: this.widget.compareZoomInfo[d][k].measurementObj.preset,
            rowBgColorField: this.widget.compareZoomInfo[d][k].measurementObj.rowBgColorField,
            presetlabel: this.widget.compareZoomInfo[d][k].measurementObj.presetlabel
          }
          this.dashboard.compareSnapShot.compareData.push(measurementObj);
        }
        this.widget.compareZoomInfo[this.widget.compareZoomInfo.length - 1].length = 0;
        this.widget.compareZoomInfo.pop();
        this.zoomlength = this.widget.compareZoomInfo.length;
        if (this.widget.compareZoomInfo.length === 0) {
          this.isCompareZoom = false;
          this.comparezoomTimeObj = null;
        }
      }
      else {
        this.widget.zoomInfo.times.pop();
      }

      sessionStorage.setItem('opName' , OP_TYPE_UNDOZOOM);
      this.widget.opName = OP_TYPE_UNDOZOOM;
      //widget load call
      this.load();
    } catch (error) {
      console.error("error in undozoom method", error);
    }
  }

  fillSeriesData(){
    const me = this;
    let updateData : boolean = false;
    if(me.widget.settings.types.graph.type == 0 || me.widget.settings.types.graph.type == 3 || me.widget.settings.types.graph.type == 4 || me.widget.settings.types.graph.type == 5 || me.widget.settings.types.graph.type == 6 || me.widget.settings.types.graph.type == 11 || me.widget.settings.types.graph.type == 12 ||  me.widget.settings.types.graph.type == 3 || me.widget.settings.types.graph.type == 4 || me.widget.settings.types.graph.type == 5 || me.widget.settings.types.graph.type == 6 || me.widget.settings.types.graph.type == 11 || me.widget.settings.types.graph.type == 31
       || me.widget.settings.types.graph.type == 56 || me.widget.settings.types.graph.type == 80 || me.widget.settings.types.graph.type == 83 || me.widget.settings.types.graph.type == 88 || me.widget.settings.types.graph.type == 111 || me.widget.settings.types.graph.type == 28 || me.widget.settings.types.graph.type == 29 || me.widget.settings.types.graph.type == 30){
        var index = 0;
        updateData = true;
        //console.time("chartTime");
        me.forEachGraph((args: ForEachGraphArgs) => {
          if( me.highchartInstance.series[index]){
          me.highchartInstance.series[index]['color'] = args.graphSettings.color;
          me.highchartInstance.series[index]['visible'] =  args.graphSettings.visible;
          me.highchartInstance.series[index]['selected']= args.graphSettings.selected;
          if(me.widget.settings.types.graph.type == 11 || me.widget.settings.types.graph.type == 28 || me.widget.settings.types.graph.type == 59 || me.widget.settings.types.graph.type == 8 || me.widget.settings.types.graph.type == 38 || me.widget.settings.types.graph.type == 49) {
            me.highchartInstance.series[index]['borderWidth'] =  me.highlightSelectedGraph(args.graphSettings.selected, 2);
            me.highchartInstance.series[index].options['borderWidth'] = me.highchartInstance.series[index]['borderWidth']
          }else {
            me.highchartInstance.series[index]['lineWidth'] =  me.highlightSelectedGraph(args.graphSettings.selected, 2);
            me.highchartInstance.series[index].options['lineWidth'] = me.highchartInstance.series[index]['lineWidth'];
          }
          }

          me.highchartInstance.series[index].setData(me.getNormalGraphData(args.graph, args.gsType),false,false,false);
         index = index + 1;
        });
        //console.timeEnd("chartTime");
        console.log(me.widget.widgetIndex);
        return updateData;
    }
    else if(me.widget.settings.types.graph.type == 7 || me.widget.settings.types.graph.type == 36 || me.widget.settings.types.graph.type == 37 || me.widget.settings.types.graph.type == 41 || me.widget.settings.types.graph.type == 43 || me.widget.settings.types.graph.type == 44 || me.widget.settings.types.graph.type == 58 || me.widget.settings.types.graph.type == 81 || me.widget.settings.types.graph.type == 82 || me.widget.settings.types.graph.type == 89){
      var index = 0;
      updateData = true;
      me.forEachGraph((args: ForEachGraphArgs) => {
       me.highchartInstance.series[index].setData(me.getPercentileGraphDataForLine(args.graph), false,false,false);
       index = index + 1;
      });
      return updateData;
    }
    else if(me.widget.settings.types.graph.type == 8 || me.widget.settings.types.graph.type == 45 || me.widget.settings.types.graph.type == 47 || me.widget.settings.types.graph.type == 48 || me.widget.settings.types.graph.type == 49 || me.widget.settings.types.graph.type == 52 || me.widget.settings.types.graph.type == 54 || me.widget.settings.types.graph.type == 90 || me.widget.settings.types.graph.type == 92 ){
      var index = 0;
      updateData = true;
      me.forEachGraph((args: ForEachGraphArgs) => {
       me.highchartInstance.series[index].setData(me.getSlabGraphData(args.graph),false,false,false);
       index = index + 1;
      });
      return updateData;
    }
    else if(me.widget.settings.types.graph.type == 59 || me.widget.settings.types.graph.type == 38 || me.widget.settings.types.graph.type == 91){
      var index = 0;
      updateData = true;
      me.forEachGraph((args: ForEachGraphArgs) => {
       me.highchartInstance.series[index].setData(me.getPercentileGraphData(args.graph),false,false,false);
       index = index + 1;
      });
      return updateData;
    }
      return updateData;
  }


 /*Method used to get Unique Names in Graph To Display.*/
 getUniqueNamesOfGraphsToDisplay(arrGraphNameList, vectorSeperator) {
  try {
    if (arrGraphNameList === null || arrGraphNameList.length <= 1) {
      return arrGraphNameList;
    }
    let maxGraphTokenLength = 1;
    let minGraphTokenLength = 1000;
    /*2D array for graph token column wise.*/
    let unqueGraphNameArray = new Array(arrGraphNameList.length);
    /*Array to storing if graphName is available with vector list.*/
    let vectorWithGraphNames = new Array();

    /*Step 1 - Find all Tokens column wise.*/
    /*Separting All Graph Name level by level and storing in 2D array.*/
    /*
     G1 - T1>S1>I1
     G2 - T2>S1>I1
     Stores Like -->
     [[G1, T1, S1, I1], [G2, T2, S1, I1]]
     */
    for (let i = 0; i < arrGraphNameList.length; i++) {
      /*Checking for Vector with Graph Names.*/
      /*Note(Case: 111) - This Case may be failed if vector also contain '-' special charecter. Need to handle.*/
      /*Need to keep this state for merging tokens as it is.*/
      if (arrGraphNameList[i].indexOf('-') > 0) {
        vectorWithGraphNames.push(true);
      } else {
        vectorWithGraphNames.push(false);
      }
      unqueGraphNameArray[i] = this.getTokenizeStringArray(arrGraphNameList[i], vectorSeperator);

      /*Finding Maximum Length String by Token.*/
      if (maxGraphTokenLength < unqueGraphNameArray[i].length) {
        maxGraphTokenLength = unqueGraphNameArray[i].length;
      }
      if (minGraphTokenLength > unqueGraphNameArray[i].length) {
        minGraphTokenLength = unqueGraphNameArray[i].length;
      }
    }

    if(minGraphTokenLength > maxGraphTokenLength){
      minGraphTokenLength = maxGraphTokenLength ;
    }
    minGraphTokenLength--;
    /*Checking if only one level graphs are available.*/
    if (maxGraphTokenLength === 1) {
      console.warn('Maximum columns are 1. No Need to filter.');
      return arrGraphNameList;
    }

    /*Getting Column with Sample Values.*/
    let sameValuesCols = new Array();

    /*Step 2: check columns with same values.*/
    /*Checking and Filtering Elements of 2D array column Wise (Till Max Column Size).*/
    for (let i = 0; i < minGraphTokenLength; i++) {
      if (this.checkArrayColumnWithSameValues(i, unqueGraphNameArray)) {
        sameValuesCols.push(i);
      }
    }

    let arrayWithUniqueGraphName = new Array();
    /*Merge graph token skipping same value column tokens.*/
    for (let i = 0; i < unqueGraphNameArray.length; i++) {
      let graphName = this.combineAndSkipGraphTokens(unqueGraphNameArray[i], sameValuesCols, vectorSeperator, vectorWithGraphNames[i]);
      if (graphName === null || graphName === '') {
        arrayWithUniqueGraphName.push(arrGraphNameList[i]);
      } else {
        arrayWithUniqueGraphName.push(graphName);
      }
    }
    return arrayWithUniqueGraphName;
  } catch (e) {
    console.error(e);
    return arrGraphNameList;
  }
}

/** Function Token graph Name and vector by vector seperator.
 */
getTokenizeStringArray(graphName, tokenizer) {
  let tokenArray = new Array();
  try {
    let splitByGraphName = graphName.split('-');

    /*Checking for Graph with vector.*/
    if (splitByGraphName.length > 1) {
      tokenArray.push(splitByGraphName[0].trim());
      if (splitByGraphName.length > 2) {
        let tempVector = '';
        for (let vectorIdx = 1; vectorIdx < splitByGraphName.length; vectorIdx++) {
          if (tempVector !== '') {
            tempVector = tempVector + '-';
          }
          /*To add - separator in vector only if it is not blank.*/
          tempVector = tempVector + splitByGraphName[vectorIdx].trim();
        }
        graphName = tempVector;
      } else {
        graphName = splitByGraphName[1].trim();
      }
    }

    let vectorArr = graphName.split(tokenizer);

    if (vectorArr === null || vectorArr.length === 0) {
      return tokenArray;
    }
    for (let i = 0; i < vectorArr.length; i++) {

    /*because of this condition vectors having component as "others" are showing complete graphname with vector name
       in tooltip but rest vectors are showing common factors as tooltip.
       EG : - if the panel has the following graphs :
       1. Number of Cores - Cavisson>NDAppliance>DBUpload1
       2. Number of Cores - Cavisson>NDAppliance>DBUpload2
       3. Number of Cores - Cavisson>NDAppliance>LPS
       4. Number of Cores - Cavisson>NDAppliance>Others

       then in shared tooltip it will shows as below :
       1.DBUpload1
       2.DBUpload2
       3.LPS
       4.Number of Cores - Cavisson>NDAppliance>Others

       so resolve this issue we are commenting this check
      */

    /*  if (vectorArr[i].trim() === 'Others') {
        continue;
      }  */

      tokenArray.push(vectorArr[i].trim());
    }
  } catch (e) {
    console.log(e);
    console.error(e);
  }
  return tokenArray;
}

 /**
   Method checks if columns all values are same in 2D array.
   */
   checkArrayColumnWithSameValues(column, twoDArray) {
    try {
      let value = '';
      for (let i = 0; i < twoDArray.length; i++) {
        let innerArr = twoDArray[i];

        /*If column length mismatched then leaving it as it is.- Need to check case.*/
        if (column >= innerArr.length) {
          value = "NA";
         // continue;
        }

        /*First Time value not available. - Need to check if array has single value.*/
        if (value === '') {
          value = innerArr[column];
          continue;
        }
        /*If value mismatched. return false as columns values are not matched.*/
        if (value !== innerArr[column]) {
          return false;
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /** Function is used to concat array as string, skipping passed index.
   */
  combineAndSkipGraphTokens(arrTokens, arrSkipCols, vectorSeperator, isGraphNameAvailable) {
    try {
      let graphName = '';
      let isGraphNameAdded = false;
      if(arrSkipCols.length >= arrTokens.length){
        return arrTokens[arrTokens.length - 1];
      }
      for (let i = 0; i < arrTokens.length; i++) {
        /*If cols exist in skip list. tnen igonring it.*/
        if (arrSkipCols.indexOf(i) < 0) {
          if (graphName === '') {
            graphName = arrTokens[i];
          } else {
            if (arrSkipCols.indexOf(0) < 0 && !isGraphNameAdded && isGraphNameAvailable) {
              graphName = graphName + '-' + arrTokens[i];
              isGraphNameAdded = true;
            } else {
              graphName = graphName + vectorSeperator + arrTokens[i];
            }
          }
        }
      }
      return graphName;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // getLegendDisplayName(legendNameArray : any): Array<string> {
  //   try {
  //     /* Getting Data of Panel. */
  //     const graphNameArray = this.getUniqueNamesOfGraphsToDisplay(arrlegendNamesForDisplay, '>');
  //     return graphNameArray;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
  getLegendNameArray(){
    const me = this;
    let array = [];
    try{
      me.forEachGraph((args: ForEachGraphArgs) => {
        array.push(args.graphName);
          });
    }
    catch(e){
      return [];
    }
   return array;
  }

  chartEventHandler($event) {
    try {
        console.log("event == " , $event);
        let json = {};
        json['action'] = "HIGHLIGHT_GRAPH";

        const graphName = $event['point']['series']['name'];
        const selected = $event['point']['series']['selected'];

        json['graphName'] = graphName;
        this.highlightGraph(graphName, selected);
        //this.getLowerPanelService().updateLowerPanel(json);

    } catch (error) {
      console.error('Exception while listen the series click event from chart panel. ', error);
    }
  }


  geoMapClickEventHandler(event) {
    try {
        console.log("event == " , event);
        let json = {};
        json['vectorName'] = event.point.vectorName;
        json['groupId'] = event.point.groupId;
        json['graphName'] = event.point.graphName;
        json['metricName'] = event.point.metricName;

        this.handleGeoMapEvent(json);


    } catch (error) {
      console.error('Exception while listen the series click event from chart panel. ', error);
    }
  }

  createGeoMap(co: Highmap.Options) {
    const me = this;

    const mapKey = 'countries/us/us-all';

    me.httpClient.get('./assets/dummyData/geo-location-data/'+mapKey+'.geo.json').subscribe(geoData =>{

      let chartType = me.widget.settings.types.graph.type;

      let data = [];
      let geoMapDataObj;
      geoMapDataObj = this.getGeoMapDataSet(me, chartType);

      if(geoMapDataObj) {
        data = geoMapDataObj['data'];
      }

      let scaleBarValue = geoMapDataObj['weightedAvg'] * 2;

      let intervalArray = this.getArrayofInterval(scaleBarValue, false);
      let maxScaleValue = 0;
      let tickInterval = 0;
      if(intervalArray && intervalArray.length > 1) {
        maxScaleValue = intervalArray[intervalArray.length - 1];
        tickInterval = intervalArray[intervalArray.length - 1] - intervalArray[intervalArray.length - 2];
        tickInterval = Number(tickInterval.toFixed(3));
      }

    // const drillMapData: any = geoData;
    // const drillMapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);

    // const widgetMap = Highcharts.geojson(drillMapData);
    let lastScaleValue = maxScaleValue - tickInterval;
    let geoColorBandArr = [[0, '#41dc86'], [0.5, '#E6DE6D'], [1, '#ee6055']];
    if(me.widget.settings.types.graph.geomap.redToGreen) {
      geoColorBandArr = [[0, '#ee6055'], [0.5, '#E6DE6D'], [1, '#41dc86']];
    }
    /* This is done for get the no. of digits after the decimal point in tickInterval*/
    const decimalDigit = tickInterval.toString().split('.');
    if (decimalDigit.length > 1) {
      const digit = decimalDigit[1].length;
      /*This is done because the no. of digits after the decimal point of lastScaleValue is not
      coming equal to the no. of digits after the decimal point of tick Interval  */
      lastScaleValue = Number(lastScaleValue.toFixed(digit));
    }

    co.chart = {
      map: mapKey,
      renderTo: 'chartContainer',
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      marginTop: 10,
      marginLeft: 50,
      width: me.containerDimensions.width,
      height: me.containerDimensions.height - 10
    };

    co.mapNavigation = {
      enabled: false,
    };

      co.legend = {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        valueDecimals: 0,
        symbolHeight: me.containerDimensions.height - 30, // to set the height of the scalebar/legend
        padding: -5,
        symbolPadding: 10,
        symbolWidth: 5,
        y: -10,
        x: 0,
        navigation: { enabled: false }
      } as Highmap.LegendOptions;


      co.tooltip = {
        delayForDisplay: 100,
        style : {
          fontFamily: 'open sans, sans-serif',
          fontStyle: 'normal',
          fontSize: '10px'
        },
        formatter: function () {
            return  this.point.name + ": "  + this.point.value ;
        }
    } as Highmap.TooltipOptions;

    co.colorAxis = {
      min: 0,
        max: maxScaleValue,
        stops: geoColorBandArr,
        tickInterval: tickInterval,
        showLastLabel: false,
        labels: {
          align: 'left',
          x: 5,
          useHTML: true,
          style:{
            width: 50,
            fontFamily: 'open sans, sans-serif',
            fontStyle: 'normal',
            fontSize: '10px'
            },
          formatter: function () {
            if (this.value === lastScaleValue) {
              return  '>' + this.value ;
            } else {
              return this.value;
            }
          }
        } as Highmap.ColorAxisLabelsOptions,
    } as Highmap.ColorAxisOptions;

      co.series = [
        {
          type: 'map',
          mapData: geoData,
          events: {
            click:  this.geoMapClickEventHandler.bind(this)
          },
          data: data,
          joinBy: ['name', 'key'],
          animation: false,
          name: '',
          states: {
            hover: {
              color: '#CBE7D3',
            },
          },

          shadow: false,
        } as Highmap.SeriesMapOptions,
      ];

    co.xAxis = {
      visible: false,
    };

    co.yAxis = {
      visible: false,
    };

    me.highchartInstance = Highmap.mapChart(
      me.chartContainer.nativeElement,
      co
    );

  });
  }

  getFormulaTypebyGraphStats(graphStatsType ) {
    let type = (graphStatsType.includes(",") ? graphStatsType.split(",")[0] : graphStatsType)
    return GraphStatsType["TYPE_" + type];

  }
}
