import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AUTOCOMPLETE_DATA } from '../../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../../service/home-sessions.model';
import { DOMAIN_PERFORMANCE_TABLE } from './service/domain-performance.dummy';
import { DomainPerformanceTable } from './service/domain-performance.model';
import { Processdomaindata } from './service/processdomaindata';
import { DomainPerformanceService } from './service/domainperformance.service';
import TimeFilterUtil from '../../../common/interfaces/timefilter';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/domain-service.state'
import { Store } from 'src/app/core/store/store';
import { ParsePagePerformanceFilters } from '../../../common/interfaces/parsepageperformancefilter';
//import TimeFilterUtil from '../../../common/interfaces/timefilter';
import * as moment from 'moment';
import 'moment-timezone';
import { ChartConfig } from './../../../../../../shared/chart/service/chart.model';
import { PagePerformanceFilter_TABLE } from '../page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../page-performance-filter/service/page.model';

@Component({
  selector: 'app-domain-performance',
  templateUrl: './domain-performance.component.html',
  styleUrls: ['./domain-performance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DomainPerformanceComponent implements OnInit {
  data: DomainPerformanceTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  datapagefilter: PageFilterTable;
  breadcrumb: MenuItem[] = [];
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  isShowAll: boolean = true;
  domaincomparemode: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  aggdata: any;
  variableData: any;
  limitInput: number;
  limitCInput: number;
  prevReqPct: any;
  selectedDomain: string;
  domaintitle: string;
  duration: any;
  count: any;
  ytext: string;
  piedomainData: any;
  domainData: any;
  slicedData: any;
  domainDataInput: any;
  aggDomain: any;
  slicedReqCount: any;
  pieInputLimit: any = "10";
  enableChart: boolean = false;
  multidomain: boolean = false;
  maxDate: Date;
  deftime: any;
  flag: any;
  rowdata: any;
  customTime: Date[] = [];
  visible: boolean = false;
  customTimeError: string;
  trendChartData: ChartConfig;
  trendData: any[] = [];
  selectedIds: any;
  multidomainData: any;
  @Output() arrowClick = new EventEmitter<boolean>();
  filterforcompare: any = this.getinitfilter();

  @Input() set newFilterEvent(parsepagefilter: string) {
    if (parsepagefilter) {
      this.pageperformancefilter(parsepagefilter);
    }
  }

  constructor(private DomainPerformanceService: DomainPerformanceService) {
    this.limitInput = 50;
    this.selectedIds = [];
    this.selectedDomain = "";
    //this.limitPieInput = 10;
    this.multidomainData = null;
    this.limitCInput = 1;
    this.prevReqPct = -1;
    this.ytext = "Duration (sec)";
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');
  }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Sessions', routerLink: '/home/home-sessions' },
      { label: 'Page Performance Details', routerLink: '/performance-details' }
    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics' }
    ]

    me.autoCompleteList = AUTOCOMPLETE_DATA;
    me.data = DOMAIN_PERFORMANCE_TABLE;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.variableData = new Processdomaindata();
    me.datapagefilter = PagePerformanceFilter_TABLE;
    if (me.datapagefilter.filtercriteria)
      me.loadPagePerformanceData(me.datapagefilter.filtercriteria.pagePerformanceFilters);
    else {
      let filtercriteria: any = {};
      filtercriteria = this.getinitfilter();
      me.loadPagePerformanceData(filtercriteria);
    }
  }
  pageperformancefilter(parsepagefilter: string) {
    let filtercriteria = JSON.parse(parsepagefilter);
    console.log("pageperformancefilter filtercriteria", filtercriteria);
    this.filterforcompare = filtercriteria.pagePerformanceFilters;
    this.loadPagePerformanceData(filtercriteria.pagePerformanceFilters);
  }
  getinitfilter() {
    let parsepagefilter = null;
    parsepagefilter = new ParsePagePerformanceFilters();

    let time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
    let date = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    let d = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    let date1 = window["toDateString"](d);
    if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1) {
      let tmpDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
      date1 = tmpDate;
    }
    let startT = date1 + " 00:00:00";
    let endT = date1 + " 23:59:00";
    parsepagefilter.pagePerformanceFilters.timeFilter.startTime = startT;
    parsepagefilter.pagePerformanceFilters.timeFilter.endTime = endT;
    return parsepagefilter.pagePerformanceFilters;
  }
  loadPagePerformanceData(filtercriteria) {
    console.log("loadPagePerformanceData method start filtercriteria : ", filtercriteria);
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    me.DomainPerformanceService.LoadDomainAggData(filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoaded(state);
          return;
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  private onLoaded(state: HomePageTabLoadedState) {
    console.log("state : ", state);
    const me = this;
    me.data = DOMAIN_PERFORMANCE_TABLE;
    this.enableChart = false;

    if (state.data.data != null && state.data.data.length > 0) {
      let d = new Processdomaindata();
      this.piedomainData = null;
      this.aggDomain = null;
      this.domainData = [];
      this.aggDomain = {};
      let domainData1 = d.processData(state.data.data);
      this.piedomainData = domainData1.slice(0, 100);
      this.domainData = domainData1.slice(0, this.domainDataInput);
      me.data.calDomainData = d.calcPerc(this.piedomainData);
      this.aggDomain["requestcountwise"] = d.getRequestCountData(this.piedomainData);
      //this.pieDataCalculation(this.aggDomain["requestcountwise"]);
      // filter on basis of request pct 
      this.aggDomain["pctdurationwise"] = d.getAvgDurationData(1, me.data.calDomainData);
      this.slicedData = [];
      this.slicedReqCount = [];
      this.slicedData = this.aggDomain["pctdurationwise"].slice(0, 50);
      this.slicedReqCount = this.aggDomain["requestcountwise"].slice(0, this.pieInputLimit);
      //this.slicedReqCount = this.aggDomain["requestcountwise"].slice(0,10);
      me.data.data = this.domainData;
      me.error = null;
      me.loading = false;
      me.empty = !me.data.data.length;
      let series = [];
      series.push({
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedData
      });
      DOMAIN_PERFORMANCE_TABLE.charts[1]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
      DOMAIN_PERFORMANCE_TABLE.charts[1]["highchart"]["yAxis"]["title"]["text"] = this.ytext;
      let seriescount = [];
      seriescount.push({
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedReqCount
      });
      DOMAIN_PERFORMANCE_TABLE.charts[0]["highchart"]["series"] = seriescount as Highcharts.SeriesOptionsType[];
      this.data.charts = DOMAIN_PERFORMANCE_TABLE.charts;

      setTimeout(() => {
        this.enableChart = true;
      }, 100);
    }
    else
      this.enableChart = true;
  }

  resetCustomTime(e) {
    this.customTime = [];
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimeError = '';
  }

  getDomainTrendData(e, flag) {
    this.visible = false;
    this.enableChart = false;
    this.multidomain = false;
    this.trendChartData = {};
    this.multidomainData = null;
    // set the filtercriteria
    this.customTime[0] = new Date(this.filterforcompare.timeFilter.startTime.split(' ')[0] + ' ' + '00:00:00');
    this.customTime[1] = new Date(this.filterforcompare.timeFilter.endTime.split(' ')[0] + ' ' + '23:59:59');
    console.log('this.customTime[0]  : ', this.customTime[0], ' this.customTime[1] ', this.customTime[1]);
    // get the sessions
    this.flag = flag;
    this.rowdata = e;
    this.getData(null);
    this.visible = true;
  }

  getData(timeflag) {
    this.enableChart = false;
    if (this.flag == "all") {
      this.getAllDomainTrendsData(timeflag);
      return;
    }
    this.multidomain = false;
    let ddd = [];
    let e = this.rowdata;

    let f = {}
    f["timeFilter"] = {};

    f["domains"] = e.domain;
    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFilter["startTime"] != "")
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFilter["startTime"];
    //f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFilter["endTime"] != "")
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFilter["endTime"];
    //f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftime = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceService.LoadDomainTrend(f).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          this.loading = state.loading;
          this.error = state.error;
          this.trendData = state.data.data;
          me.onLoadedtrend(state);
          return;
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  private onLoadedtrend(state: HomePageTabLoadedState) {
    let data = state.data.data;
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
    let titleText = '';
    let type = 'domain';
    switch (type) {
      case 'domain':
        titleText = `Domain Trend for ${this.rowdata.domain}`;
        break;
    }
    this.trendChartData = {
      title: titleText,
      highchart: {
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
    console.log(' trendChartData : ', this.trendChartData);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
  }
  getDomainsId(darray) {

    let id = [];
    for (let i = 0; i < darray.length; i++) {
      if (darray[i].hasOwnProperty("id"))
        id.push(darray[i].id);
      else
        id.push(darray[i].domainid);
    }
    return id;
  }
  getAllDomainTrendsData(timeflag) {
    this.trendChartData = null;
    this.multidomain = true;
    console.log('this.selectedIds ', this.selectedIds);
    let e = this.rowdata;
    if (e == null) {
      e = this.selectedIds;
    }
    let f = {}
    f["timeFilter"] = {};

    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFilter["startTime"] != "")
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFilter["startTime"];
    //f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFilter["endTime"] != "")
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFilter["endTime"];
    //f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftime = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    //this.deftime = "";

    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    f["domainArray"] = this.getDomainsId(e);
    //console.log("f : ", f);
    this.selectedDomain = "Domain Timing over Time for ";
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceService.getAllDomainTData(f).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          this.loading = state.loading;
          this.error = state.error;
          me.onLoadedtrendAll(state);
          return;
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoadedtrendAll(state: HomePageTabLoadedState) {
    let o = state.data.data;
    this.enableChart = false;
    this.multidomainData = o;
    let Selelcted = document.querySelector('#valueselect');
    let valueSelelcted = 0;
    if (Selelcted == null)
      valueSelelcted = 0;
    else
      valueSelelcted = Selelcted["value"];
    let seriesdata: any;
    if (valueSelelcted == 0)
      seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    else
      seriesdata = this.getSeriesData(o, 2, 'Count', '');

    //let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    this.trendChartData = {
      title: this.selectedDomain,
      highchart: {
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
        series: seriesdata
      }
    };
    console.log(' trendChartData all : ', this.trendChartData);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
  }
  getSeriesData(o, index, name, suffix) {
    let yAxis = 0;
    if (index == 2)
      yAxis = 1;

    //console.log("called getSeriesData with ", index, " -- " , name);
    let sr = [];
    let domains = Object.keys(o);
    for (let i = 0; i < domains.length; i++) {
      let ccc = [];
      let ddd = [];
      let entry = JSON.parse(o[domains[i]]);
      let res = entry.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
      this.trendData = res;
      for (let r = 0; r < res.length; r++) {
        let s = [];
        let datetime = res[r][0] * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r][index]));
        ddd.push(s);
      }
      let obj1 = {
        'name': domains[i],
        'type': 'spline',
        'yAxis': yAxis,
        'data': ddd,
        'tooltip': {
          valueSuffix: suffix
        }
      };
      sr.push(obj1);
    }
    //console.log("sr : " , sr);
    return sr;
  }
  getSeriesDataforBoth(o) {
    let sr = [];
    let domains = Object.keys(o);
    for (let i = 0; i < domains.length; i++) {
      let ccc = [];
      let ddd = [];
      let entry = JSON.parse(o[domains[i]]);
      let res = entry.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
      this.trendData = res;
      for (let r = 0; r < res.length; r++) {
        let s = [];
        let datetime = res[r][0] * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r][1]));
        ddd.push(s);
        let l = [];
        l.push(datetime);
        l.push(parseInt(res[r][2]));
        ccc.push(l);
      }
      let obj1 = {
        'name': 'duration',
        'type': 'spline',
        'yAxis': 0,
        'data': ddd,
        'tooltip': {
          valueSuffix: 'ms'
        }
      };
      let obj2 = {
        'name': 'count',
        'type': 'area',
        'yAxis': 1,
        'data': ccc,
        'tooltip': {
          valueSuffix: ''
        }
      };
      sr.push(obj1);
      sr.push(obj2);
    }
    return sr;
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

    this.getData(true);
  }

  onValueChange(valueSelelcted) {
    this.enableChart = false;
    if (this.multidomainData == null)
      return;
    //console.log("seriesdata : ", this.seriesdata);
    let seriesdata: any;
    if (valueSelelcted == 0)
      seriesdata = this.getSeriesData(this.multidomainData, 1, 'Duration', 'ms'); // index for duration in array
    else
      seriesdata = this.getSeriesData(this.multidomainData, 2, 'Count', '');

    //let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    this.trendChartData = {
      title: this.selectedDomain,
      highchart: {
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
        series: seriesdata
      }
    };
    console.log(' trendChartData all : ', this.trendChartData);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
  }

  pieDataCalculation(value) {
    //console.log("@ 1 pieInputLimit " , this.pieInputLimit);
    let otherData = [];
    let totalCount = null;
    let processData = [];
    processData = value.slice(0, this.pieInputLimit);
    let others = {};
    otherData.push(value.slice(processData.length - 1, value.length - 1));
    //console.log("@ otherData " , otherData);
    if (otherData != null && otherData != undefined && otherData[0].length > 0) {
      for (let i = 0; i < otherData[0].length; i++)
        totalCount = parseInt(otherData[0][i].y) + totalCount;
    }
    if (totalCount != 0) {
      others = { name: "Others", y: parseInt(totalCount) };
      processData.push(others);
    }
    //console.log("@ 1 processData " , processData);
    return processData;
  }

  private onLoading(state: HomePageTabLoadingState) {
    console.log("state HomePageTabLoadingState : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  onPctBlur(value) {
    console.log("this.limitCInput: ", this.limitCInput);
    this.onChange(value);
  }
  onBlurMethod(value) {
    console.log("this.limitInput : ", this.limitInput, " value: ", value);
    this.onChange(value);
  }

  onChange(t) {
    let ti = new Date().getTime();
    this.enableChart = false;
    // take 3 values and callculate data
    // 1. request percentage i.e. limitCInput
    // 2. Top limit i.e. limitInput
    // 3. selected value i.e. value
    if (this.variableData == null) {
      this.variableData = new Processdomaindata();
    }
    // re calculate the data only if request percentage has changed
    if (this.prevReqPct != this.limitCInput) {
      //console.log("Request Percentage changed");
      this.aggdata = {};
      this.aggdata["avgdurationwise"] = this.variableData.getAvgDurationData(this.limitCInput, this.data.calDomainData);
      this.aggdata["avgwaitwise"] = this.variableData.getAvgWaitData(this.limitCInput, this.data.calDomainData);
      this.aggdata["avgdownloadwise"] = this.variableData.getAvgDownloadData(this.limitCInput, this.data.calDomainData);
      this.prevReqPct = this.limitCInput;
    }
    console.log("t : ", t, " this.aggdata: ", this.aggdata, ' this.limitInput : ', this.limitInput);
    let cdata = null;
    if (null != this.aggdata) {
      if (t == 0) {
        //if(this.limitInput > this.aggdata.avgdurationwise.length)
        //this.limitInput = this.aggdata.avgdurationwise.length;
        cdata = this.aggdata.avgdurationwise.slice(0, this.limitInput);
        this.domaintitle = "Domains By Duration";
        this.ytext = "Duration (sec)";
      }
      else if (1 == t) {
        //if(this.limitInput > this.aggdata.avgwaitwise.length)
        //this.limitInput = this.aggdata.avgwaitwise.length;

        cdata = this.aggdata.avgwaitwise.slice(0, this.limitInput);
        this.domaintitle = "Domains By Wait Time";
        this.ytext = "Wait Time (sec)";
      }
      else if (2 == t) {
        //if(this.limitInput > this.aggdata.avgdownloadwise.length)
        //this.limitInput = this.aggdata.avgdownloadwise.length;

        cdata = this.aggdata.avgdownloadwise.slice(0, this.limitInput);
        this.domaintitle = "Domains By Download Time";
        this.ytext = "Download Time (sec)";
      }
    }
    let series = [];
    series.push({
      name: '',
      colorByPoint: true,
      pointWidth: 15,
      data: cdata
    });
    DOMAIN_PERFORMANCE_TABLE.charts[1]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
    DOMAIN_PERFORMANCE_TABLE.charts[1]["highchart"]["yAxis"]["title"]["text"] = this.ytext;
    this.data.charts = DOMAIN_PERFORMANCE_TABLE.charts;
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
  }
  filterFields(event) {
    const me = this;
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < me.autoCompleteList.autocompleteData.length; i++) {
      let reportitem = me.autoCompleteList.autocompleteData[i];
      if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reportitem);
      }
    }
    me.filteredReports = filtered;
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
  showPerformance() {
    this.isShowAll = false;
    this.domaincomparemode = true;
    this.arrowClick.emit(this.isShowAll);
  }
  hotspotSummary($event) {
    console.log('event : ', $event);
    this.isShowAll = $event;
    this.domaincomparemode = false;
  }
  showpagedetail() {
    this.isShowAll = false;
    this.domaincomparemode = false;
    this.arrowClick.emit(true);
  }
}

