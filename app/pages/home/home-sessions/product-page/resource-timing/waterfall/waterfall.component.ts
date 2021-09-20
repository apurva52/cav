import { AppError } from 'src/app/core/error/error.model';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../common/service/nvhttp.service';
import { ChartConfig } from './../../../../../../shared/chart/service/chart.model';
import TimeFilterUtil from './../../../common/interfaces/timefilter';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng';
import { MenuItem } from 'primeng/api';
// import { RESOURCE_TIMING_DATA, PAGE, USER_TIMING_DATA } from './service/waterfall.dummy';
import { WaterfallItem, TrendFilterCriteria } from './service/waterfall.model';
import * as moment from 'moment';
import { Cols } from '../../../common/interfaces/cols';
import { Store } from 'src/app/core/store/store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../../../common/util/export-util';

@Component({
  selector: 'app-waterfall',
  templateUrl: './waterfall.component.html',
  styleUrls: ['./waterfall.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WaterfallComponent implements OnInit, OnChanges {
  @ViewChild('wt') table: Table;
  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() resourceTimingData: any;
  @Input() page: any;
  @Input() userTimingData: any[];

  resourceTimingDialogData: any;
  userTimingDialogData: any;


  waterfallTableCols: Cols[];
  waterfallData: WaterfallItem[] = [];

  waterfallTimelineCols: Cols[];
  lap: any[];
  timelineView: boolean = true;
  items: MenuItem[];
  ctype: string = 'all';
  customTimeError: string;
  customTime: Date[] = [];
  maxDate: Date;
  filter: TrendFilterCriteria;
  loading: boolean;
  error: Error | AppError = null;
  trendData: any[] = [];
  trendChartData: ChartConfig;
  visible: boolean;
  selectedRow: any;
  rowData: WaterfallItem;
  type: string;

  constructor(private http: NvhttpService) {
    // this.resourceTimingData = RESOURCE_TIMING_DATA;
    // this.page = PAGE;
    // this.userTimingData = USER_TIMING_DATA;
    // set waterfall table columns
    this.waterfallTableCols = [
      { field: 'filename', header: 'File Name', classes: 'text-left' },
      { field: 'host', header: 'Host', classes: 'text-right' },
      { field: 'initiatorType', header: 'Initiator', classes: 'text-left' },
      { field: 'startTime', header: 'Start Time(ms)', classes: 'text-right' },
      { field: 'duration', header: 'Duration(ms)', classes: 'text-right' },
      { field: 'timingRedirect', header: 'Redirect Time (ms)', classes: 'text-right' },
      { field: 'timingDNS', header: 'DNS(ms)', classes: 'text-right' },
      { field: 'timingCache', header: 'App Cache Time', classes: 'text-right' },
      { field: 'timingTCP', header: 'TCP(ms)', classes: 'text-right' },
      { field: 'timingRequest', header: 'Wait(ms)', classes: 'text-right' },
      { field: 'timingResponse', header: 'Download (ms)', classes: 'text-right' },
      { field: 'transferSize', header: 'Transfer Size', classes: 'text-right' },
      { field: 'nextHopProtocol', header: 'Protocol', classes: 'text-left' },
    ];

    this.waterfallTimelineCols = [
      { field: 'filename', header: 'Name', width: '20%', classes: 'text-left' },
      { field: 'initiatorType', header: 'Initiator', width: '10%', classes: 'text-left' },
      { field: 'host', header: 'Domain', width: '20%', classes: 'text-left' },
      { field: 'transferSize', header: 'Transfer Size', width: '12%', classes: 'text-right' },
      { field: 'timeline', header: 'Timeline', width: '40%', classes: 'text-right' },
    ];

    this.items = [
      { label: 'CSV', command: (event: any) => { this.table.exportCSV(); } },
      { label: 'Excel', command: (event: any) => { this.exportExcel(); } },
      { label: 'PDF', command: (event: any) => { this.exportPdf(); } }
    ];

    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');
  }

  ngOnInit(): void {
    // this.getWaterfallData();
  }

  ngOnChanges() {
    if (!this.userTimingData) {
      this.userTimingData = [];
    }

    if (this.resourceTimingData && this.resourceTimingData.entries) {
      this.getWaterfallData();
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

  exportPdf() {
    // set a customized page format to fit all the columns. 
    const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.table.el.nativeElement));
    //autoTable(doc, {html: this.table.el.nativeElement});
    const jsonData = ExportUtil.generatePDFData(this.table.el.nativeElement, 1);
    console.log('waterfall export json data - ', jsonData);
    autoTable(doc, jsonData);
    doc.save('waterfall.pdf');
  }


  exportExcel() {
    import('xlsx').then(xlsx => {
      let jsonData = ExportUtil.getXLSData(this.table.el.nativeElement, 1);
      const worksheet = xlsx.utils.json_to_sheet(jsonData.data, {header: jsonData.headers, skipHeader:true});
      
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer);
    });
  }


  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'waterfall.xlsx');
    });
  }

  showHandler(e: MouseEvent, i: any, type: string): void {
    this.lap = [];
    switch (type) {
      case 'resourceTimingDialog':
        this.resourceTimingDialogData = i;
        break;

      case 'userTimingDialog':
        this.userTimingDialogData = i;
        this.lap = JSON.parse(unescape(i.actionData));
        break;
    }

    (document.getElementById(type) as HTMLDialogElement).show();
  }

  hideHandler(type: string): void {
    switch (type) {
      case 'resourceTimingDialog':
        this.resourceTimingDialogData = null;
        break;

      case 'userTimingDialog':
        this.userTimingDialogData = null;
        break;
    }

    (document.getElementById(type) as HTMLDialogElement).close();
  }

  ttgetduration(value): string {
    if (value > 1000) {
      value = `${(value / 1000).toFixed(2)}s`;
    }
    else {
      value = `${parseInt(value, 10)}ms`;
    }
    return value;
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

  getSessions(flag: boolean, type?: string, rowData?: WaterfallItem): void {
    if (rowData) {
      this.rowData = rowData;
    }
    if (type) {
      this.type = type;
    }
    //  set the filtercriteria
    if (flag) {
      this.filter.timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    }

    // get the sessios through REST API
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
        this.prepareChartData(state.data, this.type, this.rowData);
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

  prepareChartData(data: any[], type: string, rowData: any): void {
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
      l.push(parseInt(r[2]));
      ccc.push(l);
    }

    duration = ddd;
    count = ccc;

    console.log('duration : ', duration, 'count : ', count);

    let titleText = '';
    switch (type) {
      case 'resource':
        titleText = `Resource Trend for ${rowData.url}`;
        break;

      case 'domain':
        titleText = `Domain Trend for ${rowData.host}`;
        break;
    }

    this.trendChartData = {
      title: null,
      highchart: {
        exporting: {
          enabled: true
        },
        title: {
          text: titleText
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



}
