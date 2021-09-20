import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { NVAppConfigService } from '../../common/service/nvappconfig.service';
import { SessionStateService } from '../../session-state.service';
import { MARKETING_ANALYTICS_TABLE, MA_DETAIL_CHART, MA_MEDIUM_TABLE, MA_SOURCE_TABLE, PANEL_DUMMY } from '../service/marketing-analytics.dummy';
import { MADetailFilter, MarketingAnalyticsOverviewFilter } from '../service/marketing-analytics.model';
import { MarketingAnalyticsService } from '../service/marketing-analytics.service';
import { MarketAnalyticsLoadingState, MarketAnalyticsLoadedState, MarketAnalyticsErrorState } from '../service/marketing-analytics.state';

@Component({
  selector: 'app-marketing-analytics-detail',
  templateUrl: './marketing-analytics-detail.component.html',
  styleUrls: ['./marketing-analytics-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarketingAnalyticsDetailComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  mediumData: Table;
  sourceData: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  campaigns: string[];
  selectedCampaign: string;

  cols1: TableHeaderColumn[] = [];
  _selectedColumns1: TableHeaderColumn[] = [];
  globalFilterFields1: string[] = [];


  cols2: TableHeaderColumn[] = [];
  _selectedColumns2: TableHeaderColumn[] = [];
  globalFilterFields2: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  panel: any;
  visualChart: VisualChart;

  appConfig: any;

  constructor(private service: MarketingAnalyticsService, private stateService: SessionStateService,
    private router: Router, private route: ActivatedRoute, private nvAppConfig: NVAppConfigService) {

    // set appConfig.
    this.nvAppConfig.getdata().subscribe((data: any) => {
      // FIXME: handle case when config is not loaded. 
      this.appConfig = data;
    });
  }

  ngOnInit(): void {

    const me = this;

    me.breadcrumb = [
      { label: 'Marketing Analytics', routerLink: '/marketing-analytics' },
      { label: 'Marketing Analytics Detail' }
    ]

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.panel = PANEL_DUMMY;

    me.visualChart = MA_DETAIL_CHART;

    me.sourceData = MA_SOURCE_TABLE;

    me.mediumData = MA_MEDIUM_TABLE;

    this.totalRecords = 0;

    me.cols1 = me.mediumData.headers[0].cols;
    for (const c of me.mediumData.headers[0].cols) {
      me.globalFilterFields1.push(c.field);
      if (c.selected) {
        me._selectedColumns1.push(c);
      }
    }


    me.cols2 = me.sourceData.headers[0].cols;
    for (const c of me.sourceData.headers[0].cols) {
      me.globalFilterFields2.push(c.field);
      if (c.selected) {
        me._selectedColumns2.push(c);
      }
    }

    // get campaigns and selected campaigns.
    this.campaigns = this.stateService.get('ma.campaigns');

    // if campaign not found then move to overview page. 
    if (!this.campaigns) {
      this.router.navigate(['marketing-analytics'], { replaceUrl: true });
      return;
    }

    // registr to get selected campain. 
    this.route.queryParams.subscribe(params => {
      console.log('marketing-analytics-detail, params change - ', params, ' this.campaigns : ', this.campaigns);
      this.selectedCampaign = params['selectedCampaign'];
      const timeFilter = JSON.parse(params['timeFilter']);

      //reload data. 
      this.applyFilter({
        timeFilter: timeFilter,
        bucket: '5 mins',
        campaign: encodeURIComponent(this.selectedCampaign)
      });
    });
  }

  @Input() get selectedColumns1(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns1;
  }
  set selectedColumns1(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns1 = me.cols1.filter((col) => val.includes(col));
  }

  @Input() get selectedColumns2(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns2;
  }
  set selectedColumns2(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns2 = me.cols2.filter((col) => val.includes(col));
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
    let filter: MADetailFilter = {
      timefilter: $event.timeFilter,
      bucket: $event.bucket,
      campaign: encodeURIComponent($event.campaign)
    };

    // get table data. 
    this.service.LoadDetailCampaignData(filter).subscribe((state: Store.State) => {
      if (state instanceof MarketAnalyticsLoadingState) {
        this.dataLoading();
      } else if (state instanceof MarketAnalyticsLoadedState) {
        this.dataLoaded(state);
      } else if (state instanceof MarketAnalyticsErrorState) {
        this.dataLoadError(state);
      }
    });

    // get graph data. 
    this.service.LoadDetailCampaignGraphData(filter).subscribe((state: Store.State) => {
      if (state instanceof MarketAnalyticsLoadingState) {
        // TODO: check other things. 
        this.resetChartData();
      } else if (state instanceof MarketAnalyticsLoadedState) {
        console.log('MA Detail, graph data loaded.');
        this.setChartData(state.data as any[]);
      } else if (state instanceof MarketAnalyticsErrorState) {
        // TODO: 
        console.error('MA Detail: Error in loading graph data. ');
      }
    });

  }

  setChartData(resp: any[]) {
    let sr = [];
    let sar = [];  //array for sessions
    let par = [];  //array for pages
    let otar = []; //array for order total
    let ocar = []; //array for order count
    let convRate = []; //array for conversion rate
    let bounceRate = []; //array for bounce rate
    if (resp != null && resp != undefined) {
      let res = resp[0];
      for (let r = 0; r < res.length; r++) {
        let s = [];
        let datetime = (res[r]["bucket"] + this.appConfig.cavEpochDiff) * 1000;
        s.push(datetime);
        s.push(parseFloat(res[r]['sessions']));
        sar.push(s);
        let l = [];
        l.push(datetime);
        l.push(parseInt(res[r]['pages']));
        par.push(l);
        let t = [];
        t.push(datetime);
        t.push(parseInt(res[r]['ordertotal']));
        otar.push(t);
        let c = [];
        c.push(datetime);
        c.push(parseInt(res[r]['ordercount']));
        ocar.push(c);
        let cr = [];
        cr.push(datetime);
        cr.push(parseInt(res[r]['conversion_rate']));
        convRate.push(cr);
        let br = [];
        br.push(datetime);
        br.push(parseInt(res[r]['bounce_rate']));
        bounceRate.push(br);
      }
    }

    // set data. 
    let series = this.visualChart.charts[0].highchart.series;

    series[0]['data'] = sar; // session

    series[1]['data'] = par; // pages

    series[2]['data'] = otar; // Order total

    series[3]['data'] = ocar; // order count

    series[4]['data'] = convRate; // conv. 

    series[5]['data'] = bounceRate; // bounce rate. 

    // update data.
    this.visualChart.charts[0] = { ...this.visualChart.charts[0] };
  }

  resetChartData() {
    let series = this.visualChart.charts[0].highchart.series;

    series[0]['data'] = []; // session

    series[1]['data'] = []; // pages

    series[2]['data'] = []; // Order total

    series[3]['data'] = []; // order count

    series[4]['data'] = []; // conv. 

    series[5]['data'] = []; // bounce rate. 

    // update data.
    this.visualChart.charts[0] = { ...this.visualChart.charts[0] };
  }

  dataLoaded(state: MarketAnalyticsLoadedState) {
    this.loading = false;

    // at 0th medium data and at 1st source data. 
    let data: any[] = state.data as any[];

    this.setMediumData(data[0]);

    this.setSourceData(data[1]);

  }




  setMediumData(data: any) {
    let mediumData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        sessiondur: parseFloat(data[i].sessiondur),
        totalsession: parseInt(data[i].totalsession),
        avg_nop_in_session: parseInt(data[i].avg_nop_in_session),
        ordercount: parseInt(data[i].ordercount),
        medium: data[i].medium,
        pagecount: parseInt(data[i].pagecount),
        conversionrate: parseFloat(data[i].conversionrate),
        bouncerate: parseFloat(data[i].bouncerate),
        ordertotal: parseInt(data[i].ordertotal)
      };
      mediumData.push(obj);
    }

    this.mediumData.data = mediumData;
  }

  setSourceData(data: any) {
    let sourceData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        sessiondur: parseFloat(data[i].sessiondur),
        totalsession: parseInt(data[i].totalsession),
        avg_nop_in_session: parseInt(data[i].avg_nop_in_session),
        ordercount: parseInt(data[i].ordercount),
        source: data[i].source,
        pagecount: parseInt(data[i].pagecount),
        conversionrate: parseFloat(data[i].conversionrate),
        bouncerate: parseFloat(data[i].bouncerate),
        ordertotal: parseInt(data[i].ordertotal)
      };
      sourceData.push(obj);
    }

    this.sourceData.data = sourceData;
  }


  dataLoadError(state: MarketAnalyticsErrorState) {
    this.loading = false;
    this.error = {
      msg: (state.error && state.error.message) ? state.error.message : 'Error in loading data.'
    };
  }

  dataLoading() {
    this.mediumData.data = [];
    this.sourceData.data = [];
    this.totalRecords = 0;
    this.loading = true;
    this.empty = false;
  }



}
