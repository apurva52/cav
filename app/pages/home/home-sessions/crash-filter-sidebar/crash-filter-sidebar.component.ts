// import { SessionfiltercriteriaComponent } from '../sessionfiltercriteria/sessionfiltercriteria.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
import { Moment } from 'moment-timezone';
import { SelectItem } from 'primeng';
import { MessageService } from 'primeng/api';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { Metadata } from '../common/interfaces/metadata';
import { ParseSessionFilters } from './../common/interfaces/parsesessionfilters';
import { MetadataService } from './../common/service/metadata.service';
import { SessionStateService } from './../session-state.service';

interface ExportData {
  filtercriteria: any;
  filtercriteriadisplay: string;
  StartTime: any;
  EndTime: any;
}
@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-crash-sidebar-filter',
  templateUrl: './crash-filter-sidebar.component.html',
  styleUrls: ['./crash-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Metadata, MessageService]
})

export class CrashFilterSidebarComponent extends PageSidebarComponent implements OnInit {
  @Output() loadSessionData: EventEmitter<boolean>;
  @Output() filterChange: EventEmitter<any>;
  @Input() elt: any;

  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
  customTimeFrame: Moment[] = [];
  classes = 'crash-filter-sidebar';
  invalidDate = false;
  duration: SelectItem[] = [
    { label: '15 Minutes', value: 900000 },
    { label: '1 Hour', value: 3600000 },
    { label: '4 Hours', value: 14400000 },
    { label: '8 Hours', value: 28800000 },
    { label: '12 Hours', value: 43200000 },
    { label: '16 Hours', value: 57600000 },
    { label: '20 Hours', value: 72000000 },
    { label: '1 Day', value: 86400000 },
    { label: '1 Week', value: 604800000 },
    { label: '1 Month', value: 2628000000 },
    { label: '1 Year', value: 31556952000 }];

  ignoreTimeFilterChange = false;
  channels: SelectItem[];
  locations: SelectItem[] = [];
  mobileCarriers: SelectItem[] = [];
  connections: SelectItem[] = [];
  customTimeFrameMax: Moment = null;
  osversion: any[];
  metadata: Metadata;
  parsesessionfilter: ParseSessionFilters;
  os: SelectItem[];
  myForm: FormGroup;
  pages: SelectItem[];
  st: any;
  et: any;
  device: any[];
  filtercriteria1: any[] = [];
  filtercriteriadisplay: string = '';
  userSegments: SelectItem[];
  sttime: any;
  oldformfilter: any;
  ettime: any;
  reloading = false;

  constructor(private stateService: SessionStateService, private metadataService: MetadataService, private messageService: MessageService) {
    super();
    this.loadSessionData = new EventEmitter();
    this.filterChange = new EventEmitter();
    this.oldformfilter = this.stateService.get('crashfilter');
    this.parsesessionfilter = new ParseSessionFilters();
    this.metadata = new Metadata();
    this.st = '';
    this.et = '';
    this.device = [
      { label: 'PC', value: 'PC' },
      { label: 'Mobile', value: '1' },
      { label: 'Tablet', value: 'Tablet' }
    ];
    this.setForm();
    this.os = [];
    this.osversion = [];
    this.userSegments = [];

  }

  ngOnInit() {
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;

      const channelm = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return { label: this.metadata.channelMap.get(key).name, value: this.metadata.channelMap.get(key).id };
      });

      const me = this;

      let location_keys = Array.from(this.metadata.locationMap.keys());
      me.locations = location_keys.map(key => {
        return { label: (this.metadata.locationMap.get(key).state ? (this.metadata.locationMap.get(key).state + ',') : '') + this.metadata.locationMap.get(key).country, value: key };
      });

      let usersegment: any[] = Array.from(this.metadata.userSegmentMap.keys());
      this.userSegments = usersegment.map(key => {
        return { label: this.metadata.userSegmentMap.get(key).name, value: this.metadata.userSegmentMap.get(key).id };
      });

      const mobilem = Array.from(this.metadata.mobileCarrierMap.keys());
      me.mobileCarriers = mobilem.map(key => {
        return { label: this.metadata.mobileCarrierMap.get(key).name, value: this.metadata.mobileCarrierMap.get(key).name };
      });

      let conn_keys = Array.from(this.metadata.connectionMap.keys());
      me.connections = conn_keys.map(key => {
        return { label: this.metadata.connectionMap.get(key).name, value: this.metadata.connectionMap.get(key).name };
      });

      const pagem = Array.from(this.metadata.pageNameMap.keys());
      me.pages = pagem.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).id };
      });

      const platform = Array.from(this.metadata.osMap.keys());
      for (let i = 0; i < platform.length; i++) {
        if (i > 0) {
          if (this.metadata.osMap.get(platform[i]).name !== this.metadata.osMap.get(platform[i - 1]).name) {
            this.os.push({ label: this.metadata.osMap.get(platform[i]).name, value: this.metadata.osMap.get(platform[i]).name });
          }
        }
        else {
          this.os.push({ label: this.metadata.osMap.get(platform[i]).name, value: this.metadata.osMap.get(platform[i]).name });
        }
      }
      for (let i = 0; i < platform.length; i++) {
        if (this.metadata.osMap.get(platform[i]).version !== null && this.metadata.osMap.get(platform[i]).version !== 'null') {
          this.osversion.push(this.metadata.osMap.get(platform[i]).version);
        }
      }
    });
  }


  onTimeFilterCustomTimeChange(isStart: boolean) {
    const nestedGroup: FormGroup = this.myForm.controls['timeFilter'] as FormGroup;
    console.log('onTimeFilterCustomTimeChange called. timeFilter - ', nestedGroup.value, ', ignoreTimeFilterChange - ' + this.ignoreTimeFilterChange);
    // if _timefilter is set to true then ignore it. ^M
    if (this.myForm.controls['_timefilter'].value == 'true') { return; }

    if (this.ignoreTimeFilterChange == true) {
      // reset it.
      this.ignoreTimeFilterChange = false;
      return;
    }

    const startTimeValue: Date[] = nestedGroup.controls['_customTimeFrameStart'].value;
    const endTimeValue: Date[] = nestedGroup.controls['_customTimeFrameEnd'].value;

    // FIXME: handling for timezone.

    if (isStart) {
      // update startTimeValue in endTime.
      endTimeValue[0] = startTimeValue[0];

      // set this to end also.
      // Note: as we are programatically updating formControl which will trigger this method again. So setting a flag to ignore it.
      this.ignoreTimeFilterChange = true;
      nestedGroup.patchValue({
        last: null,
        _customTimeFrameEnd: endTimeValue,
        // 'startTime': moment.tz(startTimeValue[0], tz).format('MM/DD/YYYY hh:mm:ss')
        startTime: startTimeValue[0]
      });
    } else {
      // update Starttime
      startTimeValue[1] = endTimeValue[1];
      this.ignoreTimeFilterChange = true;
      nestedGroup.patchValue({
        last: null,
        _customTimeFrameStart: startTimeValue,
        // 'endTime': moment.tz(endTimeValue[1], tz).format('MM/DD/YYYY hh:mm:ss')
        endTime: endTimeValue[1]
      });
    }



    console.log('time filter value - ', nestedGroup.value);
  }

  onSubmit(f: any) {
    const storef = { ...f };
    f.stime = f.timeFilter.startTime;
    f.etime = f.timeFilter.endTime;

    console.log('filter', f, f.timeFilter.last, f.stime, f.etime);

    const c = new Date();
    if (f.timeFilter.last === null || f.timeFilter.last === '' || f.timeFilter.last === 'null') {
      if (f.stime === null || f.etime === null) {

        this.warn('Please Enter Valid Date and Time.');
        return;
      }
      if (new Date(f.stime).getTime() > new Date(f.etime).getTime()) {
        this.warn('Start Time cannot be greater than End Time.');
        return;
      }
      else if (new Date(f.etime).getTime() > c.getTime()) {
        this.warn('Invalid Date');
        return;
      }
    }

    if (f._timefilter === 'true') {
      const tmp = new Date().getTime() - f.timeFilter.last;
      const d = new Date(tmp);
      this.sttime = window['toDateString'](d) + ' ' + d.toTimeString().toString().replace('GMT+0530 (India Standard Time)', '').trim();
      const e = new Date();
      this.ettime = window['toDateString'](e) + ' ' + e.toTimeString().toString().replace('GMT+0530 (India Standard Time)', '').trim();
    }
    else {
      const g = f.stime;
      this.sttime = window['toDateString'](g) + ' ' + g.toTimeString().toString().replace('GMT+0530 (India Standard Time)', '').trim();
      const h = f.etime;
      this.ettime = window['toDateString'](h) + ' ' + h.toTimeString().toString().replace('GMT+0530 (India Standard Time)', '').trim();
    }

    this.getfiltercriteria(f, this.sttime, this.ettime);
    this.stateService.set('crashfilter', storef, true);
    this.closeClick();
    const extdata: ExportData = {
      filtercriteria: this.filtercriteria1,
      filtercriteriadisplay: this.filtercriteriadisplay,
      StartTime: this.sttime,
      EndTime: this.ettime
    };
    this.filterChange.emit(extdata);
    console.log('Filter - ', this.filtercriteria1);

  }

  getfiltercriteria(d: any, stme: any, etme: any) {
    console.log('check', d);
    this.filtercriteria1 = [];
    this.filtercriteriadisplay = '';
    this.filtercriteria1.push(stme);
    this.filtercriteria1.push(etme);

    this.filtercriteriadisplay += 'StartTime: ' + stme;
    this.filtercriteriadisplay += ', EndTime: ' + etme;


    if (d.platform != null && d.platform != 'null') {
      this.filtercriteria1.push('Platform:' + d.platform);
      this.filtercriteriadisplay += ', Platform: ' + d.platform;
    }
    if (d.connectionType != null && d.connectionType != 'null') {
      this.filtercriteria1.push('connectionType:' + d.connectionType);
      this.filtercriteriadisplay += ', Connection Type: ' + d.connectionType;
    }
    if (d.entryPage != null && d.entryPage != 'null' && d.entryPage.length != 0) {
      this.filtercriteria1.push('pagename:' + d.entryPage);
      this.filtercriteriadisplay += ', Page: ' + d.entryPage;
    }
    if (d.MobileCarrier != null && d.MobileCarrier != 'null') {
      this.filtercriteria1.push('mobilecarrier:' + d.MobileCarrier);
      this.filtercriteriadisplay += ', Mobile Carrier: ' + d.MobileCarrier;
    }
    if (d.crashname != null && d.crashname != '') {
      this.filtercriteria1.push('filename:' + d.crashname);
      this.filtercriteriadisplay += ', File: ' + d.crashname;
    }
    if (d.exception != null && d.exception != '') {
      this.filtercriteria1.push('exceptionname:' + d.exception);
      this.filtercriteriadisplay += ', Exception Name: ' + d.exception;
    }
    if (d.function != null && d.function != '') {
      this.filtercriteria1.push('functionname:' + d.function);
      this.filtercriteriadisplay += ', Function: ' + d.function;
    }
    if (d.channel != null && d.channel != 'null' && d.channel.length != 0) {
      this.filtercriteria1.push('channel:' + d.channel);
      d.channel = this.metadata.channelMap.get(Number(this.myForm.controls['channel'].value)).name;
      this.filtercriteriadisplay += ', Channel: ' + d.channel;
    }
    if (d.device != null && d.device != 'null') {
      this.filtercriteria1.push('devicemanufacturer:' + d.device);
      this.filtercriteriadisplay += ', Device Manufacturer: ' + d.device;
    }
    if (d.crashmessage != null && d.crashmessage != '') {
      this.filtercriteria1.push('exceptionmessage:' + d.crashmessage);
      this.filtercriteriadisplay += ', Exception Message: ' + d.crashmessage;
    }
    if (d.location != null && d.location != 'null') {
      this.filtercriteria1.push('location:' + d.location);
      this.filtercriteriadisplay += ', Location: ' + d.location;
    }
    if (d.appname != null && d.appname != '') {
      this.filtercriteria1.push('appname:' + d.appname);
      this.filtercriteriadisplay += ', App Name: ' + d.appname;
    }
    if (d.appversion != null && d.appversion != 'null') {
      this.filtercriteria1.push('appversion:' + d.appversion);
      this.filtercriteriadisplay += ', App Version: ' + d.appversion;
    }

    console.log('filters2', this.filtercriteria1);
  }

  warn(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: msg });
  }

  onSelectMethod(event, val) {
    const d = new Date(event);
    const nestedGroup: FormGroup = this.myForm.controls['timeFilter'] as FormGroup;
    if (val === 'starttime') {
      // this.st = d.getTime() / 1000;
      this.st = window['toDateString'](d) + ' ' + d.toLocaleTimeString();
      nestedGroup.patchValue({ startTime: this.st });
    }
    else {
      // this.et = d.getTime() / 1000;
      this.et = window['toDateString'](d) + ' ' + d.toLocaleTimeString();
      nestedGroup.patchValue({ endTime: this.et });
    }
  }

  resetbutton() {
    this.reloading = true;

    setTimeout(() => {
      this.stateService.set('crashfilter', undefined, true);
      this.oldformfilter = this.stateService.get('crashfilter');
      this.setForm();
      this.reloading = false;
    }, 0);
  }

  setForm() {
    if (this.oldformfilter != undefined) {
      var a = [], b = [];
      if (this.oldformfilter._timefilter == 'Custom') {
        a[0] = this.oldformfilter.timeFilter._customTimeFrameStart[0];
        a[1] = this.oldformfilter.timeFilter._customTimeFrameStart[1];
        b[0] = this.oldformfilter.timeFilter._customTimeFrameEnd[0];
        b[1] = this.oldformfilter.timeFilter._customTimeFrameEnd[1];
      }
      // if (this.oldformfilter._timeFilter == "custom")
      //   this.oldformfilter.timeFilter.last = '900000';
      this.myForm = new FormGroup({
        _timefilter: new FormControl(this.oldformfilter._timefilter),
        timeFilter: new FormGroup({
          startTime: new FormControl(this.oldformfilter.startTime), endTime: new FormControl(this.oldformfilter.endTime), last: new FormControl(this.oldformfilter.timeFilter.last),
          _customTimeFrameStart: new FormControl(a),
          _customTimeFrameEnd: new FormControl(b)
        }),
        _duration: new FormControl('count'),
        entryPage: new FormControl(this.oldformfilter.entryPage),
        hh: new FormControl(),
        lastval: new FormControl(this.oldformfilter.timeFilter.last),
        mm: new FormControl(),
        ss: new FormControl(),
        usersegment: new FormControl(this.oldformfilter.usersegment),
        device: new FormControl(this.oldformfilter.device),
        channel: new FormControl(this.oldformfilter.channel),
        crashmessage: new FormControl(this.oldformfilter.crashmessage),
        exception: new FormControl(this.oldformfilter.exception),
        crashname: new FormControl(this.oldformfilter.crashname),
        function: new FormControl(this.oldformfilter.function),
        appname: new FormControl(this.oldformfilter.appname),
        appversion: new FormControl(this.oldformfilter.appversion),
        platform: new FormControl(this.oldformfilter.platform),
        location: new FormControl(this.oldformfilter.location),
        MobileCarrier: new FormControl(this.oldformfilter.MobileCarrier),
        connectionType: new FormControl(this.oldformfilter.connectionType)
      });
      if (this.oldformfilter._timefilter == 'Custom') {
        this.myForm.controls['lastval'].patchValue('900000');
        this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.enable();
        this.myForm.controls.timeFilter['controls']._customTimeFrameStart.enable();
      }
      if (this.oldformfilter._timefilter == 'true') {

        this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.disable();
        this.myForm.controls.timeFilter['controls']._customTimeFrameStart.disable();
      }
    }
    else {
      const d = new Date();
      const startT = new Date(d.toDateString() + ' 00:00:00');
      const endT = new Date(d.toDateString() + ' 23:59:00');
      this.myForm = new FormGroup({
        _timefilter: new FormControl('true'),
        timeFilter: new FormGroup({
          startTime: new FormControl(startT), endTime: new FormControl(endT), last: new FormControl('15 Minutes'),
          _customTimeFrameStart: new FormControl(new Array(2)),
          _customTimeFrameEnd: new FormControl(new Array(2))
        }),
        _duration: new FormControl('count'),
        entryPage: new FormControl(null),
        hh: new FormControl(),
        lastval: new FormControl('900000'),
        mm: new FormControl(),
        ss: new FormControl(),
        usersegment: new FormControl(),
        device: new FormControl(null),
        channel: new FormControl(null),
        crashmessage: new FormControl(null),
        exception: new FormControl(null),
        crashname: new FormControl(null),
        function: new FormControl(null),
        appname: new FormControl(null),
        appversion: new FormControl(null),
        platform: new FormControl(null),
        location: new FormControl(null),
        MobileCarrier: new FormControl(null),
        connectionType: new FormControl(null)
      });
      this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.disable();
      this.myForm.controls.timeFilter['controls']._customTimeFrameStart.disable();
    }

  }


  onSelectMethodLast() {
    const nestedGroup: FormGroup = this.myForm.controls['timeFilter'] as FormGroup;
    const lastvalue = this.myForm.controls['lastval'].value;
    nestedGroup.patchValue({ last: lastvalue });
  }

  triggerfilter() {
    const val = this.myForm.controls['_timefilter'].value;
    const nestedGroup: FormGroup = this.myForm.controls['timeFilter'] as FormGroup;
    if (val === 'true') {
      this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.disable();
      this.myForm.controls.timeFilter['controls']._customTimeFrameStart.disable();
      const lastvalue = this.myForm.controls['lastval'].value;
      nestedGroup.patchValue({ startTime: null });
      nestedGroup.patchValue({ endTime: null });

      nestedGroup.patchValue({ last: lastvalue });
    }
    else {
      this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.enable();
      this.myForm.controls.timeFilter['controls']._customTimeFrameStart.enable();
      nestedGroup.patchValue({ last: null });
      const d = new Date();
    }
  }





  getPageNames(pages) {
    let pageNameList = '';
    if (pages.length > 0) {
      for (let a = 0; a < pages.length; a++) {
        if (a > 0) {
          pageNameList += ' ';
        }
        pageNameList += this.metadata.pageNameMap.get(Number(pages[a])).name;
      }
    }
    return pageNameList;
  }

  checkSelected() {

  }

  resetInfo() {
    const val = this.myForm.controls['sessInfo'].value;
    if (val !== 'SessionwithEvents') {
      this.myForm.controls['selectedEvent'].patchValue(null);
    }
  }

  setPlatformVersion(event) {
    this.osversion = [];
    const val = event;
    this.myForm.controls['platformversion'].patchValue(null);
    const platform = Array.from(this.metadata.osMap.keys());
    for (let f = 0; f < platform.length; f++) {
      if (val === this.metadata.osMap.get(platform[f]).name) {
        if (this.metadata.osMap.get(platform[f]).version !== null && this.metadata.osMap.get(platform[f]).version !== 'null') {
          this.osversion.push(this.metadata.osMap.get(platform[f]).version);
        }
      }
    }
    return this.osversion;
  }


  showCalendar() {
    const time = (new Date().getTime());
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    this.oldformfilter = this.stateService.get('crashfilter');
    me.show();
  }

}



