import { AppError } from 'src/app/core/error/error.model';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../common/service/nvhttp.service';
import { HttpClient } from '@angular/common/http';
import { TrendFilterCriteria } from './../waterfall/service/waterfall.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnChanges } from '@angular/core';
import { Cols } from '../../../common/interfaces/cols';
// import { RESOURCE_TIMING_DATA, PAGE, DOMAIN_ACTIVITY_DATA, DOMAIN_DATA, SERIES_DATA } from './service/domain-activity.dummy';
import TimeFilterUtil from '../../../common/interfaces/timefilter';
import { DomainName } from '../../../common/interfaces/domain';
import * as moment from 'moment';
import { MenuItem, Table } from 'primeng';
import { Store } from 'src/app/core/store/store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../../../common/util/export-util';

@Component({
  selector: 'app-domain-activity',
  templateUrl: './domain-activity.component.html',
  styleUrls: ['./domain-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DomainActivityComponent implements OnInit, OnChanges {
  @ViewChild('dt') table: Table;

  @Input() resourceTimingData: any;
  @Input() page: any;
  @Input() domainActivityData: any[];
  @Input() domaindata: any[] = [];
  @Input() seriesdata: any[] = [];

  columns: Cols[];
  tabular: boolean = false;
  tableData: any[];
  chart: ChartConfig;
  customTime: Date[] = [];
  loading: boolean;
  trendData: any[] = [];
  trendChartData: ChartConfig;
  customTimeError: string;
  items: MenuItem[];
  maxDate: Date;
  visible: boolean = false;
  filter: TrendFilterCriteria;
  error: Error | AppError = null;
  domainName: string;


  constructor(private http: HttpClient, private nvhttp: NvhttpService) {
    // set the table columns
    this.columns = [
      { field: 'domainName', header: 'Domain Name', classes: 'text-right' },
      { field: 'totalRequest', header: 'Total Request', classes: 'text-right' },
      { field: 'avgDuration', header: 'Avg Duration(ms)', classes: 'text-right' },
      { field: 'avgDownload', header: 'Avg Download(ms)', classes: 'text-right' },
      { field: 'avgWait', header: 'Avg Wait(ms)', classes: 'text-right' },
      { field: 'avgRedirect', header: 'Avg Redirect(ms)', classes: 'text-right' },
      { field: 'avgDNS', header: 'Avg DNS(ms)', classes: 'text-right' },
      { field: 'avgTCP', header: 'Avg TCP(ms)', classes: 'text-right' },
      { field: 'avgAppCache', header: 'Avg App Cache(ms)', classes: 'text-right' },
      { field: 'transferSize', header: 'Transfer Size', classes: 'text-right' }
    ];

    this.items = [
      { label: 'CSV', command: () => { this.table.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];

    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');

  }

  ngOnInit(): void {
    // this.resourceTimingData = RESOURCE_TIMING_DATA;
    // this.page = PAGE;
    // this.domainActivityData = DOMAIN_ACTIVITY_DATA;
    // this.domaindata = DOMAIN_DATA;
    // this.seriesdata = SERIES_DATA;

    // this.getTableData();
    // this.getChartData();
  }

  ngOnChanges() {
    this.getTableData();
    this.getChartData();
  }

  getChartData() {
    this.chart = {
      title: '',
      highchart: {
        exporting: {
          enabled: true
        },
        credits: {
          enabled: false
        },
        chart: {
          // renderTo: 'chartcontainer1',
          type: 'columnrange',
          inverted: true,
          // height: this.domaindata.length <= 20 ? 500 : 1100,
          // width: 1000
        },

        title: {
          text: ''
        },

        xAxis: {
          categories: this.domaindata
        },
        yAxis: {
          title: {
            text: 'Time in seconds'
          }

        },
        legend: {
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical',
          x: 0,
          y: 50
        },

        plotOptions: {
          columnrange: {
            grouping: false
          }
        },
        tooltip: {
          pointFormat: '<span>Total</span> : <b>{point.low}s - {point.high}s</b>'
        },
        series: this.seriesdata
      }
    };
  }

  getTableData(): void {

    this.tableData = [];

    for (const d of this.domainActivityData) {
      this.tableData.push({
        domainName: d.domainName,
        avgAppCache: d.appCache_avg,
        avgDNS: d.dns_avg,
        avgDownload: d.download_avg,
        avgDuration: d.duration_avg,
        avgRedirect: d.redirection_avg,
        avgTCP: d.tcp_avg,
        avgWait: d.wait_avg,
        totalRequest: d.resources.length,
        transferSize: d.transferSize,
        appCacheCount: d.appCache_count,
        dnsCount: d.dns_count,
        downloadCount: d.download_count,
        durationCount: d.duration_count,
        redirectionCount: d.redirection_count,
        tcpCount: d.tcp_count,
        waitCount: d.wait_count,
        resourcesLength: d.resources.length,
        transferSizeCount: d.transferSize_count
      });
    }
  }

  getResourceTrendData(bool: boolean, domainName?: string): void {
    if (domainName) {
      this.domainName = domainName;
    }
    this.visible = true;
    //  set Filtercriteria
    this.customTime[0] = new Date(this.page.navigationStartTime.split(' ')[1] + ' ' + '00:00:00');
    this.customTime[1] = new Date(this.page.navigationStartTime.split(' ')[1] + ' ' + '23:59:59');

    this.filter = {
      timeFilter: TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]),
      bucket: 3600,
      domains: this.domainName,
      pages: this.page.pageName.id
    };

    if (bool) {
      this.filter.timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    }

    // get the data through REST API
    // get the sessios through REST API

    this.nvhttp.getDomainTrendData(this.filter).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        console.log('Loading : ', state);
        this.loading = state.loading;
        this.error = state.error;
        this.trendData = state.data;
      }

      if (state instanceof NVPreLoadedState) {
        console.log('Loaded : ', state);

        this.loading = state.loading;
        this.error = state.error;
        this.trendData = state.data;

        this.trendData = this.trendData.sort((a, b) => {
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
        for (const r of this.trendData) {
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

        this.trendChartData = {
          title: `Domain Trend for ${this.domainName}`,
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
    },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          console.log('Loading Error : ', err);

          this.loading = err.loading;
          this.error = err.error;
          this.trendData = err.data;
        }
      });

  }

  resetCustomTime(e): void {
    this.customTime = [];
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimeError = '';
  }

  validateTime() {
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
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.table.el.nativeElement));
    //autoTable(doc, {html: this.table.el.nativeElement});
    const jsonData = ExportUtil.generatePDFData(this.table.el.nativeElement, 1);
    console.log('waterfall export json data - ', jsonData);
    autoTable(doc, jsonData);
    doc.save('domain-activity.pdf');
  }


  exportExcel() {
    import('xlsx').then(xlsx => {
      const jsonData = ExportUtil.getXLSData(this.table.el.nativeElement, 1);
      const worksheet = xlsx.utils.json_to_sheet(jsonData.data, {header: jsonData.headers, skipHeader: true});
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
      FileSaver.saveAs(data, 'domain-activity.xlsx');
    });
  }



}
