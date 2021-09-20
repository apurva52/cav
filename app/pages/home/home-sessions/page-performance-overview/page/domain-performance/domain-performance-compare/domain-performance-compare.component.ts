import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AUTOCOMPLETE_DATA } from '../../../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../../../service/home-sessions.model';
import { DOMAIN_PERFORMANCE_COMPARE_TABLE } from './service/domain-performance.dummy';
import { DomainPerformanceCompareTable } from './service/domain-performance.model';
import { ProcessdomainComparedata } from './service/processdomaincomparedata';
import { DomainPerformanceCompareService } from './service/domainperformance.service';
import TimeFilterUtil from '../../../../common/interfaces/timefilter';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/domain-service.state';
import { Store } from 'src/app/core/store/store';
import { ParsePagePerformanceFilters } from '../../../../common/interfaces/parsepageperformancefilter';
// import TimeFilterUtil from '../../../common/interfaces/timefilter';
import * as moment from 'moment';
import 'moment-timezone';
import { ChartConfig } from '../../../../../../../shared/chart/service/chart.model';
import { PagePerformanceFilter_TABLE } from '../../page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../../page-performance-filter/service/page.model';


@Component({
  selector: 'app-domain-performance-compare',
  templateUrl: './domain-performance-compare.component.html',
  styleUrls: ['./domain-performance-compare.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DomainPerformanceCompareComponent implements OnInit {
  data: DomainPerformanceCompareTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  errorcmp: AppError;
  loadingcmp: boolean;
  emptycmp: boolean;
  emptyTable: boolean;
  datapagefilter: PageFilterTable;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  isShowAll: boolean = true;

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
  multidomain: boolean = false;
  multidomaincmp: boolean = false;
  maxDate: Date;
  deftime: any;
  deftimecmp: any;
  flag: any;
  rowdata: any;
  rowdatacmp: any;
  customTime: Date[] = [];
  customTimecmp: Date[] = [];
  visible: boolean = false;
  customTimeError: string;
  customTimeErrorcmp: string;
  trendChartData: ChartConfig;
  trendChartDatacmp: ChartConfig;
  trendData: any[] = [];
  trendDatacmp: any[] = [];
  selectedIds: any;
  multidomainData: any;
  breadcrumb: MenuItem[] = [];
  multidomainDatacmp: any;
  @Output() arrowClick = new EventEmitter<boolean>();

  filterforcompare: any = this.getinitfilter();
  parsepagefilterdetail: any = {};
  @Input() get parsepagefilter() {
    return;
  }

  set parsepagefilter(filter: {}) {
    this.parsepagefilterdetail = filter;
    if (filter !== null && filter != undefined) {
      this.loadPagePerformanceData(filter);
    }
  }
  constructor(private DomainPerformanceCompareService: DomainPerformanceCompareService) {
    this.limitInput = 50;
    this.selectedIds = [];
    this.selectedDomain = "";
    // this.limitPieInput = 10;
    this.multidomainData = null;
    this.multidomainDatacmp = null;
    this.limitCInput = 1;
    this.prevReqPct = -1;
    this.ytext = "Duration (sec)";
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimecmp[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTimecmp[1] = new Date(d.toDateString() + ' 23:59:00');
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
    ];

    me.autoCompleteList = AUTOCOMPLETE_DATA;
    me.data = DOMAIN_PERFORMANCE_COMPARE_TABLE;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.variableData = new ProcessdomainComparedata();
    if (me.datapagefilter.filtercriteria) {
      me.loadPagePerformanceData(me.datapagefilter.filtercriteria.pagePerformanceFilters);
    }
    else {
      let filtercriteria: any = {};
      filtercriteria = this.getinitfilter();
      me.loadPagePerformanceData(filtercriteria);
    }

  }
  pageperformancefilter(parsepagefilter: string) {
    const filtercriteria = JSON.parse(parsepagefilter);
    console.log("pageperformancefilter filtercriteria", filtercriteria);
    this.filterforcompare = filtercriteria.pagePerformanceFilters;
    this.loadPagePerformanceData(filtercriteria.pagePerformanceFilters);
  }
  getinitfilter() {
    let parsepagefilter = null;
    parsepagefilter = new ParsePagePerformanceFilters();

    const time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
    const date = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    const d = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    let date1 = window["toDateString"](d);
    if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1) {
      const tmpDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
      date1 = tmpDate;
    }
    const startT = date1 + " 00:00:00";
    const endT = date1 + " 23:59:00";
    parsepagefilter.pagePerformanceFilters.timeFilter.startTime = startT;
    parsepagefilter.pagePerformanceFilters.timeFilter.endTime = endT;
    return parsepagefilter.pagePerformanceFilters;
  }
  loadPagePerformanceData(filtercriteria) {
    console.log("loadPagePerformanceData method start filtercriteria : ", filtercriteria);
    const me = this;
    // me.graphInTreeService.load(payload).subscribe(
    me.DomainPerformanceCompareService.LoadDomainAggData(filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {

          if (filtercriteria.timeFiltercmp.startTime != "" && filtercriteria.timeFiltercmp.endTime != "") {
            const comparefilter = JSON.parse(JSON.stringify(filtercriteria));

            comparefilter.timeFilter.last = filtercriteria.timeFiltercmp.last;
            comparefilter.timeFilter.startTime = filtercriteria.timeFiltercmp.startTime;
            comparefilter.timeFilter.endTime = filtercriteria.timeFiltercmp.endTime;
            this.DomainPerformanceCompareService.LoadDomainAggData(comparefilter).subscribe(
              (statecmp: any) => {
                me.onLoaded(state, statecmp);
              });
          }
          else {
            me.onLoaded(state, []);
          }
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
  private onLoaded(state, statecmp) {
    console.log("state : ", state);
    const me = this;
    me.data = DOMAIN_PERFORMANCE_COMPARE_TABLE;

    if (state.data.data != null && state.data.data.length > 0) {
      const d = new ProcessdomainComparedata();
      this.piedomainData = null;
      this.aggDomain = null;
      this.domainData = [];
      this.aggDomain = {};
      let domaincmp = [];
      if (Array.isArray(statecmp)) {
        domaincmp = [];
      }
      else {
        domaincmp = statecmp.data.data;
      }
      const domainDatanor = d.processData(state.data.data);
      const domainDatacmp = d.processData(domaincmp);
      const domainDatafinal = this.comparemethod(domainDatanor, domainDatacmp);

      this.piedomainData = domainDatafinal.slice(0, 100);
      this.domainData = domainDatafinal.slice(0, this.domainDataInput);
      me.data.calDomainData = d.calcPerc(this.piedomainData);
      this.aggDomain["requestcountwise"] = d.getRequestCountData(this.piedomainData);
      // this.pieDataCalculation(this.aggDomain["requestcountwise"]);
      // filter on basis of request pct
      this.aggDomain["pctdurationwise"] = d.getAvgDurationData(1, me.data.calDomainData);
      this.slicedData = [];
      this.slicedReqCount = [];
      // this.slicedData = this.aggDomain["pctdurationwise"].slice(0, 50);
      // this.slicedReqCount = this.aggDomain["requestcountwise"].slice(0, this.pieInputLimit);

      this.slicedData.push(this.aggDomain["pctdurationwise"][0].slice(0, 15));
      this.slicedData.push(this.aggDomain["pctdurationwise"][1].slice(0, 15));
      this.slicedReqCount.push(this.pieDataCalculation(this.aggDomain["requestcountwise"][0]));
      this.slicedReqCount.push(this.pieDataCalculation(this.aggDomain["requestcountwise"][1]));

      console.log('this.aggDomain : ', this.aggDomain);
      // this.slicedReqCount = this.aggDomain["requestcountwise"].slice(0,10);
      me.data.data = this.domainData;
      me.error = null;
      me.loading = false;
      me.empty = !me.data.data.length;
      const series = [];
      series.push({
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedData[0]
      }, {
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedData[1]
      });
      DOMAIN_PERFORMANCE_COMPARE_TABLE.charts[1]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
      DOMAIN_PERFORMANCE_COMPARE_TABLE.charts[1]["highchart"]["yAxis"]["title"]["text"] = this.ytext;
      const seriescount = [];
      seriescount.push({
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedReqCount[0]
      }, {
        name: '',
        colorByPoint: true,
        pointWidth: 15,
        data: this.slicedReqCount[1]
      });
      DOMAIN_PERFORMANCE_COMPARE_TABLE.charts[0]["highchart"]["series"] = seriescount as Highcharts.SeriesOptionsType[];
      this.data.charts = DOMAIN_PERFORMANCE_COMPARE_TABLE.charts;
    }

  }

  // sort function
  sortFunction(sortdata) {
    sortdata.sort((a, b) => (a.domain > b.domain) ? 1 : ((b.domain > a.domain) ? -1 : 0));
    return sortdata;
  }

  // method for return common jsonobject data for both duration1 and duration2
  commonResponse(norrumdata, cmprumdata) {
    const resobject = {};
    resobject["domain"] = norrumdata["domain"];
    resobject["domainid"] = norrumdata["domainid"];
    resobject["duration_avg"] = norrumdata["duration_avg"];
    resobject["duration_count"] = norrumdata["duration_count"];
    resobject["redirection_avg"] = norrumdata["redirection_avg"];
    resobject["redirection_count"] = norrumdata["redirection_count"];
    resobject["dns_avg"] = norrumdata["dns_avg"];
    resobject["dns_count"] = norrumdata["dns_count"];
    resobject["tcp_avg"] = norrumdata["tcp_avg"];
    resobject["tcp_count"] = norrumdata["tcp_count"];
    resobject["ssl_avg"] = norrumdata["ssl_avg"];
    resobject["ssl_count"] = norrumdata["ssl_count"];
    resobject["wait_avg"] = norrumdata["wait_avg"];
    resobject["wait_count"] = norrumdata["wait_count"];
    resobject["response_avg"] = norrumdata["response_avg"];
    resobject["response_count"] = norrumdata["response_count"];
    resobject["domain1"] = cmprumdata["domain"];
    resobject["domainid1"] = cmprumdata["domainid"];
    resobject["duration_avg1"] = cmprumdata["duration_avg"];
    resobject["duration_count1"] = cmprumdata["duration_count"];
    resobject["redirection_avg1"] = cmprumdata["redirection_avg"];
    resobject["redirection_count1"] = cmprumdata["redirection_count"];
    resobject["dns_avg1"] = cmprumdata["dns_avg"];
    resobject["dns_count1"] = cmprumdata["dns_count"];
    resobject["tcp_avg1"] = cmprumdata["tcp_avg"];
    resobject["tcp_count1"] = cmprumdata["tcp_count"];
    resobject["ssl_avg1"] = cmprumdata["ssl_avg"];
    resobject["ssl_count1"] = cmprumdata["ssl_count"];
    resobject["wait_avg1"] = cmprumdata["wait_avg"];
    resobject["wait_count1"] = cmprumdata["wait_count"];
    resobject["response_avg1"] = cmprumdata["response_avg"];
    resobject["response_count1"] = cmprumdata["response_count"];
    resobject["fp_avg1"] = cmprumdata["fp_avg"];
    resobject["fp_count1"] = cmprumdata["fp_count"];

    return resobject;
  }

  comparemethod(domainDatanor, domainDatacmp) {
    domainDatanor = this.sortFunction(domainDatanor);
    domainDatacmp = this.sortFunction(domainDatacmp);
    let filldata = [];
    if (domainDatanor.length == 0 && domainDatacmp.length == 0) {
      filldata = [];
    }
    else if (domainDatanor.length == domainDatacmp.length) {
      let flag = true;
      filldata = [];
      for (let j = 0; j < domainDatanor.length; j++) {
        flag = true;
        for (let m = 0; m < domainDatacmp.length; m++) {
          if (domainDatanor[j]["domain"] == domainDatacmp[m]["domain"]) {
            filldata.push(this.commonResponse(domainDatanor[j], domainDatacmp[m]));
            flag = false;
          }
        }
        if (flag) {
          filldata.push(this.duration1Response(domainDatanor[j]));
        }
        // filldata.push(this.duration2Response(cmprumdata[j]));
      }
    }
    else if (domainDatanor.length > domainDatacmp.length) {
      filldata = [];
      let flag = true;
      for (let j = 0; j < domainDatacmp.length; j++) {
        flag = true;
        for (let m = 0; m < domainDatacmp.length; m++) {
          if (domainDatanor[j]["domain"] == domainDatacmp[m]["domain"]) {
            filldata.push(this.commonResponse(domainDatanor[j], domainDatacmp[m]));
            flag = false;
          }
        }
        if (flag) {
          filldata.push(this.duration1Response(domainDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
      for (let i = domainDatacmp.length; i < domainDatanor.length; i++) {
        flag = true;
        for (let n = 0; n < domainDatacmp.length; n++) {
          if (domainDatanor[i]["domain"] == domainDatacmp[n]["domain"]) {
            filldata.push(this.commonResponse(domainDatanor[i], domainDatacmp[n]));
            flag = false;
          }
        }
        if (flag) {
          filldata.push(this.duration1Response(domainDatanor[i]));
        }

      }
    }
    else if (domainDatanor.length < domainDatacmp.length) {
      filldata = [];
      let flag = true;
      for (let j = 0; j < domainDatanor.length; j++) {
        flag = true;
        for (let m = 0; m < domainDatacmp.length; m++) {
          if (domainDatanor[j]["domain"] == domainDatacmp[m]["domain"]) {
            filldata.push(this.commonResponse(domainDatanor[j], domainDatacmp[m]));
            flag = false;
          }
        }
        if (flag) {
          filldata.push(this.duration1Response(domainDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }

    }
    return filldata;
  }
  // method for return response 1 domain jsonobject data
  duration1Response(domainDatanor) {
    return domainDatanor;
  }

  resetCustomTime(e) {
    this.customTime = [];
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimecmp[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTimecmp[1] = new Date(d.toDateString() + ' 23:59:00');
    this.customTimeError = '';
    this.customTimeErrorcmp = '';

  }

  getDomainTrendData(e, flag) {
    this.visible = false;
    this.multidomain = false;
    this.multidomaincmp = false;
    this.trendChartData = {};
    this.trendChartDatacmp = {};
    this.multidomainData = null;
    this.multidomainDatacmp = null;
    // set the filtercriteria
    this.customTime[0] = new Date(this.filterforcompare.timeFilter.startTime.split(' ')[0] + ' ' + '00:00:00');
    this.customTime[1] = new Date(this.filterforcompare.timeFilter.endTime.split(' ')[0] + ' ' + '23:59:59');
    this.customTimecmp[0] = new Date(this.filterforcompare.timeFiltercmp.startTime.split(' ')[0] + ' ' + '00:00:00');
    this.customTimecmp[1] = new Date(this.filterforcompare.timeFiltercmp.endTime.split(' ')[0] + ' ' + '23:59:59');
    console.log('e : ', e, 'this.customTime[0]  : ', this.customTime[0], ' this.customTime[1] ', this.customTime[1]);
    // get the sessions
    this.flag = flag;
    if (this.flag == "all" && e != null) {
      this.rowdata = e[0];
      this.rowdatacmp = e[1];
    }
    else {
      this.rowdata = e;
      this.rowdatacmp = e;
    }
    this.getData(null);
    this.getDatacmp(null);
    this.visible = true;
  }

  getData(timeflag) {
    if (this.flag == "all") {
      this.getAllDomainTrendsData(timeflag);
      return;
    }
    this.multidomain = false;
    const ddd = [];
    const e = this.rowdata;

    const f = {};
    f["timeFilter"] = {};

    f["domains"] = e.domain;
    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFilter["startTime"] != "") {
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFilter["startTime"];
    }
    // f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFilter["endTime"] != "") {
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFilter["endTime"];
    }
    // f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftime = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    this.deftimecmp = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    const timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    const me = this;
    // me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceCompareService.LoadDomainTrend(f).subscribe(
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

  getDatacmp(timeflag) {
    if (this.flag == "all") {
      this.getAllDomainTrendsDatacmp(timeflag);
      return;
    }
    this.multidomaincmp = false;
    const ddd = [];
    const e = this.rowdatacmp;

    const f = {};
    f["timeFilter"] = {};

    f["domains"] = e.domain;
    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFiltercmp["startTime"] != "") {
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFiltercmp["startTime"];
    }
    // f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFiltercmp["endTime"] != "") {
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFiltercmp["endTime"];
    }
    // f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";
    this.deftimecmp = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    const timeFilter = TimeFilterUtil.getTimeFilter('', this.customTimecmp[0], this.customTimecmp[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    const me = this;
    // me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceCompareService.LoadDomainTrend(f).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          this.loadingcmp = state.loading;
          this.errorcmp = state.error;
          this.trendDatacmp = state.data.data;
          me.onLoadedtrendcmp(state);
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

  private onLoadedtrendcmp(state: HomePageTabLoadedState) {
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
    const type = 'domain';
    switch (type) {
      case 'domain':
        titleText = `Domain Trend for ${this.rowdatacmp.domain}`;
        break;
    }
    this.trendChartDatacmp = {
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
    console.log(' trendChartDatacmp : ', this.trendChartDatacmp);

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
    const type = 'domain';
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

  }
  getDomainsId(darray) {

    const id = [];
    for (let i = 0; i < darray.length; i++) {
      if (darray[i].hasOwnProperty("id") && darray[i]["id"] !== undefined) {
        id.push(darray[i].id);
      }
      else if (darray[i].hasOwnProperty("domainid") && darray[i]["domainid"] !== undefined) {
        id.push(darray[i].domainid);
      }
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
    const f = {};
    f["timeFilter"] = {};

    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFilter["startTime"] != "") {
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFilter["startTime"];
    }
    // f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFilter["endTime"] != "") {
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFilter["endTime"];
    }
    // f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftime = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    // this.deftime = "";

    const timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    f["domainArray"] = this.getDomainsId(e);
    // console.log("f : ", f);
    this.selectedDomain = "Domain Timing over Time for ";
    const me = this;
    // me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceCompareService.getAllDomainTData(f).subscribe(
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

  getAllDomainTrendsDatacmp(timeflag) {
    this.trendChartDatacmp = null;
    this.multidomaincmp = true;
    console.log('this.selectedIds ', this.selectedIds);
    let e = this.rowdatacmp;
    console.log('e : ', e);
    if (e == null) {
      e = this.selectedIds;
    }
    const f = {};
    f["timeFilter"] = {};

    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFiltercmp["startTime"] != "") {
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFiltercmp["startTime"];
    }
    // f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFiltercmp["endTime"] != "") {
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFiltercmp["endTime"];
    }
    // f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftimecmp = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    // this.deftime = "";

    const timeFilter = TimeFilterUtil.getTimeFilter('', this.customTimecmp[0], this.customTimecmp[1]);
    if (timeflag == true) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }
    f["domainArray"] = this.getDomainsId(e);
    // console.log("f : ", f);
    this.selectedDomain = "Domain Timing over Time for ";
    const me = this;
    // me.graphInTreeService.load(payload).subscribe(
    console.log('LoadDomainTrend f : ', f);
    me.DomainPerformanceCompareService.getAllDomainTData(f).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          this.loadingcmp = state.loading;
          this.errorcmp = state.error;
          me.onLoadedtrendAllcmp(state);
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
    const o = state.data.data;
    this.multidomainData = o;
    const Selelcted = document.querySelector('#valueselect');
    let valueSelelcted = 0;
    if (Selelcted == null) {
      valueSelelcted = 0;
    }
    else {
      valueSelelcted = Selelcted["value"];
    }
    let seriesdata: any;
    if (valueSelelcted == 0) {
      seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms');
    } // index for duration in array
    else {
      seriesdata = this.getSeriesData(o, 2, 'Count', '');
    }

    // let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
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

  }

  private onLoadedtrendAllcmp(state: HomePageTabLoadedState) {
    const o = state.data.data;
    console.log('onLoadedtrendAllcmp state : ', state);
    this.multidomainDatacmp = o;
    const Selelcted = document.querySelector('#valueselectcmp');
    let valueSelelcted = 0;
    if (Selelcted == null) {
      valueSelelcted = 0;
    }
    else {
      valueSelelcted = Selelcted["value"];
    }
    let seriesdata: any;
    if (valueSelelcted == 0) {
      seriesdata = this.getSeriesDatacmp(o, 1, 'Duration', 'ms');
    } // index for duration in array
    else {
      seriesdata = this.getSeriesDatacmp(o, 2, 'Count', '');
    }
    console.log('v seriesdata : ', seriesdata, ' Selelcted: ', Selelcted, ' this.trendDatacmp : ', this.trendDatacmp);
    // let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    this.trendChartDatacmp = {
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
    console.log(' trendChartDatacmp all : ', this.trendChartDatacmp);

  }

  getSeriesDatacmp(o, index, name, suffix) {
    let yAxis = 0;
    if (index == 2) {
      yAxis = 1;
    }

    console.log("getSeriesDatacmp  ", index, o);
    const sr = [];
    const domains = Object.keys(o);
    for (let i = 0; i < domains.length; i++) {
      const ccc = [];
      const ddd = [];
      const entry = JSON.parse(o[domains[i]]);
      const res = entry.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
      this.trendDatacmp = res;
      for (let r = 0; r < res.length; r++) {
        const s = [];
        const datetime = res[r][0] * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r][index]));
        ddd.push(s);
      }
      const obj1 = {
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
    // console.log("sr : " , sr);
    return sr;
  }

  getSeriesData(o, index, name, suffix) {
    let yAxis = 0;
    if (index == 2) {
      yAxis = 1;
    }

    // console.log("called getSeriesData with ", index, " -- " , name);
    const sr = [];
    const domains = Object.keys(o);
    for (let i = 0; i < domains.length; i++) {
      const ccc = [];
      const ddd = [];
      const entry = JSON.parse(o[domains[i]]);
      const res = entry.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
      this.trendData = res;
      for (let r = 0; r < res.length; r++) {
        const s = [];
        const datetime = res[r][0] * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r][index]));
        ddd.push(s);
      }
      const obj1 = {
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
    // console.log("sr : " , sr);
    return sr;
  }
  getSeriesDataforBoth(o) {
    const sr = [];
    const domains = Object.keys(o);
    for (let i = 0; i < domains.length; i++) {
      const ccc = [];
      const ddd = [];
      const entry = JSON.parse(o[domains[i]]);
      const res = entry.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
      this.trendData = res;
      for (let r = 0; r < res.length; r++) {
        const s = [];
        const datetime = res[r][0] * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r][1]));
        ddd.push(s);
        const l = [];
        l.push(datetime);
        l.push(parseInt(res[r][2]));
        ccc.push(l);
      }
      const obj1 = {
        'name': 'duration',
        'type': 'spline',
        'yAxis': 0,
        'data': ddd,
        'tooltip': {
          valueSuffix: 'ms'
        }
      };
      const obj2 = {
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
  submitcmp(): void {

    // validate the custom time
    if (this.customTimecmp[0] === null) {
      this.customTimeErrorcmp = 'Start time cannot be greater than end time.';
      return;
    }

    if (new Date(this.customTimecmp[0]).getTime() > new Date(this.customTimecmp[1]).getTime()) {
      this.customTimeErrorcmp = 'Start time cannot be greater than end time.';
      return;
    }

    this.customTimeErrorcmp = '';

    this.getDatacmp(true);
  }

  onValueChange(valueSelelcted) {
    if (this.multidomainData == null) {
      return;
    }
    // console.log("seriesdata : ", this.seriesdata);
    let seriesdata: any;
    if (valueSelelcted == 0) {
      seriesdata = this.getSeriesData(this.multidomainData, 1, 'Duration', 'ms');
    } // index for duration in array
    else {
      seriesdata = this.getSeriesData(this.multidomainData, 2, 'Count', '');
    }

    // let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
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

  }
  onValueChangecmp(valueSelelcted) {
    if (this.multidomainDatacmp == null) {
      return;
    }
    // console.log("seriesdata : ", this.seriesdata);
    let seriesdata: any;
    if (valueSelelcted == 0) {
      seriesdata = this.getSeriesDatacmp(this.multidomainDatacmp, 1, 'Duration', 'ms');
    } // index for duration in array
    else {
      seriesdata = this.getSeriesDatacmp(this.multidomainDatacmp, 2, 'Count', '');
    }

    // let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    this.trendChartDatacmp = {
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

  }

  pieDataCalculation(value) {
    // console.log("@ 1 pieInputLimit " , this.pieInputLimit);
    const otherData = [];
    let totalCount = null;
    let processData = [];
    processData = value.slice(0, this.pieInputLimit);
    let others = {};
    otherData.push(value.slice(processData.length - 1, value.length - 1));
    // console.log("@ otherData " , otherData);
    if (otherData != null && otherData != undefined && otherData[0].length > 0) {
      for (let i = 0; i < otherData[0].length; i++) {
        totalCount = parseInt(otherData[0][i].y) + totalCount;
      }
    }
    if (totalCount != 0) {
      others = { name: "Others", y: parseInt(totalCount) };
      processData.push(others);
    }
    // console.log("@ 1 processData " , processData);
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
    const ti = new Date().getTime();
    // take 3 values and callculate data
    // 1. request percentage i.e. limitCInput
    // 2. Top limit i.e. limitInput
    // 3. selected value i.e. value
    if (this.variableData == null) {
      this.variableData = new ProcessdomainComparedata();
    }
    // re calculate the data only if request percentage has changed
    if (this.prevReqPct != this.limitCInput) {
      // console.log("Request Percentage changed");
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
        // if(this.limitInput > this.aggdata.avgdurationwise.length)
        // this.limitInput = this.aggdata.avgdurationwise.length;
        cdata = [];
        cdata.push(this.aggdata.avgdurationwise[0].slice(0, this.limitInput));
        cdata.push(this.aggdata.avgdurationwise[1].slice(0, this.limitInput));
        this.domaintitle = "Domains By Duration";
        this.ytext = "Duration (sec)";
      }
      else if (1 == t) {
        // if(this.limitInput > this.aggdata.avgwaitwise.length)
        // this.limitInput = this.aggdata.avgwaitwise.length;
        cdata = [];
        cdata.push(this.aggdata.avgwaitwise[0].slice(0, this.limitInput));
        cdata.push(this.aggdata.avgwaitwise[1].slice(0, this.limitInput));
        this.domaintitle = "Domains By Wait Time";
        this.ytext = "Wait Time (sec)";
      }
      else if (2 == t) {
        // if(this.limitInput > this.aggdata.avgdownloadwise.length)
        // this.limitInput = this.aggdata.avgdownloadwise.length;
        cdata = [];
        cdata.push(this.aggdata.avgdownloadwise[0].slice(0, this.limitInput));
        cdata.push(this.aggdata.avgdownloadwise[1].slice(0, this.limitInput));
        // cdata = this.aggdata.avgdownloadwise.slice(0, this.limitInput);
        this.domaintitle = "Domains By Download Time";
        this.ytext = "Download Time (sec)";
      }
    }
    const series = [];
    series.push({
      name: '',
      colorByPoint: true,
      pointWidth: 15,
      data: cdata[0]
    }, {
      name: '',
      colorByPoint: true,
      pointWidth: 15,
      data: cdata[1]
    });
    DOMAIN_PERFORMANCE_COMPARE_TABLE.charts[1]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
    DOMAIN_PERFORMANCE_COMPARE_TABLE.charts[1]["highchart"]["yAxis"]["title"]["text"] = this.ytext;
    this.data.charts = DOMAIN_PERFORMANCE_COMPARE_TABLE.charts;

  }
  filterFields(event) {
    const me = this;
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < me.autoCompleteList.autocompleteData.length; i++) {
      const reportitem = me.autoCompleteList.autocompleteData[i];
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

}

