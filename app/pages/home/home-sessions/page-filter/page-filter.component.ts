import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { LazyLoadEvent, Menu, MenuItem, SelectItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { PageFilterInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pagefilterinformation';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { DataManager } from '../common/datamanager/datamanager';
import { Metadata } from '../common/interfaces/metadata';
import { PagePerformanceMetrics } from '../common/interfaces/pageperformancemetrics';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../common/service/nvhttp.service';
import { ReplayService } from '../play-sessions/service/replay.service';
import { SessionStateService } from '../session-state.service';
import { PAGE_FILTER_TABLE } from './service/page-filter.dummy';
import { AutoCompleteData, PageFilterTable, PageFilterTableHeaderColumn } from './service/page-filter.model';
import { PageListService } from './service/page-filter.service';
import { PageListLoadedState, PageListLoadingErrorState, PageListLoadingState } from './service/page-filter.state';
import { ParsePageFilter } from './sidebar/page-filter-sidebar/service/ParsePageFilter';
import { Router, ActivatedRoute } from '@angular/router';
import { DrillDownDDRService } from '../common/service/drilldownddrservice.service';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { PageFilterSidebarComponent } from './sidebar/page-filter-sidebar/page-filter-sidebar.component';
import { Util } from '../common/util/util';
import { PageFilters } from '../common/interfaces/pagefilter';
import { HttpClient } from '@angular/common/http';
import { PageFilterSmartSearch } from './pagefiltersmartsearch';

@Component({
  selector: 'app-page-filter',
  templateUrl: './page-filter.component.html',
  styleUrls: ['./page-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PageFilterComponent extends PageFilterSmartSearch implements OnInit, OnDestroy {

  @ViewChild('session') session: Table;
  @ViewChild('analyticsMenu') analyticsMenu: Menu;
  @ViewChild(PageFilterSidebarComponent, { read: PageFilterSidebarComponent }) pageFilterSidebar: PageFilterSidebarComponent;
  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() pages: any[];
  @Input() pageFilterMode: boolean = false;
  sessionsOffset: any;
  data: PageFilterTable;
  error: AppError;
  loading: boolean = false;
  ischecked: boolean = false;
  key: string;
  cols: PageFilterTableHeaderColumn[];
  selected: boolean = false;
  totalRecords: number = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: PageFilterTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  analyticsOptions: MenuItem[];
  linkOptions: MenuItem[];
  groupDataTemp: any;
  metadata: Metadata;
  paginationEvent: any;
  offsetWindow: any[];
  startTime: string;
  endTime: string;
  scatterStartTime: string;
  scatterendTime: string;
  scatterStart: Date;
  trends = PagePerformanceMetrics;
  metric: SelectItem = { label: 'Onload', value: this.trends.onload };
  ddrflag: boolean;
  buckets = {
    '5 Minutes': 5 * 60,
    '15 Minutes': 15 * 60,
    '30 Minutes': 30 * 60,
    '1 Hour': 3600,
    '4 Hours': 3600 * 4,
    '1 Day': 24 * 3600,
    '1 Week': 7 * 24 * 3600,
    '1 Month': 30 * 24 * 3600,
    All: 0
  };
  tableData: PageFilterInformation[];
  offset: number = 0;
  first: number = 0;
  rows: number = 0;
  currentRowData: any;
  currentEvent: any;
  eventOptions: MenuItem[];
  appFlag: boolean = false;
  impactFlag: boolean = false;
  impactData: any = [];
  displayFlag: boolean = false;
  cardData: any
  selectedRowIndex: any;
  nvconfigurations: any;
  breadcrumb: BreadcrumbService
  filterLabel: string = '';
  countLoading: boolean = false;
  chartLoading: boolean;
  fromBreadcrumb : boolean = false;
   //smartsearch
   autoCompleteList: AutoCompleteData;
   filteredReports: any[];
   smartSearchFilterApplied : boolean = false;


  constructor(
    http: HttpClient,
    private route: ActivatedRoute, private router: Router,
    private pagelistservice: PageListService,
    private metadataService: MetadataService,
    private nvhttp: NvhttpService,
    private stateService: SessionStateService,
    private replayService: ReplayService,
    private ddrService: DrillDownDDRService,
    private nvAppConfigService: NVAppConfigService,
    breadcrumb: BreadcrumbService
  ) {
    super(http);
    this.breadcrumb = breadcrumb;
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;  
    });
    this.metadataService.getMetadata().subscribe(metadata => {
      //init smart search.
      this.init(metadata, this.applySmartSearchFilter, this);
    });

    this.downloadOptions = [
      {
        label: 'Export Pages as PDF', command: () => {
          this.nvFunction('pdf');
        }
      },
      {
        label: 'Export Pages as HTML', command: () => {
          this.nvFunction('html');
        }
      },
      {
        label: 'Export Pages as XLS', command: () => {
          this.nvFunction('xls');
        }
      },
    ];

    this.linkOptions = [
      { label: 'Page Detail', command: (event: any) => { this.navigate_to_page_detail() } },
      { label: 'Play Session', command: (event: any) => { this.navigate_to_replay(); } },
    ];

    this.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Page Performance Detail', routerLink: '/performance-details' },
      { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
      { label: 'Form Analytics', routerLink: '/form-analytics' },
      { label: 'Custom Metrics', routerLink: '/custom-metrics' },
      { label: 'Path Analytics', items: [
        { label: "User Flow Report", command: (event: any) => { this.view_flow_path(); } },
        { label: "Navigation Summary", command: (event: any) => { this.navigation_path(); } }] },
      { label: 'Marketing Analytics', routerLink: '/marketing-analytics' }
  ]
    this.eventOptions = [
      { label: 'Event Aggregate Report', command: (event: any) => { this.openEventscreen(event); } },
      { label: 'Impact of Event', command: (event: any) => { this.openImpactEvent(event); } },
    ];
    this.getMetadata();
  }

  ngOnInit(): void { 
    this.data = {...PAGE_FILTER_TABLE};
    this.first = this.data.paginator.first;
    this.rows = this.data.paginator.rows;
    this.cols = this.data.headers[0].cols;
    for (const c of this.data.headers[0].cols) {
      this.globalFilterFields.push(c.valueField);
      if (c.selected) {
        this._selectedColumns.push(c);
      }
    }
    if (this.route.snapshot.queryParams.filterCriteria) {
      try {
        console.log('filtercriteria  presnet in the url');
        ParsePageFilter.pageFilters = JSON.parse(this.route.snapshot.queryParams.filterCriteria);
        this.handleDataRequest(false);
        return;
      } catch (e) {
        // TODO: error.
        return;
      }
    }

    // set breadcrumb.
    if (Object.keys(this.route.snapshot.queryParams).length == 0) {
      // clear all breadcrumb. 
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
      this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    }
    let qp = {...this.route.snapshot.queryParams};
    qp['from'] = "breadcrumb";
    this.breadcrumb.add({ label: 'Pages', routerLink: '/page-filter', queryParams: qp } as MenuItem);

    // restore to previuos state only if we are coming from breadcrumb
    let from = this.route.snapshot.queryParams.from;
    if(from && from == "breadcrumb")
      this.fromBreadcrumb = true;

    // try to restore from state
    const oldFilter = this.stateService.get('page.filterCriteria');
    console.log('page-filter | oldFilter : ', oldFilter);

    if (oldFilter != null && this.fromBreadcrumb) {
      ParsePageFilter.pageFilters = {...oldFilter};
      let data: PageFilterInformation[] = this.stateService.get('page.data', []);

      
      if (data && data.length) {
        this.tableData = this.stateService.get('page.data', []);
        this.rows = this.stateService.get('page.rows', this.rows);
        this.first = this.stateService.get('page.first', this.first);
        this.totalRecords = this.stateService.get('page.totalRecords', 0);
        this.selectedRow = this.stateService.getSelectedSessionPage();
      }
      return;

    } else {
      // reset parsePageFilter
      const parsePageFilter = new ParsePageFilter();
      // get data for default time period
      this.loadDefault();
      // reset stateService - 'page.filterCriteria', so that it is not accessed in sidebar, else its sets wrong custom time
      this.stateService.set('page.filterCriteria',null);
    }

    this.handleDataRequest(false); 

    
  }


  loadDefault() {
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;

      // get default data for last 1 Hour
      const specificTime = Util.convertLastToFormattedWithoutZone('1 Hour', this.nvconfigurations);
      ParsePageFilter.pageFilters.timeFilter.last = '';
      ParsePageFilter.pageFilters.timeFilter.startTime = specificTime.startTime;
      ParsePageFilter.pageFilters.timeFilter.endTime = specificTime.endTime;
    });
  }


  @Input() get selectedColumns(): PageFilterTableHeaderColumn[] {

    return this._selectedColumns;
  }
  set selectedColumns(val: PageFilterTableHeaderColumn[]) {

    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {

    this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
    if (this.isEnabledColumnFilter === true) {
      this.filterTitle = 'Disable Filters';
    } else {
      this.filterTitle = 'Enable Filters';
    }
  }

  private onLoading(state: PageListLoadingState) {

    this.tableData = [];
    this.error = state.error;
    this.loading = state.loading;
  }

  private onLoadingError(state: PageListLoadingErrorState) {
    
    this.tableData = [];
    this.error = state.error;
    this.loading = state.loading;
  }

  private onLoaded(state: PageListLoadedState) {

    //let reserror = state;
    //if (reserror !== '' && reserror !== undefined && reserror !== 'NA'){
     // this.loading = false;
      //this.countLoading = false;
      //this.error = {};
      //this.error['msg'] = reserror;
      //return;
    //}
    this.loading = state.loading;
    this.error = state.error;

    this.metadataService.getMetadata().subscribe(metadata => {
      this.data.data = state.data.data.map(a => {
        return new PageFilterInformation(a, metadata);
      });
      /**
       * there can be 3 cases, handling for all the three cases
       * case 1 : having no data
       * case 2 : having data , less than the limit
       * in both of the above case, we do not have to call the count request , and fill the total records as data. length
       * case 3 : else case,  calling the count request  and filling total records
       */
      if(this.data.data.length < this.data.paginator.rows)
         this.totalRecords = this.data.data.length;
      else
        this.getDataCountForTable();
      
      if(!this.paginationEvent){
        this.tableData = this.data.data;
        return;
      }

      if(this.totalRecords > 0 )
        this.customSort(this.paginationEvent);
      else
        this.tableData = this.data.data;
    });



  }

  // method to handle data request for both modes.
  handleDataRequest(type: boolean) {
    this.pageFilterMode = type;
    this.data.filtermode = this.pageFilterMode;
    this.loading = true;
    
    ParsePageFilter.pageFilters.bucketString = '5 Minutes';

    if (type) { // scatter map 
      ParsePageFilter.pageFilters.limit = 300; // limit of 5 min 
      ParsePageFilter.pageFilters.offset = 1;
      this.updateOffset(ParsePageFilter.pageFilters.offset);

    } else {
      ParsePageFilter.pageFilters.limit = this.data.paginator.rows;
      ParsePageFilter.pageFilters.offset = 0;

      this.totalRecords = 0;
      this.getDataForTable();
    }
  }

  getDataCountForTable() {
    this.countLoading = true;
    ParsePageFilter.pageFilters.pageCount = true;
    const filter = JSON.parse(JSON.stringify(ParsePageFilter.pageFilters));
    this.nvhttp.getPageFilterCount(filter).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadedState) {
        try{
         state.data.filtermode = this.pageFilterMode;
        }catch(e){}
        this.totalRecords = state.data;
        this.countLoading = false;
      }
    },
      (error: Store.State) => {
        console.error('Failed to get the total records for the table. Error : ', error);
      });
  }

  getDataForTable() {
    
    ParsePageFilter.pageFilters.pageCount = false;

    this.pagelistservice.LoadPageListTableData(ParsePageFilter.pageFilters).subscribe(
      (state: Store.State) => {

        if (state instanceof PageListLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof PageListLoadedState) {
          state.data.filtermode = this.pageFilterMode;
          this.onLoaded(state);
          return;
        }
      },
      (state: PageListLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
  }

  getMetadata() {
    const parsePageFilter = new ParsePageFilter();

    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      DataManager.metadata = this.metadata;
      parsePageFilter.setPageFilterCriteria(this.metadata);
    });
  }

  getPageDetails(e) { }


  updateBucket(e) {
    ParsePageFilter.pageFilters.limit = this.buckets[e];

    if (this.buckets[e] !== 0) {
      ParsePageFilter.totalBuckets = Math.ceil(ParsePageFilter.duration / this.buckets[e]);
    } else {
      ParsePageFilter.totalBuckets = 0;
      this.offsetWindow = [];
    }
    this.updateOffset(1);
  }

  updateOffset(e) {
    if (this.pageFilterMode) {
      ParsePageFilter.pageFilters.offset = e;
      this.offsetWindow = [];
      let i = e;
      if (e > 2)
        i = e - 2;
      for (let n = 1; i <= ParsePageFilter.totalBuckets; i++, n++) {

        this.offsetWindow.push(i);
        if (n === 5)
          break;
      }
      this.getChartData();
    }
  }


  getChartData() {
    this.pages = [];
    const time = new Date(ParsePageFilter.pageFilters.timeFilter.startTime).getTime() / 1000;
    const limit = ParsePageFilter.pageFilters.limit;
    const timeZone = sessionStorage.getItem('_nvtimezone');
    const offset = ParsePageFilter.pageFilters.offset;
    const etime = new Date(ParsePageFilter.pageFilters.timeFilter.endTime).getTime() / 1000;
    let tmpTime = time + (offset - 1) * limit;

    this.startTime = window['toDateString'](new Date(tmpTime * 1000)) + ' ' + new Date(tmpTime * 1000).toTimeString().split(' ')[0];
    this.scatterStart = new Date(moment.tz(tmpTime * 1000, timeZone).format('MM/DD/YYYY HH:mm:ss'));
    tmpTime = time + offset * limit;
    if (limit === 0) {
      tmpTime = etime;
    }
    this.endTime = window['toDateString'](new Date(tmpTime * 1000)) + ' ' + new Date(tmpTime * 1000).toTimeString().split(' ')[0];
    
    this.calculateTime();

    this.nvhttp.getPageScatteredChartData().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.chartLoading = state.loading;
      }
      if (state instanceof NVPreLoadedState) {

        this.pages = [];
        this.pages = state.data;
        if (this.ddrflag == true) {
          let navigationstart = 0;
          let navigationend = 0;
          let limit = 300;
          for (let i = 0; i < this.pages.length; i++) {
            if (i == 0) {
              navigationstart = this.pages[i][0];
            }
            if (i == (this.pages.length - 1)) {
              navigationend = this.pages[this.pages.length - 1][0];
            }
          }
          let buckett = 0;
          buckett = ((navigationend - navigationstart) / (3600 * 7));
          if (buckett < 5) {
            ParsePageFilter.pageFilters.bucketString = '5 Minutes';
            limit = 5 * 60;
          } else if (buckett < 15) {
            ParsePageFilter.pageFilters.bucketString = '15 Minutes';
            limit = 15 * 60;
          } else if (buckett < 30) {
            ParsePageFilter.pageFilters.bucketString = '30 Minutes';
            limit = 30 * 60;
          } else if (buckett < 60) {
            ParsePageFilter.pageFilters.bucketString = '1 Hour';
            limit = 3600;
          } else if (buckett < (60 * 4)) {
            ParsePageFilter.pageFilters.bucketString = '4 Hours';
            limit = 3600 * 4;
          } else {
            ParsePageFilter.pageFilters.bucketString = 'All';
            limit = 0;
          }
          this.ddrflag = false;
          const time = new Date(ParsePageFilter.pageFilters.timeFilter.startTime).getTime() / 1000;
          const timeZone = sessionStorage.getItem('_nvtimezone');
          const offset = ParsePageFilter.pageFilters.offset;
          const etime = new Date(ParsePageFilter.pageFilters.timeFilter.endTime).getTime() / 1000;
          let tmpTime = time + (offset - 1) * limit;

          this.startTime = window['toDateString'](new Date(tmpTime * 1000)) + ' ' + new Date(tmpTime * 1000).toTimeString().split(' ')[0];
          this.scatterStart = new Date(moment.tz(tmpTime * 1000, timeZone).format('MM/DD/YYYY HH:mm:ss'));
          tmpTime = time + offset * limit;
          if (limit === 0) {
            tmpTime = etime;
          }
          this.endTime = window['toDateString'](new Date(tmpTime * 1000)) + ' ' + new Date(tmpTime * 1000).toTimeString().split(' ')[0];

          let metricinfo = 'onload';
          if (ParsePageFilter.pageFilters.perceivedRender != null) {
            metricinfo = 'perceivedRender';
            this.metric = { label: 'PRT', value: this.trends.prt }
          } else if (ParsePageFilter.pageFilters.onload != null) {
            metricinfo = 'onload';
            this.metric = { label: 'Onload', value: this.trends.onload };
          } else if (ParsePageFilter.pageFilters.domInteractive != null) {
            metricinfo = 'domInteractive';
            this.metric = { label: 'TTDI', value: this.trends.ttdi };
          } else if (ParsePageFilter.pageFilters.domContentLoaded != null) {
            metricinfo = 'domContentLoaded';
            this.metric = { label: 'TTDL', value: this.trends.ttdl };
          } else if (ParsePageFilter.pageFilters.dom != null) {
            metricinfo = 'dom';
            this.metric = { label: 'DOM Time', value: this.trends.dom };
          } else if (ParsePageFilter.pageFilters.dns != null) {
            metricinfo = 'dns';
            this.metric = { label: 'DNS', value: this.trends.dns };
          } else if (ParsePageFilter.pageFilters.dns != null) {
            metricinfo = 'tcp';
            this.metric = { label: 'TCP', value: this.trends.tcp };
          } else if (ParsePageFilter.pageFilters.unload != null) {
            metricinfo = 'unload';
            this.metric = { label: 'Unload', value: this.trends.unload };
          } else if (ParsePageFilter.pageFilters.ssl != null) {
            metricinfo = 'ssl';
            this.metric = { label: 'SSL', value: this.trends.ssl };
          } else if (ParsePageFilter.pageFilters.wait != null) {
            metricinfo = 'wait';
            this.metric = { label: 'Wait Time', value: this.trends.wait };
          } else if (ParsePageFilter.pageFilters.download != null) {
            metricinfo = 'download';
            this.metric = { label: 'Download Time', value: this.trends.download };
          }

        }

        this.chartLoading = state.loading;
      }

    }, (err: Store.State) => {
      if (err instanceof NVPreLoadingErrorState) {
        console.error('getPageScatteredChartData | Error - ', err);

        this.chartLoading = err.loading;
      }
    });
  }

  calculateTime() {
    let duration = 15 * 60 * 1000;
    if (ParsePageFilter.pageFilters.timeFilter.last !== '') {
      const val = ParsePageFilter.pageFilters.timeFilter.last;
      if (val === '15 Minutes') {
        duration = 15 * 60 * 1000;
      } else if (val === '1 Hour') {
        duration = 1 * 60 * 60 * 1000;
      } else if (val === '4 Hours') {
        duration = 4 * 60 * 60 * 1000;
      } else if (val === '8 Hours') {
        duration = 8 * 60 * 60 * 1000;
      } else if (val === '12 Hours') {
        duration = 12 * 60 * 60 * 1000;
      } else if (val === '16 Hours') {
        duration = 16 * 60 * 60 * 1000;
      } else if (val === '20 Hours') {
        duration = 20 * 60 * 60 * 1000;
      } else if (val === '1 Day') {
        duration = 1 * 24 * 60 * 60 * 1000;
      } else if (val === '1 Week') {
        duration = 7 * 24 * 60 * 60 * 1000;
      } else if (val === '1 Month') {
        duration = 30 * 24 * 60 * 60 * 1000;
      } else {
        duration = 1 * 12 * 365 * 24 * 60 * 60 * 1000;
      }
    } else {
      const st = (new Date(ParsePageFilter.pageFilters.timeFilter.startTime).getTime()) - (1388534400000);
      const et = (new Date(ParsePageFilter.pageFilters.timeFilter.endTime).getTime()) - (1388534400000);
      duration = et - st;
    }
    ParsePageFilter.duration = duration / 1000;
    ParsePageFilter.totalBuckets = ParsePageFilter.duration / ParsePageFilter.pageFilters.limit;

  }

  ngOnDestroy(): void { 
    let f = {...ParsePageFilter.pageFilters};
    this.stateService.setAll({
      'page.rows': f.limit,
      'page.first': f.offset,
      'page.totalRecords': this.totalRecords,
      'page.filterCriteria': f,
      'page.data': this.tableData,
      prevRoute: 'page-filter'
    });
    if (this.tableData === undefined ) 
    return
    this.tableData.forEach((val, i) => {
      if (val === this.selectedRow) {
        this.stateService.set('page.selectedPageIdx', i, true);
      }
    });  
  
  
  }

  openImpactEvent(item) {

    this.appFlag = true;
    this.impactFlag = true;
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    var yesterdayStr = moment.tz(dateObj, sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
    var st = yesterdayStr + " 00:00:00";
    var et = yesterdayStr + " 23:59:59";
    let st_utc = moment.tz(new Date(st), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    let et_utc = moment.tz(new Date(et), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    this.nvhttp.getEventImpactInfo("", st_utc, et_utc, this.currentRowData.channel.name, this.currentEvent).subscribe((res: Response) => {

      this.appFlag = false;
      this.cardData = res;
      this.displayFlag = true;
    },
      err => {
        this.appFlag = false;
        console.log("error occred : ", err);
      })
    this.impactData = [];
    this.impactData.push({ event: this.currentEvent });
    this.impactData.push({ last: "" });
    this.impactData.push({ startDateTime: st });
    this.impactData.push({ endDateTime: et });
    this.impactData.push({ channel: this.currentRowData.channel });
    
  }
  changeFlagValue(ev) {
    this.impactFlag = ev;
  }


  openEventscreen(item) {
    let timeFilter = ParsePageFilter.pageFilters.timeFilter;

    this.router.navigate(['/session-event'], { queryParams: { startDateTime: timeFilter.startTime, endDateTime: timeFilter.endTime, last: timeFilter.last, eventname: this.currentEvent, eventFlag: "false" } });

  }

  onClickMenu(rowData: any, name, evt, pageMenu: Menu) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
    this.currentRowData = rowData;
    this.currentEvent = name;

    this.hideAllMenus();
    this.hideAllMenus();
    pageMenu.toggle(evt);
  }

  navigate_to_page_detail() {
    this.router.navigate(['/page-detail'], { queryParams: { sid: this.selectedRow.sid, pageInstance: this.selectedRow.pageinstance } });
  }

  navigate_to_replay() {
    let msg = "session with sid : " + this.selectedRow.sid;
    this.replayService.console("log", "openReplay1", msg);
    this.replayService.openReplay(this.selectedRow.sid, null/*session*/, null/*pages*/, null/**index */, this.selectedRow.pageinstance/**pageinstance */, false);
  }
  handleRowSelection($event) {
    this.selectedRow = $event.data;
    this.selectedRowIndex = $event.index;
    if (this.selectedRowIndex === undefined) {
      this.tableData.forEach((val, i) => {
        if (val === this.selectedRow) {
          this.selectedRowIndex = i;
          return true;

        }
      });
      this.selectedRowIndex = this.selectedRowIndex || 0;
    }
    this.stateService.set('page.selectedPageIdx', this.selectedRowIndex, true);

  }

  openNDSession(e: MouseEvent, data) {
    e.stopPropagation();
    var url = "";
    var pi = null;
    let flowpathID = "-1";
    if (this.selectedRowIndex != null) {
      var ele = document.createElement('a');
      pi = Number(data.pageinstance);
      pi = pi - 1;

      ele.href = data.url;
      url = ele.pathname;

      flowpathID = data.flowpathInstance;
    }
    let st = parseInt(data.navigationStartTime);
    let et = parseInt(data.navigationStartTime) + 300;
    st += this.nvconfigurations.cavEpochDiff;
    et += this.nvconfigurations.cavEpochDiff;


    this.ddrService.ndSessionDdr((st * 1000).toString(), (et * 1000).toString(), data.trnum + '', data.sid, flowpathID + '', pi + '', url);

  }
  openNF(e: MouseEvent, data) {
    e.stopPropagation();
    let st = parseInt(data.navigationStartTime);
    let et = parseInt(data.navigationStartTime) + 300;
    st += this.nvconfigurations.cavEpochDiff;
    et += this.nvconfigurations.cavEpochDiff;
    let ele = document.createElement('a');
    ele.href = data.url;
    let url = ele.pathname;
    this.ddrService.nfSessionDdr(data.pageinstance, "page", data.flowpathInstance, data.sid, url, st * 1000, et * 1000);
  }

  nvFunction(exportype: any) {
    let filterString = encodeURIComponent(JSON.stringify(ParsePageFilter.pageFilters.timeFilter));
    ParsePageFilter.pageFilters.pageCount = false;
    let timezoneflag = "Asia/Kolkata";
    let serviceUrl = "/netvision/rest/webapi/exportPagefilter?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    serviceUrl += "&filterCriteria=" + encodeURIComponent(JSON.stringify(ParsePageFilter.pageFilters));
    window.open(serviceUrl + "&filterString=" + filterString + "&exporttype=" + exportype + "&timezoneflag=" + timezoneflag);

  }


  updateOff(offset, limit) {

    // this.pagination = true;
    // set limit as per remaining counts. 
    ParsePageFilter.pageFilters.limit = (this.totalRecords - offset > limit) ? limit : (this.totalRecords - offset);
    this.sessionsOffset = offset / limit;
    ParsePageFilter.pageFilters.offset = offset;//(index) * parseInt(ParseSessionFilters.sessionFilters.limit+""); 
    this.getDataForTable();

  }


  loadPagination(e: LazyLoadEvent) {
    this.loading = true;
    if (Object.keys(e.filters).length == 0) {
      ParsePageFilter.pageFilters.offset = e.rows;
      ParsePageFilter.pageFilters.limit = e.first;

      this.paginationEvent = e;
      //this.getDataForTable(); 
      this.updateOff(e.first, e.rows)
      return;
    }

    // in case of filters, first may got reset. update that. 
    // update first. 
    if(this.sessionsOffset){
      this.first = this.sessionsOffset * ParsePageFilter.pageFilters.limit;
      this.session.first = this.first;
    }


    setTimeout(() => {
      // update offset only when first or rows are changed
      if (this.data.data) {
        this.groupDataTemp = this.data.data.filter((row) =>
          this.filterCol(row, e.filters)
        );
        this.groupDataTemp.sort(
          (a, b) => this.sortField(a, b, e.sortField) * e.sortOrder
        );
        this.tableData = [...this.groupDataTemp];
        this.loading = false;
      }
    }, 0);


  }

  filterCol(row, filter) {
    let isInFilter = false;
    let noFilter = true;
    for (var columnName in filter) {
      if (row[columnName] == null) {
        return;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      let filterMatchMode: String = filter[columnName].matchMode;
      if (filterMatchMode.includes('contain')) {
        if (columnName === "os") {
          rowValue = row[columnName].name.toString().toLowerCase();
          if(row.mobileOSVersion != '' && row.mobileOSVersion != null && row.mobileOSVersion != 'null')
            rowValue += "("+row.mobileOSVersion+ ")";
        }
        else if (columnName === "channel" || columnName === "browser" || columnName === "device") {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === "location") {
          let a = row;
          if ((a.location.state === undefined || a.location.state === ""))
            rowValue = a.location.country;
          if ((a.location.state !== undefined || a.location.state !== ""))
            rowValue = a.location.state + "," + a.location.country;
          else
            rowValue = a.location.state;
          rowValue = rowValue.toLowerCase();
        }
        if (rowValue.includes(filter[columnName].value.toLowerCase()))
          isInFilter = true
      } else if (
        filterMatchMode.includes('custom') &&
        rowValue.includes(filter[columnName].value)
      ) {
        isInFilter = true;
      }
    }
    if (noFilter) {
      isInFilter = true;
    }
    return isInFilter;
  }



  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;
    if (typeof rowA[field] === 'string') {
      return rowA[field].localeCompare(rowB[field]);
    }
    if (typeof rowA[field] === 'number') {
      if (rowA[field] > rowB[field]) return 1;
      else return -1;
    }
  }
  customSort(event) {
    this.changeSort(event);
  }

  /***Sorting */
  sclick = 0;
  iclick = 0;

  changeSort(event) {
    this.sclick = event.sortOrder;
    this.iclick = event.sortOrder;
    if (event.sortField === "formattedTime") {
      if (this.sclick == -1) {
        this.sclick = 1;
        this.data.data.sort(this.compare);
      }
      else {
        this.sclick = -1;
        this.data.data.sort(this.compare1);
      }
      this.tableData = [...this.data.data];
    }
    else if (event.sortField === "browser") {
      if (this.iclick == -1) {
        this.iclick = 1;
        this.data.data.sort(this.icompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.icompare2);
      }
      this.tableData = [...this.data.data];
    }
    else if (event.sortField === "os") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.oscompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.oscompare2);
      }
      this.tableData = [...this.data.data];
    }

    else if (event.sortField === "device") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.devicecompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.devicecompare2);
      }
      this.tableData = [...this.data.data];
    }
    else if (event.sortField === "channel") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.chanelcompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.channelcompare2);
      }
      this.tableData = [...this.data.data];
    }
    else if (event.sortField === "location") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.locationcompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.locationcompare2);
      }
      this.tableData = [...this.data.data];
    } else {
      this.data.data.sort(
        (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
      );
      this.tableData = [...this.data.data];
    }

  }

  icompare(a, b) {
    if ((a.browserVersion === undefined || a.browserVersion === "") && (b.browserVersion === undefined || b.browserVersion === ""))
      return (a.browser.name < b.browser.name) ? -1 : (a.browser.name > b.browser.name) ? 1 : 0;
    else
      return ((a.browser.name.localeCompare(b.browser.name)) || (a.browserVersion.localeCompare(b.browserVersion)));
  }

  icompare2(a, b) {
    if ((b.browserVersion === undefined || b.browserVersion === "") && (a.browserVersion === undefined || b.browserVersion === ""))
      return (b.browser.name < a.browser.name) ? -1 : (b.browser.name > a.browser.name) ? 1 : 0;
    else
      return ((b.browser.name.localeCompare(a.browser.name)) || (b.browserVersion.localeCompare(a.browserVersion)));
  }

  oscompare(a, b) {
    if ((a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null') && (b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null'))

      return ((a.os.name.localeCompare(b.os.name)) || (a.mobileOSVersion.localeCompare(b.mobileOSVersion)));
    if ((a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null') && (b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion != 'null'))
      return (a.os.name < b.os.name) ? -1 : (a.os.name > b.os.name) ? 1 : 0;
  }
  oscompare2(a, b) {
    if ((b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null') && (a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null'))

      return ((b.os.name.localeCompare(a.os.name)) || (b.mobileOSVersion.localeCompare(a.mobileOSVersion)));
    if ((b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion == 'null') && (a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null'))
      return (b.os.name < a.os.name) ? -1 : (b.os.name > a.os.name) ? 1 : 0;
  }


  chanelcompare(a, b) {
    return ((b.channel.name.localeCompare(a.channel.name)));

  }
  channelcompare2(a, b) {
    return ((b.channel.name.localeCompare(a.channel.name)));

  }

  devicecompare(a, b) {
    return (a.device.name.localeCompare(b.device.name));
  }

  devicecompare2(a, b) {
    return (b.device.name.localeCompare(a.device.name));
  }

  locationcompare(a, b) {
    if ((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === ""))
      return (a.location.country < b.location.country) ? -1 : (a.location.country > b.location.country) ? 1 : 0;
    if ((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === ""))
      return (a.location.country < b.location.state) ? -1 : (a.location.country > b.location.state) ? 1 : 0;
    if ((a.location.state !== undefined || a.location.state !== "") && (b.location.state === undefined || b.location.state === ""))
      return (a.location.state < b.location.country) ? -1 : (a.location.state > b.location.country) ? 1 : 0;
    else
      return (a.location.state < b.location.state) ? -1 : 1;
  }

  locationcompare2(a, b) {
    if ((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === ""))
      return (a.location.country < b.location.country) ? 1 : (a.location.country > b.location.country) ? -1 : 0;
    if ((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === ""))
      return (a.location.country < b.location.state) ? 1 : (a.location.country > b.location.state) ? -1 : 0;
    if ((a.location.state !== undefined || a.location.state !== "") && (b.location.state === undefined || b.location.state === ""))
      return (a.location.state < b.location.country) ? 1 : (a.location.state > b.location.country) ? -1 : 0;
    else
      return (a.location.state < b.location.state) ? 1 : -1;
  }

  compare(a, b) {

    if ((new Date(a.formattedTime).getTime()) < (new Date(b.formattedTime).getTime()))
      return -1;
    if ((new Date(a.formattedTime).getTime()) > (new Date(b.formattedTime).getTime()))
      return 1;
    return 0;
  }

  compare1(a, b) {
    if ((new Date(a.formattedTime).getTime()) < (new Date(b.formattedTime).getTime()))
      return 1;
    if ((new Date(a.formattedTime).getTime()) > (new Date(b.formattedTime).getTime()))
      return -1;
    return 0;
  }

  toggleMenuOptions(e: MouseEvent, menuOptions: Menu): void {
    this.hideAllMenus();
    menuOptions.toggle(e);
  }

  hideAllMenus(): void {
    document.getElementById('nothing').click();
  }
  view_flow_path() {
    this.router.navigate(['/path-analytics'], { queryParams: { mode: 'UserFlowReport' }, replaceUrl: true });
  }
  
  navigation_path() {
    this.router.navigate(['/path-analytics'], { queryParams: { mode: 'NavigationSummary' }, replaceUrl: true });
  }
  applySmartSearchFilter(force: boolean = false) {
    
    if (!force && (!this.smartSearchInput || !this.smartSearchInput.length)) {
      console.log('No Smart Filter selected. ');
      return;
    }
    this.smartSearchFilterApplied = true;
  
    ParsePageFilter.pageFilters.limit = 15;
    ParsePageFilter.pageFilters.offset =  0; 


    // parse smartsearch filters. 
    this.parseFilter();
  
    this.handleDataRequest(false);
  }
}


