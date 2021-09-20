import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AUTOCOMPLETE_DATA } from '../../../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../../../service/home-sessions.model';
import { PERFORMANCE_COMPARE_TABLE } from './service/resource-performance.dummy';
import { PerformanceTable } from './service/resource-performance.model';
import { ResourcePerformanceCompareService } from './service/resource-performance.service';
import { ParsePagePerformanceFilters } from '../../../../common/interfaces/parsepageperformancefilter';
import * as moment from 'moment';
import 'moment-timezone';
import { Store } from 'src/app/core/store/store';
import { ProcessResourceCompareData } from './service/process-resource-comparedata';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/resouce-performance.state';
import { ChartConfig } from '../../../../../../../shared/chart/service/chart.model';
import TimeFilterUtil from '../../../../common/interfaces/timefilter';
import { PagePerformanceFilter_TABLE } from '../../page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../../page-performance-filter/service/page.model';

@Component({
  selector: 'app-resource-performance-compare',
  templateUrl: './resource-performance-compare.component.html',
  styleUrls: ['./resource-performance-compare.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResourcePerformanceCompareComponent implements OnInit {
  breadcrumb: MenuItem[] = [];
  activeTab: MenuItem;
  datapagefilter: PageFilterTable;
  data: PerformanceTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  errorcmp: AppError;
  loadingcmp: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  alertSetting: MenuItem[];
  searchOptions: SelectItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  isShowAll: boolean = true;

  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  enableChart: boolean = false;
  multidomain: boolean = false;
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
  multidomaincmp: boolean = false;
  customTimeErrorcmp: string;
  trendChartData: ChartConfig;
  trendChartDatacmp: ChartConfig;
  trendData: any[] = [];
  trendDatacmp: any[] = [];
  selectedIds: any;
  type: any;
  selectedResource: string;
  multidomainData: any;
  multidomainDatacmp: any;
  filterforcompare: any = this.getinitfilter();
  @Output() arrowClick = new EventEmitter<boolean>();
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
  constructor(private ResourcePerformanceCompareService: ResourcePerformanceCompareService) {
    this.type = null;
    this.selectedIds = [];
    this.selectedResource = "";
    this.multidomainData = null;
    this.multidomainDatacmp = null;
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
    me.alertSetting = [
      {
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance'],
      },
      {
        label: 'Alert Settings',
        routerLink: ['/alert-configure'],
      },
    ];
    me.searchOptions = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
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
    me.data = PERFORMANCE_COMPARE_TABLE;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
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
    me.ResourcePerformanceCompareService.LoadResourceAggData(filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          if (filtercriteria.timeFiltercmp.startTime != "" && filtercriteria.timeFiltercmp.endTime != "") {
            let comparefilter = JSON.parse(JSON.stringify(filtercriteria));

            comparefilter.timeFilter.last = filtercriteria.timeFiltercmp.last;
            comparefilter.timeFilter.startTime = filtercriteria.timeFiltercmp.startTime;
            comparefilter.timeFilter.endTime = filtercriteria.timeFiltercmp.endTime;
            me.ResourcePerformanceCompareService.LoadResourceAggData(comparefilter).subscribe(
              (statecmp: any) => {
                me.onLoaded(state, statecmp);
              });
          }
          else
            me.onLoaded(state, []);
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
  private onLoaded(state: HomePageTabLoadedState, statecmp) {
    console.log("state : ", state);
    const me = this;
    me.data = PERFORMANCE_COMPARE_TABLE;
    this.enableChart = false;
    let domaincmp = [];
    if (Array.isArray(statecmp))
      domaincmp = [];
    else
      domaincmp = statecmp.data.data;
    let dnor = new ProcessResourceCompareData(state.data.data);
    //me.data.data = d.rdata;
    //me.data.datarequest = d.getPieTableData();
    let resourceDatanor = dnor.rdata;
    let pieTableDatanor = dnor.getPieTableData();
    let pieDatanor = dnor.getPieData();
    let dcmp = new ProcessResourceCompareData(domaincmp);
    let resourceDatacmp = dcmp.rdata;
    let pieTableDatacmp = dcmp.getPieTableData();
    let pieDatacmp = dcmp.getPieData2();
    me.data.data = this.comparetabledata(resourceDatanor, resourceDatacmp)
    me.data.datarequest = this.comparepietabledata(pieTableDatanor, pieTableDatacmp);
    let pieDatafinal = this.comparepiedata(pieDatanor, pieDatacmp);
    let series = [];
    series.push({
      name: '',
      colorByPoint: true,
      pointWidth: 15,
      data: pieDatafinal[0]
    }, {
      name: '',
      colorByPoint: true,
      pointWidth: 15,
      data: pieDatafinal[1]
    });

    PERFORMANCE_COMPARE_TABLE.charts[0]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];

    me.data.charts = PERFORMANCE_COMPARE_TABLE.charts;
    console.log('me.data.charts : ', me.data.charts);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
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

  comparepietabledata(pieTableDatanor, pieTableDatacmp) {
    let filldata = [];
    pieTableDatanor = pieTableDatanor.sort((a, b) => (a.contentType > b.contentType) ? 1 : ((b.contentType > a.contentType) ? -1 : 0));
    pieTableDatacmp = pieTableDatacmp.sort((a, b) => (a.contentType > b.contentType) ? 1 : ((b.contentType > a.contentType) ? -1 : 0));
    if (pieTableDatanor.length == 0 && pieTableDatacmp.length == 0) {
      filldata = [];
    }
    else if (pieTableDatanor.length == pieTableDatacmp.length) {
      filldata = [];
      for (let j = 0; j < pieTableDatanor.length; j++) {
        if (pieTableDatanor[j]["contentType"] == pieTableDatacmp[j]["contentType"]) {
          filldata.push(this.commonpietabledata(pieTableDatanor[j], pieTableDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(pieTableDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
    }
    else if (pieTableDatanor.length > pieTableDatacmp.length) {
      filldata = [];
      for (let j = 0; j < pieTableDatacmp.length; j++) {
        if (pieTableDatanor[j]["contentType"] == pieTableDatacmp[j]["contentType"]) {
          filldata.push(this.commonpietabledata(pieTableDatanor[j], pieTableDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(pieTableDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
      for (let i = pieTableDatacmp.length; i < pieTableDatanor.length; i++) {
        filldata.push(this.duration1pietabledata(pieTableDatanor[i]));
      }
    }

    else if (pieTableDatanor.length < pieTableDatacmp.length) {
      filldata = [];
      for (let j = 0; j < pieTableDatanor.length; j++) {
        if (pieTableDatanor[j]["contentType"] == pieTableDatacmp[j]["contentType"]) {
          filldata.push(this.commonpietabledata(pieTableDatanor[j], pieTableDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(pieTableDatanor[j]));
          //filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }

    }
    return filldata;
  }


  comparetabledata(resourceDatanor, resourceDatacmp) {
    resourceDatanor = resourceDatanor.sort((a, b) => (a.resourceName > b.resourceName) ? 1 : ((b.resourceName > a.resourceName) ? -1 : 0));
    resourceDatacmp = resourceDatacmp.sort((a, b) => (a.resourceName > b.resourceName) ? 1 : ((b.resourceName > a.resourceName) ? -1 : 0));
    let filldata = [];
    if (resourceDatanor.length == 0 && resourceDatacmp.length == 0) {
      filldata = [];
    }
    else if (resourceDatanor.length == resourceDatacmp.length) {
      filldata = [];
      for (let j = 0; j < resourceDatanor.length; j++) {
        if ((resourceDatanor[j]["resourceName"] == resourceDatacmp[j]["resourceName"]) && (resourceDatanor[j]["domain"] == resourceDatacmp[j]["domain"])) {
          filldata.push(this.commonresourcetabledata(resourceDatanor[j], resourceDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(resourceDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
    }
    else if (resourceDatanor.length > resourceDatacmp.length) {
      filldata = [];
      for (let j = 0; j < resourceDatacmp.length; j++) {
        if ((resourceDatanor[j]["resourceName"] == resourceDatacmp[j]["resourceName"]) && (resourceDatanor[j]["domain"] == resourceDatacmp[j]["domain"])) {
          filldata.push(this.commonresourcetabledata(resourceDatanor[j], resourceDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(resourceDatanor[j]));
          // filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
      for (let i = resourceDatacmp.length; i < resourceDatanor.length; i++) {
        filldata.push(this.duration1pietabledata(resourceDatanor[i]));

      }
    }
    else if (resourceDatanor.length < resourceDatacmp.length) {
      filldata = [];
      for (let j = 0; j < resourceDatanor.length; j++) {
        if ((resourceDatanor[j]["resourceName"] == resourceDatacmp[j]["resourceName"]) && (resourceDatanor[j]["domain"] == resourceDatacmp[j]["domain"])) {
          filldata.push(this.commonresourcetabledata(resourceDatanor[j], resourceDatacmp[j]));
        }
        else {
          filldata.push(this.duration1pietabledata(resourceDatanor[j]));
          //filldata.push(this.duration2Response(cmprumdata[j]));
        }
      }
    }

    return filldata;
  }

  duration1pietabledata(pieTableDatanor) {
    return pieTableDatanor;
  }

  commonpietabledata(pieTableDatanor, pieTableDatacmp) {
    let resobject = {};
    resobject["contentType"] = pieTableDatanor["contentType"];
    resobject["avgDuration"] = pieTableDatanor["avgDuration"];
    resobject["countpct"] = pieTableDatanor["countpct"];
    resobject["count"] = pieTableDatanor["count"];
    resobject["contentType1"] = pieTableDatacmp["contentType"];
    resobject["count1"] = pieTableDatacmp["count"];
    resobject["countpct1"] = pieTableDatacmp["countpct"];
    resobject["avgDuration1"] = pieTableDatacmp["avgDuration"];

    return resobject;
  }
  comparepiedata(pieDatanor, pieDatacmp) {
    let filldata = [];
    filldata.push(pieDatanor);
    filldata.push(pieDatacmp);
    return filldata;
  }

  // Method for Common Resource Data
  commonresourcetabledata(resourceDatanor, resourceDatacmp) {
    let resobject = {};
    resobject["connection"] = resourceDatanor["connection"];
    resobject["connection1"] = resourceDatacmp["connection"];
    resobject["count"] = resourceDatanor["count"];
    resobject["count1"] = resourceDatacmp["count"];
    resobject["dns"] = resourceDatanor["dns"];
    resobject["dns1"] = resourceDatacmp["dns"];
    resobject["domain"] = resourceDatanor["domain"];
    resobject["domain1"] = resourceDatacmp["domain"];
    resobject["domainid"] = resourceDatanor["domainid"];
    resobject["domainid1"] = resourceDatacmp["domainid"];
    resobject["download"] = resourceDatanor["download"];
    resobject["download1"] = resourceDatacmp["download"];
    resobject["duration"] = resourceDatanor["duration"];
    resobject["duration1"] = resourceDatacmp["duration"];
    resobject["redirection"] = resourceDatanor["redirection"];
    resobject["redirection1"] = resourceDatacmp["redirection"];
    resobject["resource"] = resourceDatanor["resource"];
    resobject["resource1"] = resourceDatacmp["resource"];
    resobject["resourceName"] = resourceDatanor["resourceName"];
    resobject["resourceName1"] = resourceDatacmp["resourceName"];
    resobject["resourceid"] = resourceDatanor["resourceid"];
    resobject["resourceid1"] = resourceDatacmp["resourceid"];
    resobject["wait"] = resourceDatanor["wait"];
    resobject["wait1"] = resourceDatacmp["wait"];
    resobject["fp"] = resourceDatanor["fp"];
    resobject["fp1"] = resourceDatacmp["fp"];
    return resobject;
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

  getResourceTrendData(e, type) {
    this.type = type;
    //this.rowdata = e;
    this.visible = false;
    this.multidomain = false;
    this.multidomaincmp = false;
    this.enableChart = false;
    this.trendChartData = {};
    this.multidomainData = null;
    this.trendChartDatacmp = {};
    this.multidomainDatacmp = null;
    this.customTime[0] = new Date(this.filterforcompare.timeFilter.startTime.split(' ')[0] + ' ' + '00:00:00');
    this.customTime[1] = new Date(this.filterforcompare.timeFilter.endTime.split(' ')[0] + ' ' + '23:59:59');
    this.customTimecmp[0] = new Date(this.filterforcompare.timeFiltercmp.startTime.split(' ')[0] + ' ' + '00:00:00');
    this.customTimecmp[1] = new Date(this.filterforcompare.timeFiltercmp.endTime.split(' ')[0] + ' ' + '23:59:59');
    console.log('this.customTime[0]  : ', this.customTime[0], ' this.customTime[1] ', this.customTime[1]);
    if ((this.type == "alldomain" || this.type == "allresource") && e != null) {
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
    this.enableChart = false;
    if (this.type.indexOf("all") > -1) {
      this.getAllResourceTrendsData(timeflag);
      return;
    }
    this.multidomain = false;
    let ddd = [];
    let e = this.rowdata;
    let f = {}
    f["pages"] = this.filterforcompare.pages;
    f["timeFilter"] = {};

    f["domains"] = e.domain;
    this.selectedResource = "Domain Trend for " + e.domain;

    if (this.type == "resource") {
      f["resource"] = e.resource;
      this.selectedResource = "Resource Trend for " + e.resource;
    }
    else {
      f["resource"] = null;
    }
    if (this.filterforcompare.timeFilter["startTime"] != "")
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFilter["startTime"];
    //f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFilter["endTime"] != "")
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFilter["endTime"];
    //f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftime = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    //this.deftime = "";
    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag != null) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }

    const me = this;
    me.ResourcePerformanceCompareService.LoadResourceTrendData(f).subscribe(
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
    this.enableChart = false;
    if (this.type.indexOf("all") > -1) {
      this.getAllResourceTrendsDatacmp(timeflag);
      return;
    }
    this.multidomaincmp = false;
    let ddd = [];
    let e = this.rowdatacmp;
    let f = {}
    f["pages"] = this.filterforcompare.pages;
    f["timeFilter"] = {};

    f["domains"] = e.domain;
    this.selectedResource = "Domain Trend for " + e.domain;

    if (this.type == "resource") {
      f["resource"] = e.resource;
      this.selectedResource = "Resource Trend for " + e.resource;
    }
    else {
      f["resource"] = null;
    }
    if (this.filterforcompare.timeFiltercmp["startTime"] != "")
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFiltercmp["startTime"];
    //f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFiltercmp["endTime"] != "")
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFiltercmp["endTime"];
    //f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftimecmp = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    //this.deftime = "";
    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTimecmp[0], this.customTimecmp[1]);
    if (timeflag != null) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }

    const me = this;
    me.ResourcePerformanceCompareService.LoadResourceTrendData(f).subscribe(
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

  private onLoadedtrend(state: HomePageTabLoadedState) {
    let o = state.data.data;
    let res = o.sort((a, b) => {
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
    for (const r of res) {
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
    let titleText = this.selectedResource;
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


  private onLoadedtrendcmp(state: HomePageTabLoadedState) {
    let o = state.data.data;
    let res = o.sort((a, b) => {
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
    for (const r of res) {
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
    let titleText = this.selectedResource;
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
    console.log(' trendChartData : ', this.trendChartData);
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
  }

  getAllResourceTrendsData(timeflag) {
    this.multidomain = true;
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
    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    if (timeflag != null) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }

    if (this.type == "alldomain") {
      f["domainArray"] = this.getId(e, 'domainid');
      f["resourceArray"] = null;
      this.selectedResource = "Domain Timing over Time for ";
      const me = this;
      me.ResourcePerformanceCompareService.getAllDomainTData(f).subscribe(
        (state: Store.State) => {
          if (state instanceof HomePageTabLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof HomePageTabLoadedState) {
            this.loading = state.loading;
            this.error = state.error;
            this.trendData = state.data.data;
            me.onLoadedAlltrend(state);
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
    else {
      f["domainArray"] = null;
      f["resourceArray"] = this.getId(e, 'resourceid');
      this.selectedResource = "Resource Timing over Time";
      const me = this;
      me.ResourcePerformanceCompareService.LoadResourceAllTrendData(f).subscribe(
        (state: Store.State) => {
          if (state instanceof HomePageTabLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof HomePageTabLoadedState) {
            this.loading = state.loading;
            this.error = state.error;
            this.trendData = state.data.data;
            me.onLoadedAlltrend(state);
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


  }
  getAllResourceTrendsDatacmp(timeflag) {
    this.multidomaincmp = true;
    this.trendChartDatacmp = null;
    this.enableChart = false;
    let e = this.rowdatacmp;
    if (e == null) {
      e = this.selectedIds;
    }
    let f = {}
    f["timeFilter"] = {};

    f["resource"] = null;
    f["pages"] = this.filterforcompare.pages;
    if (this.filterforcompare.timeFiltercmp["startTime"] != "")
      f["timeFilter"]["startTime"] = this.filterforcompare.timeFiltercmp["startTime"];
    //f["timeFilter"]["startTime"] = this.filtercriteria.timeFilter["startTime"].split(" ")[0] + " " + "00:00:00";

    if (this.filterforcompare.timeFiltercmp["endTime"] != "")
      f["timeFilter"]["endTime"] = this.filterforcompare.timeFiltercmp["endTime"];
    //f["timeFilter"]["endTime"] = this.filtercriteria.timeFilter["endTime"].split(" ")[0] + " " + "23:59:59";

    this.deftimecmp = f["timeFilter"]["startTime"] + " - " + f["timeFilter"]["endTime"];
    let timeFilter = TimeFilterUtil.getTimeFilter('', this.customTimecmp[0], this.customTimecmp[1]);
    if (timeflag != null) {
      f["timeFilter"]["last"] = "";
      f["timeFilter"]["startTime"] = timeFilter.startTime;
      f["timeFilter"]["endTime"] = timeFilter.endTime;
    }

    if (this.type == "alldomain") {
      f["domainArray"] = this.getId(e, 'domainid');
      f["resourceArray"] = null;
      this.selectedResource = "Domain Timing over Time for ";
      const me = this;
      me.ResourcePerformanceCompareService.getAllDomainTData(f).subscribe(
        (state: Store.State) => {
          if (state instanceof HomePageTabLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof HomePageTabLoadedState) {
            this.loadingcmp = state.loading;
            this.errorcmp = state.error;
            this.trendDatacmp = state.data.data;
            me.onLoadedAlltrendcmp(state);
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
    else {
      f["domainArray"] = null;
      f["resourceArray"] = this.getId(e, 'resourceid');
      this.selectedResource = "Resource Timing over Time";
      const me = this;
      me.ResourcePerformanceCompareService.LoadResourceAllTrendData(f).subscribe(
        (state: Store.State) => {
          if (state instanceof HomePageTabLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof HomePageTabLoadedState) {
            this.loadingcmp = state.loading;
            this.errorcmp = state.error;
            this.trendDatacmp = state.data.data;
            me.onLoadedAlltrendcmp(state);
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


  }



  private onLoadedAlltrend(state: HomePageTabLoadedState) {
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

    this.trendChartData = {
      title: this.selectedResource,
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


  private onLoadedAlltrendcmp(state: HomePageTabLoadedState) {
    let o = state.data.data;
    this.enableChart = false;
    this.multidomainDatacmp = o;
    let Selelcted = document.querySelector('#valueselect');
    let valueSelelcted = 0;
    if (Selelcted == null)
      valueSelelcted = 0;
    else
      valueSelelcted = Selelcted["value"];
    let seriesdata: any;
    if (valueSelelcted == 0)
      seriesdata = this.getSeriesDatacmp(o, 1, 'Duration', 'ms'); // index for duration in array
    else
      seriesdata = this.getSeriesDatacmp(o, 2, 'Count', '');

    this.trendChartDatacmp = {
      title: this.selectedResource,
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
      title: this.selectedResource,
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

  onValueChangecmp(valueSelelcted) {
    this.enableChart = false;
    if (this.multidomainDatacmp == null)
      return;
    //console.log("seriesdata : ", this.seriesdata);
    let seriesdata: any;
    if (valueSelelcted == 0)
      seriesdata = this.getSeriesDatacmp(this.multidomainDatacmp, 1, 'Duration', 'ms'); // index for duration in array
    else
      seriesdata = this.getSeriesDatacmp(this.multidomainDatacmp, 2, 'Count', '');

    //let seriesdata = this.getSeriesData(o, 1, 'Duration', 'ms'); // index for duration in array
    this.trendChartDatacmp = {
      title: this.selectedResource,
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
  getSeriesDatacmp(o, index, name, suffix) {
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
      this.trendDatacmp = res;
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

  getId(darray, prop) {
    console.log("darray : ", darray);
    let id = [];
    for (let i = 0; i < darray.length; i++) {
      id.push(darray[i][prop]);
    }
    return id;
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
