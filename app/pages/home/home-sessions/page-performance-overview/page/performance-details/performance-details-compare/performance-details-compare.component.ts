import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { AUTOCOMPLETE_DATA } from '../../../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../../../service/home-sessions.model';
import { PERFORMANCE_COMPARE_TABLE } from './servece/performance-details-compare.dummy';
import { PerformanceCompareTable } from './servece/performace-details-compare.model';
import { Store } from 'src/app/core/store/store';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './../service/page-service.state'
import { PagePerformaceDetailService } from './../../performance-details/service/pageperformacedetail.service';
import { ParsePagePerformanceFilters } from '../../../../common/interfaces/parsepageperformancefilter';
import { PagePerformanceChart } from '../../../../common/interfaces/pageperformancechart';
import { Metadata } from '../../../../common/interfaces/metadata';
import { Util } from './../../../../common/util/util';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-performance-details-compare',
  templateUrl: './performance-details-compare.component.html',
  styleUrls: ['./performance-details-compare.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PerformanceDetailsCompareComponent implements OnInit {
  data: PerformanceCompareTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  isShowAll: boolean = true;
  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  searchOptions: SelectItem[];
  pparsepagefilter = new ParsePagePerformanceFilters();
  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  overviewinfo: any = "";
  display: boolean = false;
  showresourceperformance: boolean = false;
  showdomainperformance: boolean = false;
  header: any;
  content: any;
  enableChart: boolean = false;

  @Output() arrowClick = new EventEmitter<boolean>();

  parsepagefilterdetail: any = {};

  @Input() set parsepagefilter(filter: {}) {
    this.parsepagefilterdetail = filter;
    if (filter !== null && filter != undefined) {
      this.loadPagePerformanceData(filter);
    }
  }
  constructor(private PagePerformaceDetailService: PagePerformaceDetailService) { }

  ngOnInit(): void {

    const me = this;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
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
    if (this.parsepagefilterdetail != null && typeof this.parsepagefilterdetail == 'object' && Object.keys(this.parsepagefilterdetail).length === 0) {
      let filtercriteria: any = {};
      console.log("ngOninit method start");
      filtercriteria = this.getinitfilter();
      me.loadPagePerformanceData(filtercriteria);
    }

  }

  pageperformancefilter(parsepagefilter: string) {
    let filtercriteria = JSON.parse(parsepagefilter);
    console.log("filtercriteria", filtercriteria);
    //this.filterforcompare = filtercriteria.pagePerformanceFilters;
    this.loadPagePerformanceData(filtercriteria.pagePerformanceFilters);
  }

  getinitfilter() {
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
    this.pparsepagefilter.pagePerformanceFilters.timeFilter.startTime = startT;
    this.pparsepagefilter.pagePerformanceFilters.timeFilter.endTime = endT;
    return this.pparsepagefilter.pagePerformanceFilters;
  }

  loadPagePerformanceData(filtercriteria) {
    console.log("loadPagePerformanceData method start");
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    me.PagePerformaceDetailService.LoadPageTabData(filtercriteria).subscribe(
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
            this.PagePerformaceDetailService.LoadPageTabData(comparefilter).subscribe(
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

    me.PagePerformaceDetailService.LoadPageTrendData(filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          //me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          if (filtercriteria.timeFiltercmp.startTime != "" && filtercriteria.timeFiltercmp.endTime != "") {
            let comparefilter = JSON.parse(JSON.stringify(filtercriteria));

            comparefilter.timeFilter.last = filtercriteria.timeFiltercmp.last;
            comparefilter.timeFilter.startTime = filtercriteria.timeFiltercmp.startTime;
            comparefilter.timeFilter.endTime = filtercriteria.timeFiltercmp.endTime;
            this.PagePerformaceDetailService.LoadPageTrendData(comparefilter).subscribe(
              (statecmp: any) => {
                me.onLoadedchart(state, statecmp);
              });
          }
          else
            me.onLoadedchart(state, []);
          return;
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          //me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        //me.onLoadingError(state);
      }
    );
  }
  getLoctionIDs(record) {
    let ids = [];
    for (let i = 0; i < record.length; i++) {
      ids.push(record[i].id);
    }
    console.log("getLoctionIDs : ", ids);
    return ids;
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
  private onLoadedchart(state: HomePageTabLoadedState, statecmp) {
    const me = this;
    this.enableChart = false;
    me.data = PERFORMANCE_COMPARE_TABLE;
    let reschartnor = state.data.charts;
    let reschartcmp = [];
    if (Array.isArray(statecmp))
      reschartcmp = [];
    else
      reschartcmp = statecmp.data.dataLoaded;
    let chartsarrnor = new PagePerformanceChart('Page Performance', '1 Hour', reschartnor);
    let chartsarrcmp = new PagePerformanceChart('Page Performance', '1 Hour', reschartcmp);
    PERFORMANCE_COMPARE_TABLE.charts[0]["title"] = 'Page Performance Trend Duration 1';
    PERFORMANCE_COMPARE_TABLE.charts[1]["title"] = 'Page Performance Trend Duration 2';
    PERFORMANCE_COMPARE_TABLE.charts[0]["highchart"]["series"] = chartsarrnor.series as Highcharts.SeriesOptionsType[];
    PERFORMANCE_COMPARE_TABLE.charts[1]["highchart"]["series"] = chartsarrcmp.series as Highcharts.SeriesOptionsType[];
    me.data.charts = PERFORMANCE_COMPARE_TABLE.charts;
    setTimeout(() => {
      this.enableChart = true;
    }, 200);
    me.error = null;
    me.loading = false;
    me.empty = !me.data.dataLoaded.length;
  }

  private onLoaded(state: HomePageTabLoadedState, statecmp) {
    const me = this;
    me.data = PERFORMANCE_COMPARE_TABLE;
    let pageperformancenor = state.data.dataLoaded;
    let pageperformancecmp = [];
    if (Array.isArray(statecmp)) {
      let obj = {
        "cache_avg": "0.00"
        , "cache_count": "0.00"
        , "dns_avg": "0.00"
        , "dns_count": "0.00"
        , "dom_avg": "0.00"
        , "dom_count": "0.00"
        , "fcp_avg": "0.00"
        , "fcp_count": "0.00"
        , "fid_avg": "0.00"
        , "fid_count": "0.00"
        , "fp_avg": "0.00"
        , "fp_count": "0.00"
        , "onload_avg": "0.00"
        , "onload_count": "0.00"
        , "prt_avg": "0.00"
        , "prt_count": "0.00"
        , "redirect_avg": "0.00"
        , "redirect_count": "0.00"
        , "response_avg": "0.00"
        , "response_count": "0.00"
        , "server_avg": "0.00"
        , "server_count": "0.00"
        , "ssl_avg": "0.00"
        , "ssl_count": "0.00"
        , "tcp_avg": "0.00"
        , "tcp_count": "0.00"
        , "ttdi_avg": "0.00"
        , "ttdi_count": "0.00"
        , "ttdl_avg": "0.00"
        , "ttdl_count": "0.00"
        , "tti_avg": "0.00"
        , "tti_count": "0.00"
        , "unload_avg": "0.00"
        , "unload_count": "0.00"
        , "wait_avg": "0.00"
        , "wait_count": "0.00"
      };
      pageperformancecmp.push(obj);
    }
    else
      pageperformancecmp = statecmp.data.dataLoaded;
    let finaldata = [];
    finaldata.push(this.calrumdata(pageperformancenor[0], pageperformancecmp[0]));
    console.log('finaldata : ', finaldata);
    me.data.dataLoaded = finaldata;
    //me.data.dataLoaded = state.data.dataLoaded;
    me.error = null;
    me.loading = false;
    me.empty = !me.data.dataLoaded.length;
  }
  calrumdata(pageperformancenor, pageperformancecmp) {
    let dataper1 = 0;
    let dataper2 = 0;
    let dataperfinal = 0;
    pageperformancenor["cache_avg1"] = pageperformancecmp["cache_avg"];
    dataper1 = parseFloat(pageperformancenor["cache_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["cache_avg"]) * 100;

    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["cache_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["cache_avg2"] = "0.00";
    else
      pageperformancenor["cache_avg2"] = "-100";
    pageperformancenor["cache_count1"] = pageperformancecmp["cache_count"];
    dataper1 = parseFloat(pageperformancenor["cache_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["cache_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["cache_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["cache_count2"] = "0.00";
    else
      pageperformancenor["cache_count2"] = "-100";
    pageperformancenor["dns_avg1"] = pageperformancecmp["dns_avg"];
    dataper1 = parseFloat(pageperformancenor["dns_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["dns_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["dns_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["dns_avg2"] = "0.00";
    else
      pageperformancenor["dns_avg2"] = "-100";
    pageperformancenor["dns_count1"] = pageperformancecmp["dns_count"];
    dataper1 = parseFloat(pageperformancenor["dns_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["dns_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["dns_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["dns_count2"] = "0.00";
    else
      pageperformancenor["dns_count2"] = "-100";
    pageperformancenor["dom_avg1"] = pageperformancecmp["dom_avg"];
    dataper1 = parseFloat(pageperformancenor["dom_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["dom_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["dom_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["dom_avg2"] = "0.00";
    else
      pageperformancenor["dom_avg2"] = "-100";
    pageperformancenor["dom_count1"] = pageperformancecmp["dom_count"];
    dataper1 = parseFloat(pageperformancenor["dom_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["dom_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["dom_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["dom_count2"] = "0.00";
    else
      pageperformancenor["dom_count2"] = "-100";
    pageperformancenor["onload_avg1"] = pageperformancecmp["onload_avg"];
    dataper1 = parseFloat(pageperformancenor["onload_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["onload_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["onload_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["onload_avg2"] = "0.00";
    else
      pageperformancenor["onload_avg2"] = "-100";
    pageperformancenor["onload_count1"] = pageperformancecmp["onload_count"];
    dataper1 = parseFloat(pageperformancenor["onload_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["onload_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["onload_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["onload_count2"] = "0.00";
    else
      pageperformancenor["onload_count2"] = "-100";
    pageperformancenor["prt_avg1"] = pageperformancecmp["prt_avg"];
    dataper1 = parseFloat(pageperformancenor["prt_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["prt_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["prt_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["prt_avg2"] = "0.00";
    else
      pageperformancenor["prt_avg2"] = "-100";
    pageperformancenor["prt_count1"] = pageperformancecmp["prt_count"];
    dataper1 = parseFloat(pageperformancenor["prt_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["prt_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["prt_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["prt_count2"] = "0.00";
    else
      pageperformancenor["prt_count2"] = "-100";
    pageperformancenor["redirect_avg1"] = pageperformancecmp["redirect_avg"];
    dataper1 = parseFloat(pageperformancenor["redirect_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["redirect_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["redirect_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["redirect_avg2"] = "0.00";
    else
      pageperformancenor["redirect_avg2"] = "-100";
    pageperformancenor["redirect_count1"] = pageperformancecmp["redirect_count"];
    dataper1 = parseFloat(pageperformancenor["redirect_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["redirect_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["redirect_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["redirect_count2"] = "0.00";
    else
      pageperformancenor["redirect_count2"] = "-100";
    pageperformancenor["response_avg1"] = pageperformancecmp["response_avg"];
    dataper1 = parseFloat(pageperformancenor["response_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["response_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["response_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["response_avg2"] = "0.00";
    else
      pageperformancenor["response_avg2"] = "-100";
    pageperformancenor["response_count1"] = pageperformancecmp["response_count"];
    dataper1 = parseFloat(pageperformancenor["response_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["response_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["response_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["response_count2"] = "0.00";
    else
      pageperformancenor["response_count2"] = "-100";
    pageperformancenor["server_avg1"] = pageperformancecmp["server_avg"];
    dataper1 = parseFloat(pageperformancenor["server_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["server_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["server_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["server_avg2"] = "0.00";
    else
      pageperformancenor["server_avg2"] = "-100";
    pageperformancenor["server_count1"] = pageperformancecmp["server_count"];
    dataper1 = parseFloat(pageperformancenor["server_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["server_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["server_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["server_count2"] = "0.00";
    else
      pageperformancenor["server_count2"] = "-100";
    pageperformancenor["ssl_avg1"] = pageperformancecmp["ssl_avg"];
    dataper1 = parseFloat(pageperformancenor["ssl_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ssl_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ssl_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ssl_avg2"] = "0.00";
    else
      pageperformancenor["ssl_avg2"] = "-100";
    pageperformancenor["ssl_count1"] = pageperformancecmp["ssl_count"];
    dataper1 = parseFloat(pageperformancenor["ssl_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ssl_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ssl_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ssl_count2"] = "0.00";
    else
      pageperformancenor["ssl_count2"] = "-100";
    pageperformancenor["tcp_avg1"] = pageperformancecmp["tcp_avg"];
    dataper1 = parseFloat(pageperformancenor["tcp_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["tcp_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["tcp_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["tcp_avg2"] = "0.00";
    else
      pageperformancenor["tcp_avg2"] = "-100";
    pageperformancenor["tcp_count1"] = pageperformancecmp["tcp_count"];
    dataper1 = parseFloat(pageperformancenor["tcp_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["tcp_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["tcp_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["tcp_count2"] = "0.00";
    else
      pageperformancenor["tcp_count2"] = "-100";
    pageperformancenor["ttdi_avg1"] = pageperformancecmp["ttdi_avg"];
    dataper1 = parseFloat(pageperformancenor["ttdi_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ttdi_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ttdi_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ttdi_avg2"] = "0.00";
    else
      pageperformancenor["ttdi_avg2"] = "-100";
    pageperformancenor["ttdi_count1"] = pageperformancecmp["ttdi_count"];
    dataper1 = parseFloat(pageperformancenor["ttdi_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ttdi_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ttdi_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ttdi_count2"] = "0.00";
    else
      pageperformancenor["ttdi_count2"] = "-100";
    pageperformancenor["ttdl_avg1"] = pageperformancecmp["ttdl_avg"];
    dataper1 = parseFloat(pageperformancenor["ttdl_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ttdl_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ttdl_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ttdl_avg2"] = "0.00";
    else
      pageperformancenor["ttdl_avg2"] = "-100";
    pageperformancenor["ttdl_count1"] = pageperformancecmp["ttdl_count"];
    dataper1 = parseFloat(pageperformancenor["ttdl_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["ttdl_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["ttdl_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["ttdl_count2"] = "0.00";
    else
      pageperformancenor["ttdl_count2"] = "-100";
    pageperformancenor["unload_avg1"] = pageperformancecmp["unload_avg"];
    dataper1 = parseFloat(pageperformancenor["unload_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["unload_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["unload_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["unload_avg2"] = "0.00";
    else
      pageperformancenor["unload_avg2"] = "-100";
    pageperformancenor["unload_count1"] = pageperformancecmp["unload_count"];
    dataper1 = parseFloat(pageperformancenor["unload_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["unload_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["unload_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["unload_count2"] = "0.00";
    else
      pageperformancenor["unload_count2"] = "-100";
    pageperformancenor["wait_avg1"] = pageperformancecmp["wait_avg"];
    dataper1 = parseFloat(pageperformancenor["wait_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["wait_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["wait_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["wait_avg2"] = "0.00";
    else
      pageperformancenor["wait_avg2"] = "-100";
    pageperformancenor["wait_count1"] = pageperformancecmp["wait_count"];
    dataper1 = parseFloat(pageperformancenor["wait_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["wait_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["wait_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["wait_count2"] = "0.00";
    else
      pageperformancenor["wait_count2"] = "-100";

    pageperformancenor["fp_avg1"] = pageperformancecmp["fp_avg"];
    dataper1 = parseFloat(pageperformancenor["fp_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fp_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fp_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fp_avg2"] = "0.00";
    else
      pageperformancenor["fp_avg2"] = "-100";
    pageperformancenor["fp_count1"] = pageperformancecmp["fp_count"];
    dataper1 = parseFloat(pageperformancenor["fp_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fp_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fp_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fp_count2"] = "0.00";
    else
      pageperformancenor["fp_count2"] = "-100";

    pageperformancenor["fcp_avg1"] = pageperformancecmp["fcp_avg"];
    dataper1 = parseFloat(pageperformancenor["fcp_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fcp_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fcp_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fcp_avg2"] = "0.00";
    else
      pageperformancenor["fcp_avg2"] = "-100";
    pageperformancenor["fcp_count1"] = pageperformancecmp["fcp_count"];
    dataper1 = parseFloat(pageperformancenor["fcp_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fcp_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fcp_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fcp_count2"] = "0.00";
    else
      pageperformancenor["fcp_count2"] = "-100";

    pageperformancenor["tti_avg1"] = pageperformancecmp["tti_avg"];
    dataper1 = parseFloat(pageperformancenor["tti_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["tti_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["tti_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["tti_avg2"] = "0.00";
    else
      pageperformancenor["tti_avg2"] = "-100";
    pageperformancenor["tti_count1"] = pageperformancecmp["tti_count"];
    dataper1 = parseFloat(pageperformancenor["tti_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["tti_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["tti_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["tti_count2"] = "0.00";
    else
      pageperformancenor["tti_count2"] = "-100";

    pageperformancenor["fid_avg1"] = pageperformancecmp["fid_avg"];
    dataper1 = parseFloat(pageperformancenor["fid_avg"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fid_avg"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fid_avg2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fid_avg2"] = "0.00";
    else
      pageperformancenor["fid_avg2"] = "-100";
    pageperformancenor["fid_count1"] = pageperformancecmp["fid_count"];
    dataper1 = parseFloat(pageperformancenor["fid_count"]) * 100;
    dataper2 = parseFloat(pageperformancecmp["fid_count"]) * 100;
    if (dataper1 != 0) {
      dataperfinal = (dataper1 - dataper2) / (dataper1);
      pageperformancenor["fid_count2"] = ((dataperfinal * 100).toFixed(2)).toString();
    }
    else if (dataper2 == 0)
      pageperformancenor["fid_count2"] = "0.00";
    else
      pageperformancenor["fid_count2"] = "-100";
    return pageperformancenor;
  }

  getInformation(val) {
    switch (val) {
      case 'onload':
        this.header = "Average OnLoad";
        this.content = "Onload time occurs when the processing of the page is complete and all the resources on the page (images, CSS, etc.) have finished downloading. This is also the same time that DOM complete occurs and the JavaScript window.onload event fires.";
        break;
      case 'ttdl':
        this.header = "Average DomContent Load";
        this.content = "DOM content loaded time (DOM loaded or DOM ready for short) is the point at which the DOM is ready (ie. DOM interactive) and there are no stylesheets blocking JavaScript execution.If there are no stylesheets blocking JavaScript execution and there is no parser blocking JavaScript, then this will be the same as DOM interactive time.";
        break;
      case 'dom':
        this.header = 'Average DOM Time';
        this.content = 'DOM time is total amount of time spent in processing DOM and Rendering the page. It is time from main url (last non redirect) response received to window.onload event.';
        break;
      case 'unload':
        this.header = 'Average Unload Time';
        this.content = 'Time spent in unloading the previous document (if any).';
        break;
      case 'firstbyte':
        this.header = 'Average First Byte Time';
        this.content = 'Time to First Byte (TTFB) is the total amount of time spent to receive the first byte of the response once it has been requested. It is the sum of "Redirect duration" + "Connection duration" + "Backend duration". This metric is one of the key indicators of web performance.';
        break;
      case 'redirect':
        this.header = 'Average Redirect';
        this.content = 'It is the time taken by browser to fetch all redirect urls, if there is any redirection in fetching the main url.';
        break;
      case 'cache':
        this.header = 'Average Cache Look Up Time';
        this.content = 'It is the time taken by browser to look up the main url in borwser cache.';
        break;
      case 'download':
        this.header = 'Average Download Time';
        this.content = 'Total time taken in downlaoding the main url (last non redirect) response.';
        break;
      case 'tcp':
        this.header = 'Average TCP';
        this.content = 'Time required for tcp handshake. It does not include SSL/TLS negotiation. ';
        break;
      case 'ssl':
        this.header = 'Average SSL';
        this.content = 'Time required for SSL/TLS negotiation';
        break;
      case 'dns':
        this.header = 'Average DNS';
        this.content = 'DNS resolution time. The time required to resolve a host name.';
        break;
      case 'ttdi':
        this.header = 'Average TTDI';
        this.content = 'DOM interactive time is the point at which the browser has finished loading and parsing HTML, and the DOM (Document Object Model) has been built. The DOM is how the browser internally structures the HTML so that it can render it.';
        break;
      case 'prt':
        this.header = 'Average PRT';
        this.content = 'Perceived Render Time is time when viewport area of the client browser is visually complete. It will not consider hidden area of the document.';
        break;
      case 'wait':
        this.header = 'Average Wait Time';
        this.content = 'Server response time is wait time of main URL. It is time from main url request (last non redirect) start to time when first byte of response is received.';
        break;
      case 'fp':
        this.header = 'First Paint';
        this.content = 'First Paint timestamp reports when the browser started to render the the page after navigation.';
        break;
      case 'fcp':
        this.header = 'First Content Paint';
        this.content = 'First Content Paint TimeStamp reporting the time when any content is painted – i.e. something defined in the DOM.';
        break;
      case 'tti':
        this.header = 'Time to Interactive';
        this.content = 'Time to Interactive (TTI) is when the website is visually usable and engaging.';
        break;
      case 'fid':
        this.header = 'First Input Delay';
        this.content = 'First Input Delay (FID) measures the time from when a user first interacts with your site to the time when the browser is actually able to respond to that interaction.';
        break;
    }
    this.display = true;
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

  hotspotSummary($event) {
    this.isShowAll = $event;
  }
  showPerformanceDetails() {
    this.isShowAll = true;
    this.arrowClick.emit(this.isShowAll);
  }

  showdomain() {
    this.isShowAll = false;
    this.arrowClick.emit(this.isShowAll);
    this.showdomainperformance = true;
    this.showresourceperformance = false;
  }
  showResource() {
    this.isShowAll = false;
    this.arrowClick.emit(this.isShowAll);
    this.showdomainperformance = false;
    this.showresourceperformance = true;
  }
}
