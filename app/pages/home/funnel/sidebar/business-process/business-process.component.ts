import TimeFilterUtil, { FilterCriteria } from './../../service/funnel.model';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import * as moment from 'moment';
import { Metadata } from '../../../home-sessions/common/interfaces/metadata';
import { MetadataService } from '../../../home-sessions/common/service/metadata.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FunnelService } from '../../service/funnel.service';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { SessionStateService } from '../../../home-sessions/session-state.service';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../../home-sessions/common/util/util';

@Component({
  selector: 'app-business-process',
  templateUrl: './business-process.component.html',
  styleUrls: ['./business-process.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class BusinessProcessComponent extends PageSidebarComponent implements OnInit {
  classes = 'page-sidebar business-process-manager';

  @Output() sidebarClose = new EventEmitter<boolean>();
  @Output() bpSubmit = new EventEmitter<FilterCriteria>();
  @Input() visible: boolean;

  timeFilter: string = 'last';
  customTime: Date[] = [];
  invalidDate: boolean = false;
  submitted: boolean;

  businessProcess: SelectItem[] = [];
  lastTimes: SelectItem[];
  channels: SelectItem[] = [];
  usersegments: SelectItem[] = [];

  metadata: Metadata = null;
  form: FormGroup;
  maxDate: Date;


  constructor(
    private metaDataService: MetadataService,
    private fb: FormBuilder,
    private funnelService: FunnelService,
    private timebarService: TimebarService,
    private stateService: SessionStateService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();

    // check if the filtercriteria/form needs to be restored
    // check the previous URL
    const previousURL = this.funnelService.getPreviousUrl();
    const fromBreadcrumb = this.route.snapshot.queryParams['from'] == 'breadcrumb';

    let filterCriteria = null;
    if ((fromBreadcrumb || previousURL === '/home/home-sessions?from=funnel')) {
      // check if the filterCriteria exists
      filterCriteria = this.stateService.get('funnel.filterCriteria', null);
      if (filterCriteria) {
        const value = this.stateService.get('funnel.form.value', null);
        this.form.patchValue(value);
      }
    }

    this.metaDataService.getMetadata().subscribe((response: any) => {
      this.metadata = response;

      this.funnelService.metadata = this.metadata;

      // -------channel----------
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map((key) => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).name
        };
      });
      this.channels.unshift({
        label: 'All',
        value: 'Overall'
      });

      // --------user segment-------------
      const usersegment: any[] = Array.from(this.metadata.userSegmentMap.keys());
      this.usersegments = usersegment.map((key) => {
        return {
          label: this.metadata.userSegmentMap.get(key).name,
          value: this.metadata.userSegmentMap.get(key).name
        };
      });
      this.usersegments.unshift({
        label: 'All',
        value: 'Overall'
      });

      // ----------Business Process ------------
      const bprocesss: any[] = Array.from(this.metadata.bpMap.keys());

      this.businessProcess = bprocesss.map((key) => {
        return {
          label: this.metadata.bpMap.get(key).name,
          value: this.metadata.bpMap.get(key).name
        };
      });

      if (!filterCriteria) {
        this.loadDefault();
      }
    });


    this.lastTimes = [
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },
      { label: '8 Hours', value: '8 Hours' },
      { label: '12 Hours', value: '12 Hours' },
      { label: '16 Hours', value: '16 Hours' },
      { label: '20 Hours', value: '20 Hours' },
      { label: '1 Day', value: '1 Day' },
      { label: '1 week', value: '1 Week' },
      { label: '1 Month', value: '1 Month' },
      { label: '1 Year', value: '1 Year' }
    ];
  }

  loadDefault() {
    // onload display the first checkout BP
    for (const [key, value] of this.metadata.bpMap) {
      if (value.checkoutflag === 1 && value.channel === -1) {
        this.form.get('bpname').patchValue(value.name);
        // integrating with global timebar

        let time = {} as { startTime: string, endTime: string };

        try {
          const timebarValue = this.timebarService.getValue();
          const startTimeMillis = timebarValue.time.frameStart.value;
          const endTimeMillis = timebarValue.time.frameEnd.value;

          time.startTime = moment.tz(startTimeMillis, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss');
          time.endTime = moment.tz(endTimeMillis, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss');

        } catch (error) {
          console.error('Timebar not loaded yet. Getting data for last 1 hour.');
          time = Util.convertLastToFormattedInSelectedTimeZone('1 Hour');
        }

        this.customTime[0] = new Date(time.startTime);
        this.customTime[1] = new Date(time.endTime);


        this.form.get('timeFilter').patchValue('custom');
        this.form.get('customTime').patchValue([this.customTime[0], this.customTime[1]]);

        this.onTimeFilterChange();
        // get the funnel data
        this.submit();
        break;
      }
    }
  }

  initializeForm() {
    this.submitted = false;

    const d = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');

    this.form = this.fb.group({
      bpname: ['', Validators.required],
      channel: ['Overall', Validators.required],
      usersegment: ['Overall', Validators.required],
      timeFilter: ['last', Validators.required],
      lastTime: ['1 Day', Validators.required],
      customTime: [[this.customTime[0], this.customTime[1]], Validators.required]
    });

    setTimeout(() => {
      this.onTimeFilterChange();
    });
  }


  onTimeFilterCustomTimeChange(timeType) {
    console.log('timeFilterChanged');
    const customTime = this.form.get('customTime').value;

    switch (timeType) {
      case 'start':
        this.customTime[0] = customTime[0];
        break;

      case 'end':
        // ISSUE: http://10.10.30.34/bugzilla/show_bug.cgi?id=108434
        const maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
        if (customTime[1].getTime() > maxDate.getTime()) {
          customTime[1] = maxDate;
        }

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

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const customTime = this.form.get('customTime').value;
    if (new Date(customTime[0]).getTime() > new Date(customTime[1]).getTime()) {
      this.invalidDate = true;
      return;
    }

    this.invalidDate = false;
    this.submitted = false;
    const f = this.form.value;
    // set filtercriteria
    const filterCriteria: FilterCriteria = {
      timeFilter: f.timeFilter === 'last' ? TimeFilterUtil.setTimeFilter(f.lastTime, '', '') : TimeFilterUtil.setTimeFilter('', f.customTime[0], f.customTime[1]),
      bpname: f.bpname,
      channel: f.channel,
      usersegment: f.usersegment,
    };

    // hide the sidebar
    this.hide();
    this.stateService.set('funnel.form.value', f);
    this.bpSubmit.emit(filterCriteria);
  }

  hide(): void {
    this.visible = false;
    this.sidebarClose.emit(false);
  }

  show(): void {
    this.visible = true;
  }


}
