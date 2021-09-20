import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'moment-timezone';
import { LazyLoadEvent, Menu, MenuItem, MessageService, Table } from 'primeng';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { DataManager } from '../common/datamanager/datamanager';
import { TimeFilter } from '../common/interfaces/timefilter';
import { Transaction } from '../common/interfaces/transactiondata';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../common/service/nvhttp.service';
import { SessionStateService } from '../session-state.service';
import { Metadata } from './../common/interfaces/metadata';
import { TransactionFilter } from './../common/interfaces/transactionfilter';
import { TRANSACTION_AGG_FILTER_TABLE } from './service/transaction-filter.dummy';
import { AutoCompleteData,TransactionFilterTable, TransactionFilterTableHeaderColumn } from './service/transaction-filter.model';
import { TranasactionSmartSearch } from './transactionsmartsearch';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionFilterComponent extends TranasactionSmartSearch implements OnInit {
  @ViewChild('table') table: Table;

  items: MenuItem[];
  downloadOptions: MenuItem[];

  data: TransactionFilterTable;
  error: AppError;
  loading: boolean;

  cols: TransactionFilterTableHeaderColumn[];
  totalRecords: number = 0;
  _selectedColumns: TransactionFilterTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  selectedRow: any;
  selectedRowIndex: number;

  isEnabledColumnFilter: boolean;
  groupData = [];
  metadata: Metadata;
  countLoading: boolean = false;
  transactionFilter: TransactionFilter;
  tooltipzindex = 100000;
  groupDataTemp = [];
  paginationEvent: any;
  sessionsOffset: number;
  first: number = 0;
  rows: number = 15;
  limit: number = 15;
  offset: number = 0;
  empty: boolean;

  filterLabel: string = '';
  //smartsearch
  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  smartSearchFilterApplied : boolean = false;
  nvconfigurations: any = null;

  constructor(http: HttpClient, private stateService: SessionStateService, private route: ActivatedRoute, private metaDataService: MetadataService, private router: Router, private messageService: MessageService, private nvhttp: NvhttpService, public breadcrumb: BreadcrumbService) {
    super(http);

    
    this.metaDataService.getMetadata().subscribe(metadata => {
        //init smart search.
        this.init(metadata, this.applySmartSearchFilter, this);
    });

    this.items = [
      { label: 'Session Detail', command: () => { this.ddr_to_session_details(); } }
    ];

    this.downloadOptions = [
      { label: 'Export Pages as PDF', command: () => { this.nvFunction('pdf'); } },
      { label: 'Export Pages as HTML', command: () => { this.nvFunction('html'); } },
      { label: 'Export Pages as XLS', command: () => { this.nvFunction('xls'); } },
    ];

  }


  ngOnInit(): void {
    // set breacrumb.
    if (Object.keys(this.route.snapshot.queryParams).length == 0) {
      // clear all breadcrumb. 
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
      this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    }
    this.breadcrumb.add({ label: 'Transactions', routerLink: '/transaction-filter', queryParams: { ...this.route.snapshot.queryParams } } as MenuItem);

    this.data = { ...TRANSACTION_AGG_FILTER_TABLE };

    this.cols = this.data.headers[0].cols;
    for (const c of this.data.headers[0].cols) {
      this.globalFilterFields.push(c.valueField);
      if (c.selected) {
        this._selectedColumns.push(c);
      }
    }

    // check if restore available
    this.groupData = this.stateService.get('transactions.data', []);
    this.transactionFilter = this.stateService.get('transactions.filterCriteria', null);
    this.totalRecords = this.stateService.get('transactions.totalRecords', 0);

    if (this.transactionFilter) {
      return;
    }

    // remove  the table state from sessionStorage
    sessionStorage.removeItem('transaction-table');

    this.transactionFilter = new TransactionFilter();

    this.metaDataService.getMetadata().subscribe((response: any) => {
      this.metadata = response;
      DataManager.metadata = this.metadata;
      // for first time get the data with count
      const timeFilter: TimeFilter = { last: '1 Day', startTime: '', endTime: '' };
      this.applyFilter(timeFilter);
    });

  }

  @Input() get selectedColumns(): TransactionFilterTableHeaderColumn[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: TransactionFilterTableHeaderColumn[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    this.isEnabledColumnFilter = !this.isEnabledColumnFilter;
  }

  /* loadPagination(event: LazyLoadEvent) {
     this.transactionFilter.offset = event.first;
     this.transactionFilter.limit = event.rows;
 
     console.log('offset - ', this.transactionFilter.offset, 'limit - ', this.transactionFilter.limit);
 
     this.getTransactionData(false);
   }*/

  onRowSelect(event): void {
    this.selectedRow = event.data;
    this.selectedRowIndex = event.index;
  }

  toggleMenu(e: MouseEvent, menu: Menu): void {
    this.hideAllMenus();
    menu.toggle(e);
  }

  hideAllMenus() {
    document.getElementById('nothing').click();
  }


  // ddr to session window
  ddr_to_session_details() {
    // TODO: save the current state
    this.stateService.set('transactions.data', this.groupData);
    this.stateService.set('transactions.filterCriteria', this.transactionFilter);
    this.stateService.set('transactions.totalRecords', this.totalRecords);
    this.stateService.set('transactions.selectedRow', this.selectedRow);

    this.router.navigate(['/page-detail/transactions'], { queryParams: { sid: this.selectedRow.sid, pageInstance: this.selectedRow.pageInstance, from: 'transaction' }, replaceUrl: true });
  }


  /** This method is used to get the transactions data  */
  getTransactionData(count: boolean): void {
    // set count false to get the data
    this.transactionFilter.count = false;

    this.nvhttp.getTransactionData(this.transactionFilter).subscribe(
      (state: Store.State) => {

        if (state instanceof NVPreLoadingState) {
          this.loading = true;
          this.error = null;
          this.data.data = state.data || [];
        }

        if (state instanceof NVPreLoadedState) {
          this.onLoaded(state, count);
        }
      },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          this.loading = err.loading;
          this.error = err.error;
          this.data.data = err.data || [];
        }
      }
    );
  }

  private onLoaded(state: NVPreLoadedState<any>, count: boolean): void {
    this.loading = false;
    this.error = null;

    const response = state.data;
    // either response is null or response data is empty array
    if (response == null || (response && (response.data == "NA" || response.data == '[]' || response.data.length == 0))) {
      this.groupData = [];
      return;
    }

    // checking for error
    const reserror = state.data.error;
    if (reserror !== '' && reserror !== undefined && reserror !== 'NA') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: reserror, life: 5000 });
      this.groupData = [];
      return;
    }
    // in case of valid data
    this.metaDataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
      // parse data to JSON
      const data = JSON.parse(response.data);

      for (const i of data) {
        this.data.data.push(new Transaction(i, this.metadata));

      }
      /**
      * there can be 3 cases, handling for all the three cases
      * case 1 : having no data
      * case 2 : having data , less than the limit
      * in both of the above case, we do not have to call the count request , and fill the total records as data. length
      * case 3 : else case,  calling the count request  and filling total records
      */

      // if count true , get the counts of the data
      if (count) {
        if (this.data.data.length < this.data.paginator.rows) {
          this.groupData = this.data.data;
          this.totalRecords = this.data.data.length;
        }
        else {
          this.groupData = this.data.data;
          this.getTransactionCount();
        }
        if (!this.paginationEvent) {
          this.groupData = this.data.data;
          return;
        }
        if (this.totalRecords > 0) {
          this.groupData = this.data.data;
          this.customSort(this.paginationEvent);
        }
        else {
          this.groupData = this.data.data;
        }
      }
      this.groupData = this.data.data;
      this.empty = !this.data.data.length;
      this.loading = false;

      /**  if (this.data.data.length >= this.transactionFilter.limit) {
              this.groupData = this.data.data;
              this.getTransactionCount();
            } else {
              this.totalRecords = this.data.data.length;
    
              this.groupData = this.data.data;
              this.customSort(this.paginationEvent);
            }
          }
          this.groupData = this.data.data;
          this.empty = !this.data.data.length;
          this.loading = false;
    
      **/
      /**  if (count) {
         if( count && this.data.data.length < this.data.paginator.rows){
           this.groupData =this.data.data;
          this.totalRecords = this.data.data.length;
         }
          else {
 
           this.groupData =this.data.data;
           this.getTransactionCount();
       }
 
       if(!this.paginationEvent){
         this.groupData = this.data.data;
         return;
       }
       if(this.totalRecords > 0 ){
         this.groupData =this.data.data;
       this.customSort(this.paginationEvent);
       }
       else {
         this.groupData = this.data.data;
       }
     }
 
       this.groupData = this.data.data;
       this.empty = !this.data.data.length;
       this.loading = false;
     **/


    });
  }


  /** This method is used to get the count for total records */
  getTransactionCount() {
    // set count true to get the count
    this.transactionFilter.count = true;
    this.nvhttp.getTransactionData(this.transactionFilter).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.countLoading = state.loading;
        this.totalRecords = state.data || 0;
      }
      if (state instanceof NVPreLoadedState) {
        this.totalRecords = state.data.count;
        this.countLoading = state.loading;
      }
    },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          console.error('Failed to get the count for transaction table.');
          this.countLoading = err.loading;
          this.totalRecords = err.data || 0;
        }
      }
    );
  }


  /** This method is called after form submit. This will fetch the data  and count for the table */
  applyFilter(event: TimeFilter): void {
    this.getFilterLabel(event);
    this.transactionFilter.timeFilter = event;
    this.getTransactionData(true);
  }

  getFilterLabel(event: TimeFilter): void {
    this.filterLabel = '';
    if (event.last !== '') {
      this.filterLabel += 'Last: ' + event.last;
    } else {
      this.filterLabel += 'From: ' + event.startTime;
      this.filterLabel += ', To: ' + event.endTime;
    }
  }

  /** This method is used to export the table data to a file */
  nvFunction(exportype: string) {
    const filterString = encodeURIComponent(JSON.stringify(this.transactionFilter.timeFilter));
    // save current state of table. 
    const rows = this.totalRecords;
    const first = this.table.first;
    this.table.rows = this.totalRecords;
    this.table.first = 0;
    // this.transactionFilter.pageCount = false;
    const timezoneflag = 'Asia/Kolkata';
    let serviceUrl = '/netvision/rest/webapi/exporttransactions?access_token=563e412ab7f5a282c15ae5de1732bfd1';
    serviceUrl += '&filterCriteria=' + encodeURIComponent(JSON.stringify(this.transactionFilter));
    console.log('URL : ', serviceUrl + '&filterString=' + filterString + '&exporttype=' + exportype + '&timezoneflag=' + timezoneflag);
    window.open(serviceUrl + '&filterString=' + filterString + '&exporttype=' + exportype + '&timezoneflag=' + timezoneflag);

  }
  updateOffset(offset, limit) {

    // this.pagination = true;
    // set limit as per remaining counts. 
    this.transactionFilter.limit = (this.totalRecords - offset > limit) ? limit : (this.totalRecords - offset);
    this.sessionsOffset = offset / limit;
    this.transactionFilter.offset = offset;//(index) * parseInt(ParseSessionFilters.sessionFilters.limit+""); 
    this.getTransactionData(true);

  }
  loadPagination(event: LazyLoadEvent) {
    console.log("loadPagination called, event - ", event);

    if (!this.totalRecords) return;

    this.loading = true;
    if (Object.keys(event.filters).length == 0) {
      this.updateOffset(event.first, event.rows);
      this.paginationEvent = event;
      this.getTransactionData(false);
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
      if (filterMatchMode.includes('contain')) {
        if (columnName === "browser") {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === "os") {
          rowValue = row[columnName].toString().toLowerCase();

        }
        else if (columnName === "formattedDuration") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "sid") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "pageInstance") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "store") {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === "formattedStartTime") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "device") {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === "name") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "pageName") {
          rowValue = row[columnName].name.toString().toLowerCase();
        }
        else if (columnName === "clientIp") {
          rowValue = row[columnName].toString().toLowerCase();
        }
        else if (columnName === "failedTransaction") {
          rowValue = row[columnName].toString().toLowerCase();
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
        } else if (columnName === "channel") {
          rowValue = row[columnName].name.toString().toLowerCase();
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
    if (!event) return;
    this.changeSort(event);
  }

  /***Sorting */
  sclick = 0;
  iclick = 0;

  changeSort(event) {
    this.sclick = event.sortOrder;
    this.iclick = event.sortOrder;
    if (event.sortField === "formattedStartTime") {
      if (this.sclick == -1) {
        this.sclick = 1;
        this.data.data.sort(this.compare);
      }
      else {
        this.sclick = -1;
        this.data.data.sort(this.compare1);
      }
      this.groupData = [...this.data.data];
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
      this.groupData = [...this.data.data];
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
      this.groupData = [...this.data.data];
    }
    else if (event.sortField === "store") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.storecompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.storecompare1);
      }
      this.groupData = [...this.data.data];
    }
    else if (event.sortField === "terminal") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.terminalcompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.terminalcompare1);
      }
      this.groupData = [...this.data.data];
    }
    else if (event.sortField === "deviceType") {
      if (this.iclick === -1) {
        this.iclick = 1;
        this.data.data.sort(this.devicecompare);
      }
      else {
        this.iclick = -1;
        this.data.data.sort(this.devicecompare2);
      }
      this.groupData = [...this.data.data];
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
      this.groupData = [...this.data.data];
    } else {
      this.data.data.sort(
        (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
      );
      this.groupData = [...this.data.data];
    }

  }

  icompare(a, b) {
    return ((a.browser.name.localeCompare(b.browser.name)) || (a.browserVersion.localeCompare(b.browserVersion)));
  }

  icompare2(a, b) {
    return ((b.browser.name.localeCompare(a.browser.name)) || (b.browserVersion.localeCompare(a.browserVersion)));
  }
  oscompare(a, b) {
    return ((a.os.name.localeCompare(b.os.name)) || (a.osVersion.localeCompare(b.osVersion)));
  }

  oscompare2(a, b) {
    return ((b.os.name.localeCompare(a.os.name)) || (b.osVersion.localeCompare(a.osVersion)));
  }

  storecompare(a, b) {
    if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
      return -1;
    if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
      return 1;
    return 0;
  }

  storecompare1(a, b) {
    if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
      return 1;
    if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
      return -1;
    return 0;
  }

  terminalcompare(a, b) {
    if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
      return -1;
    if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
      return 1;
    return 0;
  }

  terminalcompare1(a, b) {
    if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
      return 1;
    if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
      return -1;
    return 0;
  }
  devicecompare(a, b) {
    console.log(a, b);
    return (a.deviceType.name.localeCompare(b.deviceType.name));
  }

  devicecompare2(a, b) {
    return (b.deviceType.name.localeCompare(a.deviceType.name));
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

    if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
      return -1;
    if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
      return 1;
    return 0;
  }

  compare1(a, b) {
    if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
      return 1;
    if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
      return -1;
    return 0;
  }
  
  applySmartSearchFilter(force: boolean = false) {
    
    if (!force && (!this.smartSearchInput || !this.smartSearchInput.length)) {
      console.log('No Smart Filter selected. ');
      return;
    }
    this.smartSearchFilterApplied = true;
  
    this.transactionFilter.limit = 15;
    this.transactionFilter.offset =  0; 


    // parse smartsearch filters. 
    this.parseFilter();
  
    this.getTransactionData(true);
  }
}
