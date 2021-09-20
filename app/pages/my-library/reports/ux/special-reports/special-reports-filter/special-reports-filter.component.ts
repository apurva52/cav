import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService, SelectItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { Metadata } from 'src/app/pages/home/home-sessions/common/interfaces/metadata';
import TimeFilterUtil from 'src/app/pages/home/home-sessions/common/interfaces/timefilter';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { NVAppConfigService } from 'src/app/pages/home/home-sessions/common/service/nvappconfig.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { UxService } from '../../service/ux.service';

@Component({
  selector: 'app-special-reports-filter',
  templateUrl: './special-reports-filter.component.html',
  styleUrls: ['./special-reports-filter.component.scss']
})

export class SpecialReportsFilterComponent implements OnInit {
  @Output() submit = new EventEmitter<any>();

  form: FormGroup;

  reports: SelectItem[] = [];
  lastTime: SelectItem[];
  buckets: SelectItem[];
  channels: SelectItem[];
  pages: SelectItem[];
  domains: SelectItem[];
  storeTypes: SelectItem[];
  storeNames: SelectItem[];
  storeIDs: SelectItem[];
  terminalIDs: SelectItem[];
  locations: SelectItem[];
  browsers: SelectItem[];
  events: SelectItem[];
  navigationTypes: SelectItem[];
  metrics: SelectItem[];
  deviceTypes: SelectItem[];
  appNameandVersions: SelectItem[] = [];
  connectionTypes: SelectItem[];
  crqName: any;
  filters: any;

  customTime: Date[] = [];
  maxDate: Date;

  metadata: Metadata;

  filtersPresent: boolean;


  constructor(private http: NvhttpService, private metadataService: MetadataService, private messageService: MessageService, private uxService: UxService) {
    this.lastTime = [
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
    this.navigationTypes = [
      { label: 'Hard Navigation', value: 'Hard' },
      { label: 'Soft Navigation', value: 'Soft' }
    ];
    this.buckets = [
      { label: 'Daily', value: 'daily' },
      { label: 'Hourly', value: 'hourly' }
    ];
    this.metrics = [
      { label: 'TimeToLoad', value: 'TimeToLoad' },
      { label: 'DomComplete', value: 'DomComplete' },
      { label: 'FirstByteTime', value: 'FirstByteTime' },
      { label: 'PerceivedRenderTime', value: 'PerceivedRenderTime' },
      { label: 'DomInteractiveTime', value: 'DomInteractiveTime' },
      { label: 'DomInteractiveTime', value: 'DomInteractiveTime' },
      { label: 'TotalMetrics', value: 'TotalMetrics' },
      { label: 'TotalMetricsSilver', value: 'TotalMetricsSilver' }
    ];
    this.deviceTypes = [
      { label: 'Desktop', value: 'Desktop' },
      { label: 'Mobile', value: 'Mobile' },
      { label: 'Tablet', value: 'Tablet' }
    ];
    this.storeTypes = [
      { label: 'INSTORE', value: '.ins' },
      { label: 'CORP', value: '.corp' }
    ];
    this.domains = [
      { label: 'Adobe Test and Target', value: { domainName: 'kohls.tt.omtrdc.net' } },
      { label: 'Bloom Reach', value: { domainName: 'cdns.brsrvr.com' } },
      { label: 'Bluekai', value: { domainName: 'stags.bluekai.comstags.bluekai.comstags.bluekai.com' } },
      { label: 'DoubleClick', value: { domainName: 'securepubads.g.doubleclick.net' } },
      { label: 'DoubleClick Spotlight', value: { domainName: 'ad.doubleclick.net' } },
      { label: 'Facebook Pixel', value: { domainName: 'connect.facebook.net' } },
      { label: 'Google Dynamic Remarketting', value: { domainName: 'googleads.g.doubleclick.net' } },
      { label: 'Google Publisher Tags', value: { domainName: 'www.googletagservices.com' } },
      { label: 'Google Safeframe', value: { domainName: 'tpc.googlesyndication.com' } },
      { label: 'HookLogic', value: { domainName: 'www.hlserve.com' } },
      { label: 'Live Ramp', value: { domainName: 'rlcdn.com' } },
      { label: 'Rich Relevance', value: { domainName: 'media.richrelevance.com' } },
      { label: 'Scorecard Research Beacon', value: { domainName: 'sb.scorecardresearch.com' } },
      { label: 'Trade Desk', value: { domainName: 'match.adsrvr.org' } },
      { label: 'yahoo Dot Tag', value: { domainName: 's.yimg.com' } },
      { label: 'Blue Triangle Technologies', value: { domainName: 'kohls.btttag.com' } },
      { label: 'GA Audiences', value: { domainName: 'www.google.com' } },
      { label: 'Google Analytics', value: { domainName: 'www.google-analytics.com' } },
      { label: 'Live Intent', value: { domainName: 'liadm.com' } },
      { label: 'SOASTA mpulse', value: { domainName: 'c.go-mpulse.net' } },
      { label: 'Yahoo Analytics', value: { domainName: 'sp.analytics.yahoo.com' } },
      { label: 'Signal', value: { domainName: 's.btstatic.com' } },
      { label: 'Bazzarvoice', value: { domainName: 'kohls.ugc.bazaarvoice.com' } },
      { label: 'iGoDigital', value: { domainName: '6249496.collect.igodigital.com' } },
      { label: 'pin interest', value: { domainName: 'ct.pinterest.com' } },
      { label: 'Facebook custom Audience', value: { domainName: 'www.facebook.com' } },
      { label: 'Pinterest Conversion Tracker', value: { domainName: 's.pinimg.com' } },
      { label: 'Sidecar', value: { domainName: 'd3v27wwd40f0xu.cloudfront.net' } },
      { label: 'Facebook Connect', value: { domainName: 'connect.facebook.net' } },
      { label: 'Pinterest', value: { domainName: 'ct.pinterest.com' } },
      { label: 'Bazaarvoice', value: { domainName: 'bazaarvoice.com' } },
      { label: 'LivePerson', value: { domainName: 'liveperson.net' } },
      { label: 'Ensighten', value: { domainName: 'nexus.ensighten.com' } },
      { label: 'Answers Cloud Service', value: { domainName: 'gateway.answerscloud.com' } },
      { label: 'Facebook custom Audience', value: { domainName: 'www.facebook.com' } },
      { label: 'Pinterest Conversion Tracker', value: { domainName: 's.pinimg.com' } },
      { label: 'Sidecar', value: { domainName: 'd3v27wwd40f0xu.cloudfront.net' } },
      { label: 'Facebook Connect', value: { domainName: 'connect.facebook.net' } },
      { label: 'Pinterest', value: { domainName: 'ct.pinterest.com' } },
      { label: 'Bazaarvoice', value: { domainName: 'bazaarvoice.com' } },
      { label: 'LivePerson', value: { domainName: 'liveperson.net' } },
      { label: 'Ensighten', value: { domainName: 'nexus.ensighten.com' } },
      { label: 'Answers Cloud Service', value: { domainName: 'gateway.answerscloud.com' } }];
  }

  ngOnInit(): void {
    this.setForm();
    this.getMetadata();
    this.getReports();
  }

  getMetadata() {
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      // Channel
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        };
      });

      // Pages
      const pagesKey: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pages = pagesKey.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: { pageName: this.metadata.getPageName(key).name, pageid: key }
        };
      });

      // Location
      const locationm: any[] = Array.from(this.metadata.locationMap.keys());
      this.locations = locationm.map(key => {
        const loc = this.metadata.locationMap.get(key).state ? (this.metadata.locationMap.get(key).state + ',') : '';
        return {
          label: loc + this.metadata.locationMap.get(key).country,
          value: this.metadata.locationMap.get(key).country
        };
      });

      // Browsers
      const bsm: any[] = Array.from(this.metadata.browserMap.keys());
      this.browsers = bsm.map(key => {
        return {
          label: this.metadata.browserMap.get(key).name,
          value: {
            browserName: this.metadata.getBrowser(parseInt(key, 10)).name,
            browserid: key,
            version: this.metadata.getBrowser(parseInt(key, 10)).version
          }
        };
      });

      // Events
      const eventKeys: any[] = Array.from(this.metadata.eventMap.keys());
      this.events = eventKeys.map(key => {
        return {
          label: this.metadata.eventMap.get(key).name,
          value: key
        };
      });

      // Store IDs
      const storeid: any[] = Array.from(this.metadata.storeMap.keys());
      this.storeIDs = storeid.map(key => {
        return {
          label: this.metadata.storeMap.get(key).name + '(' + this.metadata.storeMap.get(key).id + ')',
          value: this.metadata.storeMap.get(key).id
        };
      });

      //  Store Name
      const storename: any[] = Array.from(this.metadata.storeMap.keys());
      this.storeNames = storename.map(key => {
        return {
          label: this.metadata.storeMap.get(key).name,
          value: this.metadata.storeMap.get(key).id
        };
      });

      // Store IDs
      this.storeIDs = storename.map(key => {
        return {
          label: this.metadata.storeMap.get(key).id,
          value: this.metadata.storeMap.get(key).id
        };
      });

      const connection: any[] = Array.from(this.metadata.connectionMap.keys());
      this.connectionTypes = connection.map(key => {
        return {
          label: this.metadata.connectionMap.get(key).name,
          value: this.metadata.connectionMap.get(key).id,

        };
      });

    });
  }

  getReports() {
    this.reports = [];

    const clientName = this.uxService.appConfig.clientName;

    this.http.readMultipleJSONFile(clientName).subscribe(responseList => {
      console.log('multiple json report list : ', responseList);

      for (const i of responseList) {
        if (i) {
          // prepare report list  for report dropdown
          this.setReportDropdown(i);
        }
      }

      this.showHideFiltersTab();

      console.log('this.reports :', this.reports);
    });
  }

  setReportDropdown(data) {
    // tslint:disable-next-line: forin
    for (const i in data) {
      data[i].reportName = i;
      this.reports.push({ label: i, value: data[i] });
    }
  }


  onSubmit(): void {
    const f = this.form.value;
    const filterCriteria = {} as { timeFilter: { startTime: string, endTime: string, last: string }, filObj: any };
    // Validate filters
    if (!f.report) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a report.' });
      return;
    }

    if (new Date(f.customTime[0]).getTime() > new Date(f.customTime[1]).getTime()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start time cannot be greater than end time.' });
      return;
    }

    if (f.bucket === null && this.crqName === 'ResponseTimeWeeklyReport') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select bucket.' });
      return;
    }

    if (this.crqName === 'NativeAppOverallPerformanceReport' && (f.groupBy === null || f.groupBy.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Atleast one group by filter is required.' });
      return;
    }

    // set filterCriteria Object
    if (f.timeFilter === 'last') {
      filterCriteria.timeFilter = TimeFilterUtil.getTimeFilter(f.lastTime, f.customTime[0], f.customTime[1]);
    } else {
      filterCriteria.timeFilter = TimeFilterUtil.getTimeFilter('', f.customTime[0], f.customTime[1]);

    }
    filterCriteria.filObj = this.updateFilters(f);
    if (f.report.reportName === 'Native App Overall Performance Report' && f.groupBy !== null) {
      filterCriteria.filObj.filters.groupBy = f.groupBy.join(',');
    }

    console.log('filterCriteria : ', filterCriteria);

    this.submit.emit(filterCriteria);
  }

  updateFilters(f): any {

    const filters = {
      metric: f.metric,
      location: f.location,
      browser: f.browser,
      event: f.event,
      navType: f.navigationType,
      silver: f.silver,
      usersegment: f.usersegment,
      page: f.page != null ? (f.page.length === this.pages.length ? null : (f.page.length ? f.page : null)) : f.page,
      store: [{
        storeName: f.storeName ? f.storeName : -1,
        storeType: f.storeType ? f.storeType : -1,
        storeid: f.storeID ? f.storeID : -1,
        terminalid: f.terminalID ? f.terminalID : -1
      }],
      os: f.os,
      channel: f.channel,
      bucketMode: f.bucket,
      bucketCounts: f.bucket === 'daily' ? 7 : 24,
      device: f.device,
      contype: f.connectionType,
      applicationversion: f.appNameandVersion ? f.appNameandVersion.join(',') : '',
      domain: f.report.reportName === 'Native App Overall Performance Report' ? (f.domain != null ? [{ domainName: f.domain }] : f.domain) : (f.domain != null ? (f.domain.length === this.domains.length ? null : (f.domain.length ? f.domain : null)) : f.domain)
    };

    // f.page != null ? (f.page.length === this.pages.length ? '-1' : (f.page.length ? f.page.join(',') : '-1')) : '-1',
    // ISSUE: changing filObj value also changes f.report value
    const filObj = JSON.parse(JSON.stringify(f.report));

    console.log('filObj --------', filObj);
    for (const key in filters) {
      if (filters[key] != null) {
        filObj.filters[key] = filters[key];
      }
    }

    return filObj;

  }

  setForm(): void {
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');

    this.form = new FormGroup({
      report: new FormControl(),
      timeFilter: new FormControl('last'),
      lastTime: new FormControl('1 Day'),
      customTime: new FormControl([this.customTime[0], this.customTime[1]], Validators.required),
      bucket: new FormControl(),
      channel: new FormControl(),
      page: new FormControl(),
      domain: new FormControl(),
      storeType: new FormControl(),
      storeName: new FormControl(),
      storeID: new FormControl(),
      terminalID: new FormControl(),
      appNameandVersion: new FormControl(),
      connectionType: new FormControl(),
      groupBy: new FormControl(['page.pageid', 'contype', 'applicationversion', 'domain'])
    });
  }


  onReportChange(report) {
    this.crqName = report.crqName.split('.')[4];
    this.filters = report.filters;

    // reset previously set filters
    this.resetFilters();
    this.showHideFiltersTab();
  }

  showHideFiltersTab() {

  }

  onStoreTypeChange(val) {
    const storeid: any[] = Array.from(this.metadata.storeMap.keys());

    const instoreoption = storeid.map(key => {
      return this.metadata.storeMap.get(key).name;
    });

    const instoreidoption = storeid.map(key => {
      return this.metadata.storeMap.get(key).id;
    });

    let j = 0;
    let k = 0;
    const splitstore = [];
    const corpoption = [];
    const corpidstore = [];
    const inoption = [];
    const inidstore = [];

    for (let i = 0; i < storeid.length; i++) {
      splitstore[i] = instoreoption[i].split('.');
      if (splitstore[i][1] === 'corp') {
        corpoption[j] = instoreoption[i];
        corpidstore[j] = instoreidoption[i];
        j++;

      } else if (splitstore[i][1] === 'ins') {
        inoption[k] = instoreoption[i];
        inidstore[k] = instoreidoption[i];
        k++;
      }

    }
    if (val === '.ins') {
      this.storeIDs = [];
      for (let i = 0; i < inoption.length; i++) {
        this.storeIDs.push({ label: inoption[i] + '(' + inidstore[i] + ')', value: inidstore[i] });
      }
    }

    if (this.form.controls.storeType.value === '.corp') {
      this.storeIDs = [];
      for (let i = 0; i < corpoption.length; i++) {
        this.storeIDs.push({ label: corpoption[i] + '(' + corpidstore[i] + ')', value: corpidstore[i] });
      }
    }
  }

  onStoreIDChange(val) {
    this.terminalIDs = [];
    this.http.getStoreID(val).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadedState) {
        for (const i of state.data.trim().split(',')) {
          this.terminalIDs.push({ label: i, value: i });
        }
      }
    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        console.error('Failed to get the storeid. | Error - ', state.error);
      }
    });
  }

  resetFilters() {
    for (const control in this.form.controls) {
      // tslint:disable-next-line: max-line-length
      if (control !== 'report' && control !== 'timeFilter' && control !== 'lastTime' && control !== 'customTime' && control !== 'groupBy') {
        this.form.get(control).reset();
      }
    }
  }

  onTimeFilterCustomTimeChange(timeType) {
    const customTime = this.form.get('customTime').value;

    switch (timeType) {
      case 'start':
        this.customTime[0] = customTime[0];
        break;

      case 'end':
        this.customTime[1] = customTime[1];
        break;
    }

    this.form.get('customTime').patchValue(this.customTime);
  }

  onTimeFilterChange() {
    if (this.form.get('timeFilter').value === 'last') {
      this.updateValidators('lastTime', 'customTime');
    } else {
      this.updateValidators('customTime', 'lastTime');
    }
  }

  updateValidators(time1, time2) {
    // enable one control and add validators
    this.form.get(time1).enable();
    this.form.get(time1).setValidators([Validators.required]);
    this.form.get(time1).updateValueAndValidity();

    // disable another control and remove validators
    this.form.get(time2).disable();
    this.form.get(time2).clearValidators();
    this.form.get(time2).updateValueAndValidity();
  }

}
