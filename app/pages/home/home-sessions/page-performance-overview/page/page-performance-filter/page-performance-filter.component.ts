import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { ParsePagePerformanceFilters } from '../../../common/interfaces/parsepageperformancefilter';
import { Output, EventEmitter } from '@angular/core';
import { Metadata } from '../../../common/interfaces/metadata';
import * as moment from 'moment';
import 'moment-timezone';
import { PagePerformanceFilter_TABLE } from './service/page.dummy';
import { PageFilterTable } from './service/page.model'; 
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-page-performance-filter',
  templateUrl: './page-performance-filter.component.html',
  styleUrls: ['./page-performance-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagePerformanceFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'page-performance-filter-sidebar';
  @Output() newFilterEvent = new EventEmitter<string>();

  @Input() bucketflag = false;
  @Input() filtermode = null;
  data: PageFilterTable;
  pageForm: FormGroup;
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  parsepagefilter: ParsePagePerformanceFilters;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  customTime: Date[] = [];
  customTimecmp: Date[] = [];
  newos: any;
  usersegmentoption: any;
  checkoutbpPagelist: any[];
  nchannel: any[];
  npage: any[];
  nbrowser: any;
  nos: any;
  browsericon: any;
  excludebrowsericon: any;
  osicon: any;
  jsFileNames = [];
  jsErrors = [];
  excludeosicon: any;
  nlocation: any;
  newbs: any;
  excludedevice: any;
  devicei: number;
  browseri: number;
  osi: number;
  device: any[];
  os: any[];
  startT: any;
  endT: any;
  timefilter: string = "Custom";
  timefiltercmp: string = "Custom";
  lasttimeoption: any;
  lasttimeoptioncmp: any;
  osopson: any[];
  browser_opts: any[];
  conpareflag: boolean = true;
  //maxDate: Date;

  constructor(private timebarService: TimebarService, private metadataService: MetadataService, private messageService: MessageService) {
    super();
    this.parsepagefilter = new ParsePagePerformanceFilters();
    const d = new Date(moment.tz(new Date().getTime(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));

    this.pageForm = new FormGroup({
      channel: new FormControl(null),
      userSegment: new FormControl(),
      device: new FormControl(['PC', 'Mobile', 'Tablet']),
      entryPage: new FormControl(null),
      browser: new FormControl(null),
      platform: new FormControl(null),
      platformversion: new FormControl(null),
      connectionType: new FormControl(null),
      location: new FormControl(null),
      IncludeLocation: new FormControl(null),
      ExcludeLocation: new FormControl(null),
      IncludeBrowser: new FormControl(null),
      ExcludeBrowser: new FormControl(null),
      IncludeOS: new FormControl(null),
      ExcludeOS: new FormControl(null),
      Includepage: new FormControl(null),
      ExcludePage: new FormControl(null),
      bucket: new FormControl('Auto'),
      formosicon: new FormControl(),
      formbrowsericon: new FormControl(),
      customTime: new FormControl(),
      customTimecmp: new FormControl(),
      lastval: new FormControl('1 Day'),
      lastvalcmp: new FormControl('1 Day'),
      _timefilter: new FormControl('Custom'),
      _timefiltercmp: new FormControl('Custom'),
    });
    this.devicei = 0;
    this.osi = 0;
    this.browseri = 0;
    this.os = [];
    this.osopson = [];
    this.browser_opts = [];
    this.checkoutbpPagelist = [];
    this.excludebrowsericon = [];
    this.excludedevice = ['PC', 'Mobile', 'Tablet'];
    this.excludeosicon = [];
    this.browsericon = [0, 1, 2, 3, 4];
    this.osicon = ['Windows', 'Mac OS', 'Linux', 'Chromium OS', 'Android'];
    this.newos = [];
    this.device = [];
    this.nbrowser = new Map<number, any>();
    this.nos = new Map<string, any>();
    this.nos.set('Windows', { 'id': 'Windows', 'name': 'Windows', 'class': 'icons8 icons8-calendar', 'selectedos': true });
    this.nos.set('Mac OS', { 'id': 'Mac OS', 'name': 'Mac OS', 'class': 'fa fa-apple', 'selectedos': true });
    this.nos.set('Linux', { 'id': 'Linux', 'name': 'Linux', 'class': 'fa fa-linux', 'selectedos': true });
    this.nos.set('Chromium OS', { 'id': 'Chromium OS', 'name': 'Chromium OS', 'class': 'fa fa-chrome', 'selectedos': true });
    this.nos.set('Android', { 'id': 'Android', 'name': 'Android', 'class': 'fa fa-android', 'selectedos': true });
    this.nbrowser.set(0, { 'id': 0, 'name': 'Chromium OS', 'class': 'icons8 icons8-calendar', 'selectedbrowser': true });
    this.nbrowser.set(1, { 'id': 1, 'name': 'FireFox', 'class': 'fa fa-firefox', 'selectedbrowser': true });
    this.nbrowser.set(2, { 'id': 2, 'name': 'Internet Explorer', 'class': 'fa fa-internet-explorer', 'selectedbrowser': true });
    this.nbrowser.set(3, { 'id': 3, 'name': 'Safari', 'class': 'fa fa-safari', 'selectedbrowser': true });
    this.nbrowser.set(4, { 'id': 4, 'name': 'Opera', 'class': 'fa fa-opera', 'selectedbrowser': true });
    this.device.push({ label: 'PC', value: 'PC' });
    this.device.push({ label: 'Mobile', value: 'Mobile' });
    this.device.push({ label: 'Tablet', value: 'Tablet' });
    this.lasttimeoption = [
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },
      { label: '12 Hours', value: '12 Hours' },
      { label: '1 Day', value: '1 Day' },
      { label: '1 week', value: '1 Week' },
      { label: '1 Month', value: '1 Month' },
      { label: '1 Year', value: '1 Year' }
    ];
    this.lasttimeoptioncmp = [
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },
      { label: '12 Hours', value: '12 Hours' },
      { label: '1 Day', value: '1 Day' },
      { label: '1 week', value: '1 Week' },
      { label: '1 Month', value: '1 Month' },
      { label: '1 Year', value: '1 Year' }
    ];
    let time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
    this.startT = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY') + " 00:00 AM";
    this.endT = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY') + " 23:59 PM";
    this.setformdropdown();

  }
  setformdropdown() {
    console.log("filtermode", this.filtermode);
    this.metadataService.getMetadata().subscribe(metadata => {
      this.newos = [];
      let usersegment: any[] = Array.from(metadata.userSegmentMap.keys());
      this.usersegmentoption = usersegment.map(key => {
        return { label: metadata.userSegmentMap.get(key).name, value: metadata.userSegmentMap.get(key).id }
      });
      let channelm: any[] = Array.from(metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return { label: metadata.channelMap.get(key).name, value: metadata.channelMap.get(key).id }
      });
      let pagem: any[] = Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return { label: metadata.pageNameMap.get(key).name, value: metadata.pageNameMap.get(key).id }
      });
      let locationm: any[] = Array.from(metadata.locationMap.keys());
      this.nlocation = locationm.map(key => {
        let loc = metadata.locationMap.get(key).state ? (metadata.locationMap.get(key).state + ',') : '';
        return { label: loc + metadata.locationMap.get(key).country, value: metadata.locationMap.get(key).id }
      });
      let platform = Array.from(metadata.osMap.keys());
      for (let i = 0; i < platform.length; i++) {
        this.os.push({ name: metadata.osMap.get(platform[i]).name, value: metadata.osMap.get(platform[i]).name, version: metadata.osMap.get(platform[i]).version });
        let version = metadata.osMap.get(platform[i]).version == 'null' ? '' : ' ( ' + metadata.osMap.get(platform[i]).version + ' ) ';
        this.newos.push({ label: metadata.osMap.get(platform[i]).name + version, value: metadata.osMap.get(platform[i]).name + version });
      }

      let platformm = Array.from(metadata.osMap.keys());
      for (let i = 0; i < platformm.length; i++) {
        if (i > 0) {
          if (metadata.osMap.get(platformm[i]).name !== metadata.osMap.get(platformm[i - 1]).name) {
            const name = metadata.osMap.get(platformm[i]).name;
            this.osopson.push({ label: name, value: name });
          }
        }
        else {
          const name = metadata.osMap.get(platformm[i]).name;
          this.osopson.push({ label: name, value: name });
        }
      }
      this.getBrowserM(metadata);
    });
  }
  getBrowserM(metadata) {
    let bsm: any[] = Array.from(metadata.browserMap.keys());
    this.browser_opts = bsm.map(key => {
      return { label: metadata.browserMap.get(key).name, value: metadata.browserMap.get(key).id }
    });

  }

  ngOnInit(): void {
    const me = this;

    me.data = PagePerformanceFilter_TABLE;
    console.log(' pageperfformance filter me.data', me.data);
    if (me.data.filtercriteria == null) {
      this.setForm(false);
    }
    else
      this.setAfterForm(me.data.filtercriteria.showFilter);
  }
  setAfterForm(filter) {
    let f = filter;
    let dev = ['PC', 'Mobile', 'Tablet'];
    if (f.device !== null)
      dev = f.device;
    //os and browser miss

    this.pageForm = new FormGroup({
      customTime: new FormControl(f.customTime),
      customTimecmp: new FormControl(f.customTimecmp),
      lastval: new FormControl(f.lastval),
      _timefilter: new FormControl(f._timefilter),
      lastvalcmp: new FormControl(f.lastvalcmp),
      _timefiltercmp: new FormControl(f._timefiltercmp),
      channel: new FormControl(f.channel),
      userSegment: new FormControl(f.userSegment),
      device: new FormControl(dev),
      entryPage: new FormControl(f.entryPage),
      browser: new FormControl(f.browser),
      platform: new FormControl(f.platform),
      platformversion: new FormControl(f.platformversion),
      connectionType: new FormControl(f.connectionType),
      location: new FormControl(f.location),
      IncludeLocation: new FormControl(f.IncludeLocation),
      ExcludeLocation: new FormControl(f.ExcludeLocation),
      IncludeBrowser: new FormControl(f.IncludeBrowser),
      ExcludeBrowser: new FormControl(f.ExcludeBrowser),
      IncludeOS: new FormControl(f.IncludeOS),
      ExcludeOS: new FormControl(f.ExcludeOS),
      Includepage: new FormControl(f.Includepage),
      ExcludePage: new FormControl(f.ExcludePage),
      bucket: new FormControl(f.bucket),
      groups: new FormControl(f.groups),
      stime: new FormControl(new Date(f.customTime[0])),
      etime: new FormControl(new Date(f.customTime[1])),
      stimecmp: new FormControl(new Date(f.customTimecmp[0])),
      etimecmp: new FormControl(new Date(f.customTimecmp[1])),
      granular: new FormControl(f.granular),
      metric: new FormControl(f.metric),
      granular1: new FormControl(f.granular1),
      metric1: new FormControl(f.metric1),
      rollingwindow: new FormControl(f.rollingwindow)
    });
    //this.ToggleButton = f.toggle;
    f.timeFilter.startTime = f.stime;
    f.timeFilter.endTime = f.etime;

    if (f.toggle == false) {
      f.timeFiltercmp.startTime = f.stimecmp;
      f.timeFiltercmp.endTime = f.etimecmp;
    }
    else {
      f.timeFiltercmp.startTime = "";
      f.timeFiltercmp.endTime = "";
    }
    this.conpareflag = f.toggle;
    this.triggerfilter();
    this.triggerfiltercmp();
    console.log('this.pageForm setform : ', this.pageForm);
  }
  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }

  openfilter() {
    this.conpareflag = true;
    const me = this;
    me.show();
  }

  onTimeFilterCustomTimeChange(timeType) {

    switch (timeType) {
      case 'start':
        this.customTime[0] = this.pageForm.get('customTime').value[0];
        break;
      case 'end':
        this.customTime[1] = this.pageForm.get('customTime').value[1];
        break;
    }

    this.pageForm.get('customTime').patchValue(this.customTime);

    setTimeout(() => {
      if (this.customTime && this.customTime.length === 2) {
        if (this.customTime[0].valueOf() == this.customTime[1].valueOf()) {
          this.timeFilterEnableApply = false;
          this.invalidDate = true;

        } else {
          this.invalidDate = false;
          const timePeriod = this.timebarService.getCustomTime(
            this.customTime[0].valueOf(),
            this.customTime[1].valueOf()
          );

          console.log('timePeriod : ', timePeriod);

          this.setTmpValue({
            timePeriod,
          });
        }
      }
    });
  }

  onTimeFilterCustomTimeChangecmp(timeType) {

    switch (timeType) {
      case 'start':
        this.customTimecmp[0] = this.pageForm.get('customTimecmp').value[0];
        break;

      case 'end':
        this.customTimecmp[1] = this.pageForm.get('customTimecmp').value[1];
        break;
    }

    this.pageForm.get('customTimecmp').patchValue(this.customTimecmp);

    setTimeout(() => {
      if (this.customTimecmp && this.customTimecmp.length === 2) {
        if (this.customTimecmp[0].valueOf() == this.customTimecmp[1].valueOf()) {
          this.timeFilterEnableApply = false;
          this.invalidDate = true;

        } else {
          this.invalidDate = false;
          const timePeriod = this.timebarService.getCustomTime(
            this.customTimecmp[0].valueOf(),
            this.customTimecmp[1].valueOf()
          );

          console.log('timePeriod : ', timePeriod);

          this.setTmpValue({
            timePeriod,
          });
        }
      }
    });
  }
  oncomparemode(flag) {
    this.conpareflag = flag;
  }
  offcomparemode(flag) {
    this.conpareflag = flag;
  }
  submitRecord() {
    const f = this.pageForm.value;
    console.log("submit record method called f : ", f);
    console.log("pageform customTime : ", this.pageForm.get('customTime'));  

    console.log('filter',  f.stime, f.etime);

    let c = new Date();
    if (f._timefilter ==='Custom') {
      f.stime = f.customTime[0];
      f.etime = f.customTime[1];

      if (f.stime === null || f.etime === null) {

        this.warn("Please Enter Valid Date and Time.");
        return;
      }
      if (new Date(f.stime).getTime() > new Date(f.etime).getTime()) {
        this.warn("Start Time cannot be greater than End Time.");
        return;
      }
      else if (new Date(f.etime).getTime() > c.getTime()) {
        this.warn("Invalid Date");
        return;
      }
    }
    let timeFilter = {};
    let timeFiltercmp = {};
    timeFilter["last"] = this.pageForm.get('lastval');
    if (this.pageForm.get('_timefilter').value === 'last') {
      timeFilter["last"] = this.pageForm.get('lastval').value;
      timeFilter["endTime"] = "";
      timeFilter["startTime"] = "";
    }
    else {
      timeFilter["last"] = null;
      timeFilter["endTime"] = this.customTime[1];
      timeFilter["startTime"] = this.customTime[0];
    }

    if (this.conpareflag === false) {
      if (this.pageForm.get('_timefiltercmp').value === 'last') {
        timeFiltercmp["last"] = this.pageForm.get('lastvalcmp').value;
        timeFiltercmp["endTime"] = "";
        timeFiltercmp["startTime"] = "";
      }
      else {
        timeFiltercmp["last"] = null;
        timeFiltercmp["endTime"] = this.customTimecmp[1];
        timeFiltercmp["startTime"] = this.customTimecmp[0];
      }
    }
    else {
      timeFiltercmp["last"] = "";
      timeFiltercmp["endTime"] = "";
      timeFiltercmp["startTime"] = "";
    }

    f["timeFilter"] = timeFilter;
    f["timeFiltercmp"] = timeFiltercmp;


    if (this.pageForm.get('_timefilter').value === 'last') {
      f["stime"] = "";
      f["etime"] = "";
    }
    else {
      f["stime"] = this.pageForm.get('customTime').value[0];
      f["etime"] = this.pageForm.get('customTime').value[1];
    }
    if (this.pageForm.get('_timefiltercmp').value === 'last') {
      f["stimecmp"] = "";
      f["etimecmp"] = "";
    }
    else {
      f["stimecmp"] = this.pageForm.get('customTimecmp').value[0];
      f["etimecmp"] = this.pageForm.get('customTimecmp').value[1];
    }
    if (this.pageForm.get('customTimecmp'))
      f["customTimecmp"] = this.pageForm.get('customTimecmp').value;
    if (this.pageForm.get('customTime'))
      f["customTime"] = this.pageForm.get('customTime').value;
    if (this.pageForm.get('lastval'))
      f["lastval"] = this.pageForm.get('lastval').value;
    if (this.pageForm.get('lastvalcmp'))
      f["lastvalcmp"] = this.pageForm.get('lastvalcmp').value;

    f["toggle"] = this.conpareflag; //off compare mode

    if (this.match(this.pageForm.controls['Includepage'].value, this.pageForm.controls['ExcludePage'].value))
      return;
    if (this.match(this.pageForm.controls['IncludeLocation'].value, this.pageForm.controls['ExcludeLocation'].value))
      return;
    if (this.match(this.pageForm.controls['IncludeBrowser'].value, this.pageForm.controls['ExcludeBrowser'].value))
      return;
    if (this.match(this.pageForm.controls['IncludeOS'].value, this.pageForm.controls['ExcludeOS'].value))
      return;
    if (this.match(this.pageForm.controls['entryPage'].value, this.pageForm.controls['ExcludePage'].value))
      return;
    let osm = [];
    this.nos.forEach(function (record) {
      if (record.selectedos === true)
        osm.push(record.name);
    });
    this.excludeosicon = osm;
    let bsm = [];
    this.nbrowser.forEach(function (record) {
      if (record.selectedbrowser === true)
        bsm.push(record.id);
    });
    this.excludebrowsericon = bsm;
    if ((this.excludeosicon.length > 0 && this.osi !== 0)) {
      if (this.match(this.excludeosicon, this.pageForm.controls['ExcludeOS'].value))
        return;
      f.formosicon = this.excludeosicon;
    }
    else if ((this.excludeosicon.length === 0 && this.osi === 0) || (this.excludeosicon.length === 0 && this.osi !== 0)) {
      f.formosicon = null;
    }
    if ((this.excludebrowsericon.length > 0 && this.browseri !== 0)) {
      if (this.match(this.excludebrowsericon, this.pageForm.controls['ExcludeBrowser'].value))
        return;
      f.formbrowsericon = this.excludebrowsericon;
    }
    else if ((this.excludebrowsericon.length === 0 && this.browseri === 0) || (this.excludebrowsericon.length === 0 && this.browseri !== 0)) {
      f.formbrowsericon = null;
    }
    if (this.devicei === 0 && f.device !== null && f.device.length === 3)
      f.device = null;
    let gchannel = [];
    if (f.channel !== null && f.channel !== "" && f.channel !== "null" && f.channel.length > 0) {
      gchannel = f.channel;
    }
    f.channel = gchannel;
    let gsegment = [];
    if (f.userSegment !== null && f.userSegment !== "" && f.userSegment !== "null" && f.userSegment.length > 0) {
      gsegment = f.userSegment;
    }
    f.userSegment = gsegment;

    console.log("after set form f : ", f);
    this.metadataService.getMetadata().subscribe(metadata => {
      this.parsepagefilter.getPagePerformanceFilter(f, metadata, this.bucketflag);//bucket false
      console.log("this.parsepagefilter : ", this.parsepagefilter);

      this.newFilterEvent.emit(JSON.stringify(this.parsepagefilter));
      const me = this;
      me.data.filtercriteria = this.parsepagefilter;
      console.log('me.data.filtercriteria : ', me.data.filtercriteria);
      this.closeClick();

    });
  }  

  warn(msg: string) {
    this.messageService.add({ key :'my key',severity: 'warn', summary: 'Warning', detail: msg });
  }

  match(list1, list2) {
    if (list1 === null || list1 === "null")
      return false;
    if (list2 === null || list2 === "null")
      return false;
    let compare = list1;
    let compareWith = list2;
    if (list1.length > list2.length) {
      compare = list2;
      compareWith = list1;
    }

    for (let i = 0; i < compare.length; i++) {
      if (compareWith.indexOf(compare[i]) > -1) {
        alert("Include and Exclude Property are same");
        return true;
      }
    }
    return false;
  }
  changeBrowser(id) {
    if (this.browseri === 0) {
      this.nbrowser.forEach(function (record) {
        if (id === record.id)
          record.selectedbrowser = true;
        else
          record.selectedbrowser = false;
      });
    }
    else {
      if (this.nbrowser.get(id).selectedbrowser) {
        this.nbrowser.get(id).selectedbrowser = false;
        let index = this.browsericon.indexOf(id);
        if (index > -1) {
          this.browsericon.splice(index, 1);
        }
      }
      else {
        this.nbrowser.get(id).selectedbrowser = true;
        if (this.browsericon.indexOf(id) === -1)
          this.browsericon.push(id);
      }
    }
    this.browseri++;
  }

  changeOS(id) {
    if (this.osi === 0) {
      this.nos.forEach(function (record) {
        if (id === record.id)
          record.selectedos = true;
        else
          record.selectedos = false;
      });
    } else {
      if (this.nos.get(id).selectedos) {
        this.nos.get(id).selectedos = false;
        let index = this.osicon.indexOf(id);
        if (index > -1) {
          this.osicon.splice(index, 1);
        }
      }
      else {
        this.nos.get(id).selectedos = true;
        if (this.osicon.indexOf(id) === -1)
          this.osicon.push(this.nos.get(id).name);
      }
    }
    this.osi++;
  }
  onSelectOS(val) {
    this.nos.forEach(function (record) {
      record.selectedos = false;

    });
  }

  onSelectBrowser(val) {
    this.nbrowser.forEach(function (record) {
      record.selectedbrowser = false;
    });
  }


  resetInfo() {
    let val = this.pageForm.controls['entryPage'].value;
    if (val !== null || val !== "null")
      this.pageForm.controls['entryPage'].patchValue(null);
  }

  selectDevice(event) {
    if (this.devicei === 0) {
      let devicetmp = [];
      for (let i = 0; i < this.excludedevice.length; i++) {
        if (event.value.indexOf(this.excludedevice[i]) === -1)
          devicetmp.push(this.excludedevice[i]);
        ;
      }
      this.pageForm.controls['device'].setValue(devicetmp);
    };
    this.devicei++;
  }
  onSelectChannel(ev) {
    console.log("onSelectChannel : ", ev, "entryPageValue :", this.pageForm.controls['entryPage'].value);
    this.pageForm.controls['entryPage'].patchValue(null);
    console.log("onSelectChannel : checkoutbpPagelist : ", this.checkoutbpPagelist);
    let temp = [];
    let val = ev.value;
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < this.checkoutbpPagelist.length; j++) {
        if (val[i] == this.checkoutbpPagelist[j].channel || val[i] == -1) {
          if (!temp.includes(this.checkoutbpPagelist[j].pageid))
            temp.push(this.checkoutbpPagelist[j].pageid);
        }
      }
    }
    console.log("onSelectChannel : ", temp);
    this.pageForm.controls['entryPage'].setValue(temp);
  }

  resetOS() {
    this.nos.forEach(function (record) {
      record.selectedos = true;
    });
  }
  resetBrowser() {
    this.nbrowser.forEach(function (record) {
      record.selectedbrowser = true;
    });
  }
  triggerfilter() {
    console.log('triggerfilter : ', this.pageForm.get('_timefilter'));

    if (this.pageForm.get('_timefilter').value === 'last') {
      console.log('this.pageForm lastval : ', this.pageForm.get('lastval'));
      this.pageForm.get('customTime').disable();
      this.pageForm.get('lastval').enable();

    } else {
      console.log('this.pageForm customTime : ', this.pageForm.get('customTime'))
      this.pageForm.get('customTime').enable();
      this.pageForm.get('lastval').disable();

    }
  }

  triggerfiltercmp() {
    console.log("triggerfiltercmp : ", this.pageForm.get('_timefiltercmp'));
    if (this.pageForm.get('_timefiltercmp').value === 'last') {
      this.pageForm.get('customTimecmp').disable();
      this.pageForm.get('lastvalcmp').enable();

    } else {
      this.pageForm.get('customTimecmp').enable();
      this.pageForm.get('lastvalcmp').disable();
    }
  }

  setForm(flag: boolean) {
    console.log("set Form method called");
    this.metadataService.getMetadata().subscribe(metadata => {
      this.osi = 0;
      this.browseri = 0;
      let time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
      //let date = moment.tz(time, sessionStorage.getItem("_nvtimezone"));
      this.startT = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY') + " 00:00 AM";
      this.endT = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY') + " 23:59 PM";
      let date = new Date(time);
      //let st = new Date(date.toLocaleDateString() + " " + "00:00:00");
      //let et = new Date(date.toLocaleDateString() + " " + "23:59:59");
      let dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - 1);
      let yesterdayStr = moment.tz(dateObj, sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
      let st = new Date(yesterdayStr + " 00:00:00");
      let et = new Date(yesterdayStr + " 23:59:59");
      this.timefilter = "Custom";
      this.timefiltercmp = "Custom";
      let pagem: any[] = Array.from(metadata.pageNameMap.keys());
      let key = null;
      let arr = [];
      let selectedChannel = null;
      //this.resetOS();
      //this.resetBrowser();
      if (this.bucketflag === true && this.filtermode === null) {
        try {
          if (pagem.length > 0) {
            pagem.sort(
              function (a, b) { return a - b });
            let id = 0;
            if (pagem[0] !== -1)
              id = pagem[0];
            else
              id = pagem[1];
            if (pagem.length == 1 && pagem[0] == -1)
              id = -1;
            key = metadata.pageNameMap.get(id).id;
            arr.push(key);
          }
          else
            arr = null;
        }
        catch (e) {
          arr = null;
          console.log(e);
        }
      }
      else if (this.filtermode === 'revenue') {
        arr = this.getBPCheckoutPageIds(metadata);
        //let chm: any[] =  Array.from(this.metadata.channelMap.keys());
        //if(chm.length > 0)
        //{
        // selectedChannel = [];
        //selectedChannel.push(this.metadata.channelMap.get(chm[0]).id.toString());
        //}
      }
      else {
        arr = null;
      }
      this.pageForm = new FormGroup({
        channel: new FormControl(null),
        userSegment: new FormControl(),
        device: new FormControl(['PC', 'Mobile', 'Tablet']),
        entryPage: new FormControl(arr),
        browser: new FormControl(null),
        platform: new FormControl(null),
        platformversion: new FormControl(null),
        connectionType: new FormControl(null),
        location: new FormControl(null),
        IncludeLocation: new FormControl(null),
        ExcludeLocation: new FormControl(null),
        IncludeBrowser: new FormControl(null),
        ExcludeBrowser: new FormControl(null),
        IncludeOS: new FormControl(null),
        ExcludeOS: new FormControl(null),
        Includepage: new FormControl(null),
        ExcludePage: new FormControl(null),
        bucket: new FormControl('Auto'),
        formosicon: new FormControl(),
        formbrowsericon: new FormControl(),
        customTime: new FormControl([st, et]),
        customTimecmp: new FormControl([st, et]),
        lastval: new FormControl('1 Day'),
        lastvalcmp: new FormControl('1 Day'),
        _timefilter: new FormControl('Custom'),
        _timefiltercmp: new FormControl('Custom'),
      });
      this.conpareflag = true;
      this.triggerfilter();
      this.triggerfiltercmp();
      if (flag)
        this.submitRecord();
    });

  }

  getBPCheckoutPageIds(metadata) {
    let bpid: any[] = Array.from(metadata.bpMap.keys());
    let checkbpPageNames = [];
    let checkbpPageIds = [];
    if (bpid && bpid.length > 0) {
      for (let i = 0; i < bpid.length; i++) {
        let checkbp = metadata.bpMap.get(parseInt(bpid[i])).checkoutflag;
        let checkbpPage = metadata.bpMap.get(parseInt(bpid[i])).pagelist;
        if (checkbp == 1) {
          let c = checkbpPage.split(",");
          for (let t = 0; t < c.length; t++) {
            console.log("page name : ", c[t]);
            if (!checkbpPageNames.includes(c[t])) {
              if (c[t].indexOf(":") != -1)
                c[t] = c[t].split(":")[0];
              if (c[t].indexOf("[") != -1) {
                c[t] = c[t].substr(1);
                c[t] = c[t].substr(0, c[t].length - 1);
                console.log("c[t] : ", c[t]);
              }
              checkbpPageNames.push(c[t]);
              let pid = null;
              try {
                pid = metadata.pageNameMapByName.get(c[t]).id;
                checkbpPageIds.push(pid);
                this.getCheckoutbpPagelist(c[t], pid, metadata.bpMap.get(parseInt(bpid[i])).channel);
              } catch (e) {
                console.log("exception ", e);
              }
            }
          }
        }
      }
    }
    return checkbpPageIds;
  }
  getCheckoutbpPagelist(pname, pid, channel) {
    let obj = {};
    obj["pagename"] = pname;
    obj["pageid"] = pid;
    obj["channel"] = channel;
    this.checkoutbpPagelist.push(obj);
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
  

}
