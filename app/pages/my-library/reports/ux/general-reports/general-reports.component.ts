import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Cols } from 'src/app/pages/home/home-sessions/common/interfaces/cols';
import ReportUtils from 'src/app/pages/home/home-sessions/common/interfaces/report-utils';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { UxService } from '../service/ux.service';
import { GeneralReportsFilterComponent } from './general-reports-filter/general-reports-filter.component';

@Component({
  selector: 'app-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.scss']
})

export class GeneralReportsComponent implements OnInit, OnChanges {
  @ViewChild(GeneralReportsFilterComponent) sidebar: GeneralReportsFilterComponent;
  @ViewChild('dt') dt: Table;

  @Input() CRQ: any;
  @Input() name: string;

  appConfig: any;
  startTime: string;
  endTime: string;
  loading: boolean;
  error: Error | AppError;
  data: any;
  transformResult: any;
  tableData: any[];
  cols: Cols[];
  _selectedColumns: any[];

  tableFooter: any = {};

  tabular: boolean;

  topFilters: SelectItem[];
  topFilter: number = 0;
  topCount: number = 10;

  columnFilters: SelectItem[];
  columnFilter: string;

  chartTypes: SelectItem[];
  chartType: number = 0;
  showTableChart: boolean;

  chartData: ChartConfig;

  items: MenuItem[];
  exportColumns: any[];

  toggle: boolean;
  search: boolean;


  constructor(
    private uxService: UxService,
    private http: NvhttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.topFilters = [
      { label: 'top', value: 0 },
      { label: 'bottom', value: 1 }
    ];

    this.chartTypes = [
      { label: 'BAR Chart', value: 0 },
      { label: 'PIE Chart', value: 1 }
    ];

    this.items = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'EXCEL', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];
  }

  exportCSV() {
    if (this.dt) {
      this.dt.exportCSV();
    }
  }

  exportPdf() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.tableData.concat(this.tableFooter));
        doc.save(`${this.CRQ.name}.pdf`);
      });
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.tableData.concat(this.tableFooter));
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.CRQ.name);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  ngOnChanges(): void {
    this.showTableChart = false;
  }

  ngOnInit() {

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  generateReport(f): void {
    console.log('Applied Filters : ', f);
    if (!this.CRQ) {
      this.confirmationService.confirm({
        message: 'Please select a report to continue.'
      });
    }

    window['selectedCRQ'] = this.CRQ;
    // hide the table and chart
    this.showTableChart = false;

    const dateTimeMillis = this.getDateTimeMillis(f);

    const bucketHash = { 0: 0, 1: 1, 2: 24, 3: 168, 4: 720 };

    // set POST data
    this.CRQ.queryArg = {};
    this.CRQ.queryArg.startTime = dateTimeMillis[0];
    this.CRQ.queryArg.endTime = dateTimeMillis[1];
    this.CRQ.queryArg.bucketHrs = bucketHash[f.bucket];
    this.CRQ.dateColumn = true;

    const st = new Date(dateTimeMillis[0]);
    const et = new Date(dateTimeMillis[1]);

    this.startTime = st.getMonth() + 1 + '/' + st.getDate() + '/' + st.getFullYear() + ' ' + ReportUtils.timeTo12HrFormat(st.toString().split(' ')[4].split(':')[0] + ':' + st.toString().split(' ')[4].split(':')[1]);
    this.endTime = et.getMonth() + 1 + '/' + et.getDate() + '/' + et.getFullYear() + ' ' + ReportUtils.timeTo12HrFormat(et.toString().split(' ')[4].split(':')[0] + ':' + et.toString().split(' ')[4].split(':')[1]);

    // Also set the query params
    const filterCriteria: any = {};

    filterCriteria.DateColumnFlag = true;
    filterCriteria.BucketMode = f.bucket;
    if (f.channel !== 'all') {
      filterCriteria.channelid = f.channel;
    } else {
      filterCriteria.channelid = null;
    }
    filterCriteria.st = this.startTime;
    filterCriteria.et = this.endTime;

    // get the data
    this.getReportData(filterCriteria);
  }

  getReportData(filterCriteria: any): void {
    this.http.getSelectedCRQData(filterCriteria, this.CRQ).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data = state.data;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data = state.data;

        if (this.data.errorString != null) {
          this.confirmationService.confirm({
            message: this.data.errorString,
          });
          return;

        } else {
          this.showTableChart = true;

          this.transformResult = window['transformResult2'](this.CRQ, this.data, 'client');

          console.log(' this.transformResult : ', this.transformResult);

          this.transformIntoTableData();
        }

      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data = state.data;

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get the data.' });

      }
    });
  }

  transformIntoTableData() {
    this.tableData = [];
    this.tableFooter = {};
    this.cols = [];
    this.selectedColumns = [];
    this.columnFilters = [];

    let k = 0;
    let n: number;
    let i: number;
    if (this.CRQ.reportType === 'date') {
      n = 1;
      i = 2;
      for (const item of this.transformResult[1]) {
        this.columnFilters.push({ label: item.value, value: item.value });
      }

      this.transformResult[1].unshift({ header: true, colspan: 1, rowspan: 1, value: 'Date/Time', format: 'number' });
    } else if (this.CRQ.reportType === 'matrix') {
      n = 0;
      i = 2;
      for (const item of this.CRQ.columns) {
        this.columnFilters.push({
          label: item.name,
          value: item.name
        });
      }
    } else if (this.CRQ.reportType === 'fixed') {
      i = 1;
      n = 0;
      for (const item of this.CRQ.columnDetails) {
        if (item.isHeader !== true) {
          this.columnFilters.push({
            label: item.name,
            value: item.name
          });
        }
      }
    }

    // Incase table has headers with no data except column total
    if (i < this.transformResult.length - 1) {
      for (i; i < this.transformResult.length - 1; i++) {

        this.tableData[k] = {};
        for (let j = 0; j < this.transformResult[n].length; j++) {
          this.tableData[k][this.transformResult[n][j].value] = this.transformResult[i][j].value;
          if ((i + 1) == (this.transformResult.length - 1)) {
            this.tableFooter[this.transformResult[n][j].value] = this.transformResult[i + 1][j].value;
          }
        }
        k++;

      }
    } else {
      this.tableData[0] = {};
      this.tableFooter = {};
      for (let j = 0; j < this.transformResult[n].length; j++) {
        this.tableData[0][this.transformResult[n][j].value] = undefined;
        this.tableFooter[this.transformResult[n][j].value] = this.transformResult[i][j].value;
      }
    }

    this.toNumber();

    console.log('this.tableData : ', this.tableData);
    // getting the table columns
    Object.keys(this.tableData[0]).forEach(item => {
      // console.log(item);
      this.cols.push({ field: item, header: item });
    });
    this._selectedColumns = this.cols;

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));

    // reset the chart filters
    this.columnFilter = this.columnFilters[0].value;
    this.topCount = 10;
    this.topFilter = 0;

    this.onTopValueChange();
    // show column chart 
    this.showColumnChart();

  }

  toNumber() {
    for (const i of this.tableData) {
      for (const key in i) {
        if (i[key] != null) {
          if (!isNaN(i[key])) {
            i[key] = Number(i[key]);
          }

        }
      }
    }
  }

  getDateTimeMillis(f: any) {
    if (f.timeFilter === 'last') {
      return ReportUtils.convertDateTimeInMillis(
        f.lastValue + '_' + f.lastSelect,
        f.timeFilter, this.uxService.appConfig.serverOffset
      );
    } else {
      const d = new Date(f.customTime[0]);
      const e = new Date(f.customTime[1]);
      const date1 =
        d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
      const date2 =
        e.getMonth() + 1 + '/' + e.getDate() + '/' + e.getFullYear();

      // converting date to UTC
      const startDateTime = Util.convertLocalTimeZoeToUTC(date1 + ' ' + d.toTimeString().split(' ')[0]);
      const endDateTime = Util.convertLocalTimeZoeToUTC(date2 + ' ' + e.toTimeString().split(' ')[0]);

      return ReportUtils.convertDateTimeInMillis(
        startDateTime + '_' + endDateTime,
        f.timeFilter, this.uxService.appConfig.serverOffset
      );
    }
  }

  showColumnChart(): void {
    const graphColumns = [];
    const graphData = [];

    for (let i = 0; i < this.topCount && i < this.tableData.length; i++) {
      if (this.CRQ.reportType !== 'date') {
        if (this.CRQ.reportType !== 'fixed') {
          graphColumns.push(this.tableData[i][this.CRQ.rows[0].name]);

        } else {
          graphColumns.push(this.tableData[i][this.CRQ.columnDetails[0].name]);
        }

      } else {
        graphColumns.push(this.tableData[i]['Date/Time']);
      }
    }

    for (let i = 0; i < this.topCount && i < this.tableData.length; i++) {
      graphData.push(Number(this.tableData[i][this.columnFilter]));
    }

    const heading = (this.topFilter ? 'Bottom' : 'Top') + ' ' + this.topCount + ' ' + (this.CRQ.reportType != 'date' ? (this.CRQ.reportType != 'fixed' ? this.CRQ.rows[0].name : this.CRQ.columnDetails[0].name) : this.CRQ.columns[0].name) + ' on ' + this.columnFilter;

    this.chartData = null;
    this.chartData = {
      highchart: {
        exporting: {
          enabled: true
        },
        chart: {
          type: 'column',
          height: 370
        },
        title: {
          text: '<span style="font-size:14px">' + heading + '</span>'
        },
        //  subtitle : {
        //   text: 'Source: WorldClimate.com'
        // },
        xAxis: {
          categories: graphColumns,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: this.columnFilter
          }
        },
        tooltip: {
          headerFormat: '<span style="color:{point.color}">{point.key}</span>',
          pointFormat: ': <b>{point.y:.1f} </b>',
          footerFormat: '',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Counts',
          type: 'column',
          data: graphData
        }]
      }
    };

  }

  showPieChart(): void {
    const heading = (this.topFilter ? 'Bottom' : 'Top') + ' ' + this.topCount + ' ' + (this.CRQ.reportType != 'date' ? (this.CRQ.reportType != 'fixed' ? this.CRQ.rows[0].name : this.CRQ.columnDetails[0].name) : this.CRQ.columns[0].name) + ' on ' + this.columnFilter;

    const graphData = [];

    let sumArr = 0;
    for (const i of this.tableData) {
      sumArr = sumArr + i[this.columnFilter];
    }

    if (this.CRQ.reportType !== 'date') {
      if (this.CRQ.reportType !== 'fixed') {
        for (let i = 0; i < this.topCount && i < this.tableData.length; i++) {
          graphData.push([this.tableData[i][this.CRQ.rows[0].name], (this.tableData[i][this.columnFilter]) / sumArr * 100]);
        }

      } else {
        for (let i = 0; i < this.topCount && i < this.tableData.length; i++) {
          graphData.push([this.tableData[i][this.CRQ.columnDetails[0].name], (this.tableData[i][this.columnFilter]) / sumArr * 100]);
        }
      }
    } else {
      for (let i = 0; i < this.topCount && i < this.tableData.length; i++) {
        graphData.push([this.tableData[i]['Date/Time'], (this.tableData[i][this.columnFilter]) / sumArr * 100]);
      }
    }

    this.chartData = null;
    this.chartData = {
      highchart: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          height: 370
        },
        title: {
          text: '<span style="font-size:14px">' + heading + '</span>'
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              format: '<span style="font-weight:400">{point.name}: {point.percentage:.1f} %</span>',
              // style: {
              //   color: (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
              //     'black'
              // }
            }
          }
        },
        series: [{
          type: 'pie',
          name: '',
          data: graphData
        }]
      }
    };

  }

  onTopValueChange(): void {
    // Finding bottom n elements
    if (this.topFilter) {
      this.tableData.sort((a, b) => {
        return a[this.columnFilter] - b[this.columnFilter];
      });

    } else {
      // finding top n elements
      this.tableData.sort((a, b) => {
        return b[this.columnFilter] - a[this.columnFilter];
      });
    }

    this.getChart();
  }


  getChart() {
    if (this.chartType) {
      this.showPieChart();
    } else {
      this.showColumnChart();
    }
  }

}
