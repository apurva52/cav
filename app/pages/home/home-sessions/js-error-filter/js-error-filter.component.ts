import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent, MenuItem, MessageService, SelectItem, Table } from 'primeng';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { JSErrorData } from '../common/interfaces/jserrordata';
import { ParsePagePerformanceFilters } from '../common/interfaces/parsepageperformancefilter';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { SessionStateService } from '../session-state.service';
import { JSERROR_AGG_FILTER_TABLE } from './service/js-error.dummy';
import { JsErrorAggFilterTable, JsErrorAggFilterTableHeaderColumn } from './service/js-error.model';
import { JsErrorService } from './service/js-error.service';
import { JsErrorAggListLoadedState, JsErrorAggListLoadingErrorState, JsErrorAggListLoadingState } from './service/js-error.state';
import { SmartSearch } from './smartsearch';
import { TimeFilter } from '../common/interfaces/timefilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../common/util/export-util';


@Component({
  selector: 'app-js-error-filter',
  templateUrl: './js-error-filter.component.html',
  styleUrls: ['./js-error-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class JsErrorFilterComponent extends SmartSearch implements OnInit {
  @ViewChild('session') session: Table;
  data: JsErrorAggFilterTable;
  error: AppError;
  empty: boolean;
  loading: boolean = false;
  ischecked: boolean = false;
  key: string;
  cols: JsErrorAggFilterTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: JsErrorAggFilterTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  analyticsOptions: MenuItem[];
  linkOptions: MenuItem[];

  selectedCars2: string[] = [];
  multiOptions: SelectItem[];
  nvAppConfigService: NVAppConfigService;
  nvconfigurations: any;

  groupDataTemp = [];
  paginationEvent: any;
  filterCriteria: any = '';
  groupData = [];
  first: number = 0;
  rows: number = 15;
  limit: number = 15;
  offset: number = 0;
  parsepagefilter: ParsePagePerformanceFilters;
  breadcrumb: BreadcrumbService;
  countLoading: boolean = false;
  sessionsOffset: number;
  filterLabel: string = '';

  /***Sorting */
  sclick = 0;
  iclick = 0;

  constructor(private jserrorService: JsErrorService, private metadataService: MetadataService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, breadcrumb: BreadcrumbService, private stateService: SessionStateService) {

    super();

    this.breadcrumb = breadcrumb;
    this.metadataService.getMetadata().subscribe(metadata => {
      // init smart search.
      this.init(metadata, this.applySmartSearchFilter, this);
    });
  }

  @Input() get selectedColumns(): JsErrorAggFilterTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: JsErrorAggFilterTableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  ngOnInit(): void {
    const me = this;
    me.data = JSERROR_AGG_FILTER_TABLE;

    me.getInitData();
    me.getDataForTable(true);

    // set breadcrumb.
    if (Object.keys(this.route.snapshot.queryParams).length == 0) {
      // clear all breadcrumb.
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
      this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    }
    this.breadcrumb.add({ label: 'Aggregate JSErrors', routerLink: '/js-error-filter', queryParams: this.route.snapshot.queryParams } as MenuItem);
    me.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];

    me.multiOptions = [
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Ford', value: 'Ford' },
    ],
      me.linkOptions = [
        { label: 'Sessions', routerLink: '/sessions-details' }
      ],
      me.analyticsOptions = [
        { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
        { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
        { label: 'Ux Agent Setting', routerLink: '/ux-agent-setting' },
        { label: 'Custom Metrics' },
        { label: 'Path Analytics', routerLink: '/path-analytics' },
        { label: 'Form Analytics' },
        { label: 'Marketing Analytics', routerLink: '/marketing-analytics' }
      ]


    me.first = JSERROR_AGG_FILTER_TABLE.paginator.first;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
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
  /*  loadPagination(event: LazyLoadEvent) {
     this.loading = true;
     if (Object.keys(e.filters).length == 0) {
     this.parsepagefilter.pagePerformanceFilters.limit = event.rows;
     this.parsepagefilter.pagePerformanceFilters.offset = event.first;

     console.log('loadPagination');
     this.paginationEvent = e;
       this.getDataForTable(false);
       return;



   }*/
  getDataForTable(count: boolean) {
    const me = this;
    this.parsepagefilter.pagePerformanceFilters.count = false;
    // cloning filter object
    const f = { ...this.parsepagefilter.pagePerformanceFilters };
    console.log('passing filters : ', this.parsepagefilter.pagePerformanceFilters);
    const filter = JSON.stringify(this.parsepagefilter.pagePerformanceFilters);
    // save  in state.
    this.stateService.setAll({
      'aggjserror.filters': f,
      'aggjserror.limit': f.limit,
      'aggjserror.offset': f.offset,
      'aggjserror.data': []
    });

    me.jserrorService.LoadJsErrorAggListTableData(filter).subscribe(
      (state: Store.State) => {

        if (state instanceof JsErrorAggListLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof JsErrorAggListLoadedState) {
          me.onLoaded(state, count);
          return;
        }
        if (state instanceof JsErrorAggListLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }
      },
      (state: JsErrorAggListLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  private onLoading(state: JsErrorAggListLoadingState) {
    const me = this;
    me.error = state.error;
    me.loading = true; // state.loading;
  }

  private onLoadingError(state: JsErrorAggListLoadingErrorState) {
    console.log('state1', state);
    const me = this;
    me.loading = state.loading;
    me.error = state.error;
    // me.error.msg = "Error while loading data.";
  }

  private onLoaded(state: JsErrorAggListLoadedState, count: boolean) {
    const me = this;
    me.data = JSERROR_AGG_FILTER_TABLE;
    me.loading = state.loading;
    console.log('onloaded  : ', state.data);
    const response = state.data;
    // either response is null or response data is empty array
    if ((response == null || response == undefined) || (response && (response.data == 'NA' || response.data.length == 0))) {
      state.data.data = [];
    }
    // checking for error
    const reserror = state.data['error'];
    if (reserror !== '' && reserror !== undefined && reserror !== 'NA') {
      console.log('error in data : ', reserror);
      me.error = {};
      me.error['msg'] = reserror;
      return;
      //this.messageService.add({ severity: 'info', summary: reserror, detail: '' });
      //state.data.data = [];
      // me.error.msg = state.data['error'];
    }
    // in case of valid data
    me.metadataService.getMetadata().subscribe(metadata => {
      me.data.data = state.data.data.map(a => {
        return new JSErrorData(a, metadata);
      });
      if (count && me.data.data.length >= this.parsepagefilter.pagePerformanceFilters.limit) {
        me.getXhrDataCount();
      }
      else {
        if (count) {
          me.totalRecords = me.data.data.length;
        }
        this.customSort(this.paginationEvent);
      }
      // save  in state.
      this.stateService.set('aggjserror.data', me.data.data, true);
      me.groupData = me.data.data;
    });
  }

  getXhrDataCount() {
    this.countLoading = true;
    const me = this;
    this.parsepagefilter.pagePerformanceFilters.count = true;
    const filter = JSON.stringify(this.parsepagefilter.pagePerformanceFilters);
    me.jserrorService.LoadJsErrorAggListTableData(filter).subscribe(
      (state: Store.State) => {


        if (state instanceof JsErrorAggListLoadedState) {
          me.totalRecords = state.data['count'];
          me.countLoading = false;
          // reset
          this.parsepagefilter.pagePerformanceFilters.count = false;
          return;
        }

      },
      () => {
        console.log('Error fetching count data');

      }
    );
  }
  applyFilter(filters: any) {
    console.log('applyfilter of filter called : ', filters);

    this.setFilterLabel(filters.showFilter);

    this.parsepagefilter = filters;
    this.parsepagefilter.pagePerformanceFilters.limit = 15;
    this.parsepagefilter.pagePerformanceFilters.offset = 0;
    this.getDataForTable(true);
  }

  /** This method is used to show the applied filters */
  setFilterLabel(f: any): void {
    this.filterLabel = '';

    if (f.timeFilter.last !== '') {
      this.filterLabel += 'Last: ' + f.timeFilter.last;
    } else {
      this.filterLabel += 'From: ' + f.timeFilter.startTime;
      this.filterLabel += ', To: ' + f.timeFilter.endTime;
    }

    if (f.bucket != null) {
      this.filterLabel += ', Bucket: ' + f.bucket;
    }

    if (f.entryPage != null && f.entryPage.length) {
      const tmp = f.entryPage.map(page => this.metadata.pageNameMap.get(page).name);
      this.filterLabel += ', Page: ' + tmp.join(',');
    }

    if (f.channel != null && f.channel.length) {
      const tmp = f.channel.map(channel => this.metadata.channelMap.get(channel).name);
      this.filterLabel += ', Channel: ' + tmp.join(',');
    }

    if (f.userSegment != null && f.userSegment.length) {
      const tmp = f.userSegment.map(segment => this.metadata.userSegmentMap.get(segment).name);
      this.filterLabel += ', User Segment: ' + tmp.join(',');
    }

    if (f.groups != null && f.groups.length) {
      this.filterLabel += ', Group By: ' + f.groups.join(',');
    }

    if (f.metric1 !== '') {
      this.filterLabel += ', Error Message: ' + f.metric1;
    }

    if (f.granular1 !== '') {
      this.filterLabel += ', File Name: ' + f.granular1;
    }

    if (f.device != null && f.device.length) {
      this.filterLabel += ', Device: ' + f.device.join(',');
    }

    if (f.platform != null && f.platform.length) {
      this.filterLabel += ', OS: ' + f.platform.join(',');
    }

    if (f.browser != null && f.browser.length) {
      const tmp = f.browser.map(browser => this.metadata.osMap.get(browser).name);
      this.filterLabel += ', Browsers: ' + tmp.join(',');
    }

    if ((f.Includepage != null && f.Includepage.length) ||
      (f.IncludeLocation != null && f.IncludeLocation.length) ||
      (f.IncludeBrowser != null && f.IncludeBrowser.length) ||
      (f.IncludeOS != null && f.IncludeOS.length)) {

      const includes = [];

      if (f.IncludeLocation != null && f.IncludeLocation.length) {
        const locations = f.IncludeLocation.map(location => this.metadata.locationMap.get(location));
        const tmp = locations.map(location => location.state + '(' + location.country + ')');
        includes.push('Location: ' + tmp.join(','));
      }

      if (f.Includepage != null && f.Includepage.length) {
        const tmp = f.Includepage.map(page => this.metadata.pageNameMap.get(page).name);
        includes.push('Page: ' + tmp.join(','));
      }

      if (f.IncludeOS != null && f.IncludeOS.length) {
        includes.push('OS: ' + f.IncludeOS.join(','));
      }

      if (f.IncludeBrowser != null && f.IncludeBrowser.length) {
        const tmp = f.IncludeBrowser.map(browser => this.metadata.browserMap.get(browser).name);
        includes.push('Browser: ' + tmp.join(','));
      }

      this.filterLabel += 'Include: [' + includes.join(', ') + ']';

    }

    if ((f.ExcludeBrowser != null && f.ExcludeBrowser.length) ||
      (f.ExcludeLocation != null && f.ExcludeLocation) ||
      (f.ExcludeOS != null && f.ExcludeOS.length) ||
      (f.ExcludePage != null && f.ExcludePage.length)) {

      const excludes = [];

      if (f.ExcludeLocation != null && f.ExcludeLocation) {
        const locations = f.ExcludeLocation.map(location => this.metadata.locationMap.get(location));
        const tmp = locations.map(location => location.state + '(' + location.country + ')');
        excludes.push('Location: ' + tmp.join(','));
      }

      if (f.ExcludePage != null && f.ExcludePage.length) {
        const tmp = f.ExcludePage.map(page => this.metadata.pageNameMap.get(page).name);
        excludes.push('Page: ' + tmp.join(','));
      }

      if (f.ExcludeBrowser != null && f.ExcludeBrowser.length) {
        const tmp = f.ExcludeBrowser.map(browser => this.metadata.browserMap.get(browser).name);
        excludes.push('Browser: ' + tmp.join(','));
      }

      if (f.ExcludeOS != null && f.ExcludeOS.length) {
        excludes.push('OS: ' + f.ExcludeOS.join(','));
      }

      this.filterLabel += 'Exclude: [' + excludes.join(', ') + ']';
    }

  }

  applySmartSearchFilter(force: boolean = false) {
    console.log('applySmartSearchFilter called. smartSearchInput - ', this.smartSearchInput);

    if (!force && (!this.smartSearchInput || !this.smartSearchInput.length)) {
      console.log('No Smart Filter selected. ');
      return;
    }

    // parse smartsearch filters.
    this.parseFilter();
    this.parsepagefilter.pagePerformanceFilters.limit = 15;
    console.log('parsepage filter :', this.parsepagefilter);
    this.parsepagefilter.pagePerformanceFilters.offset = 0;

    // reset pagination flag.
    // this.pagination = false;
    // this.getInitData();

    this.getDataForTable(true);
  }
  /*applySmartSearchFilter(force: boolean = false) {
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
 }*/
  /*
   gettingJsErrorCountDetail(filename,line,column,page,errMsg,browsers,platform,browserversion,platformversion)
   {
     let osname = null;
     let osversion = 'null';
     let osmap  ;
     let osdata = [];
     let detailfilter = new jsErrorDetailFilter();
     detailfilter['errorMessage'] = errMsg;
     detailfilter['columns'] = column;


     if(browsers !== "All")
       detailfilter['browsers'] = browsers;
     if(platform !== "All" && platform !== undefined)
     {
     osname = platform;
     if(platformversion !== "All")
     {
      osversion = platformversion;
     }
     osmap = {name : osname, version : osversion};
     osdata.push(osmap);
     detailfilter['os'] = osdata;
     }
     if(browserversion !== "All")
     detailfilter['browserVersion'] = browserversion;

    this.router.navigate(['/jserror-detail'],{ queryParams: { filterCriteria:  JSON.stringify(detailfilter),filterCriteriaList:JSON.stringify(this.filterCriteria) }, replaceUrl : true} );
   }*/
  gettingJsErrorCountDetail(filename, line, column, page, errMsg, browsers, platform, browserversion, platformversion) {
    let osname = null;
    let osversion = 'null';
    let osmap;
    const osdata = [];
    this.parsepagefilter.pagePerformanceFilters.line = line;
    this.parsepagefilter.pagePerformanceFilters.errorMessage = errMsg;
    this.parsepagefilter.pagePerformanceFilters.column = column;
    this.parsepagefilter.pagePerformanceFilters.filename = filename;
    if (page !== 'All') {
      this.parsepagefilter.pagePerformanceFilters.pages = page;
    }
    if (browsers !== 'All') {
      this.parsepagefilter.pagePerformanceFilters.browsers = browsers;
    }
    if (platform !== 'All' && platform !== undefined) {
      osname = platform;
      if (platformversion !== 'All') {
        osversion = platformversion;
      }
      osmap = { name: osname, version: osversion };
      osdata.push(osmap);
      this.parsepagefilter.pagePerformanceFilters.os = osdata;
    }
    if (browserversion !== 'All') {
      this.parsepagefilter.pagePerformanceFilters.browserVersion = browserversion;
    }
    this.router.navigate(['/jserror-detail'], { queryParams: { filterCriteria: JSON.stringify(this.parsepagefilter.pagePerformanceFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
  }

  getInitData() {
    console.log('getInitData called');
    const oldFilter = this.stateService.get('aggjserror.filters');
    console.log('oldFilter in  getInitData : ', oldFilter);
    this.parsepagefilter = new ParsePagePerformanceFilters();
    // this.metadataService.getMetadata().subscribe(metadata => {
    if (oldFilter == null || oldFilter == undefined) {

      const time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
      const d = new Date(moment.tz(time, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
      let date1 = window['toDateString'](d);
      if (navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('rv:11.0') > -1 || navigator.userAgent.indexOf('Edge') > -1) {
        const tmpDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
        date1 = tmpDate;
      }
      // this.parsepagefilter.pagePerformanceFilters.timeFilter.startTime =  startT;
      // this.parsepagefilter.pagePerformanceFilters.timeFilter.endTime =  endT;
      // this.parsepagefilter.pagePerformanceFilters.channels = "-1";
      // passing 1 Day as default
      this.parsepagefilter.pagePerformanceFilters.timeFilter.last = '1 Day';

      this.parsepagefilter.pagePerformanceFilters.limit = 15;
      this.parsepagefilter.pagePerformanceFilters.offset = 0;
      // this.getDataForTable(true);

      // });
      console.log('getInitData called filters : ', this.parsepagefilter.pagePerformanceFilters); // });
    }
    else {
      this.parsepagefilter.pagePerformanceFilters = oldFilter;
    }




  }
  updateOffset(offset, limit) {

    // this.pagination = true;
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    // set limit as per remaining counts.
    this.parsepagefilter.pagePerformanceFilters.limit = (this.totalRecords - offset > limit) ? limit : (this.totalRecords - offset);
    this.sessionsOffset = offset / limit;
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.parsepagefilter.pagePerformanceFilters.offset = offset; // (index) * parseInt(ParseSessionFilters.sessionFilters.limit+"");
    this.getDataForTable(true);

  }
  onPageChange(e) {
    console.log('onPageChange called with : ', e);
  }
  loadPagination(e: LazyLoadEvent) {
    this.loading = true;
    if (Object.keys(e.filters).length == 0) {
      this.updateOffset(e.first, e.rows);


      console.log('loadPagination');
      this.paginationEvent = e;
      this.getDataForTable(false);
      return;
    }

    // console.log('loadPagination');
    // this.getDataForTable();
    // in case of filters, first may got reset. update that.
    // update first.

    this.first = this.sessionsOffset * this.limit;
    this.session.first = this.first;


    setTimeout(() => {
      // update offset only when first or rows are changed
      if (this.data.data) {
        this.groupDataTemp = this.data.data.filter((row) =>
          this.filterCol(row, e.filters)
        );
        this.groupDataTemp.sort(
          (a, b) => this.sortField(a, b, e.sortField) * e.sortOrder
        );
        this.groupData = [...this.groupDataTemp];
        this.loading = false;
      }
    }, 0);


  }
  filterCol(row, filter) {
    let isInFilter = false;
    let noFilter = true;
    // tslint:disable-next-line: forin
    for (var columnName in filter) {
      if (row[columnName] == null) {
        return;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      const filterMatchMode: String = filter[columnName].matchMode;
      if (filterMatchMode.includes('contain')) {

        if (columnName === 'browser') {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === 'os') {
          rowValue = row[columnName].name.toString().toLowerCase();
        }


        if (rowValue.includes(filter[columnName].value.toLowerCase())) {
          isInFilter = true
        }
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
    if (rowA[field] == null) { return 1; }
    if (typeof rowA[field] === 'string') {
      return rowA[field].localeCompare(rowB[field]);
    }
    if (typeof rowA[field] === 'number') {
      if (rowA[field] > rowB[field]) { return 1; }
      else { return -1; }
    }
  }

  customSort(event) {
    this.changeSort(event);
  }

  changeSort(event) {
    this.sclick = event.sortOrder;
    this.iclick = event.sortOrder;
    if (event.sortField === 'browser') {
      if (this.iclick == -1) {
        this.iclick = 1;
        this.data.data.sort(this.icompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.icompare2);
      }
      this.groupData = [...this.data.data];
    }
    else if (event.sortField === 'os') {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.oscompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.oscompare2);
      }
      this.groupData = [...this.data.data];
    }
    else {
      this.data.data.sort(
        (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
      );
      this.groupData = [...this.data.data];
    }

  }

  icompare(a, b) {
    if ((a.browserVersion === undefined || a.browserVersion === '') && (b.browserVersion === undefined || b.browserVersion === '')) {
      return (a.browser.name < b.browser.name) ? -1 : (a.browser.name > b.browser.name) ? 1 : 0;
    }
    else {
      return ((a.browser.name.localeCompare(b.browser.name)) || (a.browserVersion.localeCompare(b.browserVersion)));
    }
  }

  icompare2(a, b) {
    if ((b.browserVersion === undefined || b.browserVersion === '') && (a.browserVersion === undefined || b.browserVersion === '')) {
      return (b.browser.name < a.browser.name) ? -1 : (b.browser.name > a.browser.name) ? 1 : 0;
    }
    else {
      return ((b.browser.name.localeCompare(a.browser.name)) || (b.browserVersion.localeCompare(a.browserVersion)));
    }
  }

  oscompare(a, b) {
    if ((a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null') && (b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null')) {
      return ((a.os.name.localeCompare(b.os.name)) || (a.mobileOSVersion.localeCompare(b.mobileOSVersion)));
    }

    if ((a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null') && (b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion != 'null')) {
      return (a.os.name < b.os.name) ? -1 : (a.os.name > b.os.name) ? 1 : 0;
    }
  }

  oscompare2(a, b) {
    if ((b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null') && (a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null')) {
      return ((b.os.name.localeCompare(a.os.name)) || (b.mobileOSVersion.localeCompare(a.mobileOSVersion)));
    }
    if ((b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion == 'null') && (a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null')) {
      return (b.os.name < a.os.name) ? -1 : (b.os.name > a.os.name) ? 1 : 0;
    }
  }

  exportPdf() {
    // save current state of table. 
    const rows = this.totalRecords;
    const first = this.session.first;
    this.session.rows = this.totalRecords;
    this.session.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.session.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.session.el.nativeElement, 1);
        console.log('jserror-filter export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('jserror-filter.pdf');
      } catch(e) {
        console.error('error while exporting in pdf. error - ', e);
      }
      
      //revert back to previous state. 
      this.session.rows = rows;
      this.session.first = first;
    });
    
  }

  exportCSV() {
    // save current state of table. 
    const rows = this.totalRecords;
    const first = this.session.first;
    this.session.rows = this.totalRecords;
    this.session.first = 0;

    setTimeout(() => {
      try {
        ExportUtil.exportToCSV(this.session.el.nativeElement, 1, 'jserror-filter.csv');
      } catch(e) {
        console.error('Error while exporting into CSV');
      }

      //revert back to previous state. 
      this.session.rows = rows;
      this.session.first = first;
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      // save the current state. 
      // get rows and first value. 
      const rows = this.totalRecords;
      const first = this.session.first;

      this.session.rows = this.totalRecords;
      this.session.first = 0;
      setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.session.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, {header: jsonData.headers, skipHeader: true});
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        }catch(e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
        this.session.rows = rows;
        this.session.first = first;
      });
    });
  }


  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'jserror-filter.xlsx');
    });
  }



}
