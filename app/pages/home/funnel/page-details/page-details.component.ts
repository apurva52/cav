import { Component, Input, ViewEncapsulation, OnChanges, ViewChild, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem, Slider } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Cols } from '../../home-sessions/common/interfaces/cols';
import { Metadata } from '../../home-sessions/common/interfaces/metadata';
import { SessionFilter } from '../../home-sessions/common/interfaces/sessionfilter';
import { TimeFilter } from '../../home-sessions/common/interfaces/timefilter';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../home-sessions/common/service/nvhttp.service';
import { SessionStateService } from '../../home-sessions/session-state.service';
import { FunnelDetailsComponent } from '../funnel-details/funnel-details.component';
import { EditFilter, FunnelData, Improvement } from '../service/funnel.model';
import { FunnelService } from '../service/funnel.service';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PageDetailsComponent implements OnChanges, OnInit, AfterViewInit {
  @ViewChild('slider') slider: Slider;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onEditMode = new EventEmitter<boolean>();
  @Output() pageDetails = new EventEmitter<PageDetailsComponent>();
  @Input() funnelDetails: FunnelDetailsComponent;
  @Input() data: FunnelData;

  editMode: boolean;

  entryPageTableCols: TableHeaderColumn[];
  entryPageTableData: any[];

  exitPageTableCols: TableHeaderColumn[];
  exitPageTableData: any[];

  loading: boolean;

  revenueValue: EditFilter;
  completedUser: EditFilter;
  conversionRate: EditFilter;

  entryPageCols: Cols[];
  exitPageCols: Cols[];

  orderTotal: number = null;

  metadata: Metadata;
  lastPage: FunnelData;
  firstPage: any;

  constructor(
    private http: NvhttpService,
    private messageService: MessageService,
    private stateService: SessionStateService,
    private router: Router,
    private funnelService: FunnelService
  ) {
    this.entryPageCols = [
      { header: 'Entry Page', field: 'pageName' },
      { header: 'Count', field: 'entryCount', width: '49%', classes: 'text-right' }
    ];

    this.exitPageCols = [
      { header: 'Exit Page', field: 'pageName', sort: true },
      { header: 'Count', field: 'counts', sort: true, classes: 'text-right' },
      { header: 'Exit Page Events', field: 'ExitPageEvents', sort: false },
      // { header: 'Transit Page Events', field: 'TransitPageEvents', sort: false },
    ];
  }

  ngOnChanges(): void {

    if (this.data) {
      // setting min value for entry slider
      if (this.data.EntryPage.entryCountPct) {
        if (!this.data.EntryPage.hasOwnProperty('minEntryCountPct')) {
          this.data.EntryPage['minEntryCountPct'] = this.data.EntryPage.entryCountPct;
        }
      }
      // setting max value for bpexit events
      if (this.data.ExitPage.hasOwnProperty('BPExitPageEvents')) {
        for (const i of this.data.ExitPage.BPExitPageEvents) {
          if (!i.hasOwnProperty('maxEventCount')) {
            i['maxEventCount'] = i.count;
          }
        }
      }
      this.firstPage = this.funnelDetails.pages[0];
      this.lastPage = this.funnelDetails.pages[this.funnelDetails.pages.length - 1];
      this.addIconCls(this.data);
    }
    console.log('Page-details | data : ', this.data);
  }

  ngOnInit(): void {
    this.pageDetails.emit(this);
  }

  editDetails(flag): void {
    this.editMode = flag;

    if (!flag) {
      this.funnelDetails.restoreData();
    }

    if (this.orderTotal == null) {
      this.getTotalOrder();
    }


    this.completedUser = {
      color: null,
      icon: null,
      percent: null,
      newValue: null,
      oldValue: this.lastPage.TotalCount,
    };

    this.conversionRate = {
      color: null,
      icon: null,
      newValue: null,
      percent: null,
      oldValue: Number(this.lastPage.BPNextPageCountPct)
    };

    this.revenueValue = {
      color: null,
      icon: null,
      percent: null,
      oldValue: this.orderTotal,
      newValue: null
    };

    this.funnelDetails.chartData = null;
    setTimeout(() => {
      this.funnelDetails.getChartData(this.conversionRate.oldValue);
    });

  }

  getTotalOrder(): void {
    let filterCriteria: { bpid: number, channel: number, usersegment: number, order: boolean, timeFilter: TimeFilter };
    const filter = this.funnelDetails.filterCriteria;
    this.metadata = this.funnelService.metadata;

    // get bpid from bpname
    const tmpArr: any[] = Array.from(this.metadata.bpMap.keys());
    const bpList = tmpArr.map((key) => {
      return {
        label: this.metadata.bpMap.get(key).name,
        value: this.metadata.bpMap.get(key).id
      };
    });

    const index = bpList.findIndex(bp => bp.label === filter.bpname);

    filterCriteria = {
      bpid: bpList[index].value,
      channel: filter.channel === 'Overall' ?
        -1 : this.metadata.getChannelByName(filter.channel).id,
      usersegment: filter.usersegment === 'Overall' ?
        -1 : this.metadata.getUserSegmentFromName(filter.usersegment).id,
      order: true,
      timeFilter: filter.timeFilter
    };

    this.http.getBusinessProcessOrderTotal(filterCriteria).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.orderTotal = Number(state.data);
        this.revenueValue.oldValue = this.orderTotal;
      }

    }, (error: Store.State) => {
      if (error instanceof NVPreLoadingErrorState) {
        this.loading = error.loading;
        this.messageService.add({ severity: 'danger', summary: 'Error Message', detail: 'Failed to get the total order' });
      }
    });
  }

  entryCountChange(value: number, page: FunnelData): void {
    // we are calculating only positive revenue
    if (value < page.EntryPage['minEntryCountPct']) {
      page.EntryPage.entryCountPct = page.EntryPage['minEntryCountPct'];
      this.slider.value = page.EntryPage['minEntryCountPct'];
    }

    page.ExitPage.exitCountPct = 100 - page.EntryPage.entryCountPct;
  }

  calculateNewEntry(): void {
    const benefit: number = this.getBenefit(0, 0);
    const lastNode: FunnelData = this.lastPage;

    this.updateRevenue(lastNode.TotalCount, benefit + lastNode.TotalCount);

    this.showNewProceededUser(benefit);

    this.funnelDetails.chartData = null;
    setTimeout(() => {
      if (this.conversionRate.newValue) {
        this.funnelDetails.getChartData(this.conversionRate.newValue);
      }
    });
  }

  showNewProceededUser(benefit: number): void {
    const conRate = Number(Math.min(100, ((benefit + this.lastPage.TotalCount) / this.funnelDetails.totalEntryUser * 100)).toFixed(2));

    const conUser = Math.min(this.funnelDetails.totalEntryUser, (benefit + this.lastPage.TotalCount));
    if (benefit > 0) {

      this.conversionRate.icon = 'pi pi-arrow-up';
      this.conversionRate.color = 'green';
      this.conversionRate.percent = Math.abs((conRate - this.conversionRate.oldValue) / this.conversionRate.oldValue);
      this.conversionRate.newValue = conRate;

      this.completedUser.icon = 'pi pi-arrow-up';
      this.completedUser.color = 'green';
      this.completedUser.percent = Math.abs((conUser - this.completedUser.oldValue) / this.completedUser.oldValue);
      this.completedUser.newValue = conUser;

    } else if (benefit < 0) {
      this.conversionRate.icon = 'pi pi-arrow-down';
      this.conversionRate.color = 'red';
      this.conversionRate.percent = Math.abs((conRate - this.conversionRate.oldValue) / this.conversionRate.oldValue);
      this.conversionRate.newValue = conRate;

      this.completedUser.icon = 'pi pi-arrow-down';
      this.completedUser.color = 'red';
      this.completedUser.percent = Math.abs((conUser - this.completedUser.oldValue) / this.completedUser.oldValue);
      this.completedUser.newValue = conUser;

    } else {

    }

  }

  updateRevenue(previoususers: number, newusers: number): void {
    let revenue: number = 0;
    if (this.revenueValue.oldValue == null) {
      this.revenueValue.oldValue = 0;
      revenue = 0;
    } else {
      revenue = this.revenueValue.oldValue / previoususers * newusers;
    }

    if (!revenue) {
      this.conversionRate.color = null;
      this.conversionRate.icon = null;
      this.conversionRate.newValue = null;

      this.completedUser.color = null;
      this.completedUser.icon = null;
      this.completedUser.newValue = null;

      this.revenueValue.color = null;
      this.revenueValue.icon = null;
      this.revenueValue.newValue = null;

      return;
    }

    const revenueIncPercent = Math.abs((revenue - this.revenueValue.oldValue) / this.revenueValue.oldValue);

    if (previoususers > newusers) {

      this.revenueValue.icon = 'pi pi-arrow-down';
      this.revenueValue.color = 'red';
      this.revenueValue.percent = revenueIncPercent;
      this.revenueValue.newValue = revenue;

    } else {

      this.revenueValue.icon = 'pi pi-arrow-up';
      this.revenueValue.color = 'green';
      this.revenueValue.percent = revenueIncPercent;
      this.revenueValue.newValue = revenue;

    }

  }

  getBenefit(index: number, prevCount: number): number {
    const currentNode: FunnelData = this.funnelDetails.pages[index];
    const totalCurrentUser: number = prevCount + currentNode.TotalCount;
    // get modified proceededPct.
    const modifiedProceededPct = this.funnelDetails.pages[index].EntryPage.entryCountPct;

    // calculate proceeded users.
    // take the round figure
    const proceededUsers = (totalCurrentUser * modifiedProceededPct / 100);

    console.log('new proceededUsers ', proceededUsers, ' at node - ', index);

    if (!currentNode.Improvement) {
      currentNode.Improvement = {} as Improvement;
    }

    const improvement: Improvement = currentNode.Improvement;

    improvement.proceededPct = modifiedProceededPct;
    improvement.proceededUsers = proceededUsers;

    //  Process event tuning.
    let actualEventCount = 0;
    let currentEventCount = 0;

    if (currentNode.ExitPage.hasOwnProperty('BPExitPageEvents')) {
      currentNode.ExitPage.BPExitPageEvents.forEach((event) => {
        actualEventCount += (event['maxEventCount'] || event.count);
        currentEventCount += event.count;
      });
    }

    if (currentEventCount != actualEventCount) {
      // calculate per event benifit.
      const exitCount = totalCurrentUser - proceededUsers;
      const perEventContribution = Math.min(1.0, (exitCount * 1.0 / actualEventCount));

      // calculate proceeded users.
      const extraProceededUsers = Math.floor(perEventContribution * (actualEventCount - currentEventCount));

      // calculate proceededUserPct due to these extraProceededUsers.
      const extraPrceededUsersPct = extraProceededUsers * 100.0 / totalCurrentUser;
      improvement.bpEventCount = currentEventCount;
      improvement.perEventContribution = perEventContribution;
      improvement.proceededPct += extraPrceededUsersPct;
      improvement.proceededPct = Math.min(100, improvement.proceededPct);
      improvement.proceededUsers += extraProceededUsers;
    }

    console.log('improvement : ', improvement);

    const savedUser = Math.round(improvement.proceededUsers) - currentNode.BPNextPageCount;

    if (this.funnelDetails.pages[index + 2]) {
      return this.getBenefit(index + 1, savedUser);
    }

    return savedUser;

  }

  setSessionFilterCriteria(): SessionFilter {
    const filter: SessionFilter = new SessionFilter();
    filter.timeFilter = this.funnelDetails.filterCriteria.timeFilter;

    this.metadata = this.funnelService.metadata;

    filter.bpAttributeFilter = {
      useSIDExpiry: true,
      bpName: this.funnelDetails.filterCriteria.bpname,
      completedBP: false,
      abandonedBP: true,
      bpExitPage: '',
      sessionExitPage: '',
      funnelCount: -1,
      bpExitPageEvent: undefined,
      sessionExitPageEvent: undefined,
      transitPageEvent: undefined
    };

    return filter;
  }

  bpBPExitPageDDR(bpExitPage, count): void {
    const filter = this.setSessionFilterCriteria();
    filter.bpAttributeFilter.bpExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);
  }

  bpBPExitPageEventDDR(bpExitPage, bpExitPageEvent, count): void {
    const filter = this.setSessionFilterCriteria();

    filter.bpAttributeFilter.bpExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    filter.bpAttributeFilter.bpExitPageEvent = this.metadata.getEventFromName(bpExitPageEvent).id.toString();
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);

  }

  sessionExitPageDDR(bpExitPage, sessionExitPage, count): void {
    const filter = this.setSessionFilterCriteria();
    // if the session exit page is (exit) then change it to BPExitPage
    if (sessionExitPage === '(exit)') {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    } else {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(sessionExitPage).id;
    }
    filter.bpAttributeFilter.bpExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);
  }

  bpSessionExitPageEventDDR(bpExitPage, sessionExitPage, sessionExitPageEvent, count): void {
    const filter = this.setSessionFilterCriteria();

    if (sessionExitPage === '(exit)') {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    } else {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(sessionExitPage).id;
    }
    filter.bpAttributeFilter.bpExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    filter.bpAttributeFilter.sessionExitPageEvent = this.metadata.getEventFromName(sessionExitPageEvent).id.toString();
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);

  }

  bptransitPageEventDDR(bpExitPage, sessionExitPage, transitPageEvent, count): void {
    const filter = this.setSessionFilterCriteria();

    if (sessionExitPage === '(exit)') {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    } else {
      filter.bpAttributeFilter.sessionExitPage = this.metadata.pageNameMapByName.get(sessionExitPage).id;
    }
    filter.bpAttributeFilter.bpExitPage = this.metadata.pageNameMapByName.get(bpExitPage).id;
    filter.bpAttributeFilter.transitPageEvent = this.metadata.getEventFromName(transitPageEvent).id.toString();
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);

  }

  bpBPCompleteDDR(count): void {
    const filter = this.setSessionFilterCriteria();

    filter.bpAttributeFilter.bpExitPage = '';
    filter.bpAttributeFilter.completedBP = true;
    filter.bpAttributeFilter.abandonedBP = false;
    filter.bpAttributeFilter.funnelCount = count;

    this.setStateData(filter);

  }

  setStateData(filter): void {
    this.stateService.set('sessions.filterCriteria', filter);
    this.stateService.set('sessions.count', filter.bpAttributeFilter.funnelCount);

    // save the state
    this.stateService.set('funnel.filterCriteria', this.funnelDetails.filterCriteria);
    this.stateService.set('funnel.data', this.funnelDetails.data);

    this.router.navigate(['home/home-sessions'], { queryParams: { from: 'funnel' }, replaceUrl: true });
  }

  addIconCls(origData) {
    if (origData.ExitPage.BPExitPageEvents) {
      origData.ExitPage.BPExitPageEvents.forEach((d) => {
        d.iconCls = this.funnelService.metadata.getEventIconClsFromEventName(d.eventName);
      });
    }
    origData.ExitPage.ExitDetails.forEach(page => {
      page.ExitPageEvents.forEach(ee => {
        ee.iconCls = this.funnelService.metadata.getEventIconClsFromEventName(ee.eventName);
      });
      page.TransitPageEvents.forEach(ee => {
        ee.iconCls = this.funnelService.metadata.getEventIconClsFromEventName(ee.eventName);
      });
    });

  }

  ngAfterViewInit(): void {
    // hide the event slider on scroll
    const el = document.querySelector('.page-details-card');
    if (el) {
      el.addEventListener('scroll', (event) => {
        if (this.editMode) {
          (el as HTMLElement).click();
        }
      });
    }
  }
}
