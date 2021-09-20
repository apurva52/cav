import { Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../home-sessions/common/service/nvhttp.service';
import { SessionStateService } from '../../home-sessions/session-state.service';
import { PageDetailsComponent } from '../page-details/page-details.component';
import { EditFilter, FilterCriteria, FunnelData, ProceedToType, RevenueDetails } from '../service/funnel.model';
import { FunnelService } from '../service/funnel.service';

@Component({
  selector: 'app-funnel-details',
  templateUrl: './funnel-details.component.html',
  styleUrls: ['./funnel-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FunnelDetailsComponent implements OnInit {
  @HostBinding('class.selected') isSelected: boolean = false;


  @Output() compare = new EventEmitter<boolean>();
  @Output() funnelDetails = new EventEmitter<FunnelDetailsComponent>();
  @Input() compareMode: boolean;
  @Input() closeCompareIcon: boolean;

  @Input() pageDetailsComponent: PageDetailsComponent;

  toggle: boolean;

  revenueData: RevenueDetails;
  pageDetails: FunnelData;

  editPageDetails: boolean;

  pages: any[] = [];
  rowWidth: number;

  CurrentPage: string;
  index: number;
  chartData: ChartConfig;
  Math = Math;


  filterCriteria: FilterCriteria;
  totalEntryUser: number;
  data: FunnelData[] = [];

  loading: boolean;
  error: Error | AppError;
  origData: FunnelData[];
  filterLabel: string = '';
  selectedPage: string;
  retryCount: number = 0;

  constructor(private http: NvhttpService, private funnelService: FunnelService, private stateService: SessionStateService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    // check the previous URL
    const previousURL = this.funnelService.getPreviousUrl();
    const fromBreadcrumb = this.route.snapshot.queryParams['from'] == 'breadcrumb';
    // if the navigation was from home-sessions, restore the funnel state if saved
    if ((fromBreadcrumb || previousURL === '/home/home-sessions?from=funnel') && !this.compareMode) {
      // check if the filterCriteria exists
      let filterCriteria = this.stateService.get('funnel.filterCriteria', null);
      if (filterCriteria) {
        this.setFilterCritiera(filterCriteria);
      }
      // check if data is also present
      let data = this.stateService.get('funnel.data', []);
      if (data.length) {
        this.data = data;
        this.setFunnelData();

      } else {
        this.onSubmit(filterCriteria);
      }
    } else {
      // reset the state
      this.stateService.set('funnel.filterCriteria', null);
      this.stateService.set('funnel.data', []);
    }

    this.funnelService.on('selectedPage').subscribe((data: string) => {

      for (let i = 0; i < this.pages.length - 1; i++) {

        // ISSUE: http://10.10.30.34/bugzilla/show_bug.cgi?id=108446
        if (data === this.CurrentPage && this.compareMode) {
          break;
        }
        if (data === this.pages[i].PageName) {
          this.index = i;
          this.CurrentPage = data;

          this.pageDetails = this.pages[i];
          return;
        }
      }
      this.index = -1;
      this.CurrentPage = '';
    });
  }

  funnelCalculate(data: FunnelData[]) {
    this.pages = [];
    const mx_width: number = 100;
    let min_width: number;
    const no_of_rows = data.length;
    min_width = mx_width / no_of_rows;
    let x: number = 0;
    let y: number = 0;
    for (let i = 0; i < no_of_rows; i++) {
      this.rowWidth = mx_width - min_width * (i + 1 - 1);
      x = 100 - this.rowWidth / 2 - 50;
      y = (i + 1 - 1) * 50;
      this.pages.push({
        width: this.rowWidth,
        x,
        y,
        PageName: data[i].PageName,
        TotalCount: data[i].TotalCount,
        EntryPage: data[i].EntryPage,
        ExitPage: data[i].ExitPage,
        BPNextPageCount: data[i].BPNextPageCount,
        BPNextPageCountPct: Number(data[i].BPNextPageCountPct.replace('%', '')),
        BPProcessedProceedTo: data[i].BPProcessedProceedTo,
        shadowBoxBackground: data[i].shadowBoxBackground,
        BPProceedTo: data[i].BPProceedTo
      });
    }

    console.log('Pages : ', this.pages);
  }

  viewPageDetails(pageData: FunnelData, i?: number) {
    this.funnelService.broadcast('selectedPage', pageData.PageName);
  }


  getChartData(value: number): void {
    this.chartData = {
      highchart: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 130,
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            size: '120%',
            dataLabels: {
              enabled: false,
              format: ''
            }
          }
        },
        series: [{
          data: [
            {
              name: 'Converted Sessions',
              y: value,
              selected: true,
              color: '#6297c7'
            }, {
              name: 'Abandoned Sessions',
              y: 100 - value,
              color: '#f38889'

            }
          ], type: 'pie'
        }]
      }
    };
  }

  onSubmit(filterCriteria: FilterCriteria) {
    this.setFilterCritiera(filterCriteria);


    console.log('FilterCriteria : ', filterCriteria);

    this.http.getBusinessProcess(filterCriteria).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;

        this.data = [];
        this.pages = [];
        this.pageDetails = null;
        this.funnelDetails.emit(this);

      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        // Handling for TSDB
        if (state.data.error) {
          this.data = [];
          let error = JSON.parse(state.data.error);

          // show error message
          this.messageService.add({ severity: 'error', summary: error.msg, detail: error.detailedMsg, life: 5000 });
          return;
        } else {
          this.data = state.data.data ? (JSON.parse(state.data.data)).FunnelData : state.data.FunnelData;
        }

        this.setFunnelData();
      }


    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data = [];
        this.pages = [];
        this.pageDetails = null;
      }
    });
  }

  setFunnelData() {
    try {
      this.getPercentageExit(this.data);

    } catch (error) {

      // Max 3 retry
      if (this.retryCount < 3) {
        this.retryCount++;
        console.error('Complete data not received. Refetching the data...');
        this.onSubmit(this.filterCriteria);
      }

      return;
    }

    this.retryCount = 0;
    // save the data for future use
    this.origData = JSON.parse(JSON.stringify(this.data));

    this.funnelCalculate(this.data);
    this.viewPageDetails(this.pages[0]);

    this.funnelDetails.emit(this);

    this.chartData = null;
    this.getChartData(this.pages[this.pages.length - 1].BPNextPageCountPct);
  }

  setFilterCritiera(filterCriteria: FilterCriteria) {
    this.filterLabel = '';
    this.filterCriteria = filterCriteria;

    // setting label for filter tooltip
    this.filterLabel = `<b>BP</b>: ${filterCriteria.bpname}, <b>Channel</b>: ${filterCriteria.channel}, <b>User Segment</b>: ${filterCriteria.usersegment}, `;

    if (filterCriteria.timeFilter.last !== '') {
      this.filterLabel += `<b>Last</b>: ${filterCriteria.timeFilter.last}`;
    } else {
      this.filterLabel += `<b>From</b>: ${filterCriteria.timeFilter.startTime}, <b>To</b>: ${filterCriteria.timeFilter.endTime}`;
    }
  }

  getPercentageExit(data: FunnelData[]): void {
    this.totalEntryUser = 0;
    let tempNodes: any;
    const BPEntryCounts = {};

    for (const bp of data) {
      // Check if data is valid or not. 
      if (bp.TotalCount < bp.ExitPage.TotalExitCount) {
        // TODO: Check why is this happening. 
        console.error('Data is not valid. Trying to auto correct. ');
        // changing exit count.
        bp.ExitPage.TotalExitCount = bp.TotalCount;

        // Update ExitDetail too. 
        // mark all as self exit and remove any event. 
        bp.ExitPage.BPExitPageEvents = [];
        bp.ExitPage.ExitDetails = [{
          pageName: '(exit)',
          counts: bp.ExitPage.TotalExitCount,
          ExitPageEvents: [],
          TransitPageEvents: []
        }]
      }

      // calculate the total entry user
      this.totalEntryUser += bp.EntryPage.TotalEntryCount;
      //for (const entry of bp.EntryPage.EntryDetail) {
      //   this.totalEntryUser += Number(entry.entryCount);
      //}

      //const TIC = bp.TotalCount;
      //const TEC = bp.ExitPage.TotalExitCount;
      //let percentageExit = 0;
      //if (TEC <= 0) {
      //  percentageExit = 0;
      //} else {
      //  percentageExit = Math.round(TEC * 100 / TIC);
      //}

      let entryPct = ((bp.TotalCount - bp.ExitPage.TotalExitCount) * 100 / bp.TotalCount);
      bp.EntryPage.entryCountPct = parseFloat(entryPct.toFixed(0));
      //bp.EntryPage.entryCountPct = 100 - percentageExit;
      bp.ExitPage.exitCountPct = 100 - bp.EntryPage.entryCountPct;
      //bp.ExitPage.exitCountPct = percentageExit;

      if (bp.BPProceedToNextPage.indexOf('Funnel Conversion Rate') == -1) {
        tempNodes = this.getProceedToEntry(bp.BPProceedToNextPage.replace(/<br>$/, ''));
        // save this as proceeded to. 
        bp.BPProceedTo = tempNodes.map(a => {
          return { node: a.node, count: parseInt(a.count) };
        });
        bp.BPProcessedProceedTo = this.processProceededTo(tempNodes);
        let barSize = parseFloat((125 / bp.BPProcessedProceedTo.length).toFixed(2));
        bp.shadowBoxBackground = `repeating-linear-gradient(0deg,#bbb,#bbb ${barSize}px,#eaeaea 0,#eaeaea ${2 * barSize}px)`;
      } else {
        bp.BPProceedTo = [];
        bp.BPProcessedProceedTo = [];
        bp.shadowBoxBackground = 'repeating-linear-gradient(0deg,#bbb,#bbb 125px,#eaeaea 0,#eaeaea 256px)';
        continue;
      }

      for (const tempNode of tempNodes) {
        // check if node exist then add that count else create a new array.
        if (!BPEntryCounts.hasOwnProperty(tempNode.node)) { BPEntryCounts[tempNode.node] = []; }

        BPEntryCounts[tempNode.node].push({
          pageName: bp.PageName,
          entryCount: tempNode.count
        });
      }
      bp['prevTotalCount'] = bp.TotalCount;

    }

    let prevPageName = '';
    for (const bpdata of data) {
      if (bpdata.BPProceedToNextPage.indexOf('Funnel Conversion Rate') === -1) {
        for (const k in BPEntryCounts[bpdata.PageName]) {
          //if (prevPageName !== '' && BPEntryCounts[bpdata.PageName][k].pageName === prevPageName) { continue; }
          bpdata.EntryPage.EntryDetail.push({
            pageName: BPEntryCounts[bpdata.PageName][k].pageName,
            entryCount: BPEntryCounts[bpdata.PageName][k].entryCount.toLocaleString()
          });
          bpdata.EntryPage.TotalEntryCount += Number((BPEntryCounts[bpdata.PageName][k].entryCount).replace(/\D/g, ''));
        }
      }
      prevPageName = bpdata.PageName;
    }
  }

  getProceedToEntry(data: string): any {
    let d: any;
    const nodes = [];
    let node: string;
    let count: number;
    d = data.split('<br>');
    for (const e of d) {
      node = e.replace(/^Proceeded to ([a-zA-Z0-9]*) .*$/, '$1');
      count = e.replace(/^Proceeded to .* \(([0-9,]+)\)$/, '$1').replace(/,/g, '');
      nodes.push({
        node,
        count
      });
    }
    return nodes;
  }

  onCompareMode(e): void {
    // deselect/collapse the page on compare
    if (e) {
      this.CurrentPage = '';
      this.index = -1;
    }

    // close the edit mode if opened
    if (this.pageDetailsComponent) {
      if (this.pageDetailsComponent.editMode) {
        this.pageDetailsComponent.editDetails(false);
      }
    }
    this.compareMode = e;
    this.compare.emit(e);
  }

  restoreData(): void {
    this.data = JSON.parse(JSON.stringify(this.origData));
    this.funnelCalculate(this.data);
    this.viewPageDetails(this.pages[0]);
  }

  processProceededTo(original: ProceedToType[]): ProceedToType[] {
    // sort in descending order. 
    let output = original.sort((a, b) => (b.count - a.count));

    if (output.length > 5) {
      let othersCount = output.slice(4).reduce((a, b) => (a + b.count), 0);
      // replace last node with this. 
      output[4] = { node: 'Others', count: othersCount };
    }

    return output;
  }

}
