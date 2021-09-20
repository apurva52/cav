import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Cols } from '../../../common/interfaces/cols';
import TimeFilterUtil from './../../../common/interfaces/timefilter';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import * as moment from 'moment';
import { TrendFilterCriteria, WaterfallItem } from '../waterfall/service/waterfall.model';


@Component({
  selector: 'app-bottleneck',
  templateUrl: './bottleneck.component.html',
  styleUrls: ['./bottleneck.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BottleneckComponent implements OnChanges {
  @Input() resourceTimingData: any;
  @Input() page: any;

  bloaddata: any[] = [];
  bresponsedata: any[] = [];
  bdnsdata: any[] = [];
  bconnectdata: any[] = [];
  columns: Cols[];
  rows = 5;
  rowsPerPageOptions = [5, 10, 30, 50];
  customTime: Date[] = [];
  visible: boolean;
  filter: TrendFilterCriteria;
  loading: boolean;
  error: Error | AppError = null;
  trendData: any[] = [];
  trendChartData: ChartConfig;
  maxDate: Date;
  customTimeError: string;
  waterfallData: WaterfallItem[] = [];



  constructor(private http: NvhttpService) {
    this.columns = [
      { field: 'name', header: 'Name', classes: 'text-left' },
      { field: 'time', header: 'Time', classes: 'text-right' }
    ];
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');
  }

  ngOnChanges(): void {

    if (this.resourceTimingData && this.resourceTimingData.bloaddata) {
      const data = Object.keys(this.resourceTimingData.bloaddata).reverse();
      for (const key of data) {
        // tslint:disable-next-line: max-line-length
        this.bloaddata.push({
          name: this.getFileNameFromUrl(this.resourceTimingData.bloaddata[key]),
          time: Number(key),
          url: this.resourceTimingData.bloaddata[key],
          filename: this.resourceTimingData.entries[0].filename,
          title: this.resourceTimingData.entries[0].url,
          host: new URL(this.resourceTimingData.bloaddata[key]).host,
          width: this.getWidth(Number(key), 'bloaddata')
        });
      }
    }


    if (this.resourceTimingData && this.resourceTimingData.bresponsedata) {
      const data = Object.keys(this.resourceTimingData.bresponsedata).reverse();
      for (const key of data) {
        // tslint:disable-next-line: max-line-length
        this.bresponsedata.push({
          name: this.getFileNameFromUrl(this.resourceTimingData.bresponsedata[key]),
          time: Number(key),
          url: this.resourceTimingData.bresponsedata[key],
          filename: this.resourceTimingData.entries[0].filename,
          title: this.resourceTimingData.entries[0].url,
          SVGComponentTransferFunctionElement: this.resourceTimingData.entries[0].url,
          host: new URL(this.resourceTimingData['bresponsedata'][key]).host,
          width: this.getWidth(Number(key), 'bresponsedata')
        });
      }
    }


    if (this.resourceTimingData && this.resourceTimingData.bconnectdata) {
      const data = Object.keys(this.resourceTimingData.bconnectdata).reverse();
      for (const key of data) {
        // tslint:disable-next-line: max-line-length
        this.bconnectdata.push({
          name: this.getFileNameFromUrl(this.resourceTimingData.bconnectdata[key].url),
          time: Number(key),
          url: this.resourceTimingData.bconnectdata[key].url,
          filename: this.resourceTimingData.entries[0].filename,
          title: this.resourceTimingData.entries[0].url,
          host: new URL(this.resourceTimingData['bconnectdata'][key]['url']).host,
          width: this.getWidth(Number(key), 'bconnectdata')
        });
      }
    }


    if (this.resourceTimingData && this.resourceTimingData.bdnsdata) {

      const data = Object.keys(this.resourceTimingData.bdnsdata).reverse();
      for (const key of data) {
        // tslint:disable-next-line: max-line-length
        this.bdnsdata.push({
          name: this.getFileNameFromUrl(this.resourceTimingData.bdnsdata[key].url),
          time: Number(key), url: this.resourceTimingData.bdnsdata[key],
          filename: this.resourceTimingData.entries[0].filename,
          title: this.resourceTimingData.entries[0].url,
          host: new URL(this.resourceTimingData['bdnsdata'][key]['url']).host,
          width: this.getWidth(Number(key), 'bdnsdata')
        });
      }
    }
  }

  getWaterfallData() {
    this.waterfallData = [];

    for (const i of this.resourceTimingData.entries) {
      this.waterfallData.push({
        filename: i.filename,
        url: i.url,
        host: i.host,
        initiatorType: i.initiatorType,
        contentType: i.contentType,
        startTime: i.startTime,
        duration: i.duration,
        dur: i.dur,
        timingRedirect: i.timing.redirect,
        timingDNS: i.timing.dns,
        timingCache: i.timing.cache,
        timingTCP: i.timing.tcp,
        timingRequest: i.timing.request,
        timingResponse: i.timing.response,
        transferSize: i.transferSize,
        nextHopProtocol: i.nextHopProtocol,
        differentOriginFlag: i.differentOriginFlag,
        isCache: i.isCache,
        timingCacheStart: i.timing.cacheStart,
        timingDNSStart: i.timing.dnsStart,
        timingPhaseGap1: i.timing.phaseGap1,
        timingPhaseGap1start: i.timing.phaseGap1start,
        timingPhaseGap2: i.timing.phaseGap2,
        timingPhaseGap2start: i.timing.phaseGap2start,
        timingPhaseGap3: i.timing.phaseGap3,
        timingPhaseGap3start: i.timing.phaseGap3start,
        timingRedirectStart: i.timing.redirectStart,
        timingRequestStart: i.timing.requestStart,
        timingResponseStart: i.timing.responseStart,
        timingTCPStart: i.timing.tcpStart
      });

    }
  }


  getFileNameFromUrl(url) {
    const b = new URL(url);

    let finalurl = b.pathname;

    if (finalurl.indexOf(';') > -1) {
      finalurl = finalurl.substring(0, finalurl.indexOf(';'));
    }

    const fields = finalurl.split('/');
    let l = fields.length - 1;
    while (l) {
      if (fields[l] !== '') {
        return fields[l];
      }
      l--;
    }
    return finalurl;
  }

  getTrendData(data: WaterfallItem, type: string): void {
    this.visible = true;

    // set the filtercriteria
    this.customTime[0] = new Date(this.page.navigationStartTime.split(' ')[1] + ' ' + '00:00:00');
    this.customTime[1] = new Date(this.page.navigationStartTime.split(' ')[1] + ' ' + '23:59:59');
    this.filter = {
      timeFilter: TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]),
      bucket: 3600,
      domains: data.host,
      pages: this.page.pageName.id,
      resource: type === 'resource' ? new URL(data.url).pathname : null
    };


    // get the sessions
    this.getSessions(false, type, data);


  }



  getSessions(flag: boolean, type?: string, row?: WaterfallItem): void {
    //  set the filtercriteria
    if (flag) {
      this.filter.timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    }

    // get the sessios through REST API
    // tslint:disable-next-line: deprecation
    this.http.getDomainTrendData(this.filter).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
        this.trendData = state.data;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        this.trendData = state.data;
        this.prepareChartData(state.data, type, row);
      }

    },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          this.loading = err.loading;
          this.error = err.error;
          this.trendData = err.data;
        }

      });
  }

  prepareChartData(data: any[], type: string, row: any): void {
    data = data.sort((a, b) => {
      if (a[0] === b[0]) {
        return 0;
      }
      else {
        return (a[0] < b[0]) ? -1 : 1;
      }
    });

    let duration = [];
    let count = [];
    const ddd = [];
    const ccc = [];
    for (const r of data) {
      const s = [];
      const datetime = r[0] * 1000;
      s.push(datetime);
      s.push(parseFloat(r[1]));
      ddd.push(s);

      const l = [];
      l.push(datetime);
      l.push(Number(r[2]));
      ccc.push(l);
    }

    duration = ddd;
    count = ccc;

    let titleText = '';
    switch (type) {
      case 'resource':
        titleText = `Resource Trend for ${row.name}`;
        break;

      case 'domain':
        titleText = `Domain Trend for ${row.host}`;
        break;
    }

    this.trendChartData = {
      title: titleText,
      highchart: {
        exporting: {
          enabled: true
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        chart: {
          height: 400,
          width: 500,
          zoomType: 'y'
        },
        time: {
          timezone: sessionStorage.getItem('_nvtimezone')
        },
        xAxis: {
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M}' },
          crosshair: false
        },
        yAxis: [{ // Primary yAxis
          labels: {
            format: '{value}',
            style: {
              color: '#434348',
            }
          },
          title: {
            text: 'Duration',
            style: {
              color: '#434348'
            }
          }
        }, { // Secondary yAxis
          title: {
            text: 'Count',
            style: {
              color: '#7cb5ec'
            }
          },
          labels: {
            format: '{value} ',
            style: {
              color: '#7cb5ec'
            }
          },
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        legend: {
          floating: false,
          backgroundColor: '#FFFFFF'
        },
        series: [

          {
            name: 'Count',
            type: 'area',
            yAxis: 1,
            data: count,
            tooltip: {
              valueSuffix: ''
            }
          },
          {
            name: 'Duration (ms)',
            type: 'spline',
            yAxis: 0,
            data: duration,
            tooltip: {
              valueSuffix: 'ms'
            }

          }]
      }
    };
  }

  resetCustomTime(e) {
    this.customTime = [];
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimeError = '';
  }



  submit(): void {

    // validate the custom time
    if (this.customTime[0] === null) {
      this.customTimeError = 'Start time cannot be greater than end time.';
      return;
    }

    if (new Date(this.customTime[0]).getTime() > new Date(this.customTime[1]).getTime()) {
      this.customTimeError = 'Start time cannot be greater than end time.';
      return;
    }

    this.customTimeError = '';

    this.getSessions(true);
  }



  getWidth(time: number, data: string) {
    //Note: Max width is 100px.
    let keys = Object.keys(this.resourceTimingData[data]);
    let maxTime = 0;
    if (parseFloat(keys[keys.length - 1]) > 0)
      maxTime = parseFloat(keys[keys.length - 1]);
    else
      maxTime = parseFloat(keys[keys.length - 2]);
    if (!time) return 0.0;
    return ((time / maxTime) * 100);
  }

}
