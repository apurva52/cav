import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
import { Subscription } from 'rxjs';

export interface TimeFilterValue {
  last: string;
  startTime: string;
  endTime: string;
};

@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeFilterComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeFilterComponent),
      multi: true
    }
  ]
})
export class TimeFilterComponent implements OnDestroy, ControlValueAccessor { 
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  get value(): TimeFilterValue {
    let obj = this.form.value;
    let last, start, end;
    if (obj.mode  == 'last') {
      last = obj.last;
      start = end = '';
    } else {
      last = '';
      console.log('timezone sessionstorage : ', sessionStorage.getItem('_nvtimezone'));
      let offset = moment.tz(new Date(obj.startTime[0]), sessionStorage.getItem('_nvtimezone')).format("Z");
      offset = offset.replace(":", "");
      let dateObj = new Date(moment(obj.startTime[0]).format('MM/DD/YYYY HH:mm:ss') + " " +  offset);
      let offsett = moment.tz(new Date(obj.endTime[1]), sessionStorage.getItem('_nvtimezone')).format("Z");
      offsett = offsett.replace(":", "");
      let dateObjj = new Date(moment(obj.endTime[1]).format('MM/DD/YYYY HH:mm:ss') + " " +  offset);
      start = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      end = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }

    return {
      last: last,
      startTime: start,
      endTime: end
    };
  }

  set value(value: TimeFilterValue) {

    if (value.last) {
      // set that as last. 
      this.form.patchValue({
        mode: 'last',
        last: value.last
      });
    } else {
      const stime = new Date(value.startTime);
      const etime = new Date(value.endTime);
      this.form.patchValue({
        mode: 'custom',
        startTime: [stime, etime],
        endTime: [stime, etime]
      });

    }
  }

  form: FormGroup;
  invalid = false;
  customTimeFrameMax: any;
  lasttimeoption: any[];
  errormsg: string = '';
  subscriptions: Subscription[] = [];
  ignoreCustomTimeChange = false;
  @Input() pickerType = 'timer';

  constructor() { 
    // TODO: 
    this.customTimeFrameMax = null;

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

    this.setForm();

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(this.value);
        this.onTouched();
      })
    );
  }

  setForm() {
    let d = new Date();
    //let startT = new Date(d.toDateString() + " 00:00:00");
    //let endT = new Date(d.toDateString() + ' 23:59:00');
    let dateObj = new Date();
     dateObj.setDate(dateObj.getDate() - 1);
     let yesterdayStr = moment.tz(dateObj,sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
     let startT = new Date(yesterdayStr + " 00:00:00");
     let endT = new Date(yesterdayStr + " 23:59:59");
    this.form = new FormGroup({
      last: new FormControl('15 Minutes'),
      mode: new FormControl('last'),
      startTime: new FormControl([startT, endT]),
      endTime: new FormControl([startT, endT])
    })
  }

  onTimeFilterCustomTimeChange(start: boolean) {
    if (this.ignoreCustomTimeChange) {
      this.ignoreCustomTimeChange = false;
      return;
    }

    this.ignoreCustomTimeChange = true;
    
    const stime = this.form.value.startTime[0];
    const etime = this.form.value.endTime[1];

    if (start) {
      //update in endTime.
      this.form.patchValue({
        endTime: [stime, etime]
      });
    } else {
      this.form.patchValue({
        startTime: [stime, etime]
      });
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};


  writeValue(value: any): void {
    if (value) {
      this.value = value;
    } else {
      // reset.
      this.invalid = false;
      this.errormsg = '';
      this.form.patchValue({
        mode: 'last',
        last: '15 Minutes'
      });
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // TODO: 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  validate(_: FormControl) {
    return this.invalid ? { timeFilter: { valid: false}}: null;
  }
}
