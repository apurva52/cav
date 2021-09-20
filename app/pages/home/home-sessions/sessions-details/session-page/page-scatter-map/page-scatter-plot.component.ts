import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { PagePerformanceMetrics } from '../../../common/interfaces/pageperformancemetrics';
import { SessionStateService } from '../../../session-state.service';



@Component({
  selector: 'app-page-scatter-plot',
  templateUrl: './page-scatter-plot.component.html',
  styleUrls: ['./page-scatter-plot.component.scss']
})

export class PageScatterplotComponent implements OnChanges {

  @Output() pageInstance = new EventEmitter<number>();
  @Output() tabular = new EventEmitter<boolean>();

  @Input() activeSession = false;
  @Output() metricChanged = new EventEmitter();

  pages: any;
  currentPerformanceMetric = "Onload";
  metricIndex = "timeToLoad"
  series = null;
  data = null;
  ready: boolean;
  scatterChart: ChartConfig;
  metric: SelectItem = { label: 'Onload', value: "timeToLoad" };
  //metric:any;
  metrics: SelectItem[];
  buckets: SelectItem[];
  options: ChartConfig;
  trends = PagePerformanceMetrics;
  outlier: number = 120;



  constructor(private stateService: SessionStateService) {
    this.metrics = [
      { label: 'Onload', value: "timeToLoad" },
      { label: 'TTDL', value: "timeToDOMComplete" },
      { label: 'TTDI', value: "domInteractiveTime" },
      { label: 'DOM Time', value: "domTime" },
      { label: 'PRT', value: "percievedRenderTime" },
      { label: 'Unload', value: "unloadTime" },
      { label: 'DNS', value: "dnsTime" },
      { label: 'TCP', value: "connectionTime" },
      { label: 'SSL', value: "secureConnectionTime" },
      { label: 'Wait Time', value: "firstByteTime" },
      { label: 'Download Time', value: "loadEventTime" },
      { label: 'First Paint ', value: "firstpaint" },
      { label: 'First Content Paint', value: "firstcontentpaint" },
      { label: 'Time to Interactive', value: "timetointeractive" },
      { label: 'First Input Delay', value: "firstinputdelay" }



    ];

    this.pages = this.stateService.getSelectedPage();
    if (localStorage.getItem("perfMetric") !== null && localStorage.getItem("perfMetric") !== undefined)
      this.currentPerformanceMetric = localStorage.getItem("perfMetric");

      this.metrics.some(e=>{
        if(e.label == this.currentPerformanceMetric){
          this.metric = e;
          return true;
        }
      })
      this.updateMetric(this.metric);
  }



  ngOnChanges(changes: SimpleChanges) {
    this.pages = this.stateService.getSelectedPage();
    if (localStorage.getItem("perfMetric") !== null && localStorage.getItem("perfMetric") !== undefined)
      this.currentPerformanceMetric = localStorage.getItem("perfMetric");
    this.getSeriesData();
    this.setScatterChart()
    setTimeout(() => {
      this.getSeriesData();
      this.setScatterChart();
    });
  }




  getSeriesData() {
    this.series = [];
    this.series.push({ "name": "Pages With Resource Timings", "data": [] });
    this.series.push({ "name": "Pages Without Resource Timings", "data": [] });
    this.data = [];
    this.data.push({ "name": "Pages With Resource Timings", "data": [] });
    this.data.push({ "name": "Pages Without Resource Timings", "data": [] });
    for (let i = 0; i < this.pages.length; i++) {
      let page = this.pages[i];
      let tmp = [];
      tmp.push(new Date(page["navigationStartTime"]).getTime());
      tmp.push(page[this.metricIndex]);
      if (page["resourceTimingFlag"]) {
        this.series[0].data.push(tmp);
        this.data[0].data.push(page);
      }
      else {
        this.series[1].data.push(tmp);
        this.data[1].data.push(page);
      }
    }


  }

  updateMetric(e: SelectItem) {
    console.log(e)

    this.scatterChart = undefined;
    this.currentPerformanceMetric = '';
    this.metricIndex = e.value;
    this.currentPerformanceMetric = e.label;
    localStorage.setItem("perfMetric", e.label);
    this.metricChanged.emit(e);


    setTimeout(() => {
      this.getSeriesData();
      this.setScatterChart();
    });
  }

  setScatterChart() {
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
            text: "Navigation Start Time"
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M}' }
        },
        yAxis: {
          title: {
            text: this.currentPerformanceMetric + " (sec)"
          }
        },
        legend: {
          floating: false,
          layout: 'vertical',
          verticalAlign: 'bottom',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            events: {
              click: (event) => {
                let series = event.point.series.index;
                let point = event.point.index;
                let data = this.data[series].data[point];
                let pi = data["index"]; //pageInstace
                this.pageInstance.emit(pi);
              }
            }
          },
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(231, 76, 60)'
                }
              }
            },
            states: {
              hover: {

              }
            },
            tooltip: {
              pointFormat: this.currentPerformanceMetric + ' : {point.y} sec <br> <font style="font-size:8px;">Click to open page</font>'
            }
          }
        },
        series: this.series
      }
    };

    console.log('scatterChart : ', this.scatterChart, this.series, this.currentPerformanceMetric);
  }

  toggleTabular() {
    this.tabular.emit(true);
  }


}



