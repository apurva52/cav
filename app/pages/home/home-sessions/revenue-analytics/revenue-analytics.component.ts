import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Metadata } from '../common/interfaces/metadata';
import { MetadataService } from '../common/service/metadata.service';
import { RA_GRAPH0_DATA, RA_GRAPH1_DATA, RA_GRAPH2_DATA, RA_SUMMARY_DUMMY_DATA, RA_TABLE, REVENUE_ANALYTICS_TABLE_DATA } from './service/revenue-analytics.dummy';
import { OpportunityData, RASummaryData, RevenueAnalyticsFilter, RevenueAnalyticsTable, Revenuetable, WidgetData } from './service/revenue-analytics.model';
import { RevenueAnalyticsService } from './service/revenue-analytics.service';
import { RevenueAnalyticsErrorState, RevenueAnalyticsLoadedState, RevenueAnalyticsLoadingState } from './service/revenue-analytics.state';

@Component({
  selector: 'app-revenue-analytics',
  templateUrl: './revenue-analytics.component.html',
  styleUrls: ['./revenue-analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RevenueAnalyticsComponent implements OnInit {
  breadcrumb: MenuItem[];
  graph0Data: WidgetData;
  tableData: WidgetData;
  graph1Data: WidgetData;
  graph2Data: WidgetData;
  graphsData: WidgetData[];
  opportunityData: WidgetData;
  totalRevenue: string;
  summaryData: RASummaryData;
  metricType: string = 'onLoad';

  //table realted fields. 
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  filterLabel: string = '';
  metadata: Metadata;

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


  responsiveOptions;

  constructor(private service: RevenueAnalyticsService,private metadataService: MetadataService) {
    const me = this;
    me.metadataService.getMetadata().subscribe(metadata => {
      me.metadata = metadata;
    });
    me.breadcrumb = [
      { label: 'Revenue Analytics' },
    ];

    this.graph0Data = {
      title: 'Page Performance vs Revenue',
      loading: false,
      empty: false,
      data: RA_GRAPH0_DATA,
      error: null
    };

    this.graph1Data = {
      title: 'Optimized Page Performance Metric vs Revenue Gain Per Day',
      loading: false,
      empty: false,
      data: RA_GRAPH1_DATA,
      error: null
    };

    this.graph2Data = {
      title: 'Page Performance Improvement vs Revenue Gain Per Day',
      loading: false,
      empty: false,
      data: RA_GRAPH2_DATA,
      error: null
    };

    this.graphsData = [this.graph0Data, this.graph1Data, this.graph2Data];

    this.tableData = {
      loading: false,
      empty: false,
      data: RA_TABLE,
      error: null
    }

    me.cols = me.tableData.data.headers[0].cols;
    for (const c of me.tableData.data.headers[0].cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    this.opportunityData = {
      loading: false,
      empty: false,
      data: {
        monthlyOpportunity: '$0',
        anualOpportunity: '$0',
        lastMonthSale: '$0'
      } as OpportunityData,
      error: null
    }

    this.totalRevenue = '$0.00';

    this.summaryData = RA_SUMMARY_DUMMY_DATA;
  }

  ngOnInit(): void {

  }

  applyFilter(filter: RevenueAnalyticsFilter) {
    console.log('applyFilter : ', filter);
    this.setFilterLabel(filter);

    this.metricType = filter.metricType;
    this.loadRevenueTableData(filter);
    this.loadRevenueGraphData(filter);
    this.loadRevenueOpportunity(filter);
  }

  setFilterLabel(filter: RevenueAnalyticsFilter) {
    this.filterLabel = '';
    if (filter.timeFilter) {
      if (filter.timeFilter.last != '') {
        this.filterLabel += 'Last: ' + filter.timeFilter.last;
      } else {
        this.filterLabel += 'From: ' + filter.timeFilter.startTime;
        this.filterLabel += ', To: ' + filter.timeFilter.endTime;
      }
    } else {
      this.filterLabel += 'Last: 15 Minutes';
    }

    if (filter.pages != '-2') {
      const pagesID = filter.pages.split(/\s*,\s*/).map(Number);
      const pages = pagesID.map(page => this.metadata.pageNameMap.get(page).name);

      this.filterLabel += ', Pages: ' + pages.join(',');
    }

    if (filter.channels) {
      const channelID = filter.channels.split(/\s*,\s*/).map(Number);
      const channels = channelID.map(channel => this.metadata.channelMap.get(channel).name);

      this.filterLabel += ', Channels: ' + channels.join(',');
    }

    if (filter.metricType) {
      this.filterLabel += ', Metric Type: ' + filter.metricType;
    }

    if (filter.rollingwindow) {
      this.filterLabel += ', Rolling Window: ' + filter.rollingwindow + ' Day';
    }

    if (filter.granularity) {
      this.filterLabel += ', Granularity: ' + filter.granularity;
    }

  }

  loadRevenueTableData(filter: RevenueAnalyticsFilter) {
    this.service.LoadRevenueAnalyticsData(filter, 'pageRevenueList').subscribe((state) => {
      if (state instanceof RevenueAnalyticsLoadingState) {
        this.tableData.loading = true;
        this.tableData.empty = false;
        this.tableData.error = null;
        this.tableData.data.data = [];
        // reset sumamry data. 
        this.summaryData = RA_SUMMARY_DUMMY_DATA;
      } else if (state instanceof RevenueAnalyticsLoadedState) {
        this.tableData.loading = false;

        let data = state.data as any[];

        if (!data || !data.length || !data[0].pages) {
          this.tableData.empty = true;
        } else {
          this.fillTableData(data[0]);
        }


      } else if (state instanceof RevenueAnalyticsErrorState) {
        this.tableData.loading = false;
        this.tableData.error = {
          message: 'Error in loading Revenue Analytics Data. '
        };
      }
    });
  }

  fillTableData(response: any) {
    let revenuetabledata = [];

    const totalPageViews = response.totalpageviews;

    let pages = response.pages as any[];

    const me = this;

    pages.forEach(page => {
      if (page.pageid == '-2') {
        // update summary.
        me.summaryData.avgMetricValue = page.metric + ' sec';
        me.summaryData.avgOptimalMetricValue = page.optimalMetricValue + ' sec';
        me.summaryData.avgSlowerOptimalPct = page.slowerOptimalPct + '%';
        me.summaryData.totalRAloss = me.nFormatter(parseFloat(page.raLoss), 2);
        me.summaryData.totalRevenueGain1s = me.nFormatter(parseFloat(page.gain["revenueGain1s"]), 2);
        me.summaryData.totalRevenueGain2s = me.nFormatter(parseFloat(page.gain["revenueGain2s"]), 2);
        me.summaryData.totalRevenueGain3s = me.nFormatter(parseFloat(page.gain["revenueGain3s"]), 2);
        me.summaryData.totalRevenue = me.nFormatter(parseFloat(response.totalRevenue), 2);
        return;
      }

      revenuetabledata.push(new Revenuetable(page, totalPageViews));
    });

    this.tableData.data.data = revenuetabledata;
  }

  loadRevenueGraphData(filter: RevenueAnalyticsFilter) {
    this.service.LoadRevenueAnalyticsData(filter, 'pagePerformanceFilter').subscribe((state) => {
      if (state instanceof RevenueAnalyticsLoadingState) {
        this.graph0Data = {
          loading: true,
          empty: false,
          error: null,
          data: RA_GRAPH0_DATA
        };
      } else if (state instanceof RevenueAnalyticsLoadedState) {
        this.graph0Data.loading = false;
        //calculate overall graph data. 
        let data = state.data as any[];
        if (data.length)
          this.calculateGraph0Data(state.data, filter.metricType);
        else {
          this.graph0Data.empty = false;
        }
      } else if (state instanceof RevenueAnalyticsErrorState) {
        this.graph0Data.loading = false;
        this.graph0Data.error = {
          message: 'Error in loading revenue analytics data'
        }
      }
    });
  }

  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    }
    else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  calculateGraph0Data(data: any, metric: string) {
    let sessionCount = [];
    let pageviews = [];
    let ordertotal = [];
    let ordercount = [];
    let conversion = [];

    let res = data.sort(this.sortFunction);

    let categories = [];
    for (let r = 0; r < res.length; r++) {
      categories.push(res[r][0]);
      sessionCount.push(parseFloat(res[r][1]));
      pageviews.push(parseFloat(res[r][2]));
      ordertotal.push(parseFloat(res[r][3]));
      ordercount.push(parseFloat(res[r][4]));
      conversion.push(parseFloat(res[r][5]));
    }

    let graphData = { ...RA_GRAPH0_DATA };
    // let graphData = JSON.parse(JSON.stringify(RA_GRAPH0_DATA));

    //graphData.highchart.title.text = `${graphData.highchart.title.text}_${Date.now()} `;

    graphData.highchart.xAxis['title'].text = `${metric} (sec)`

    graphData.highchart.series[0]['data'] = sessionCount;

    graphData.highchart.series[1]['data'] = pageviews;

    graphData.highchart.series[2]['data'] = ordertotal;

    graphData.highchart.series[3]['data'] = ordercount;

    graphData.highchart.series[4]['data'] = conversion;

    this.graph0Data.data = graphData;

    this.graphsData = [];

    const me = this;
    setTimeout(() => {
      this.graphsData = [this.graph0Data, this.graph1Data, this.graph2Data]
    }, 0);

  }

  loadOptimizedPagePerformanceGraphData(filter: RevenueAnalyticsFilter) {
    this.service.LoadRevenueAnalyticsData(filter, 'pageRevenueList').subscribe((state) => {
      if (state instanceof RevenueAnalyticsLoadingState) {

      } else if (state instanceof RevenueAnalyticsLoadedState) {

      } else if (state instanceof RevenueAnalyticsErrorState) {

      }
    });
  }

  loadPagePerformanceImprovementGraphData(filter: RevenueAnalyticsFilter) {
    this.service.LoadRevenueAnalyticsData(filter, 'pageRevenueList').subscribe((state) => {
      if (state instanceof RevenueAnalyticsLoadingState) {

      } else if (state instanceof RevenueAnalyticsLoadedState) {

      } else if (state instanceof RevenueAnalyticsErrorState) {

      }
    });
  }

  loadRevenueOpportunity(filter: RevenueAnalyticsFilter) {
    this.service.LoadRevenueAnalyticsData(filter, 'annualRevenue').subscribe((state) => {
      if (state instanceof RevenueAnalyticsLoadingState) {
        this.opportunityData = {
          loading: true,
          error: null,
          empty: false,
          data: {
            lastMonthSale: '$0',
            monthlyOpportunity: '$0',
            anualOpportunity: '$0'
          } as OpportunityData
        }
      } else if (state instanceof RevenueAnalyticsLoadedState) {
        this.opportunityData.loading = false;
        let data: any = state.data;
        if (!data || !data.oneMonthTrailing) {
          this.opportunityData.empty = true;
        } else {
          this.opportunityData.data = {
            lastMonthSale: this.nFormatter(parseFloat(data.oneMonthTrailing), 2),
            monthlyOpportunity: this.nFormatter(parseFloat(data.oneMonthOpporuntiy), 2),
            anualOpportunity: this.nFormatter(parseFloat(data.annulOpporunity), 2)
          } as OpportunityData;
        }
      } else if (state instanceof RevenueAnalyticsErrorState) {
        this.opportunityData.loading = false;
        this.opportunityData.error = {
          message: 'Error in loading Revenue Analytics data.'
        }
      }
    });
  }

  nFormatter(num, decimalplaces) {

    if (num >= 1000000000) {
      return '$' + ((num / 1000000000).toFixed(decimalplaces).replace(/\.0$/, '') + 'B');
    }
    if (num >= 1000000) {
      return '$' + ((num / 1000000).toFixed(decimalplaces).replace(/\.0$/, '') + 'M');
    }
    if (num >= 1000) {
      return '$' + ((num / 1000).toFixed(decimalplaces).replace(/\.0$/, '') + 'K');
    }
    return '$' + num.toFixed(decimalplaces);
  }

}
