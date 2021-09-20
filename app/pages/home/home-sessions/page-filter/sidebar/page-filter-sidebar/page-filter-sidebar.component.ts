import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import {
  TimebarValue,
  TimebarValueInput,
} from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { PAGE_FILTER_SIDEBAR_DATA } from './service/page-filter-sidebar.dummy';
import { PageFilterSidebar } from './service/page-filter-sidebar.model';
import { PageFilters, MetricFilter } from './../../../common/interfaces/pagefilter';
import { ParsePageFilter } from './service/ParsePageFilter';
import { Util } from '../../../common/util/util';
import { NVAppConfigService } from '../../../common/service/nvappconfig.service';
import * as moment from 'moment';
import { PAGE_FILTER_TABLE } from '../../service/page-filter.dummy';
import { PageFilterTable } from '../../service/page-filter.model';
import { MessageService } from 'primeng/api';
import { SessionStateService } from '../../../session-state.service';

@Component({
  selector: 'app-page-filter-sidebar',
  templateUrl: './page-filter-sidebar.component.html',
  styleUrls: ['./page-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PageFilterSidebarComponent extends PageSidebarComponent implements OnInit {
  @Output() pageDetail = new EventEmitter<boolean>();
  @Output() filterCriteria = new EventEmitter<string>();
  datafilter: PageFilterTable;
  classes = 'page-sidebar page-filter-manager';
  duration: SelectItem[];
  customTimeFrame: any[] = [];
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val1: number;
  val2: number;

  min = 0;
  max = 300;
  step = 1;
  onload: number[] = [0, 120];
  ttdi: number[] = [0, 120];
  ttdl: number[] = [0, 120];
  dom: number[] = [0, 120];
  prt: number[] = [0, 120];
  unload: number[] = [0, 120];
  redirect: number[] = [0, 60];
  cache: number[] = [0, 120];
  dns: number[] = [0, 10];
  tcp: number[] = [0, 10];
  ssl: number[] = [0, 120];
  wait: number[] = [0, 60];
  download: number[] = [0, 120];
  firstpaint: number[] = [0, 60];
  firstcontentpaint: number[] = [0, 60];
  firstinputdelay: number[] = [0, 120];
  timetointeractive: number[] = [0, 300];

  // filter toggles
  checkOnload = false;
  checkTTDI = false;
  checkTTDL = false;
  checkDOM = false;
  checkPRT = false;
  checkWait = false;
  checkTCP = false;
  checkRedirect = false;
  checkCache = false;
  checkDNS = false;
  checkSSL = false;
  checkUnload = false;
  checkDownload = false;
  checkFirstpaint = false;
  checkFirstcontentpaint = false;
  checkFirstinputdelay = false;
  checkTimetointeractive = false;

  timefilter: string = 'last';
  lasttime: string = '1 Hour';
  data: PageFilterSidebar;
  nvconfigurations: any;
  filterLabel: string;
  submitted: boolean;
  maxDate: Date;

  constructor(private timebarService: TimebarService, private nvAppConfigService: NVAppConfigService, private messageService: MessageService,private stateService: SessionStateService) {

    super();
    this.timefilter = 'last';
  }

  ngOnInit(): void {
    const me = this;
    me.timefilter = 'last';

    me.datafilter = PAGE_FILTER_TABLE;
    me.duration = [
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },
      { label: '8 Hours', value: '8 Hours' },
      { label: '12 Hours', value: '12 Hours' },
      { label: '16 Hours', value: '16 Hours' },
      { label: '20 Hours', value: '20 Hours' },
      { label: '1 Day', value: '1 Day' },
      { label: '1 Week', value: '1 Week' },
      { label: '1 Month', value: '1 Month' },
      { label: '1 Year', value: '1 Year' }
    ];
    me.data = PAGE_FILTER_SIDEBAR_DATA;

    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
    });

   
   
    // try to restore from state
    const oldFilter = this.stateService.get('page.filterCriteria');
    console.log('page-filter | oldFilter in sidebar: ', oldFilter);

    if (oldFilter != null) {
      var timeFilterApplied = oldFilter.timeFilter;
      if(timeFilterApplied.last != null && timeFilterApplied.last != ""){
         let lastValue = timeFilterApplied.last;
         this.timefilter = 'last';
         this.lasttime =  lastValue ;
      }else{
        this.timefilter = 'custom';
        let st = timeFilterApplied.startTime;
        let et = timeFilterApplied.endTime;
        let stime = new Date(st).getTime();
        this.customTimeFrame[0] = new Date(moment.tz(stime, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
        let etime = new Date(et).getTime();
        this.customTimeFrame[1] = new Date(moment.tz(etime, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
      }
      this.setOldFilter(oldFilter);
    }else{
      const time = new Date().getTime();
      const d = new Date(moment.tz(time, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
      this.customTimeFrame[0] = new Date(d.toDateString() + ' 00:00:00');
      this.customTimeFrame[1] = new Date(d.toDateString() + ' 23:59:00');
    }
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));

  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }

  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod,
          });
        }
      }
    });
  }

  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.timeFilterEnableApply = false;

    me.timebarService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');

        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          me.timeFilterEnableApply = true;
          output.next(me.tmpValue);
          output.complete();
        } else {
          me.tmpValue = null;
          me.timeFilterEnableApply = false;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);

    return value;
  }
  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    const input: TimebarValueInput = {
      timePeriod: me.tmpValue.timePeriod.selected.id,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: me.tmpValue.running,
      discontinued: me.tmpValue.discontinued,
      includeCurrent: me.tmpValue.includeCurrent,
    };

    if (clearViewBy) {
      input.viewBy = null;
    }

    me.setTmpValue(input);
  }
  warn(msg: string) {
    this.messageService.add({ key : "my key", severity: 'warn', summary: 'Warning', detail: msg });
}

  setFilters() {
    // validate timeFilter
    this.submitted = true;
    if (this.timefilter === 'custom') {
      let c = new Date();
      if (new Date(this.customTimeFrame[0]).getTime() === null || new Date(this.customTimeFrame[1]).getTime() === null) {
        this.warn("Please Enter Valid Date and Time.");
        return;
      }
      if (new Date(this.customTimeFrame[0]).getTime() > new Date(this.customTimeFrame[1]).getTime()) {
       // this.invalidDate = true;
        this.warn("Start Time cannot be greater than End Time.");
        return;
      }
      else if(new Date(this.customTimeFrame[1]).getTime() > c.getTime()){
        this.warn("Invalid Date"); 
      
        return;
      }
    }

    this.invalidDate = false;
    this.submitted = false;
    // set enabled filters in global page filter.
    ParsePageFilter.pageFilters = new PageFilters();
    const pageFilter = ParsePageFilter.pageFilters;
    this.setTimeFilter();

    this.filterLabel = '';
    
    if (pageFilter.timeFilter.last !== '') {
      this.filterLabel += `<b>Last:</b> ${pageFilter.timeFilter.last} `;
    } else {
      this.filterLabel += `<b>From:</b> ${pageFilter.timeFilter.startTime} <b>To:</b> ${pageFilter.timeFilter.endTime} `;
    }


    if (this.checkOnload) {
      pageFilter.onload = this.setMetricFilter(this.onload);
      this.filterLabel += `<b>Onload:</b> ${pageFilter.onload.operands[0] / 1000}-${pageFilter.onload.operands[1] / 1000} sec `;
    } else {
      pageFilter.onload = undefined;
    }

    if (this.checkTTDI) {
      pageFilter.domInteractive = this.setMetricFilter(this.ttdi);
      this.filterLabel += `<b>TTDI:</b> ${pageFilter.domInteractive.operands[0] / 1000}-${pageFilter.domInteractive.operands[1] / 1000} sec `;

    } else {
      pageFilter.domInteractive = undefined;
    }

    if (this.checkTTDL) {
      pageFilter.domContentLoaded = this.setMetricFilter(this.ttdl);
      this.filterLabel += `<b>TTDL:</b> ${pageFilter.domContentLoaded.operands[0] / 1000}-${pageFilter.domContentLoaded.operands[1] / 1000} sec `;

    } else {
      pageFilter.domContentLoaded = undefined;
    }

    if (this.checkDOM) {
      pageFilter.dom = this.setMetricFilter(this.dom);
      this.filterLabel += `<b>DOM:</b> ${pageFilter.dom.operands[0] / 1000}-${pageFilter.dom.operands[1] / 1000} sec `;

    } else {
      pageFilter.dom = undefined;
    }

    if (this.checkPRT) {
      pageFilter.perceivedRender = this.setMetricFilter(this.prt);
      this.filterLabel += `<b>PRT:</b> ${pageFilter.perceivedRender.operands[0] / 1000}-${pageFilter.perceivedRender.operands[1] / 1000} sec `;

    } else {
      pageFilter.perceivedRender = undefined;
    }

    if (this.checkWait) {
      pageFilter.wait = this.setMetricFilter(this.wait);
      this.filterLabel += `<b>Wait:</b> ${pageFilter.wait.operands[0] / 1000}-${pageFilter.wait.operands[1] / 1000} sec `;

    } else {
      pageFilter.wait = undefined;
    }

    if (this.checkTCP) {
      pageFilter.tcp = this.setMetricFilter(this.tcp);
      this.filterLabel += `<b>TCP:</b> ${pageFilter.tcp.operands[0] / 1000}-${pageFilter.tcp.operands[1] / 1000} sec `;

    } else {
      pageFilter.tcp = undefined;
    }

    if (this.checkDNS) {
      pageFilter.dns = this.setMetricFilter(this.dns);
      this.filterLabel += `<b>DNS:</b> ${pageFilter.dns.operands[0] / 1000}-${pageFilter.dns.operands[1] / 1000} sec `;

    } else {
      pageFilter.dns = undefined;
    }

    if (this.checkFirstpaint) {
      pageFilter.firstpaint = this.setMetricFilter(this.firstpaint);
      this.filterLabel += `<b>FP:</b> ${pageFilter.firstpaint.operands[0] / 1000}-${pageFilter.firstpaint.operands[1] / 1000} sec `;

    } else {
      pageFilter.firstpaint = undefined;
    }

    if (this.checkFirstcontentpaint) {
      pageFilter.firstcontentpaint = this.setMetricFilter(this.firstcontentpaint);
      this.filterLabel += `<b>FCP:</b> ${pageFilter.firstcontentpaint.operands[0] / 1000}-${pageFilter.firstcontentpaint.operands[1] / 1000} sec `;

    } else {
      pageFilter.firstcontentpaint = undefined;
    }

    if (this.checkFirstinputdelay) {
      pageFilter.firstinputdelay = this.setMetricFilter(this.firstinputdelay);
      this.filterLabel += `<b>FID:</b> ${pageFilter.firstinputdelay.operands[0] / 1000}-${pageFilter.firstinputdelay.operands[1] / 1000} sec `;

    } else {
      pageFilter.firstinputdelay = undefined;
    }

    if (this.checkTimetointeractive) {
      pageFilter.timetointeractive = this.setMetricFilter(this.timetointeractive);
      this.filterLabel += `<b>TTI:</b> ${pageFilter.timetointeractive.operands[0] / 1000}-${pageFilter.timetointeractive.operands[1] / 1000} sec `;

    } else {
      pageFilter.timetointeractive = undefined;
    }

    ParsePageFilter.pageFilters = pageFilter;
    this.closeClick();
    this.filterCriteria.emit(this.filterLabel);
    this.pageDetail.emit(this.datafilter.filtermode);  // false is for tabular view
  }

  resetFilter() {
    this.checkOnload = false;
    this.checkTTDI = false;
    this.checkTTDL = false;
    this.checkDOM = false;
    this.checkPRT = false;
    this.checkWait = false;
    this.checkTCP = false;
    this.checkRedirect = false;
    this.checkCache = false;
    this.checkDNS = false;
    this.checkSSL = false;
    this.checkUnload = false;
    this.checkDownload = false;
    this.checkFirstpaint = false;
    this.checkFirstcontentpaint = false;
    this.checkFirstinputdelay = false;
    this.checkTimetointeractive = false;
    this.timefilter = 'last';
    this.lasttime = '1 Hour';
    this.onload = [0, 120];
    this.ttdi = [0, 120];
    this.ttdl = [0, 120];
    this.dom = [0, 120];
    this.prt = [0, 120];
    this.unload = [0, 120];
    this.redirect = [0, 120];
    this.cache = [0, 60];
    this.dns = [0, 10];
    this.tcp = [0, 10];
    this.ssl = [0, 120];
    this.wait = [0, 60];
    this.download = [0, 120];
    this.firstpaint = [0, 60];
    this.firstcontentpaint = [0, 60];
    this.firstinputdelay = [0, 120];
    this.timetointeractive = [0, 300];


    // this.setFilters();
  }

  setMetricFilter(range) {
    const filter = new MetricFilter();
    filter.operands = [];
    filter.operands[0] = range[0] * 1000;
    filter.operands[1] = range[1] * 1000;
    filter.operator = 'range';
    return filter;
  }

  setTimeFilter() {
    if (this.timefilter === 'last') {
      const specificTime = Util.convertLastToFormattedWithoutZone(this.lasttime, this.nvconfigurations);
      ParsePageFilter.pageFilters.timeFilter.last = '';
      ParsePageFilter.pageFilters.timeFilter.startTime = specificTime.startTime;
      ParsePageFilter.pageFilters.timeFilter.endTime = specificTime.endTime;

    } else {
      const d = new Date(this.customTimeFrame[0]);
      const e = new Date(this.customTimeFrame[1]);
      const date1 = this.toDateString(d);
      const date2 = this.toDateString(e);

      ParsePageFilter.pageFilters.timeFilter.startTime = date1 + ' ' + d.toTimeString().split(' ')[0];
      ParsePageFilter.pageFilters.timeFilter.endTime = date2 + ' ' + e.toTimeString().split(' ')[0];
      ParsePageFilter.pageFilters.timeFilter.last = '';
    }

    ParsePageFilter.pageFilters.offset = 1;
  }

  private toDateString(date: Date) {
    // tslint:disable-next-line: no-string-literal
    return window['toDateString'](date);
  }

  setOldFilter(f) {
    if(f.dns){
      this.checkDNS = true;
      this.dns[0] = f.dns['operands'][0]/1000;
      this.dns[1] = f.dns['operands'][1]/1000;
    }
    if(f.dom){
      this.checkDOM = true;
      this.dom[0]= f.dom['operands'][0]/1000;
      this.dom[1]=f.dom['operands'][1]/1000;
    }
    if(f.domContentLoaded){
      this.checkTTDL = true;
      this.ttdl[0]= f.domContentLoaded['operands'][0]/1000;
      this.ttdl[1]= f.domContentLoaded['operands'][1]/1000;
    }
    if(f.domInteractive){
      this.checkTTDI = true;
      this.ttdi[0] = f.domInteractive['operands'][0]/1000;
      this.ttdi[1] = f.domInteractive['operands'][1]/1000;
    }
    if(f.firstcontentpain){
      this.checkFirstcontentpaint = true;
      this.firstcontentpaint[0] = this.firstcontentpaint['operands'][0]/1000;
      this.firstcontentpaint[1] = this.firstcontentpaint['operands'][1]/1000;
    }
    if(f.firstinputdelay){
      this.checkFirstinputdelay = true;
      this.firstinputdelay[0] = f.firstinputdelay['operands'][0]/1000;
      this.firstinputdelay[1] = f.firstinputdelay['operands'][1]/1000;
    }
    if(f.firstpaint){
      this.checkFirstpaint = true;
      this.firstpaint = [f.firstpaint['operands'][0]/1000,f.firstpaint['operands'][1]/1000];
    }
    if(f.onload){
      this.checkOnload = true;
      this.onload = [f.onload['operands'][0]/1000,f.onload['operands'][1]/1000];
    }
    if(f.perceivedRender){
      this.checkPRT = true;
      this.prt = [f.perceivedRender['operands'][0]/1000,f.perceivedRender['operands'][1]/1000];
    }
    if(f.tcp){
      this.checkTCP = true;
      this.tcp = [f.tcp['operands'][0]/1000,f.tcp['operands'][1]/1000];
    }
    if(f.timetointeractive){
      this.checkTimetointeractive = true;
      this.timetointeractive = [f.timetointeractive['operands'][0]/1000,f.timetointeractive['operands'][1]/1000];
    }
    if(f.wait){
      this.checkWait = true;
      this.wait = [f.wait['operands'][0]/1000,f.wait['operands'][1]/1000];
    }
  }
}
