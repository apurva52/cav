import { Component, Input, OnInit, ViewEncapsulation, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { HttpFilter } from '../common/interfaces/httpfilters';
import { ParseHttpFilters } from '../common/interfaces/parsehttpfilters';
import { XHRData } from '../common/interfaces/xhrdata';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { HTTP_AGG_FILTER_TABLE } from './service/http-filter.dummy';
import { AutoCompleteData, HttpAggFilterTable, HttpAggFilterTableHeaderColumn } from './service/http-filter.model';
import { HttpDataService } from './service/http-filter.service';
import { HttpAggListLoadedState, HttpAggListLoadingErrorState, HttpAggListLoadingState } from './service/http-filter.state';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionStateService } from '../session-state.service';
import { HttpFilterSmartSearch } from './httpfiltersmartsearch';
import { Table } from 'primeng';
import { HttpClient } from '@angular/common/http';
//import { HttpFilterSidebarComponent } from './sidebar/http-filter-sidebar/http-filter-sidebar.component';
//import {NvhttpService} from '../common/service/nvhttp.service';
import { TimeFilter } from '../common/interfaces/timefilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../common/util/export-util';

@Component({
  selector: 'app-http-filter',
  templateUrl: './http-filter.component.html',
  styleUrls: ['./http-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HttpFilterComponent extends HttpFilterSmartSearch implements OnInit {

  @ViewChild('session') session: Table ;
  @ViewChild('searchInput') searchInput: ElementRef;
  data: HttpAggFilterTable;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: HttpAggFilterTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: HttpAggFilterTableHeaderColumn[] = [];
  emptyTable: boolean;
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

  filterCriteria: any = '';
  groupData = [];
  
  breadcrumb: BreadcrumbService 
  countLoading: boolean = false;
  groupDataTemp = [];
  paginationEvent:any;
  sessionsOffset: number;
  first: number = 0;
  rows: number = 0;
  limit: number = 15;
  offset: number = 0;
  // if we have set some filters , do not reset it.
  filtersSet : boolean = false;
  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  smartSearchFilterApplied : boolean = false;
  fromBreadcrumb : boolean = false;
  className : string = "http-filter";
  filterLabel: string = '';


  constructor( http: HttpClient, private route: ActivatedRoute, private httpDataService: HttpDataService, private metadataService: MetadataService, private router: Router, private messageService: MessageService, breadcrumb: BreadcrumbService, private stateService: SessionStateService) {
    super(http);
    this.breadcrumb = breadcrumb;
      this.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];
   /* this.downloadOptions = [
      { label: 'Export Pages as PDF', command: () => { this.nvFunction('pdf'); } },
      { label: 'Export Pages as HTML', command: () => { this.nvFunction('html'); } },
      { label: 'Export Pages as XLS', command: () => { this.nvFunction('xls'); } },
    ];**/
    this.multiOptions = [
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Ford', value: 'Ford' },
    ],
    this.linkOptions = [
        { label: 'Sessions', routerLink: '/sessions-details' },
        { label: 'Play Session', routerLink: '/play-sessions' },
    ],
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

    this.metadataService.getMetadata().subscribe(metadata => {
      //init smart search.
      this.init(metadata, this.applySmartSearchFilter, this);
    });
  }

  ngOnInit(): void {
    const me = this;
    me.data = { ...HTTP_AGG_FILTER_TABLE };
    me.first = this.data.paginator.first;
    me.rows = this.data.paginator.rows;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    if (this.route.snapshot.queryParams.filterCriteria) {
      try {
        console.log('filtercriteria  present in the url : ', this.route.snapshot.queryParams.filterCriteria);
        ParseHttpFilters.httpFilters = JSON.parse(this.route.snapshot.queryParams.filterCriteria);
        me.getDataForTable(true);
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
    this.breadcrumb.add({ label: 'Aggregate HttpRequest', routerLink: '/http-filter', queryParams: qp } as MenuItem);

    // restore to previuos state only if we are coming from breadcrumb
    let from = this.route.snapshot.queryParams.from;
    if(from && from == "breadcrumb")
      this.fromBreadcrumb = true;

    // try to restore from state
    const oldFilter = this.stateService.get('agghttp.filterCriteria');
    console.log('agghttp-filter | oldFilter : ', oldFilter);

    if (oldFilter != null && this.fromBreadcrumb) {
      ParseHttpFilters.httpFilters = oldFilter;
      let data = this.stateService.get('agghttp.data', []);

      if (data && data.length) {
        this.groupData = this.stateService.get('agghttp.data', []);
        this.rows = this.stateService.get('agghttp.rows', this.rows);
        this.first = this.stateService.get('agghttp.first', this.first);
        this.totalRecords = this.stateService.get('agghttp.totalRecords', 0);
      }
      return;

    } else {
      // get data for default time period
      this.setDefaultFilter();
    }

   
    //ParseHttpFilters.httpFilters = new HttpFilter();
    
    me.getDataForTable(true);
  }

  setDefaultFilter(){
    ParseHttpFilters.httpFilters.timeFilter.last = '1 Day';
    ParseHttpFilters.httpFilters.limit = 15;
    ParseHttpFilters.httpFilters.offset = 0;
  }


  @Input() get selectedColumns(): HttpAggFilterTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: HttpAggFilterTableHeaderColumn[]) {
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
 
  getDataForTable(count: boolean) {

    this.setFilterLabel(ParseHttpFilters.httpFilters.timeFilter);

    const me = this;
    ParseHttpFilters.httpFilters.pageCount = false;
     // cloning filter object
     let f = { ...ParseHttpFilters.httpFilters };
     let filter = JSON.stringify(ParseHttpFilters.httpFilters);
    
    this.stateService.set('agghttp.filterCriteria', f);
    me.httpDataService.LoadHttpAggListTableData(filter).subscribe(
      (state: Store.State) => {

        if (state instanceof HttpAggListLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HttpAggListLoadedState) {
          me.onLoaded(state, count);
          return;
        }
        if (state instanceof HttpAggListLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }
      },
      (state: HttpAggListLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  setFilterLabel(timeFilter: TimeFilter) {
    this.filterLabel = '';
    if (timeFilter.last != '') {
      this.filterLabel += 'Last: ' + timeFilter.last;
    } else {
      this.filterLabel += 'From: ' + timeFilter.startTime;
      this.filterLabel += ', To: ' + timeFilter.endTime;
    }
  }
  
  private onLoading(state: HttpAggListLoadingState) {
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;
  }

  private onLoadingError(state: HttpAggListLoadingErrorState) {
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
    // me.error.msg = "Error while loading data.";
  }

  private onLoaded(state: HttpAggListLoadedState, count: boolean) {
    const me = this;
    me.data = {...HTTP_AGG_FILTER_TABLE};
    me.error = state.error;
    me.loading = false; 
    let response = state.data;
    // either response is null or response data is empty array
    if ((response == null || response == undefined) || (response && (response.data == "NA" || response.data.length == 0))) {
      state.data.data = [];
    }
    // checking for error
    let reserror = state.data['error'];
    if (reserror !== "" && reserror !== undefined && reserror !== 'NA') {
      this.messageService.add({ severity: 'info', summary: reserror, detail: '' });
      state.data.data = [];
      // me.error.msg = state.data['error'];
    }
    // in case of valid data
    me.metadataService.getMetadata().subscribe(metadata => {
      me.data.data = state.data.data.map(a => {
        return new XHRData(a, metadata);
      });
      if (count && me.data.data.length >= ParseHttpFilters.httpFilters.limit) {
        me.getXhrDataCount();
      }
      else {
        if (count)
          me.totalRecords = me.data.data.length;
         this.customSort(this.paginationEvent);
      }
       // save  in state. 
       this.stateService.set('aggjserror.data', me.data.data, true);
      me.groupData = me.data.data;
      me.empty = !me.data.data.length;
    });
  }

  getXhrDataCount() {
    const me = this; 
    this.countLoading = true;
    ParseHttpFilters.httpFilters.pageCount = true;
    let filter = JSON.stringify(ParseHttpFilters.httpFilters);
    me.httpDataService.LoadHttpAggListTableData(filter).subscribe(
      (state: Store.State) => {


        if (state instanceof HttpAggListLoadedState) {
          me.totalRecords = state.data['count']; 
          me.countLoading = false;
          // reset 
          ParseHttpFilters.httpFilters.pageCount = false;
          return;
        }

      },
      (state: HttpAggListLoadingErrorState) => {
        console.log("Error fetching count data");

      }
    );
  }
  applyFilter() {
    ParseHttpFilters.httpFilters.limit = this.data.paginator.rows;
    ParseHttpFilters.httpFilters.offset = 0;
    this.first = this.data.paginator.first;
    this.rows = this.data.paginator.rows;
    this.totalRecords = 0;
    this.getDataForTable(true);
  }
  gettingHttpDomainDetail(domain, resource, method, domainname, resourcename, count) {
    if (count <= 0)
      return;
    ParseHttpFilters.httpFilters.domainname = domain;
    ParseHttpFilters.httpFilters.resourceId = resource;
    ParseHttpFilters.httpFilters.method = "'" + method + "'";
    this.router.navigate(['/http-detail'], { queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
  }

  getting4xxCountDetail(domain, resource, method, domainname, resourcename, count) {
    if (count <= 0)
      return;

    ParseHttpFilters.httpFilters.domainname = domain;
    ParseHttpFilters.httpFilters.method = "'" + method + "'";
    ParseHttpFilters.httpFilters.statuscode = "'" + '4xx' + "'";
    ParseHttpFilters.httpFilters.resourceId = resource;
    this.router.navigate(['/http-detail'], { queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
  }
  getting5xxCountDetail(domain, resource, method, domainname, resourcename, count) {
    if (count <= 0)
      return;
    ParseHttpFilters.httpFilters.domainname = domain;
    ParseHttpFilters.httpFilters.resourceId = resource;
    ParseHttpFilters.httpFilters.method = "'" + method + "'";
    ParseHttpFilters.httpFilters.statuscode = "'" + '5xx' + "'";
    this.router.navigate(['/http-detail'], { queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
  }
  getting2xxCountDetail(domain, resource, method, domainname, resourcename, count) {
    if (count <= 0)
      return;
    ParseHttpFilters.httpFilters.domainname = domain;
    ParseHttpFilters.httpFilters.resourceId = resource;
    ParseHttpFilters.httpFilters.method = "'" + method + "'";
    ParseHttpFilters.httpFilters.statuscode = "'" + '2xx' + "'";
    this.router.navigate(['/http-detail'], { queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
  }

  gettingFailureCountDetail(domain, resource, method, domainname, resourcename, count) {
    if (count <= 0)
      return;
    ParseHttpFilters.httpFilters.domainname = domain;
    ParseHttpFilters.httpFilters.resourceId = resource;
    ParseHttpFilters.httpFilters.method = "'" + method + "'";
    ParseHttpFilters.httpFilters.errorCode = true;
    this.router.navigate(['/http-detail'], { queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters), filterCriteriaList: JSON.stringify(this.filterCriteria) }, replaceUrl: true });
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
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('http-filter.pdf');
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
        ExportUtil.exportToCSV(this.session.el.nativeElement, 1, 'http-filter.csv');
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
      FileSaver.saveAs(data, 'http-filter.xlsx');
    });
  }

  //nvFunction(exportype:any)
  //{
     // let filterString = ParseHttpFilters.httpFilters.timeFilter;
     // if(HttpFilterSidebarComponent.lasttime != "")
        // filterString += ", " + HttpFilterSidebarComponent.lasttime.split("<strong>").join("").split("</strong>").join("");
     // this.httpService.exportHttpdata(ParseHttpFilters.httpFilters,filterString,exportype);
//  }
  
  updateOffset(offset, limit) {
   
    ParseHttpFilters.httpFilters.limit = limit; 
    // set limit as per remaining counts.
     if(this.totalRecords >0) 
      ParseHttpFilters.httpFilters.limit = (this.totalRecords - offset > limit) ? limit : (this.totalRecords - offset);
     this.sessionsOffset = offset / limit;
     ParseHttpFilters.httpFilters.offset = offset;//(index) * parseInt(ParseSessionFilters.sessionFilters.limit+""); 
     
   }
   onPageChange(e) {
    console.log("onPageChange called with : ", e);
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
  for (var columnName in filter) {
    if (row[columnName] == null) {
      return;
    }
    noFilter = false;
    let rowValue: String = row[columnName].toString().toLowerCase();
    let filterMatchMode: String = filter[columnName].matchMode;
    if ( filterMatchMode.includes('contain') )
    {
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
    this.data.data.sort(
      (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
    );
    this.groupData = [...this.data.data];
  

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
  
    ParseHttpFilters.httpFilters.limit = 15;
    ParseHttpFilters.httpFilters.offset =  0; 


    // parse smartsearch filters. 
    this.parseFilter();
  
    // reset pagination flag. 
    //this.pagination = false;
  
    this.getDataForTable(false);
  }

  ngOnDestroy(): void { 
    this.stateService.setAll({
      'agghttp.rows': ParseHttpFilters.httpFilters.limit,
      'agghttp.first': ParseHttpFilters.httpFilters.offset,
      'agghttp.totalRecords': this.totalRecords,
      'agghttp.data': this.groupData,
      prevRoute: 'http-filter'
    }); 
  }

}
