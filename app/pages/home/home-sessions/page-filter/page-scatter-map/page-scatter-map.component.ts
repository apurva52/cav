import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Metadata } from '../../common/interfaces/metadata';
import { PagePerformanceMetrics } from '../../common/interfaces/pageperformancemetrics';
import { PercentilePlot, ScatteredPlotData } from '../service/page-filter.model';
import { ParsePageFilter } from '../sidebar/page-filter-sidebar/service/ParsePageFilter';

@Component({
  selector: 'app-page-scatter-map',
  templateUrl: './page-scatter-map.component.html',
  styleUrls: ['./page-scatter-map.component.scss']
})

export class PageScatterMapComponent implements OnChanges {

  @Input() startTime: string;
  @Input() endTime: string;
  @Input() offsetWindow: any[] = [];
  @Input() loading: boolean;
  @Input() metadata: Metadata;
  @Input() metric: SelectItem;
  @Input() pages: any[];

  @Output() bucketChangeEvent = new EventEmitter();
  @Output() metricChanged = new EventEmitter();
  @Output() offsetChangedEvent = new EventEmitter();

  bucket: string = ParsePageFilter.pageFilters.bucketString;
  metrics: SelectItem[];
  buckets: SelectItem[];
  trends = PagePerformanceMetrics;
  outlier: number = 120;

  scatterChart: ChartConfig;
  chartData: ScatteredPlotData;
  visible: boolean;
  percentileChart: ChartConfig;
  percentileData: PercentilePlot;

  constructor(private router: Router) {
    this.metrics = [
      { label: 'Onload', value: this.trends.onload },
      { label: 'TTDL', value: this.trends.ttdl },
      { label: 'TTDI', value: this.trends.ttdi },
      { label: 'DOM Time', value: this.trends.dom },
      { label: 'PRT', value: this.trends.prt },
      { label: 'Unload', value: this.trends.unload },
      { label: 'DNS', value: this.trends.dns },
      { label: 'TCP', value: this.trends.tcp },
      { label: 'SSL', value: this.trends.ssl },
      { label: 'Wait Time', value: this.trends.wait },
      { label: 'Download Time', value: this.trends.download }
    ];

    this.buckets = [
      { label: '5 Minutes', value: '5 Minutes' },
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '30 Minutes', value: '30 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },
      { label: 'All', value: 'All' }
    ];

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pages'] || changes['metric']) {
      this.chartData = new ScatteredPlotData(this.metric.label, this.pages, this.metadata, this.metric.value, this.outlier);
      this.percentileData = new PercentilePlot(this.metric.label, this.pages, this.metric.value);
      this.setScatterChart();
    }
  }

  updateMetric(e: SelectItem) {
    this.scatterChart = undefined;

    this.chartData = new ScatteredPlotData(e.label, this.pages, this.metadata, e.value, this.outlier);
    this.percentileData = new PercentilePlot(e.label, this.pages, e.value);
    this.metricChanged.emit(e);

    setTimeout(() => {
      this.setScatterChart();
    });
  }

  updateBucket(e) {
    this.bucketChangeEvent.emit(e);
    ParsePageFilter.pageFilters.bucketString = e;
    this.offsetWindow = [];

  }

  updateOffset(e) {
    this.offsetChangedEvent.emit(e);

  }

  outlierChange(e) {
    if (e.target.value === '') {
      this.outlier = 120;

    } else {
      this.outlier = Number((e.target.value.split(' ')[0]).replace(/,/g, ''));
    }
    this.scatterChart = undefined;

    this.chartData = new ScatteredPlotData(this.metric.label, this.pages, this.metadata, this.metric.value, this.outlier);
    this.percentileData = new PercentilePlot(this.metric.label, this.pages, this.metric.value);

    setTimeout(() => {
      this.setScatterChart();
    });
  }

  openPercentileChart() {
    this.visible = true;
    this.percentileChart = undefined;

    setTimeout(() => {
      this.percentileChart = {
        title: null,
        highchart: {
          chart: {
            type: 'spline',
            zoomType: 'x',
            width: 500
          },
          title: {
            text: ''
          },
          xAxis: {
            title: {
              text: 'Percentile(%)'
            }
          },
          yAxis: {
            title: {
              text: this.percentileData.yType
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            spline: {
            }
          },
          series: [{ name: this.percentileData.yType, data: this.percentileData.series, type: null }],
          credits: {
            enabled: false
          },
          exporting: {
            enabled: true
          }

        }
      };
    });
  }

  setScatterChart() {
    this.scatterChart = undefined;

    this.scatterChart = {
      title: null,
      highchart: {
        chart: {
          type: 'scatter',
          zoomType: 'x'
        },
        title: {
          text: null,
        },
        time: {
          timezone: sessionStorage.getItem('_nvtimezone')
        },
        xAxis: {
          title: {
            text: this.chartData.xtype
          }
          ,
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M:%S}' }
        },
        yAxis: {
          title: {
            text: this.chartData.ytype
          }
        },
        legend: {
          floating: false
        },
        plotOptions: {
          series: {
            events: {
              click: (event) => {
                const series = event.point.series.index;
                const point = event.point.index;
                const data = this.chartData.data[series][point];

                // if (this.ddrflag == true) {
                //   const sid = data["sid"];
                //   const pi = data["pageinstance"];
                //   console.log("plotOptions onclick : ", data);
                //   this.openPage({ "sid": sid, "pageInstance": pi });
                // }
                // else {
                const sid = data[1];
                const pageInstance = data[2];
                console.log("plotOptions onclick : ", data);
                this.router.navigate(['/page-detail/navigation-timing'], { queryParams: { sid, pageInstance }, replaceUrl: true });
                // }
              }
            }
          },
          scatter: {
            marker: {
              radius: 3,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(231, 76, 60)'
                }
              }
            },
            turboThreshold: 10000,
            tooltip: {
              pointFormat: this.chartData.pointFormat
            }
          }
        },
        series: this.chartData.series,
        credits: {
          enabled: false
        },
        exporting: {
          enabled: true
        }
      }
    };

    console.log('scatterChart : ', this.scatterChart);
  }
}
