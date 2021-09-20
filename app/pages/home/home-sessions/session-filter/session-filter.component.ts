// import { SessionfiltercriteriaComponent } from '../sessionfiltercriteria/sessionfiltercriteria.component';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
//import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';
import { ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
// import { SessionsComponent } from '../sessions.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

//import { FilterbagComponent } from '../../filterbag/filterbag.component';
import * as moment from 'moment';
import 'moment-timezone';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { ParseSessionFilters } from './../common/interfaces/parsesessionfilters';
import { MetadataService } from './../common/service/metadata.service';
import { Metadata } from '../common/interfaces/metadata';
import { Channel } from '../common/interfaces/channel';
import { OS } from '../common/interfaces/operatingsystem';
import { BusinessProcess } from '../common/interfaces/businessprocess';
import { PageName } from '../common/interfaces/page';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-filter',
  templateUrl: './session-filter.component.html',
  styleUrls: ['./session-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Metadata, MessageService]
})

export class SessionFilterComponent extends PageSidebarComponent implements OnInit {
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  //customTimeFrame: Moment[] = []; 
  customTimeFrame: Date[] = [];
  classes = 'session-filter-sidebar';
  invalidDate = false;
  duration = [
    { label: '15 Minutes' },
    { label: '1 Hour' },
    { label: '4 Hours' },
    { label: '8 Hours' },
    { label: '12 Hours' },
    { label: '16 Hours' },
    { label: '20 Hours' },
    { label: '1 Day' },
    { label: '1 Week' },
    { label: '1 Month' },
    { label: '1 Year' }
  ];

  ignoreTimeFilterChange = false;
  channel_opts: SelectItem[];
  location_opts: SelectItem[];
  os_opts: any[];
  user_seg_opts: any[];
  browser_opts: SelectItem[];
  connection_opts: SelectItem[];
  device_opts: any[];
  compare_opts: any[];
  found: string;
  custom_opts: any[];
  store_opts: any[];
  terminal_opts: any[];
  event_opts: any[];
  page_opts: SelectItem[];
  bp_opts: SelectItem[];
  customTimeFrameMax: Moment = null;
  osversion: SelectItem[];
  http: HttpClient;
  checktime: boolean;
  checkIfOthersAreSelected: boolean;
  custval: any;
  static url = 'http://localhost:81/metadata.json';
  metadata: Metadata;
  @Output() loadSessionData: EventEmitter<boolean>;
  @Output() filterChange: EventEmitter<any>;
  @Input() elt: any;

  parsesessionfilter: ParseSessionFilters;
  os: SelectItem[];
  showstore: any;
  showstoreOption: any;
  static attributehtml = '';
  custominfo: string;
  customindex: boolean;
  myForm: FormGroup;
  lasttime: any[];
  usersegment: any[];
  eventstype: any[];
  pages: SelectItem[];
  events: SelectItem[];
  fb: FormBuilder;
  custopr: any[];
  st: any;
  et: any;
  completed: boolean;
  bp: any;
  customarray: any[];
  bparray: any[];
  customk: any[];
  customtype: any;
  customclientid: any;
  device: any[];
  terminal: any[];
  usersegmentoption: any[]; 
  //customTimeFrame :Moment [];
  OPERATOR_OPTS = [
    { label: '<=', value: '<=' },
    { label: '=', value: '=' },
    { label: '>=', value: '>=' }
  ];

  OPERATOR_OPTS2 = [
    { label: 'Less Than Equals To', value: '<=' },
    { label: 'Equals To', value: '=' },
    { label: 'Greater Than Equals To', value: '>=' }
  ];

  CM_CONDS = [
    { label: 'And', value: 'And' },
    { label: 'OR', value: 'OR' }
  ];

  reloading = false;

  constructor(http: HttpClient, private nvhttp: NvhttpService, private route: ActivatedRoute, private router: Router, private metadataService: MetadataService, private messageService: MessageService) {
    super();
    this.checkIfOthersAreSelected = true;
    this.loadSessionData = new EventEmitter();
    this.filterChange = new EventEmitter();
    this.custominfo = '';
    this.parsesessionfilter = new ParseSessionFilters();
    this.metadata = new Metadata();
    this.st = '';
    this.et = '';
    this.http = http;
    this.completed = true;
    this.lasttime = ['15 Minutes', '1 Hour', '4 Hours', '8 Hours', '12 Hours', '16 Hours', '20 Hours', '1 Day', '1 Week', '1 Month', '1 Year'];
    this.usersegment = [];
    this.device = [];
    this.device.push({ label: 'PC', value: 'PC' });
    this.device.push({ label: 'Mobile', value: 'Mobile' });
    this.device.push({ label: 'Tablet', value: 'Tablet' });
    this.bp = null;
    this.bparray = [];
    this.customarray = []; 
     const time = new Date().getTime();
     const d = new Date(moment.tz(time, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss')); 
     this.customTimeFrame[0] = new Date(d.toDateString() + ' 00:00:00');
     this.customTimeFrame[1] = new Date(d.toDateString() + ' 23:59:00');
     this.setForm();
    this.os = [];
    this.osversion = [];
    this.terminal = [];
    this.usersegmentoption = [];

    this.duration = this.duration.map(e => {
      return e['value'] = e.label, e;
    });

  }

  ngOnInit() {  
    
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;


      this.channel_opts = Array.from(this.metadata.channelMap.keys()).map(key => {
        let entry = this.metadata.channelMap.get(key);
        return {
          label: entry.name,
          value: entry.id
        }
      }); 

      const me = this;

      let location_keys = Array.from(this.metadata.locationMap.keys());
      me.location_opts = location_keys.map(key => {
        return { label: (this.metadata.locationMap.get(key).state ? (this.metadata.locationMap.get(key).state + ',') : '') + this.metadata.locationMap.get(key).country, value: key }
      });

      let user_seg_keys = Array.from(this.metadata.userSegmentMap.keys());
      me.user_seg_opts = user_seg_keys.map(key => {
        return { label: this.metadata.userSegmentMap.get(key).name, value: key }
      });
      let browser_keys = Array.from(this.metadata.browserMap.keys());
      me.browser_opts = browser_keys.map(key => {
        return { label: this.metadata.browserMap.get(key).name, value: key }
      });
      let conn_keys = Array.from(this.metadata.connectionMap.keys());
      me.connection_opts = conn_keys.map(key => {
        return { label: this.metadata.connectionMap.get(key).name, value: key }
      });

      let store_keys = Array.from(this.metadata.storeMap.keys());
      me.store_opts = store_keys.map(key => {
        return { label: this.metadata.storeMap.get(key).name, value: key }
      });
      let terminal_keys = Array.from(this.metadata.terminalMap.keys());
      me.terminal_opts = terminal_keys.map(key => {
        return { label: this.metadata.terminalMap.get(key).name, value: key }
      });
      let event_keys = Array.from(this.metadata.eventMap.keys());
      me.event_opts = event_keys.map(key => {
        return { label: this.metadata.eventMap.get(key).name, value: key }
      });

      this.page_opts = Array.from(this.metadata.pageNameMap.keys()).map(key => {
        const entry = this.metadata.pageNameMap.get(key);
        return { label: entry.name, value: entry.id };
      });

      this.bp_opts = Array.from(this.metadata.bpMap.keys()).map(key => {
        const entry = this.metadata.bpMap.get(key);
        return { label: entry.name, value: entry.id };
      });

      this.custom_opts = Array.from(this.metadata.customMetricMap.keys()).map(key => {
        const entry = this.metadata.customMetricMap.get(key);
        return { label: entry.name, value: entry.id };
      });

      let eventKeys: any[] = Array.from(this.metadata.eventMap.keys());
      this.events = eventKeys.map(key => {
        return { label: this.metadata.eventMap.get(key).name, value: key }
      });
      let pagesKey: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pages = pagesKey.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: key }
      });
      console.log("this.pages", this.pages);
      let customKey: any[] = Array.from(this.metadata.customMetricMap.keys());
      this.customk = customKey.map(key => {
        return { label: this.metadata.customMetricMap.get(key).name, value: this.metadata.customMetricMap.get(key).valueType, id: this.metadata.customMetricMap.get(key).id }
      });
      let usersegment: any[] = Array.from(this.metadata.userSegmentMap.keys());
      this.usersegmentoption = usersegment.map(key => {
        return { label: this.metadata.userSegmentMap.get(key).name, value: this.metadata.userSegmentMap.get(key).id }
      });
      let platform = Array.from(this.metadata.osMap.keys());
      for (let i = 0; i < platform.length; i++) {
        if (i > 0) {
          if (this.metadata.osMap.get(platform[i]).name !== this.metadata.osMap.get(platform[i - 1]).name) {
            const name = this.metadata.osMap.get(platform[i]).name;
            this.os.push({ label: name, value: name });
          }
        }
        else {
          const name = this.metadata.osMap.get(platform[i]).name;
          this.os.push({ label: name, value: name });
        }
      }
      for (let i = 0; i < platform.length; i++) {
        if (this.metadata.osMap.get(platform[i]).version !== null && this.metadata.osMap.get(platform[i]).version !== 'null') {
          const version = this.metadata.osMap.get(platform[i]).version;
          this.osversion.push({ label: version, value: version });
        }
      }

      this.showstore = Array.from(this.metadata.storeMap.keys());
      this.showstoreOption = this.showstore.map(key => {
        return { label: this.metadata.storeMap.get(key).id, value: this.metadata.storeMap.get(key).id }
      });
    });
  }


  onTimeFilterCustomTimeChange(isStart: boolean) {
    //if _timefilter is set to true then ignore it. 
    if (this.myForm.controls['_timefilter'].value == 'true') return;

    let nestedGroup: FormGroup = <FormGroup>this.myForm.controls['timeFilter'];
    console.log('onTimeFilterCustomTimeChange called. timeFilter - ', nestedGroup.value, ', ignoreTimeFilterChange - ' + this.ignoreTimeFilterChange);
    if (this.ignoreTimeFilterChange == true) {
      // reset it. 
      this.ignoreTimeFilterChange = false;
      return;
    };

    let startTimeValue: Date[] = nestedGroup.controls['_customTimeFrameStart'].value;
    let endTimeValue: Date[] = nestedGroup.controls['_customTimeFrameEnd'].value;

    // FIXME: handling for timezone.
    let tz = sessionStorage.getItem('_nvtimezone') || null;

    if (isStart) {
      // update startTimeValue in endTime.
      endTimeValue[0] = startTimeValue[0];

      // set this to end also. 
      // Note: as we are programatically updating formControl which will trigger this method again. So setting a flag to ignore it.
      this.ignoreTimeFilterChange = true;
      nestedGroup.patchValue({
        'last': null,
        '_customTimeFrameEnd': endTimeValue,
        //'startTime': moment.tz(startTimeValue[0], tz).format('MM/DD/YYYY hh:mm:ss')
        'startTime': startTimeValue[0]
      });
    } else {
      //update Starttime
      startTimeValue[1] = endTimeValue[1];
      this.ignoreTimeFilterChange = true;
      nestedGroup.patchValue({
        'last': null,
        '_customTimeFrameStart': startTimeValue,
        //'endTime': moment.tz(endTimeValue[1], tz).format('MM/DD/YYYY hh:mm:ss')
        'endTime': endTimeValue[1]
      });
    }



    console.log('time filter value - ', nestedGroup.value);
  }

  onSubmit(f: any) {
    //TODO: handling for Filterbag. 
    // FilterbagComponent.bagItem.itemlist = [];
    //if (document.querySelector("#similarfiltericon") != null)
    //  document.querySelector("#similarfiltericon")["style"]["color"] = "white";
    f.stime = f.timeFilter.startTime;
    f.etime = f.timeFilter.endTime;

    console.log('filter', f.timeFilter.last, f.stime, f.etime);

    let c = new Date();
    if (f.timeFilter.last === null || f.timeFilter.last === '' || f.timeFilter.last === 'null') {
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
    let cpage = this.myForm.controls['containingPage'].value;
    let ncpage = this.myForm.controls['notContainingPage'].value;
    if ((cpage !== null && cpage !== "null") && (ncpage !== null && ncpage !== "null")) {
      if (cpage.length > ncpage.length) {
        for (let i = 0; i < cpage.length; i++) {
          for (let j = 0; j < ncpage.length; j++) {
            if (cpage[i] === ncpage[j]) {
              this.warn("Containing and NotContainingPage are same");
              return false;
            }
          }
        }
      }
      else {
        for (let i = 0; i < ncpage.length; i++) {
          for (let j = 0; j < cpage.length; j++) {
            if (ncpage[i] === cpage[j]) {
              this.warn("Containing and NotContainingPage are same");
              return false;
            }
          }
        }
      }
    }
    f.pageCount = this.myForm.controls['_pageopr'].value + ' ' + this.myForm.controls['_pageCountInfo'].value;
    if (this.myForm.controls['mm'].value > 60 || this.myForm.controls['ss'].value > 60) {
      this.warn("Enter value less than 60");
      return false;
    }
    else if (this.myForm.controls['hh'].value < 0 || this.myForm.controls['mm'].value < 0 || this.myForm.controls['ss'].value < 0) {
      this.warn("Enter value greater than 0");
      return false;
    }
    f.sessionDuration = this.myForm.controls['_sessoptr'].value + ' ' + this.myForm.controls['hh'].value + ':' + this.myForm.controls['ss'].value + ':' + this.myForm.controls['mm'].value;
    f.pageLoadTime = this.myForm.controls['_ltopt'].value + ' ' + this.myForm.controls['_loadTime'].value;
    f.domCompleteTime = this.myForm.controls['_domopt'].value + ' ' + this.myForm.controls['_completedomtime'].value;
    f.orderTotal = this.myForm.controls['_otor'].value + ' ' + this.myForm.controls['_ototal'].value;
    f.orderCount = this.myForm.controls['_orderopr'].value + ' ' + this.myForm.controls['_ocount'].value;
    f._customCondition = this.myForm.controls['_customCondition'].value;
    f.customValue = this.customarray;
    f.eventDataControl = this.myForm.controls['eventDataControl'].value;

    // since now, only one out of completedBP and abondenedBP can be selected
    let completeBp = false;
    let abondnedBp = false;

    if (this.myForm.controls['bpName'].value !== "null" && this.myForm.controls['bpName'].value !== null && this.myForm.controls['bpName'].value !== undefined) {
      // if bp name is selected by default it is abondened, if none is selected
      f.bpName = this.metadata.bpMap.get(parseInt(this.myForm.controls['bpName'].value)).name;
      if (this.myForm.controls['_bptype'].value == "") {
        this.myForm.controls['_bptype'].patchValue('true');
        this.myForm.controls['_bptype'].setValue('true');
      }
    }
    else
      f.bpName = null;

    let bptype = this.myForm.controls['_bptype'].value;
    console.log("Anjali bptype : " + bptype);
    if (bptype == 'true') {
      // abondnedBp is selected
      console.log("abondnedBp is selected");
      abondnedBp = true;
      completeBp = false;
    }
    else if (bptype == 'false') {
      // completeBp is selected
      console.log("completeBp is selected");
      abondnedBp = false;
      completeBp = true;
    }
    else { // when nothing is selected
      abondnedBp = false;
      completeBp = false;
    }

    //removing length check, this was required in checkbox 
    if ((completeBp !== null && completeBp !== false) || (abondnedBp !== null && abondnedBp !== false)) {
      if (f.bpName === null) {
        this.warn("Select BP Name");
        return false;
      }
    }
    if (f.storeId === null || f.storeId === "null")
      f.terminalId = null;

    this.parsesessionfilter.getSessionFilter(f, this.metadata);

    this.filterChange.emit(f);
    //this.loadSessionData.emit(true);
    this.closeClick();
    // FIXME: handle below points.
    // SessionfiltercriteriaComponent.setFilterCriteria([]);
    // SessionfiltercriteriaComponent.setFilterCriteria(this.parsesessionfilter.filterCriteriaList);
    // this.router.navigate(['/home/netvision/sessions'], { queryParams: { filterCriteria: JSON.stringify(ParseSessionFilters.sessionFilters), filterCriteriaList: JSON.stringify(this.parsesessionfilter.filterCriteriaList), channeltype: 'advance', random: Math.random() }, replaceUrl: true });
    console.log('Filter - ', ParseSessionFilters.sessionFilters);

  }

  warn(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: msg });
  }

  onSelectMethod(event, val) {
    let d = new Date(event);
    let nestedGroup: FormGroup = <FormGroup>this.myForm.controls['timeFilter'];
    if (val === 'starttime') {
      // this.st = d.getTime() / 1000;
      this.st = window["toDateString"](d) + ' ' + d.toLocaleTimeString();
      nestedGroup.patchValue({ startTime: this.st });
    }
    else {
      // this.et = d.getTime() / 1000;
      this.et = window["toDateString"](d) + ' ' + d.toLocaleTimeString();
      nestedGroup.patchValue({ endTime: this.et });
    }
  }

  resetbutton() {
    this.myForm.controls.eventDataControl.disable();
    this.reloading = true;

    setTimeout(() => {
      this.setForm();
      // reset the filterCriteria label in home-session component
      this.reloading = false;
    }, 0);
  }

  setForm() {
    this.customarray = [];
    this.bp = null;
    let d = new Date();
    let f = window["toDateString"](d);
    let startT = new Date(d.toDateString() + " 00:00:00");
    let endT = new Date(d.toDateString() + ' 23:59:00');
    this.myForm = new FormGroup({
      channel: new FormControl(null),
      CompletedSession: new FormControl('true'),
      NVSessionID: new FormControl(),
      sessInfo: new FormControl('allsession'),
      _timefilter: new FormControl('true'),
      sessionWithNd: new FormControl(false),
      crashSessions: new FormControl(false),
      replaysession: new FormControl(false),
      timeFilter: new FormGroup({
        startTime: new FormControl(startT), endTime: new FormControl(endT), last: new FormControl('15 Minutes'),
        //_customTimeFrameStart: new FormControl(new Array(2)), 
        _customTimeFrameStart: new FormControl(this.customTimeFrame), 
        _customTimeFrameEnd: new FormControl(this.customTimeFrame)
      }), 

      selectedEvent: new FormControl(),
      _duration: new FormControl('count'),
      entryPage: new FormControl(null),
      exitPage: new FormControl(null),
      loginId: new FormControl(null),
      location: new FormControl(null),
      browser: new FormControl(null),
      screen: new FormControl(null),
      lastval: new FormControl('15 Minutes'),
      _pageopr: new FormControl('<='),
      pageCount: new FormControl(),
      _pageCountInfo: new FormControl(),
      pageUrl: new FormControl(),
      referrerUrl: new FormControl(),
      clientIp: new FormControl(null),
      sessionDuration: new FormControl(),
      _sessoptr: new FormControl('<='),
      hh: new FormControl(),
      mm: new FormControl(),
      ss: new FormControl(),
      userSegment: new FormControl(),
      sessionId: new FormControl(),
      containingPage: new FormControl(),
      notContainingPage: new FormControl(),
      connectionType: new FormControl(null),
      responseSearch: new FormControl(),
      device: new FormControl(null),
      svcUrl: new FormControl(),
      pageLoadTime: new FormControl(),
      _ltopt: new FormControl('<='),
      _loadTime: new FormControl(),
      domCompleteTime: new FormControl(),
      _domopt: new FormControl('<='),
      _completedomtime: new FormControl(),
      platform: new FormControl(),
      orderTotal: new FormControl(null),
      _otor: new FormControl('<='),
      _ototal: new FormControl(),
      orderCount: new FormControl(null),
      _orderopr: new FormControl('<='),
      _ocount: new FormControl(),
      bpName: new FormControl(null),
      _bptype: new FormControl(''),
      //completeBp: new FormControl('false'),
      //abondnedBp: new FormControl('true'),
      bpExitPage: new FormControl(),
      sessionExitPage: new FormControl(),
      bpExitPageEvents: new FormControl(),
      sessionExitPageEvent: new FormControl(),
      transit: new FormControl(),
      storeName: new FormControl(null),
      storeId: new FormControl(null),
      terminalId: new FormControl(null),
      associateId: new FormControl(),
      transactionId: new FormControl(),
      eventDataControl: new FormControl(),
      _customName: new FormControl(null),
      _customOpr: new FormControl(null),
      _customCondition: new FormControl('And'),
      _customTxt: new FormControl(),
      customValue: new FormControl(),
      platformversion: new FormControl(null),
      stime: new FormControl(startT),
      etime: new FormControl(endT),
      botSessions: new FormControl(false),
      authFailed: new FormControl(false),
      notAuth: new FormControl(false)
    });
    this.myForm.controls.eventDataControl.disable();
    this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.disable()
    this.myForm.controls.timeFilter['controls']._customTimeFrameStart.disable()
  }

  trigger($event, val) {
    if (val === 'allsessions') {
      this.completed = true;
    }
    else {
      this.completed = false;
    }
  }

  // FIXME: 
  setBPExitPage(val) {
    let k = val;
    this.bparray = [];
    if (val === "null")
      return;
    let g = this.metadata.bpMap.get(parseInt(k)).pagelist;
    let h = g.split(',');
    for (let i = 0; i < h.length; i++) {
      this.bparray.push({ label: h[i], value: this.metadata.pageNameMapByName.get(h[i].replace(':E', '')).id });
    }
    return this.bparray;
  }


  onSelectCustom(event) {
    let filterfound = this.custom_opts.find(temp => {
      if (temp.value == event)
        return temp

    })
    this.found = filterfound.label;
    this.custval = event;
    let val = -1;
    for (let i = 0; i < this.customk.length; i++) {
      if (this.customk[i].id === this.custval) {
        val = this.customk[i].value;
        this.customtype = val;
        this.customclientid = this.customk[i].id;
      }
    }
    this.custopr = [];
    if (val === 0 || val === 4) {
      this.custopr.push({ 'label': 'Equals to', 'value': '=' });
      this.custopr.push({ 'label': 'Not Equals to', 'value': '!=' });
      if (val === 0) {
        this.custopr.push({ 'label': 'Contains', 'value': 'exist' });
      }
    }
    else {
      this.custopr.push({ 'label': 'Less than', 'value': '<' });
      this.custopr.push({ 'label': 'Greater than', 'value': '>' });
      this.custopr.push({ 'label': 'Equal to ', 'value': '=' });
      this.custopr.push({ 'label': 'Not equals to ', 'value': '!=' });
      this.custopr.push({ 'label': ' Less than equals to ', 'value': '>=' });
      this.custopr.push({ 'label': ' Greater than equals to ', 'value': '>=' });
    }
  }

  setCustomValue(value) {
    if ((this.custval === undefined || this.custval === null || this.custval === "null") || (this.myForm.controls['_customOpr'].value === null || this.myForm.controls['_customOpr'].value === "null") || (this.myForm.controls['_customTxt'].value === "" || this.myForm.controls['_customTxt'].value === null)) {
      this.warn('Please fill all details');
      return;
    }
    this.customindex = false;
    this.customarray.push({ 'name': this.found, 'label': this.found, 'operator': this.myForm.controls['_customOpr'].value, 'value': this.myForm.controls['_customTxt'].value, 'type': this.customtype, 'clientid': this.customclientid });
    this.myForm.addControl('customVal', new FormControl(this.customarray));
  }

  removeCustom(cust) {
    let index = this.customarray.indexOf(cust);
    this.customarray.splice(index, 1);
  }

  getCustomValue() {
    let html = ' ';
    html += '<span>hello</span>';
    return html;
  }

  onSelectMethodLast(event) {
    let nestedGroup: FormGroup = <FormGroup>this.myForm.controls['timeFilter'];
    let lastvalue = this.myForm.controls['lastval'].value;
    nestedGroup.patchValue({ last: lastvalue });
  }

  triggerfilter() {
    let val = this.myForm.controls['_timefilter'].value;
    let nestedGroup: FormGroup = <FormGroup>this.myForm.controls['timeFilter'];
    if (val === 'true') {
      let lastvalue = this.myForm.controls['lastval'].value;
      nestedGroup.patchValue({ startTime: null });
      nestedGroup.patchValue({ endTime: null });

      nestedGroup.patchValue({ last: lastvalue });
    }
    else {
      this.myForm.controls.timeFilter['controls']._customTimeFrameEnd.enable();
      this.myForm.controls.timeFilter['controls']._customTimeFrameStart.enable(); 
      this.myForm.controls['lastval'].disable();
      nestedGroup.patchValue({ last: null });
      let d = new Date();
      let f = window["toDateString"](d);
      let startT = new Date(d.toDateString() + " 00:00:00");
      let endT = new Date(d.toDateString() + ' 23:59:00');
    }
  }

  showAttributeElement() {
    let cpage = this.myForm.controls['containingPage'].value;
    let ncpage = this.myForm.controls['notContainingPage'].value;
    if ((cpage !== null || cpage !== "null") && (ncpage !== null && ncpage !== "null")) {
      if (cpage.length > ncpage.length) {
        for (let i = 0; i < cpage.length; i++) {
          for (let j = 0; j < ncpage.length; j++) {
            if (cpage[i] === ncpage[j]) {
              this.warn("Select Other Page");
              return false;
            }
          }
        }
      }
      else {
        for (let i = 0; i < ncpage.length; i++) {
          for (let j = 0; j < cpage.length; j++) {
            if (ncpage[i] === cpage[j]) {
              this.warn("Select Other Page");
              return false;
            }
          }
        }
      }
    }
  }


  getAttributeHtml() {
    // TODO: 
    // return SessionfilterComponent.attributehtml ;
  }

  getPageNames(pages) {
    let pageNameList = '';
    if (pages.length > 0) {
      for (let a = 0; a < pages.length; a++) {
        if (a > 0) {
          pageNameList += ' ';
        }
        pageNameList += this.metadata.pageNameMap.get(parseInt(pages[a])).name;
      }
    }
    return pageNameList;
  }

  checkSelected(e) {
    let val = this.myForm.controls['_duration'].value;
    /*
      if ( val === 'time')
       {
         this.myForm.controls['_pageCountInfo'].patchValue('');
      }
      else
       {
        this.myForm.controls['_hh'].patchValue('');
        this.myForm.controls['_mm'].patchValue('');
        this.myForm.controls['_ss'].patchValue('');
      }
    */
  }

  resetInfo() {
    let val = this.myForm.controls['sessInfo'].value;
    if (val !== 'SessionwithEvents') {
      this.myForm.controls['selectedEvent'].patchValue(null);
    }
  }
  eventData() {
    let eventId = this.myForm.controls['selectedEvent'].value;
    if (eventId !== null && eventId !== undefined && eventId.length > 0) {
      this.myForm.controls.eventDataControl.enable();
    }
    else {
      this.myForm.controls.eventDataControl.disable();
    }

  }
  setPlatformVersion(event) {
    this.osversion = [];
    let val = event;
    this.myForm.controls['platformversion'].patchValue(null);
    let platform = Array.from(this.metadata.osMap.keys());
    for (let f = 0; f < platform.length; f++) {
      if (val === this.metadata.osMap.get(platform[f]).name) {
        if (this.metadata.osMap.get(platform[f]).version !== null && this.metadata.osMap.get(platform[f]).version !== "null")
          this.osversion.push({ label: this.metadata.osMap.get(platform[f]).version, value: this.metadata.osMap.get(platform[f]).version });
      }
    }
    return this.osversion;
  }

  getTerminal() {
    let val = this.myForm.controls['storeId'].value;
    let service: string = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + val;
    /*
    this.http.get(service,{responseType:'text'}).map((response: any) => response)
                  .subscribe((response:any) => {let a: any = response ;
                  //let tmp = [];
                  let f = a.trim().split(',');
                  for ( let i = 0; i < f.length ; i++)
                   {
                     this.terminal.push({label : f[i] , value : f[i]});
                   }
                    //this.terminal = tmp;
      } );
      */
  }

  selectTerminal(value) {
    this.nvhttp.showTerminal(value).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response) {
        if (response.length > 0) {
          this.terminal = Array.from(response).map(key => {
            return {
              label: key['goalid'],
              value: key['goalid']
            }
          });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'No Terminal Id is present for store id ' + value, detail: '' });
          this.terminal = [];
        }
        console.log(this.terminal);
      }

    });
  }

  eventMsg() {
    let eventId = this.myForm.controls['selectedEvent'].value;
    if (eventId == null || eventId == undefined || eventId.length == 0) {
      //TODO: handle it.
      window['alert']('Please select any event from general filter..!!');
      //this.snackBar.open('Please select any event from general filter..!!', 'OK',{
      // duration: 4000
      //});
    }
    return;
  }
  showCalendar() {
    let time = (new Date().getTime());
    let dt = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }

}

