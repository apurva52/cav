import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { AUTOCOMPLETE_DATA } from '../../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../../service/home-sessions.model';
import { PERFORMANCE_TABLE } from './service/performance-details.dummy';
import { PerformanceTable } from './service/performance-details.model';
import { Store } from 'src/app/core/store/store';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/page-service.state'
import { PagePerformaceDetailService } from './../performance-details/service/pageperformacedetail.service';
import { ParsePagePerformanceFilters } from '../../../common/interfaces/parsepageperformancefilter';
import { PagePerformanceChart } from '../../../common/interfaces/pageperformancechart';
import { PagePerformanceTableData } from './service/pageperformancetable';
import { Metadata } from '../../../common/interfaces/metadata';
import { Util } from './../../../common/util/util';
import * as moment from 'moment';
import 'moment-timezone';
import { PagePerformanceOverviewService } from '../../page-performance-overview.service';
import { PagePerformanceFilter_TABLE } from '../page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../page-performance-filter/service/page.model';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-performance-details',
  templateUrl: './performance-details.component.html',
  styleUrls: ['./performance-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PerformanceDetailsComponent implements OnInit {
  data: PerformanceTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  datapagefilter: PageFilterTable;
  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  searchOptions: SelectItem[];
  breadcrumb: MenuItem[] = [];
  pparsepagefilter = new ParsePagePerformanceFilters();
  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  overviewinfo: any = "";
  display: boolean = false;
  header: any;
  content: any;

  compareMode: boolean;
  items: MenuItem[];
  filterforcompare = this.getinitfilter();
  @Input() hname: string;
  @Input() metadata: Metadata = null;
  selectedTab: string = 'details';
  activeTab: MenuItem;
  pagePerformanceItems: { header: string; description: any; key: string; }[] = [];
  filterCriteria: string = undefined;

  @Input() get pagedetailinfo() {
    console.log('detail gui get overviewinfo : ', this.overviewinfo);
    return this.overviewinfo;
  }

  set pagedetailinfo(pagedetailinfo) {
    this.overviewinfo = pagedetailinfo;
    console.log('detail gui set overviewinfo : ', this.overviewinfo);
  }
  parsepagefilterdetail: any = {};
  @Input() get parsepagefilter() {
    console.log('detail gui get parsepagefilterdetail : ', this.parsepagefilterdetail);
    return this.parsepagefilterdetail;
  }

  set parsepagefilter(parsepagefilter) {
    this.parsepagefilterdetail = parsepagefilter;

    console.log('detail gui set parsepagefilterdetail : ', this.parsepagefilterdetail);
    console.log('detail gui set overviewinfo : ', this.overviewinfo, ' metadata : ', this.metadata);
    let dimensionValue = this.overviewinfo;

    if (this.hname == "pagename") {
      let filter = this.metadata.getPageFromName(dimensionValue);
      this.parsepagefilterdetail.pages = filter.id + "";
      this.parsepagefilterdetail.pageName = dimensionValue;
    }
    else if (this.hname == "browserall") {
      let filter = this.metadata.getBrowserByName(dimensionValue);
      this.parsepagefilterdetail.browsers = filter.id + "";
    }
    else if (this.hname == "devicetype") {
      let filter = dimensionValue;
      this.parsepagefilterdetail.devices = "'" + filter + "'";
    }
    else if (this.hname == "country" || this.hname == "region") {
      console.log(' location', dimensionValue);
      let filter = this.metadata.getLocationFromName(dimensionValue);
      let f = this.getLoctionIDs(filter);
      this.parsepagefilterdetail.locations = f.join() + "";

    }
    else if (this.hname == "osall") {
      let filter = dimensionValue;
      this.parsepagefilterdetail.os = Util.setOSNameAndVersion([filter], this.metadata, '/');
    }
    else if (this.hname == "browsername") {
      let filter = this.metadata.getBrowserByName(dimensionValue);
      this.parsepagefilterdetail.browsers = filter.id + "";
    }
    else if (this.hname == "osname") {
      this.parsepagefilterdetail.os = Util.setOSNameAndVersion([dimensionValue], this.metadata, '(');
    }
    else if (this.hname == "detail") {
      let filtero = dimensionValue.split("/")[0];
      let filterb = dimensionValue.split("/")[1];

      this.parsepagefilterdetail.os = Util.setOSNameAndVersion([filtero], this.metadata, '(');
      if (filterb.indexOf('(') > -1) {
        let fl2 = filterb.split('(')[0];
        let filter = this.metadata.getBrowserByName(fl2);
        this.parsepagefilterdetail.browsers = filter.id + "";
      }
    }
    else if (this.hname == "entityname") {
      this.parsepagefilterdetail.conType = dimensionValue;
    }

    this.parsepagefilterdetail.bucket = 3600;
    this.filterforcompare = this.parsepagefilterdetail; //for comapre mode
    this.loadPagePerformanceData(this.parsepagefilterdetail);
  }

  @Output() arrowClick = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute, private PagePerformaceDetailService: PagePerformaceDetailService, private router: Router) { }

  ngOnInit(): void {

    const me = this;
    me.items = [
      {
        label: 'DETAILS', command: () => {
          this.selectedTab = 'details'
        }
      },
      {
        label: 'RESOURCE', command: () => {
          this.selectedTab = 'resource';
        }
      },
      {
        label: 'DOMAIN', command: () => {
          this.selectedTab = 'domain';
        }
      }
    ];

    this.activeTab = this.items[0];

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
    ];

    me.autoCompleteList = AUTOCOMPLETE_DATA;
    me.data = PERFORMANCE_TABLE;
    me.datapagefilter = PagePerformanceFilter_TABLE;
    if (this.route.snapshot.queryParams.filterCriteria) {
      try {
        console.log('filtercriteria  presnet in the url');
        let pagePerformanceFilters = JSON.parse(this.route.snapshot.queryParams.filterCriteria);
        console.log('ParseSessionFilters :', pagePerformanceFilters);
        me.loadPagePerformanceData(pagePerformanceFilters.pagePerformanceFilters);
        return;
      } catch (e) {
        // TODO: error.
        console.log('ddr error ', e);
        return;
      }
    }

   if (me.datapagefilter.filtercriteria == null) {
      let filtercriteria: any = {};
      filtercriteria = this.getinitfilter();
      me.loadPagePerformanceData(filtercriteria);
    }

  }

  pageperformancefilter(parsepagefilter: string) {
    this.filterCriteria = parsepagefilter;
    let filtercriteria = JSON.parse(parsepagefilter);
    console.log("filtercriteria", filtercriteria);
    this.filterforcompare = filtercriteria.pagePerformanceFilters;
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

    me.PagePerformaceDetailService.LoadPageTrendData(filtercriteria).subscribe(
      (state: Store.State) => {
        if (state instanceof HomePageTabLoadingState) {
          //me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoadedchart(state);
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
    this.pagePerformanceItems = [];
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data = null;
    this.pagePerformanceItems = [];
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }
  private onLoadedchart(state: HomePageTabLoadedState) {
    const me = this;
    me.data = PERFORMANCE_TABLE;
    let chartsarr = new PagePerformanceChart('Page Performance', '1 Hour', state.data.charts);
    PERFORMANCE_TABLE.charts[0]["highchart"]["series"] = chartsarr.series as Highcharts.SeriesOptionsType[];
    me.data.charts = PERFORMANCE_TABLE.charts;

    let dataa = [];
    state.data.charts.forEach(record => {
      dataa.push(new PagePerformanceTableData(record))
    });
    dataa.sort(
      function (a, b) { return parseInt(a[0]) - parseInt(b[0]) });

    me.data.data = dataa;
    me.error = null;
    me.loading = false;
    me.empty = !me.data.dataLoaded.length;
  }

  private onLoaded(state: HomePageTabLoadedState) {
    const me = this;
    me.data = PERFORMANCE_TABLE;

    console.log('onLoaded PERFORMANCE_TABLE state : ', state);
    if (state.data.dataLoaded.length == 0)
      me.data.dataLoaded = [{ "response_count": "0.00", "fid_avg": "0.00", "fid_count": "0.00", "ttdl_avg": "0.00", "tti_avg": "0.00", "tti_count": "0.00", "wait_count": "0.00", "prt_count": "0.00", "dom_avg": "0.00", "cache_avg": "0.00", "prt_avg": "0.00", "dns_count": "0.00", "ssl_count": "0.00", "ssl_avg": "0.00", "dns_avg": "0.00", "response_avg": "0.00", "redirect_avg": "0.00", "cache_count": "0.00", "onload_avg": "0.00", "ttdi_count": "0.00", "fcp_avg": "0.00", "tcp_count": "0.00", "redirect_count": "0.00", "ttdi_avg": "0.00", "wait_avg": "0.00", "unload_avg": "0.00", "onload_count": "0.00", "unload_count": "0.00", "tcp_avg": "0.00", "fp_count": "0.00", "fcp_count": "0.00", "fp_avg": "0.00", "server_avg": "0.00", "dom_count": "0.00", "ttdl_count": "0.00", "server_count": "0.00" }];
    else
      me.data.dataLoaded = state.data.dataLoaded;
    this.getPagePerformanceItems();

    me.error = null;
    me.loading = false;
    me.empty = !me.data.dataLoaded.length;
  }

  getPagePerformanceItems() {
    this.pagePerformanceItems = [
      { header: 'AVG OnLoad', description: this.data.dataLoaded[0].onload_avg, key: 'onload' },
      { header: 'AVG DOM Time', description: this.data.dataLoaded[0].dom_avg, key: 'dom' },
      { header: 'AVG TTDI', description: this.data.dataLoaded[0].ttdi_avg, key: 'ttdi' },
      { header: 'AVG PRT', description: this.data.dataLoaded[0].prt_avg, key: 'prt' },
      { header: 'AVG TTDL', description: this.data.dataLoaded[0].ttdl_avg, key: 'ttdl' },
      { header: 'AVG First Byte', description: this.data.dataLoaded[0].wait_avg, key: 'firstbyte' },
      { header: 'AVG TTI', description: this.data.dataLoaded[0].tti_avg, key: 'tti' },
      { header: 'AVG FID', description: this.data.dataLoaded[0].fid_avg, key: 'fid' },
      { header: 'AVG Unload', description: this.data.dataLoaded[0].unload_avg, key: 'unload' },
      { header: 'AVG Redirect', description: this.data.dataLoaded[0].redirect_avg, key: "redirect" },
      { header: 'AVG CacheLookUp', description: this.data.dataLoaded[0].cache_avg, key: 'cache' },
      { header: 'AVG DNS', description: this.data.dataLoaded[0].dns_avg, key: 'dns' },
      { header: 'AVG TCP', description: this.data.dataLoaded[0].tcp_avg, key: 'tcp' },
      { header: 'AVG SSL', description: this.data.dataLoaded[0].ssl_avg, key: 'ssl' },
      { header: 'AVG Wait Time', description: this.data.dataLoaded[0].server_avg, key: 'wait' },
      { header: 'AVG Download Time', description: this.data.dataLoaded[0].response_avg, key: 'download' },
      { header: 'AVG FP', description: this.data.dataLoaded[0].fp_avg, key: 'fp' },
      { header: 'AVG FCP', description: this.data.dataLoaded[0].fcp_avg, key: 'fcp' },
    ];
  }

  getInformation(val) {
    console.log('val');
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

  navigate() {
    this.router.navigate(['/page-performance-overview']);
  }
}
