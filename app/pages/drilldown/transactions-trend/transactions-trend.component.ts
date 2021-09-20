import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  TransactionTrendData,
  TransactionTrendTableHeaderCols,
} from './service/transactions-trend.model';
import { AppError } from 'src/app/core/error/error.model';
import { TransactionTrendService } from './service/transactions-trend.service';
import { Store } from 'src/app/core/store/store';
import {
  TransactionTrendLoadingState,
  TransactionTrendLoadedState,
  TransactionTrendLoadingErrorState,
} from './service/transactions-trend.state';
import { AutoplayConfig } from '../../kpi/service/kpi.model';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { SpecifiedTimeComponent } from './specified-time/specified-time.component';
import { Router } from '@angular/router';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FilterUtils } from 'primeng/utils';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-transactions-trend',
  templateUrl: './transactions-trend.component.html',
  styleUrls: ['./transactions-trend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class TransactionsTrendComponent implements OnInit {
  timesDropDown = [];
  autoplayConfig: AutoplayConfig;
  autoplayEnabled: boolean;
  autoplayInterval: number;
  autoplayCurrentSeqIndex: number;
  data: TransactionTrendData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: any;

  timeFilterVisible: boolean = false;
  showModel: boolean = false;
  specifiedTimeValue;
  items1: MenuItem[];
  options: MenuItem[];
  trendData = [];
  trendDataTemp = [];
  selectedRow: any;

  selectedItem;
  showPopup = false;
  downloadOptions: MenuItem[];
  finalValue: any;

  isShowSearch: boolean = false;
  inputValue: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  stateID: string;
  @Input() widget: DashboardWidgetComponent;

  @ViewChild(SpecifiedTimeComponent, { read: SpecifiedTimeComponent })
  private specifiedTimeComponent: SpecifiedTimeComponent;

  selectedFilter =
    'Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All';
  cols: TransactionTrendTableHeaderCols[] = [];
  _selectedColumns: TransactionTrendTableHeaderCols[] = [];
  showUI: boolean = false;
  breadcrumb: BreadcrumbService;

  constructor(
    private sampleDemoService: TransactionTrendService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sessionService: SessionService,
    private f_ddr:DdrPipe,
    private route: ActivatedRoute,
    breadcrumb: BreadcrumbService
  ) {
    this.breadcrumb = breadcrumb;
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    });
    this.timesDropDown = [{ label: 'Specified Time', value: null }];
  }

  ngOnInit(): void {
    const me = this;
    me.load();
    me.breadcrumb.add({label: 'BT Trend', routerLink: '/drilldown/transactions-trend', queryParams: { state: this.stateID}});
    me.downloadOptions = [
      {
        label: 'Word',
      },
      {
        label: 'Excel',
      },
      {
        label: 'PDF',
      },
    ];
    me.items1 = [
      {
        label: 'Aggregate Transaction Flowmap',
        command: (event: any) => {
          this.router.navigate(['/aggregate-transaction-flowmap']);
        },
      },
      {
        label: 'Method Timing Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/method-timing']);
        },
      },
      {
        label: 'DB Request Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/db-queries']);
        },
      },

      {
        label: 'Flowpath Analyzer',
        command: (event: any) => {
          this.router.navigate(['/flowpath-analyzer']);
        },
      },
      {
        label: 'BT IP Summary',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/ip-summary']);
        },
      },
    ];

    me.options = [
      {
        label: 'Live',
        items: [
          { label: 'Last 5 Minutes' },
          { label: 'Last 10 Minutes' },
          { label: 'Last 30 Minutes' },
          { label: 'Last 1 Hours' },
          { label: 'Last 2 Hours' },
          { label: 'Last 4 Hours' },
          { label: 'Last 6 Hours' },
          { label: 'Last 8 Hours' },
          { label: 'Last 12 Hours' },
          { label: 'Last 24 Hours' },
          { label: 'Today' },
          { label: 'Last 7 Days' },
          { label: 'Last 30 Days' },
          { label: 'Last 90 Days' },
          { label: 'This Week' },
          { label: 'This Month' },
          { label: 'This Year' },
        ],
      },
      {
        label: 'Past',
        items: [
          { label: 'Yesterday' },
          { label: 'Last Week' },
          { label: 'Last 2 Week' },
          { label: 'Last 3 Week' },
          { label: 'Last 4 Week' },
          { label: 'Last Month' },
          { label: 'Last 2 Month' },
          { label: 'Last 3 Month' },
          { label: 'Last 6 Month' },
          { label: 'Last Year' },
        ],
      },
      {
        label: 'Events',
        items: [
          {
            label: 'Black Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Christmas Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Cyber Monday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Good Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'New Years Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Presidents Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Thanks Giving Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Valentines Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
        ],
      },
      {
        label: 'Custom',
        command: (event: any) => {
          this.openSpecifiedTimeDialog();
          //  this.specifiedTimeComponent.open();
        },
      },
    ];
  }

  onClickMenu(item) {
    console.log('show item:' + item);
    this.selectedItem = item.toElement.innerText;
  }

  onClickDialogMenu(item) {
    console.log('show item:' + item);
    this.selectedItem = item.toElement.innerText;
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
        filterMatchMode.includes('contains') &&
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

  loadPagination(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.tableData.data) {
        this.trendDataTemp = this.data.tableData.data.filter((row) =>
          this.filterField(row, event.filters)
        );
        this.data.tableData.data.sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
        );
        this.trendData = this.trendDataTemp.slice(
          event.first,
          event.first + event.rows
        );
        this.loading = false;
      }
    }, 1000);
  }

  getRowData(rowData) {
    console.log(rowData);
  }

  openSpecifiedTimeDialog() {
    this.specifiedTimeComponent.open();
    this.cd.detectChanges();
  }

  load() {
    const me = this;
    me.sampleDemoService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionTrendLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof TransactionTrendLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionTrendLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  // clearFilters() {
  //   const me = this;
  //   me.inputValue = document.querySelector('.ui-inputtext');
  //   me.inputValue.value = '';
  // }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  private onLoading(state: TransactionTrendLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TransactionTrendLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TransactionTrendLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;

    // this.trendData = this.data.tableData.data;
    if (me.data) {
      me.empty = false;
      if (!me.data.tableData.data && me.data.tableData.data == null) {
        me.emptyTable = true;
      }
      let check = {};
      me.loadPagination(check);
      this.totalRecords = this.data.tableData.data.length;
    } else {
      me.empty = true;
    }

    me.cols = me.data.tableData.headers[0].cols;
    for (const c of me.data.tableData.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    if (!me.data.tableData.data) {
      me.empty = true;
    }
  }

  paginate(event) {
    alert('test' + JSON.stringify(event));
    // this.data.tableData.data = this.data.tableData.data.slice(event.first, event.first+event.rows);
    console.log('Index of the first record::' + event.first);
    console.log('Number of rows to display in new page::' + event.rows);
    console.log('Index of the new page::' + event.page);
    console.log('Total number of pages::' + event.pageCount);
  }

  @Input() get selectedColumns(): TransactionTrendTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TransactionTrendTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  filterChange() {
    const me = this;
    me.timeFilterVisible = true;
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
