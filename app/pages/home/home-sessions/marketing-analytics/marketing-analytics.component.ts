import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MarketAnalyticsTable } from './service/table.model';
import { SessionStateService } from '../session-state.service';
import { MARKETING_ANALYTICS_TABLE, PANEL_DUMMY, VISUAL_CHART_DATA } from './service/marketing-analytics.dummy';
import { VisualChart, MarketingAnalyticsOverviewFilter } from './service/marketing-analytics.model';
import { MarketingAnalyticsService } from './service/marketing-analytics.service';
import { MarketAnalyticsErrorState, MarketAnalyticsLoadedState, MarketAnalyticsLoadingState } from './service/marketing-analytics.state';
import { TimeFilter } from '../common/interfaces/timefilter';

@Component({
  selector: 'app-marketing-analytics',
  templateUrl: './marketing-analytics.component.html',
  styleUrls: ['./marketing-analytics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarketingAnalyticsComponent implements OnInit, OnDestroy {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  data: MarketAnalyticsTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  campaigns: string[];
  currentTimeFilter: any = null;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  panel: any;
  visualChart: VisualChart;

  filterLabel: string = '';

  constructor(private service: MarketingAnalyticsService, private stateService: SessionStateService,
    private router: Router) { }

  ngOnInit(): void {

    const me = this;

    me.breadcrumb = [
      { label: 'Marketing Analytics' }
    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.panel = PANEL_DUMMY;

    me.visualChart = VISUAL_CHART_DATA;

    me.data = MARKETING_ANALYTICS_TABLE;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    //check customtime null or not for open detail gui
    if (me.data.customTime != null)
      this.currentTimeFilter = me.data.customTime;
    if (me.data.filtercriteria == null) {
      let filter: any;
      filter = { "timefilter": { "last": "1 Day", "startTime": "", "endTime": "" } };
      this.service.LoadOverviewData(filter).subscribe((state: Store.State) => {
        if (state instanceof MarketAnalyticsLoadingState) {
          this.dataLoading();
        } else if (state instanceof MarketAnalyticsLoadedState) {
          this.dataLoaded(state);
        } else if (state instanceof MarketAnalyticsErrorState) {
          this.dataLoadError(state);
        }
      });
    }

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

  applyFilter($event) {
    this.setFilterLabel($event);

    const filter: MarketingAnalyticsOverviewFilter = {
      timefilter: $event.timeFilter
    };

    // set this filter for further drilldown. 
    this.currentTimeFilter = $event.timeFilter;

    this.service.LoadOverviewData(filter).subscribe((state: Store.State) => {
      if (state instanceof MarketAnalyticsLoadingState) {
        this.dataLoading();
      } else if (state instanceof MarketAnalyticsLoadedState) {
        this.dataLoaded(state);
      } else if (state instanceof MarketAnalyticsErrorState) {
        this.dataLoadError(state);
      }
    });

  }

  setFilterLabel(event: any): void {
    this.filterLabel = '';
    if (event.timeFilter.last != '') {
      this.filterLabel += 'Last: ' + event.timeFilter.last;
    } else {
      this.filterLabel += 'From: ' + event.timeFilter.startTime;
      this.filterLabel += ', To: ' + event.timeFilter.endTime;
    }
  }

  dataLoaded(state: MarketAnalyticsLoadedState) {
    this.loading = false;

    let data = state.data;
    this.campaigns = data[1];
    this.data.campaigns = data[1];
    if (!this.campaigns && !this.campaigns.length) {
      this.empty = true;
      return;
    }

    this.setTableData(data[0]);

    this.setGraphData(data[0]);
  }

  setTableData(data: any[]) {
    let tableData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        avg_session_duration: parseFloat(data[i].avg_session_duration),
        total_session: parseInt(data[i].total_session),
        avg_nop_in_session: parseInt(data[i].avg_nop_in_session),
        order_count: parseInt(data[i].order_count),
        utm_campaign: data[i].utm_campaign,
        pagecount: parseInt(data[i].pagecount),
        conv_rate: parseFloat(data[i].conv_rate),
        bounce_rate: parseFloat(data[i].bounce_rate),
        ordertotal: parseInt(data[i].ordertotal)
      };
      tableData.push(obj);
    }

    this.data.data = tableData;
    this.totalRecords = this.data.data.length;
  }

  setGraphData(res: any[]) {
    let sr = [];
    let sar = [];  //array for sessions
    let par = [];  //array for pages
    let otar = []; //array for order total
    let ocar = []; //array for order count
    let convRate = []; //array for conversion rate
    let bounceRate = []; //array for bounce rate
    let categories = [];

    if (res != null && res != undefined) {
      let len;
      if (res.length <= 10)
        len = res.length;
      else
        len = 10;
      for (let r = 0; r < len; r++) {
        categories.push(res[r].utm_campaign);
        sar.push(parseFloat(res[r]['total_session']));
        par.push(parseInt(res[r]['pagecount']));
        otar.push(parseInt(res[r]['ordertotal']));
        ocar.push(parseInt(res[r]['order_count']));
        convRate.push(parseInt(res[r]['conv_rate']));
        bounceRate.push(parseInt(res[r]['bounce_rate']));
      }
    }

    let chart: Highcharts.Options = this.visualChart.charts[0].highchart;

    chart.xAxis['categories'] = categories;

    //set series data.
    chart.series[0]['data'] = sar; // session

    chart.series[1]['data'] = par; // page count

    chart.series[2]['data'] = otar; // order total

    chart.series[3]['data'] = ocar; // order count

    chart.series[4]['data'] = convRate; // conversion rate.

    chart.series[5]['data'] = bounceRate; // bounce rate. 

    this.visualChart.charts[0] = { ...this.visualChart.charts[0] };
  }

  resetGraphData() {
    let chart: Highcharts.Options = this.visualChart.charts[0].highchart;

    chart.xAxis['categories'] = [];

    //set series data.
    chart.series[0]['data'] = []; // session

    chart.series[1]['data'] = []; // page count

    chart.series[2]['data'] = []; // order total

    chart.series[3]['data'] = []; // order count

    chart.series[4]['data'] = []; // conversion rate.

    chart.series[5]['data'] = []; // bounce rate. 

    this.visualChart.charts[0] = { ...this.visualChart.charts[0] };
  }

  dataLoadError(state: MarketAnalyticsErrorState) {
    this.loading = false;
    this.error = {
      msg: (state.error && state.error.message) ? state.error.message : 'Error in loading data.'
    };
  }

  dataLoading() {
    this.data.data = [];
    this.totalRecords = 0;
    this.loading = true;
    this.empty = false;
    // reset.
    this.resetGraphData();
  }

  ngOnDestroy() {
    //save campaings list. 
    this.stateService.set('ma.campaigns', this.data.campaigns);

  }

  openDetail(selectedCampaign: string) {
    console.log('MA: oppenDatail called. Selected Campaign - ', selectedCampaign);
    this.data.customTime = this.currentTimeFilter;
    this.router.navigate(['ma-detail'], { queryParams: { 'selectedCampaign': selectedCampaign, 'timeFilter': JSON.stringify(this.currentTimeFilter) }, replaceUrl: true });
  }

}
