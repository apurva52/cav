import { Component, Input, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { LazyLoadEvent, Menu, MenuItem, PaginatorModule, SelectItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { AUTOCOMPLETE_DATA, SESSION_TABLE } from './service/home-sessions.dummy';
import { AutoCompleteData, SessionsTable, SessionsTableHeaderColumn } from './service/home-sessions.model';
import { HomeSessionsLoadingState, HomeSessionsLoadingErrorState, HomeSessionsLoadedState } from './service/home-sessions.state';
import { MetadataService } from './common/service/metadata.service';
import { Metadata } from './common/interfaces/metadata';
import { HomeSessionService } from './service/home-sessions.service'
import { Store } from 'src/app/core/store/store';
import { Session } from './common/interfaces/session';
import { ParseSessionFilters } from './common/interfaces/parsesessionfilters';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment-timezone';
import { CHART_SAMPLE } from 'src/app/shared/chart/service/chart.dummy';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { ReplayService } from './play-sessions/service/replay.service';
import { DataManager } from './common/datamanager/datamanager';
import { SmartSearch } from './smartsearch';
import { SessionFilter } from './common/interfaces/sessionfilter';
import { TimeFilter } from './common/interfaces/timefilter';
import { SessionStateService } from './session-state.service';
import { NVAppConfigService } from './common/service/nvappconfig.service';
import { NvhttpService } from './common/service/nvhttp.service';
import { MessageService } from 'primeng/api';
import { DrillDownDDRService } from './common/service/drilldownddrservice.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { HttpClient } from '@angular/common/http';

const STRUGGLING_SESSIONS = 1;
const HEALTHY_SESSIONS = 2;
const ALL_SESSIONS = 0;

@Component({
  selector: 'app-home-sessions',
  templateUrl: './home-sessions.component.html',
  styleUrls: ['./home-sessions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class HomeSessionsComponent extends SmartSearch implements OnInit,AfterViewInit, OnDestroy {

  data: SessionsTable;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: SessionsTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: SessionsTableHeaderColumn[] = [];
  emptyTable: boolean;
  globalFilterFields: string[] = [];
  selectedRow: any;
  selectedRowIndex = 0;
  isEnabledColumnFilter: boolean;
  tooltipzindex = 100000;
  analyticsOptions: MenuItem[];
  linkOptions: MenuItem[];

  countLoading: boolean = false;
  selectedCars2: string[] = [];
  multiOptions: SelectItem[];

  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  reportitem: any[];
  groupData = []; // sessions
  groupDataTemp = [];

  metadata: Metadata;
  // to parse filters
  parsesessionfilter: ParseSessionFilters;
  activeSessions: boolean;
  replayFlag: boolean = true;
  nfUrl: string = "";
  ndUrl: string = "";
  trendLoaded: boolean = false;
  sessionsCount: number;
  sessionTrends: any;
  // ---
  sessionsView: number;
  sessionsOffset: number;
  sessionLoading = true;
  pagesLoading = true;
  fetchingCount = true;
  timer: any;
  filterCriteria: any;
  filterCriteriaList: any;
  sessionCompleted: any;
  particularPage: boolean;
  loaderflag: boolean = false;
  autoCommand: boolean = false;
  particularpageinstance: string;
  dur: number;
  tbuckets: number;
  today1: any;
  newDay: any;
  summaryflag: boolean;
  pflag: boolean;
  replayddrflag: boolean = false;
  channelType: any;
  funnelCount = -1;
  //to resize session trend.
  resize = false;
  defaultFlag: any = false;
  // to keep track of pagination
  pfirst: number = 0;
  // once the data is loaded (request is completed , we need to call pagination method again) so saving pagination events
  paginationEvent: LazyLoadEvent;
  pagination: boolean = false;
  first: number = 0;
  rows: number = 15;
  @ViewChild('session') table: Table;
  limit: number = 15;
  offset: number = 0;
  lastTimeFilter: TimeFilter = null;
  selectedexportsid: any = [];
  sessionTrendData: any;
  trendBuckets: SelectItem[];
  trendBucket: string = 'Auto';
  showSessionTrend: boolean;
  // sessionsTypes:SelectItem[];
  // sessionsTypes:SelectItem[];
  sessionMode:SelectItem[];
  selectedSessionMode: number = 0;
  sessionsTypes: boolean = true;

  hlTo = 0;
  hlFrom = 0;
  granularity = "Auto";
  nvconfigurations: any = null;

  private readonly localStorageKeyHomeSession = 'home-session';
  trendloading: boolean;
  currentRowData: any;
  currentEvent: any;
  eventOptions: MenuItem[];
  appFlag: boolean = false;
  impactFlag: boolean = false;
  impactData: any = [];
  displayFlag: boolean = false;
  cardData: any


  status: any;
  responseForScript = false;
  executeResponse = null;
  data4 = null;
  msg = null;
  rowdata: any;
  testcasename: any;
  testcase: boolean = false;
  filterhtml: string = '';
  filterTitle:string = '';
  filterItems: MenuItem[];
  
  gloablSessionMode = ALL_SESSIONS;

  constructor(http: HttpClient,private route: ActivatedRoute, private sessionService: HomeSessionService, private messageService: MessageService, private metadataService: MetadataService, private replayService: ReplayService, private router: Router, private stateService: SessionStateService, private nvAppConfigService: NVAppConfigService, private nvHttp: NvhttpService, private ddrService: DrillDownDDRService, private breadcrumb: BreadcrumbService) {

    super(http);

  //   this.sessionsTypes = [
  //     {label: 'Active', value: true},
  //     {label: 'Completed', value: false},

  // ];

  this.sessionMode = [
    {label: 'All', value: 0},
    {label: 'Struggling', value: 1},
    {label: 'Healthy', value: 2},
];

    this.filterItems = [
      { label: 'Page Filter', routerLink: '/page-filter', replaceUrl: true },
      { label: 'HTTPS Filter', routerLink: '/http-filter', replaceUrl: true },
      { label: 'JS Error Filter', routerLink: '/js-error-filter', replaceUrl: true },
      { label: 'Transaction Filter', routerLink: '/transaction-filter', replaceUrl: true },
      { label: 'App Crash Filter', routerLink: '/app-crash-filter', replaceUrl: true },
      { label: 'Feedback Filter', routerLink: '/feedback', replaceUrl: true }
    ];

    this.parsesessionfilter = new ParseSessionFilters();
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;

    });


    //this.sessionTrendData = { title: null, highchart: CHART_SAMPLE[4].highchart };

    this.metadataService.getMetadata().subscribe(metadata => {
      //init smart search.
      this.init(metadata, this.applySmartSearchFilter, this);
    });

    // set default value of activeSession
    this.activeSessions = false;
  }

  ngOnInit(): void {
    const me = this;

    localStorage.setItem(me.localStorageKeyHomeSession, location.href);
    me.selectedexportsid = [];
    me.downloadOptions = [
      {
        label: 'Export Session as PDF', command: () => {
          this.nvFunction('pdf');
        }
      },
      {
        label: 'Export Session as HTML', command: () => {
          this.nvFunction('html');
        }
      },
      {
        label: 'Export Session as XLS', command: () => {
          this.nvFunction('xls');
        }
      },
    ];

    me.linkOptions = [
      { label: 'Session Detail', command: (event: any) => { this.navigate_to_details(); } },
      { label: 'Play Session', command: (event: any) => { this.navigate_to_replay(); } },
    ],
      me.analyticsOptions = [
        { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
        { label: 'Page Performance Detail', routerLink: '/performance-details' },
        { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
        // { label: 'Ux Agent Setting', routerLink: '/ux-agent-setting' },
        { label: 'Form Analytics', routerLink: '/form-analytic-overall' },
        { label: 'Custom Metrics', routerLink: '/custom-metrics' },
        { label: 'Path Analytics', items: [{ label: "User Flow Report", command: (event: any) => { this.view_flow_path(); } }, { label: "Navigation Summary", command: (event: any) => { this.navigation_path(); } }] },
        { label: 'Marketing Analytics', routerLink: '/marketing-analytics' }
      ]

    me.eventOptions = [
      { label: 'Event Aggregate Report', command: (event: any) => { this.openEventscreen(event); } },
      { label: 'Impact of Event', command: (event: any) => { this.openImpactEvent(event); } },
    ];

    //handling for breadcrumb.
    if (Object.keys(me.route.snapshot.queryParams).length == 0) {
      // it is clicked from menu.
      // remove all and add from the begining.
      me.breadcrumb.removeAll();

      me.breadcrumb.add({label: 'Home', routerLink: '/home' } as MenuItem);

      me.breadcrumb.addNewBreadcrumb({label: 'Sessions', routerLink: '/home/home-sessions', queryParams: {'from': 'breadcrumb'} } as MenuItem);
    } else {
      me.breadcrumb.addNewBreadcrumb({label: 'Sessions', routerLink: '/home/home-sessions', queryParams: { 'from': 'breadcrumb' } } as MenuItem);
    }

    me.autoCompleteList = AUTOCOMPLETE_DATA;
    me.data = {...SESSION_TABLE};
    me.first = SESSION_TABLE.paginator.first;
    me.rows = SESSION_TABLE.paginator.rows;
    me.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      //me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    if (this.route.snapshot.queryParams.filterCriteria) {
      try {
        console.log('filtercriteria  presnet in the url');
        ParseSessionFilters.sessionFilters = JSON.parse(this.route.snapshot.queryParams.filterCriteria);
        // TODO: Review here again, can we get active in any case. 
        this.activeSessions = false;
        console.log('ParseSessionFilters :', ParseSessionFilters);
        me.loadSessionList(ParseSessionFilters.sessionFilters);
        return;
      } catch (e) {
        // TODO: error.
        return;
      }
    }
    // try to restore from state. 
    let oldFilter = this.stateService.get('sessions.filterCriteria');
    if (oldFilter != null) {
      ParseSessionFilters.sessionFilters = oldFilter;
      // set global filter. 
      if (ParseSessionFilters.sessionFilters.strugglingUserSessions) {
        this.gloablSessionMode = STRUGGLING_SESSIONS;
      } else if (ParseSessionFilters.sessionFilters.healthyUserSessions) {
        this.gloablSessionMode = HEALTHY_SESSIONS;
      } else {
        this.gloablSessionMode = ALL_SESSIONS;
      }

      // check if from funnnel.
      let from = this.route.snapshot.queryParams.from;
      if (from == 'funnel') {
        this.funnelCount = this.stateService.get('sessions.count', -1);
      }

      // Check if data also present then set that also.
      let oldData = this.stateService.get('sessions.data');
      if (from != 'funnel' && oldData && oldData.length > 0) {
        this.groupData = oldData;
        this.totalRecords = this.stateService.get('sessions.count', 0);
        this.first = this.stateService.get('sessions.offset', this.first);
        this.rows = this.stateService.get('sessions.rows', this.rows);
        this.limit = this.stateService.get('sessions.limit', this.limit);
        this.activeSessions = this.stateService.get('sessions.active', false);
        this.sessionTrends = this.stateService.get('sessions.trend', []);
        this.selectedRowIndex = this.stateService.get('sessions.selectedSessionIdx', 0);

        // check if counts are 0 then reload. 
        if (this.totalRecords == 0) {
          this.getSessionsCount();
        }
      }
      
    } else {
      ParseSessionFilters.sessionFilters.timeFilter.last = "1 Hour";
      ParseSessionFilters.sessionFilters.limit = 15;
      ParseSessionFilters.sessionFilters.offset = 0;
      this.activeSessions = false;
    }

    console.log("calling loadSessionList from : ngOnit ");
    // it will come here only if not restored from data saved in state. 

    this.pagination = false;
    // me.loadSessionList(ParseSessionFilters.sessionFilters);  

    me.route.queryParams.subscribe(params => { 
      console.log('sessions-detail, params change - ', params);
      
        
      const sid = params['sid'];
      
      

      if (!sid) {
        // If it is already loaded then return. 
        me.loadSessionList(ParseSessionFilters.sessionFilters);

      }
        
       else {
        // load data for given sid. 
        let sessionFilter = new SessionFilter();
        ParseSessionFilters.sessionFilters.nvSessionId = sid + '';
        // FIXME: handling for active/complete session detection.

      this.loadSessionList(ParseSessionFilters.sessionFilters);

    }
  
      })
     
    
  }


  @Input() get selectedColumns(): SessionsTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: SessionsTableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
  }

  view_flow_path() {
    this.router.navigate(['/path-analytics'], { queryParams: { mode: 'UserFlowReport' }, replaceUrl: true });
  }

  navigation_path() {
    this.router.navigate(['/path-analytics'], { queryParams: { mode: 'NavigationSummary' }, replaceUrl: true });
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

  filterField(row, filter) {
    let isInFilter = false;
    let noFilter = true;
    for (var columnName in filter) {
      if (row[columnName] == null) {
        return;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      let filterMatchMode: String = filter[columnName].matchMode;
      if (
        filterMatchMode.includes('contain') &&
        rowValue.includes(filter[columnName].value.toLowerCase())
      ) {
        isInFilter = true;
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

  loadSessionList(filter: SessionFilter) {
    // get the filtercriteria label
    this.filterhtml = this.sessionService.getFilterLabel(filter, this.metadata);
    this.filterTitle = this.filterhtml.replace(/<\/?b>/g, '');

    const me = this;

    this.applyGloablFilter();

    me.sessionService.LoadSessionListTableData(filter, this.activeSessions, false).subscribe(
      (state: Store.State) => {
        if (state instanceof HomeSessionsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomeSessionsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: HomeSessionsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: HomeSessionsLoadingState) {

    const me = this;
    me.empty = false;
    me.error = null;
    me.loading = true;
    
    if (this.pagination == false) {
      // reset totalCount too. 
      this.totalRecords = 0;
    }

    // save filter criteria in state. 
    this.stateService.setAll({
      'sessions.filterCriteria': ParseSessionFilters.sessionFilters,
      'sessions.rows': this.rows,
      'sessions.limit': this.limit,
      'sessions.active': this.activeSessions
    });

    this.stateService.set('sessions.data', null, true);
  }

  private onLoadingError(state: HomeSessionsLoadingErrorState) {

    const me = this;
    // if we are setting data = null; then filter options and other options are also disabled
    me.empty = false;
    me.loading = false;
    me.countLoading = false;
    me.error = state.error;
    me.error.msg = "Error while loading data.";

  }

  private onLoaded(state: HomeSessionsLoadedState) {
    const me = this;
    // handle for error case
    let d = state.data['error'];
    if(d !== "NA"){
      me.loading = false;
      me.countLoading = false;
      me.error = {};
      me.error['msg'] = d;
      return;
    }
    me.metadataService.getMetadata().subscribe(metadata => {
      me.metadata = metadata;
      let dataObj: any = state.data.data;
      if (dataObj == "NA")
        state.data.data = [];

      me.data.data = state.data.data.map(a => {
        let session: Session = new Session(a, metadata, state.isActive);

        DataManager.addSession(session.sid);
        return session;
      });

      if (me.pagination == false) {
        me.first = 0;
        if (me.data.data.length > 0) {
          if (me.funnelCount != -1) {
            if (me.data.data.length > me.funnelCount) {
              me.data.data.length = me.funnelCount;
            }
          }
          me.getSessionsCount();
        } else {
          me.totalRecords = 0;
          me.trendLoaded = false;
        }
      } else {
        let count = this.stateService.get('sessions.count', 0);
        if (count) {
          this.totalRecords = count;
        }
      }

      if (this.paginationEvent)
        this.customSort(this.paginationEvent);
      else
        me.groupData = me.data.data;

      // save data also. 
      this.stateService.set('sessions.data', me.groupData, true);
      this.stateService.set('sessions.offset', me.sessionsOffset * me.limit);

      me.empty = !me.data.data.length;
      // Don't reset totalRecord. It should be update only when new filter is applied. 
      //me.totalRecords = me.data.data.length;
      me.error = null;
      me.loading = false;
    })

  }
  applyFilter(filters: string) {

    this.parsesessionfilter.getSessionFilter(filters, this.metadata);

    // reset pagination flag. 
    this.pagination = false;

    // Note: if filter applied from filter sidebar, then disable activeSession.
    this.activeSessions = false;

    this.loadSessionList(ParseSessionFilters.sessionFilters);
  }

  navigate_to_details() {
    console.log("navigate_to_details called : ", this.selectedRow + ", activeSession - " + this.activeSessions);
    //this.router.navigate(['/sessions-details/session-page-details'], { queryParams: { selectedSessionIdx: this.selectedRowIndex, active: this.activeSessions, random: Math.random() }, replaceUrl: true });
    this.router.navigate(['/sessions-details/session-page-details'], { replaceUrl: true });
  }
  navigate_to_replay() {
    console.log("navigate_to_details called : ", this.selectedRow);
    //this.router.navigate(['/play-sessions'],{ queryParams: { selectedSession : JSON.stringify(this.selectedRow),random: Math.random()}, replaceUrl : true});
    let msg = "session with sid : " + this.selectedRow.sid;
    this.replayService.console("log", "openReplay1", msg);
    this.replayService.openReplay(this.selectedRow.sid, null/*session*/, null/*pages*/, 0/**index */, null/**pageinstance */, this.activeSessions);
  }
  /**TO DO  */
  openReplay(data) {

  }
  openReplay1(data) {

  }
  openScript(event, data) {
    event.stopPropagation();

    this.rowdata = data;
    this.responseForScript = false;
    this.testcase = true;
    this.msg = null;
    this.testcasename = data.entryPage + '_' + data.exitPage;
  }

   setSession(event, item) {
     event.stopPropagation();
     event.preventDefault();
     event.stopImmediatePropagation();
    //this.selectedexportsid.push(data);
    if (event.target.ariaChecked == "true") {
      this.selectedexportsid.push(item.sid);
    }
    else {
      for (var a = 0; a < this.selectedexportsid.length; a++) {
        if (this.selectedexportsid[a] == item.sid)
          this.selectedexportsid.splice(a, 1);
      }
    }
  }
  exportSessionDetail() {
    console.log(' selectedRow', this.selectedexportsid);
    console.log('ParseSessionFilters.sessionFilters.timeFilter : ', ParseSessionFilters.sessionFilters);
    let url = "/netvision/rest/webapi/exportsession?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    //let timezoneflag = sessionStorage.getItem('_nvtimezone');
    let timezoneflag = this.nvconfigurations.timeZone;
    let timeFilter = ParseSessionFilters.sessionFilters.timeFilter;
    let sid = this.selectedexportsid;
    url += "&sid=" + sid + "&timezoneflag=" + timezoneflag;
    console.log(' selectedRow url ', url);
    if (sid.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Please select Session From Table Row Checkbox', detail: '' });
      return;
    }
    window.open(url);
  }

  nvFunction(exportype: any) {
    console.log("exporttype is", exportype);
    //let filterString = SessionfiltercriteriaComponent.timeFilter;
    let filterString = encodeURIComponent(JSON.stringify(ParseSessionFilters.sessionFilters.timeFilter));
    //if (SessionfiltercriteriaComponent.filterhtml != "")

    //  filterString += ", " + SessionfiltercriteriaComponent.filterhtml.split("<strong>").join("").split("</strong>").join("");
    ParseSessionFilters.sessionFilters.sessionCount = false;
    let timezoneflag = this.nvconfigurations.timeZone;
    let serviceUrl = "/netvision/rest/webapi/exportnvsessions?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    //this.nvHttp.exportSessionspdf(ParseSessionFilters.sessionFilters, filterString, exportype);
    serviceUrl += "&filterCriteria=" + encodeURIComponent(JSON.stringify(ParseSessionFilters.sessionFilters));
    console.log("URL : ", serviceUrl + "&filterString=" + filterString + "&exporttype=" + exportype + "&timezoneflag=" + timezoneflag);
    window.open(serviceUrl + "&filterString=" + filterString + "&exporttype=" + exportype + "&timezoneflag=" + timezoneflag);

  }
  getSessionsCount() {
    this.trendLoaded = false; 
    this.countLoading = true;
    ParseSessionFilters.sessionFilters.countBucket = this.getBucketDuration();
    this.sessionService.LoadSessionListTableData(ParseSessionFilters.sessionFilters, this.activeSessions, true).subscribe(
      (state: Store.State) => {
        if (state instanceof HomeSessionsLoadingState) {
          //me.onLoading(state);
          return;
        }

        if (state instanceof HomeSessionsLoadedState) {
          if (this.activeSessions == false)
            this.prepareSessionTrendData(state.data, ParseSessionFilters.sessionFilters.countBucket);
          else {
            this.sessionsCount = state.data["count"];
            this.sessionTrends = [];
            this.totalRecords = this.sessionsCount;
          }

          this.stateService.setAll({
            'sessions.count': this.totalRecords,
            'sessions.trend': this.sessionTrends
          })
          this.fetchingCount = false; 
          this.countLoading = false;
          return; 
          
        }
      },
      (state: HomeSessionsLoadingErrorState) => {
        //me.onLoadingError(state);
      }
    );

  }

  getBucketDuration() {
    if (ParseSessionFilters.sessionFilters.timeFilter.last !== null && ParseSessionFilters.sessionFilters.timeFilter.last !== "") {
      let currentBucketSize = ParseSessionFilters.sessionFilters.timeFilter.last;
      if (currentBucketSize == "15 Minutes") {
        this.dur = 15 * 60;
      }
      else if (currentBucketSize == "1 Hour") {
        this.dur = 1 * 60 * 60;
      }
      else if (currentBucketSize == "4 Hours" || currentBucketSize == "4 Hour") {
        this.dur = 4 * 60 * 60;
      }
      else if (currentBucketSize == "12 Hours" || currentBucketSize == "12 Hour") {
        this.dur = 12 * 60 * 60;
      }
      else if (currentBucketSize == "1 Day") {
        this.dur = 1 * 24 * 60 * 60;
      }
      else if (currentBucketSize == "1 Week") {
        this.dur = 7 * 24 * 60 * 60;
      }
      else if (currentBucketSize == "1 Month") {
        //this.dur = 30 * 24 * 60 * 60;
        this.dur = this.calculateDate() * 24 * 60 * 60;

      }
      else if (currentBucketSize == "1 Year") {
        let year = new Date();
        let yyyy = year.getFullYear();
        if (yyyy % 4 == 0) {
          this.dur = 366 * 24 * 60 * 60;
        }
        else
          this.dur = 365 * 24 * 60 * 60;
      }
    }
    else {
      let st = (new Date(ParseSessionFilters.sessionFilters.timeFilter.startTime).getTime()) - (1388534400000);
      let et = (new Date(ParseSessionFilters.sessionFilters.timeFilter.endTime).getTime()) - (1388534400000);
      this.dur = et - st;
      this.dur = this.dur / 1000;
    }
    let bucketSize = this.getBucketSize();

    this.tbuckets = Math.ceil(this.dur / bucketSize);
    this.sessionTrends = [];
    for (let i = 0; i < this.tbuckets; i++) {
      this.sessionTrends.push({ "x": i, "y": 0 });
    }
    this.chooseBucket();
    return bucketSize;
  }

  calculateDate() {
    let arrMonth;
    let today = new Date();
    this.today1 = moment.tz(today, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    //let newDay;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    //to check leap year
    if (yyyy % 4 == 0) {
      arrMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    else
      arrMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //decreasing date by a month.
    if (mm == 1) {
      mm = 12;
      yyyy = yyyy - 1;
    }
    else
      mm = mm - 1;
    if (dd > arrMonth[mm - 1]) {
      dd = arrMonth[mm - 1];
    }
    this.newDay = mm + '/' + dd + '/' + yyyy;
    let monthDur = ((Date.parse(this.today1)) - (Date.parse(this.newDay))) / 86400000;
    return monthDur;
  }
  traverseOffset($event) {
    console.log("traverseOffset called with data : ", $event);
    let index = $event;

    let startIndex = 0;
    let endIndex = 0;


    this.hlFrom = this.sessionTrends[index].x - (this.getBucketSize() * 1000 / 2);
    this.hlTo = this.sessionTrends[index].x + (this.getBucketSize() * 1000 / 2);

    let skipSessions = 0;
    for (let i = 0; i < index; i++)
      skipSessions += this.sessionTrends[i].y;
    console.log("traverseOffset called skipSessions : ", skipSessions);
    //let offset = Math.floor((skipSessions + 1)/ParseSessionFilters.sessionFilters.limit);
    let offset = Math.floor((skipSessions));
    let l = parseInt(ParseSessionFilters.sessionFilters.limit + "");
    this.updateOffset(offset, l);
  }
  updateBucket() {
    this.sessionTrendData = null;
    this.trendloading = true;
    // update granularity and get session counts again.
    this.granularity = this.trendBucket;
    this.getSessionsCount();
  }

  // time string converted into seconds
  buckets = {
    "1 Minutes": 1 * 60,
    "5 Minutes": 5 * 60,
    "1 Hour": 3600,
    "1 Day": 24 * 3600
  }
  //to return bucket size.
  getBucketSize() {

    // no need to calculate for  other than auto granularity.
    if (this.granularity != "Auto") return this.buckets[this.granularity];
    let bucketSize;
    if (this.dur <= (15 * 60)) {       //1 min
      bucketSize = 1 * 60;
      return bucketSize;
    }
    else if (this.dur > (15 * 60) && this.dur <= (4 * 60 * 60)) {       //5 min
      bucketSize = 5 * 60;
      return bucketSize;
    }
    else if (this.dur > (4 * 60 * 60) && this.dur <= (1 * 24 * 60 * 60)) {       //1 hour
      bucketSize = 1 * 60 * 60;
      return bucketSize;
    }
    else if (this.dur > (1 * 24 * 60 * 60)) {
      //1 day
      bucketSize = 1 * 24 * 60 * 60;
      return bucketSize;
    }
  }

  prepareSessionTrendData(response, bucketSize) {
    try {
      if (response == null) return;
      if (response.data == null || response.data == undefined) return;
      let totalCounts = 0;
      let trends : any[] = response.data.trend;

      // starttime and endtime can be modified for some filters that is why updating this.sessionTrends to fit the complete data. 
      let maxIndex = trends.reduce((max, cur) => (max < cur.index ? cur.index: max), 0);

      for (let i = this.sessionTrends.length; i < maxIndex+1; i++) {
        this.sessionTrends[i] = {x: i, y: 0};
      }

      for (let j = 0; j < this.sessionTrends.length; j++) {
        //let ststamp = new Date (moment.utc(response.data.startTimeStamp).tz(sessionStorage.getItem('_nvtimezone')).format('HH:mm:ss MM/DD/YY')).valueOf();
        let ststamp = response.data.startTimeStamp;
        this.sessionTrends[j].x = (ststamp + ((j) * bucketSize) + this.nvconfigurations.cavEpochDiff) * 1000;

      }

      // get total counts for pagination first from the response.
      if (trends != null && trends != undefined) {
        for (let i = 0; i < trends.length; i++) {
          if (this.sessionTrends[trends[i].index] == undefined) continue;

          // count should not exeed funnelCount.
          if (this.funnelCount != -1 && ((totalCounts + trends[i].count) > this.funnelCount)) {
            let delta = this.funnelCount - totalCounts;
            totalCounts = this.funnelCount;

            trends[i].count = delta;
            
            this.sessionTrends[trends[i].index].y = trends[i].count;

            // TODO: It should not show those points which are discarded. 
            console.log('session search has more data than funnelCount, adjusting accordingly');
            break;
          }

          //Handling for DDR from Business Process
          totalCounts += trends[i].count;

          this.sessionTrends[trends[i].index].y = trends[i].count;
        }
      }


      this.sessionsCount = totalCounts;
      this.setOptions();
      this.totalRecords = this.sessionsCount;
    }
    catch (e) {
      console.log("Error: " + e);
    }
  }

  updateOffset(offset, limit) {
    ParseSessionFilters.sessionFilters.dataFlag = true;
    ParseSessionFilters.sessionFilters.sessionCount = false;
    this.pagination = true;
    // set limit as per remaining counts. 
    ParseSessionFilters.sessionFilters.limit = (this.totalRecords - offset > limit) ? limit: (this.totalRecords - offset);
    this.sessionsOffset = offset / limit;
    ParseSessionFilters.sessionFilters.offset = offset;//(index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.loadSessionList(ParseSessionFilters.sessionFilters);
  }

  onPageChange(e) {
    console.log("onPageChange called with : ", e);
  }

  toggleSessionTrend() {
    this.showSessionTrend = !this.showSessionTrend;
    this.setOptions();
  }

  applySmartSearchFilter(force: boolean = false) {
    console.log('applySmartSearchFilter called. smartSearchInput - ', this.smartSearchInput + ", activeSessions - " + this.activeSessions);

    if (!force && (!this.smartSearchInput || !this.smartSearchInput.length)) {
      console.log('No Smart Filter selected. ');
      return;
    }

    // parse smartsearch filters. 
    this.parseFilter(this.activeSessions);

    // reset pagination flag. 
    this.pagination = false;

    this.loadSessionList(ParseSessionFilters.sessionFilters);
  }

  handleSessionTypeChange($event) {
    console.log('activeSessions toggle changed - ' + this.activeSessions);

    // If active Session is true then reload the sessions. 
    if (this.activeSessions) {
      // TODO: review it. 
      // It should reset all the filters which are already set. 

      // save timeFilter as lastTimeFilter.
      if (ParseSessionFilters.sessionFilters && ParseSessionFilters.sessionFilters.timeFilter)
        this.lastTimeFilter = ParseSessionFilters.sessionFilters.timeFilter;

      ParseSessionFilters.sessionFilters = new SessionFilter();
      ParseSessionFilters.sessionFilters.timeFilter.last = "active";
      ParseSessionFilters.sessionFilters.sid = null;
      ParseSessionFilters.sessionFilters.offset = 0;
      ParseSessionFilters.sessionFilters.limit = this.limit;
    } else {
      ParseSessionFilters.sessionFilters = new SessionFilter();
      // Check if last timefilter is set then use that.
      if (this.lastTimeFilter && this.lastTimeFilter.last != 'active') {
        ParseSessionFilters.sessionFilters.timeFilter = this.lastTimeFilter;
      } else {
        ParseSessionFilters.sessionFilters.timeFilter.last = "1 Hour";
      }
      ParseSessionFilters.sessionFilters.limit = this.limit;
      ParseSessionFilters.sessionFilters.offset = 0;
    }

    this.pagination = false;

    this.loadSessionList(ParseSessionFilters.sessionFilters);
  }

  handleRowSelection($event) {
    console.log('handleRowSelection selectedRowIndex - ' + $event.index);
    this.selectedRow = $event.data;
    this.selectedRowIndex = $event.index;

    // TODO: find solution. 
    if (this.selectedRowIndex === undefined) {
      this.groupData.some((value, index) => {
        if (value == this.selectedRow) {
          this.selectedRowIndex = index;
          return true;
        }
      });

      this.selectedRowIndex = this.selectedRowIndex || 0;
    }

    console.log('handleRowSelection selectedRowIndex - ' + this.selectedRowIndex);
    // save and boradcast to other. 
    this.stateService.set('sessions.selectedSessionIdx', this.selectedRowIndex, true);
  }

  chooseBucket() {
    if (this.dur > (1 * 24 * 60 * 60)) {
      this.trendBuckets = [
        { label: '1 Hour', value: '1 Hour' },
        { label: '1 Day', value: '1 Day' },
        { label: 'Auto', value: 'Auto' }];
    }

    else if (this.dur > (1 * 60 * 60) && this.dur <= (1 * 24 * 60 * 60)) {
      this.trendBuckets = [
        { label: '1 Hour', value: '1 Hour' },
        { label: '1 Day', value: '1 Day' },
        { label: 'Auto', value: 'Auto' }];
    }

    else {

      this.trendBuckets = [
        { label: '1 Minutes', value: '1 Minutes' },
        { label: '5 Minutes', value: '5 Minutes' },
        { label: '1 Hour', value: '1 Hour' },
        { label: '1 Day', value: '1 Day' },
        { label: 'Auto', value: 'Auto' }
      ];
    }

  }

  setOptions() {

    let options = {
      plotOptions: {
        column: {
          stacking: 'normal'
        },
        series: {
          cursor: 'pointer',
          events: {
            click: (event) => {

              console.log(event.point.index);
              if (event.point.y > 0)
                this.traverseOffset(event.point.index);

            }
          }
        }

      },
      credits: { enabled: false },
      legend: { enabled: false },
      yAxis: {
        min: 0,
        title: {
          text: 'Session(s)'
        }
      },
      chart: {
        type: 'column',
        height: 300,
      },
      title: {
        text: ''
      },
      time: {
        timezone: sessionStorage.getItem('_nvtimezone')
      },
      xAxis: {
        showLastLabel: true,
        type: 'datetime',
        labels: { format: '{value:%e %b\'%y %H:%M:%S}' },
        plotBands: [{
          color: '#FCFFC5',
          from: this.hlFrom,
          to: this.hlTo,
          id: 'plotband1'
        }]
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
        shared: true
      },
      series: [{
        name: 'Sessions',
        data: this.sessionTrends
      }],
      exporting: {
        enabled: true,
        sourceWidth: 1200,
        sourceHeight: 500,
        title: 'Session Trend'
      }


    };
    console.log('options : ', options);
    this.sessionTrendData = { title: null, highchart: options };
    this.trendloading = false;
    this.trendLoaded = true;
  }

  ngOnDestroy(): void {
    this.stateService.set('prevRoute', 'home-session');
  }

  openEventscreen(item) {
    console.log("openEventScreen called with  -- item -- ", item);
    console.log("this.currentEvent : ", this.currentEvent, " -- row -- ", this.currentRowData);
    if (this.activeSessions == true)
      return;
    //this.router.navigate(['/session-event'],{ queryParams: { last: timeFilter.last, eventname: this.currentEvent }} );

    let timeFilter = ParseSessionFilters.sessionFilters.timeFilter;

    this.router.navigate(['/session-event'], { queryParams: { startDateTime: timeFilter.startTime, endDateTime: timeFilter.endTime, last: timeFilter.last, eventname: this.currentEvent, eventFlag: "true" } });

  }

  openImpactEvent(item) {
    console.log("openImpactEvent called with  -- item -- ", this.currentRowData.channel);
    this.appFlag = true;
    this.impactFlag = true;
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    var yesterdayStr = moment.tz(dateObj, sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
    var st = yesterdayStr + " 00:00:00";
    var et = yesterdayStr + " 23:59:59";
    let st_utc = moment.tz(new Date(st), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    let et_utc = moment.tz(new Date(et), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    this.nvHttp.getEventImpactInfo("", st_utc, et_utc, this.currentRowData.channel.name, this.currentEvent).subscribe((res: Response) => {
      this.appFlag = false;
      console.log("response : ", res);
      this.cardData = res;
      this.displayFlag = true;
    }, err => {
      this.appFlag = false;
      console.log("error occred : ", err);
    })
    this.impactData = [];
    console.log("eventName ", this.currentEvent);
    this.impactData.push({ event: this.currentEvent });
    this.impactData.push({ last: "" });
    this.impactData.push({ startDateTime: st });
    this.impactData.push({ endDateTime: et });
    this.impactData.push({ channel: this.currentRowData.channel });
    console.log("after this.impactData ", this.impactData);
    console.log("impactFlag ", this.impactFlag);
  }
  changeFlagValue(ev) {
    console.log("changeFlagValue ", ev);
    this.impactFlag = ev;
  }


  onClickMenu(rowData: any, name, ev:MouseEvent, eventMenu:Menu) {
    console.log("setting event name as : ", name, " on clicking menu ");
    ev.stopPropagation();
    this.currentRowData = rowData;
    this.currentEvent = name;
    // ISSUE: Event Menu not hiding on single click
    this.hideAllMenus();
    this.hideAllMenus();
    eventMenu.toggle(ev);

  }
  Reload() {
    this.loadSessionList(ParseSessionFilters.sessionFilters);
  }

  createScript(executeflag) {
    executeflag = executeflag || false;
    this.data4 = "  Creating Script...";
    this.msg = null;
    this.responseForScript = true;
    //this.responseForScriptflag = true;
    if (this.testcasename.length > 64) {
      this.messageService.add({ severity: 'warn', summary: 'TestCaseName limit exceeded', detail: '' });
      return true;
    }
    //this.responseForScript = [];
    this.nvHttp.getTestScript(this.rowdata.sid, this.testcasename, 'createscript').subscribe((state: Store.State) => {
      let response = state['data'];
      //this.responseForScript = response;
      if (response !== null && response !== "" && response !== undefined) {
        if (response["status"] === 'success') {
          if (executeflag == false) {
            this.responseForScript = false;
            console.log("executeflag == false");
            this.messageService.add({ severity: 'success', summary: response["msg"], detail: '' });
            window.open(response["redirectUrl"], "_self");
            this.msg = "Script created successfully";
          }
          else {
            console.log("executeflag == true");
            this.executeScript(response["msg"]);
          }
        }

        else {
          this.messageService.add({ severity: 'error', summary: response["ErrorMsg"], detail: '' });
          // this.responseForScript = null;
          this.msg = "Error in creating script";
        }
      }

    });
  }



  executeScript(path) {
    console.log("responseForScript==" + JSON.stringify(this.responseForScript));
    //if(this.responseForScript != null)
    {
      this.executeResponse = [];
      this.msg = null;
      this.data4 = "  Executing Script...";
      //if(this.responseForScript.status === 'success')
      {
        this.nvHttp.getTestScript(path, this.testcasename, 'executescript').subscribe((state: Store.State) => {
          let response = state['data']
          console.log("executeScript response==" + response);
          this.executeResponse = response;
          if (response !== null && response !== "" && response !== undefined) {
            if (response["status"] === 'success') {
              this.testcase = false;
              this.messageService.add({ severity: 'success', summary: 'Netstorm started successfully', detail: '' });
              let newWindow = window.open(response["executeScriptUrl"]);
              if (newWindow)
                newWindow.document.title = "script";
              this.msg = null;
              //SessionlistlargeComponent.setShowScript(false);
              this.executeResponse = null;
            }
            else {
              this.messageService.add({ severity: 'error', summary: response["errorStr"], detail: '' });
              this.responseForScript = false;
              this.testcase = false;
              this.msg = null;
              this.executeResponse = null;
            }
          }

        });
      }
    }
  }
  createAndExecute() {
    this.createScript(true);
  }

  openNDSession(e, data) {
    e.stopPropagation();
    var url = "";
    var pi = null;
    let st = data.startTime;
    let et = data.endTime;
    if (this.activeSessions) {
      st += this.nvconfigurations.cavEpochDiff;
      et += this.nvconfigurations.cavEpochDiff;
    }
    this.ddrService.ndSessionDdr((st * 1000).toString(), (et * 1000).toString(), data.trnum + '', data.sid, data.flowpathInstances, undefined, undefined);

  }
  openNF(e, data) {
    e.stopPropagation();

    let st = data.startTime;
    let et = data.endTime;
    if (this.activeSessions) {
      st += this.nvconfigurations.cavEpochDiff;
      et += this.nvconfigurations.cavEpochDiff;
    }
    this.ddrService.nfSessionDdr(null, "session", data.flowpathInstances, data.sid, null, (st * 1000), (et * 1000));
  }

  loadPagination(event: LazyLoadEvent) {
    console.log("loadPagination called, event - ", event);
  
    if (!this.totalRecords) return;

    this.loading = true;
    if(Object.keys(event.filters).length == 0){
      this.updateOffset(event.first, event.rows);
      this.paginationEvent = event;
      return;
    }

    // in case of filters, first may got reset. update that. 
    // update first. 
    this.first = this.sessionsOffset * this.limit;
    this.table.first = this.first;

    setTimeout(() => {
       // update offset only when first or rows are changed
      if (this.data.data) {
        this.groupDataTemp = this.data.data.filter((row) =>
          this.filterCol(row, event.filters)
        );
        this.groupDataTemp.sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
        );
        this.groupData = [...this.groupDataTemp];
        console.log("Data", this.groupData)
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
      if ( filterMatchMode.includes('contain') )
      {
        if(columnName === "browser")
        {
          rowValue = row[columnName].name.toString().toLowerCase();
          // if browser is  iphone app
          if(row.AndroidBrowserFlag == false && row.browser.id != "21"){
           if((row.browserVersion != "" && row.browserVersion != null && row.browserVersion != "null" ))
             rowValue += "("+row.browserVersion+ ")";
          }else if(row.AndroidBrowserFlag == true && row.browser.id != "21"){
            rowValue = "AndroidApp";
          }
        }
        else if(columnName === "os")
        {
          rowValue = row[columnName].name.toString().toLowerCase();
          if(row.osVersion != "" && row.osVersion != null && row.osVersion != "null" )
          rowValue += "("+row.osVersion+ ")";
        }
        else if(columnName=== "store")
        {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if(columnName === "terminal")
        {
          rowValue = row[columnName].id.toString().toLowerCase();
        }
        else if(columnName === "deviceType")
        {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if(columnName === "location")
        {
          let a = row;
          if((a.location.state === undefined || a.location.state === "") )
             rowValue = a.location.country;
          if((a.location.state !== undefined || a.location.state !== "" ))
             rowValue = a.location.state +","+ a.location.country;
          else
            rowValue = a.location.state; 
          rowValue = rowValue.toLowerCase();
        }
        if(rowValue.includes(filter[columnName].value.toLowerCase()))
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

  customSort(event){
    if (!event) return;
    this.changeSort(event);
  }

  /***Sorting */
  sclick = 0;
  iclick = 0;

changeSort(event) {
  this.sclick = event.sortOrder;
  this.iclick = event.sortOrder;
  if(event.sortField === "formattedStartTime"){
    if(this.sclick == -1)
    {
      this.sclick = 1;
      this.data.data.sort(this.compare);
    }
    else 
    {
      this.sclick = -1;
      this.data.data.sort(this.compare1);
    }
    this.groupData = [...this.data.data];
  }
  else if(event.sortField === "browser")
  {
   if(this.iclick == -1)
   {
    this.iclick = 1;
    this.data.data.sort(this.icompare);
   }
   else 
   {
     this.iclick = -1;
     this.data.data.sort(this.icompare2);
   }
    this.groupData = [...this.data.data];
  }
  else if(event.sortField === "os")
  {
   if(this.iclick === -1)
   {
    this.iclick = 1;
    this.data.data.sort(this.oscompare);
   }
   else 
   {
     this.iclick = -1;
     this.data.data.sort(this.oscompare2);
   }
    this.groupData = [...this.data.data];
  }
  else if(event.sortField === "store")
  {
    if(this.iclick === -1)
    {
     this.iclick = 1;
     this.data.data.sort(this.storecompare);
    }
    else
    {
      this.iclick = -1;
      this.data.data.sort(this.storecompare1);
    }
     this.groupData = [...this.data.data];
   }
  else if(event.sortField === "terminal")
   {
    if(this.iclick === -1)
    {
     this.iclick = 1;
     this.data.data.sort(this.terminalcompare);
    }
    else
    {
      this.iclick = -1;
      this.data.data.sort(this.terminalcompare1);
    }
     this.groupData = [...this.data.data];
   }
  else if(event.sortField === "deviceType")
  {
   if(this.iclick === -1)
   {
    this.iclick = 1;
    this.data.data.sort(this.devicecompare);
   }
   else 
   {
     this.iclick = -1;
     this.data.data.sort(this.devicecompare2);
   }
    this.groupData = [...this.data.data];
  }
  else if(event.sortField === "location")
  {
   if(this.iclick === -1)
   {
    this.iclick = 1;
    this.data.data.sort(this.locationcompare);
   }
   else 
   {
     this.iclick = -1;
     this.data.data.sort(this.locationcompare2);
   }
    this.groupData = [...this.data.data];
  }else{
    this.data.data.sort(
      (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
    );
    this.groupData = [...this.data.data];
  }

 }

 icompare(a,b)
 {
    return ((a.browser.name.localeCompare(b.browser.name)) || (a.browserVersion.localeCompare(b.browserVersion)));
 }

 icompare2(a,b)
 {
    return ((b.browser.name.localeCompare(a.browser.name)) || (b.browserVersion.localeCompare(a.browserVersion)));
 }
 oscompare(a,b)
 {
    return ((a.os.name.localeCompare(b.os.name)) || (a.osVersion.localeCompare(b.osVersion))) ;
 }

 oscompare2(a,b)
 {
   return ((b.os.name.localeCompare(a.os.name)) || (b.osVersion.localeCompare(a.osVersion)));
 }
 
 storecompare(a,b)
  {
   if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
     return -1;
   if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
     return 1;
   return 0;
  }
 
  storecompare1(a,b)
  {
   if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
     return 1;
   if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
     return -1;
   return 0;
  }
  
  terminalcompare(a,b)
  {
   if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
     return -1;
   if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
     return 1;
   return 0;
  }
 
  terminalcompare1(a,b)
  {
   if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
     return 1;
   if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
     return -1;
   return 0;
  }
  devicecompare(a,b)
 {
   console.log(a,b);
  return (a.deviceType.name.localeCompare(b.deviceType.name)) ;
 }

 devicecompare2(a,b)
 {
   return (b.deviceType.name.localeCompare(a.deviceType.name));
 }
 
 locationcompare(a,b)
 {
  if((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === "") )
    return  (a.location.country < b.location.country) ? -1 : (a.location.country > b.location.country) ? 1 : 0;
  if((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === "" ))
      return (a.location.country < b.location.state) ? -1 : (a.location.country > b.location.state) ? 1 : 0;
  if((a.location.state !== undefined || a.location.state !== "" ) && ( b.location.state === undefined || b.location.state === "" ) )
    return  (a.location.state < b.location.country) ? -1 : (a.location.state > b.location.country) ? 1 : 0;
  else
      return (a.location.state < b.location.state) ? -1 : 1;
 }

 locationcompare2(a,b)
 {
  if((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === ""))
    return  (a.location.country < b.location.country) ? 1 : (a.location.country > b.location.country) ? -1 : 0;
  if((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === "" ))
      return (a.location.country < b.location.state) ? 1 : (a.location.country > b.location.state) ? -1 : 0;
  if((a.location.state !== undefined || a.location.state !== "" ) && ( b.location.state === undefined || b.location.state === "" ))
    return  (a.location.state < b.location.country) ? 1 : (a.location.state > b.location.country) ? -1 : 0; 
  else
      return (a.location.state < b.location.state) ? 1 : -1;
 }
 
 compare(a,b) {

  if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
    return -1;
  if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
    return 1;
  return 0;
}
 
 compare1(a,b){ 
   if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
    return 1;
  if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
    return -1;
  return 0;
  }

  applyGloablFilter() {
    // update sessionFilter accordingly. 
    if (this.gloablSessionMode == ALL_SESSIONS) {
      // TODO: In this case we should check 
      ParseSessionFilters.sessionFilters.healthyUserSessions = false;
      ParseSessionFilters.sessionFilters.strugglingUserSessions = false;
    } else if (this.gloablSessionMode == STRUGGLING_SESSIONS) {
      ParseSessionFilters.sessionFilters.healthyUserSessions = false;
      ParseSessionFilters.sessionFilters.strugglingUserSessions = true;
    } else if (this.gloablSessionMode == HEALTHY_SESSIONS) {
      ParseSessionFilters.sessionFilters.healthyUserSessions = true;
      ParseSessionFilters.sessionFilters.strugglingUserSessions = false;
    }
  }

  changeGloablSessionMode(mode: number) {
    if (this.gloablSessionMode != mode) {
      this.gloablSessionMode = mode;

      // Note: gloabl filters will be applied in loadSessionList. 
      // reload the session list.   
      // reset pagination flag. 
      this.pagination = false;

      this.loadSessionList(ParseSessionFilters.sessionFilters);
    }
  }

  toggleMenuOptions(e: MouseEvent, menuOptions: Menu): void {
    // hide all open menus
    this.hideAllMenus();
    menuOptions.toggle(e);
  }

  hideAllMenus(): void{
    document.getElementById('nothing').click();
  }  

  ngAfterViewInit():void{
    const el = document.querySelector('.ui-table-scrollable-body');
    if(el){
      el.addEventListener('scroll', (event) => {
        document.getElementById('nothing').click();
      })
    }
  }


}



