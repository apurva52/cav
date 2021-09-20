import { Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
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
import { FEEDBACK_FILTER_SIDEBAR_DATA, PANEL_DUMMY } from './service/feedback-filter-sidebar.dummy';
import { FeedbackFilterSidebar } from './service/feedback-filter-sidebar.model'; 
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { CalendarModule } from 'primeng/calendar'; 
import * as moment from 'moment';
import 'moment-timezone'; 
import { MetadataService } from './../../common/service/metadata.service'; 
import { Metadata } from './../../common/interfaces/metadata'; 
import { SessionStateService } from './../../session-state.service'; 
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-feedback-filter-sidebar',
  templateUrl: './feedback-filter-sidebar.component.html',
  styleUrls: ['./feedback-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackFilterSidebarComponent
  extends PageSidebarComponent
  implements OnInit {
  @Output() metadataCopy = new EventEmitter<Metadata>();
  classes = 'feedback-sidebar feedback-filter-manager';
  duration: SelectItem[];
  //customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val1: number;
  val2: number; 
  metadata: Metadata;
  filterCriteria: any = {};
  data:FeedbackFilterSidebar
  panel: any;
  options: SelectItem[]; 
  lastTime:any;
  comments:any; 
  feedbackForm: FormGroup; 
  submitted:boolean ; 
  startT: Date;
  endT: Date; 
  pages: any[] = []; 
  filters: any = {}; 
  Offset: number = 0;
  Limit: number = 1500;
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  showAdvanceFilter: boolean;
  showTimeFilter: boolean = true; 
  showFilter: any = {}; 
  ignoreTimeFilterChange:any;
  @Output() filterChange: EventEmitter<any>; 
  //customTimeFrame : any; 
  customTimeFrame: Date[] = []; 
  msg:any; 
  //invalidDate:boolean;

  
  constructor(private timebarService: TimebarService, private snackBar: MatSnackBar, private metadataService: MetadataService, private fb: FormBuilder, private stateService: SessionStateService, private messageService : MessageService ) {
    super();  
    this.filterChange = new EventEmitter(); 
    //this.setForm();
    this.lastTime = [
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
    this.comments = [
      { label: 'All', value: 'All' },
      { label: 'Any', value: 'Any' }
    ];
  }

  ngOnInit() {
    const me = this;
     me.panel = PANEL_DUMMY;
    me.data = FEEDBACK_FILTER_SIDEBAR_DATA  
    const time = new Date().getTime();
    const d = new Date(moment.tz(time, sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTimeFrame[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTimeFrame[1] = new Date(d.toDateString() + ' 23:59:00');

    // let formd = this.stateService.get('feedbackfilter')
    // formd == undefined ? this.setForm() : this.feedbackForm = formd
    
    const date = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
     const p = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
     this.startT = new Date(p.toDateString() + ' 00:00:00');
     this.endT = new Date(p.toDateString() + ' 23:59:00');
     this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
     this.setForm();

    
    this.metadataService.getMetadata().subscribe(metadata => { 
      this.metadata = metadata; 
      this.metadataCopy.emit(metadata);
      let pagesKey: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pages = pagesKey.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).id  }
      });
    });  



  } 
  
  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show(); 
    this.showTimeFilter = true; 
    
  }
  

  warn(msg: string) {
    this.messageService.add({  key : "my key", severity: 'warn', summary: 'Warning', detail: msg });
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
             timePeriod: timePeriod,
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
  setTimeFilter(filter) {
    const timefilter = {
      startTime: '',
      endTime: '',
      last: ''
    };
    if (filter.timeFilter === 'Custom') {
      const d = new Date(filter.specifiedFrom[0]);
      const e = new Date(filter.specifiedTo[1]);
      const date1 = window['toDateString'](d);
      const date2 = window['toDateString'](e);

      timefilter.startTime = date1 + ' ' + d.toTimeString().split(' ')[0];
      timefilter.endTime = date2 + ' ' + e.toTimeString().split(' ')[0];
      timefilter.last = '';
    } else {
      timefilter.startTime = '';
      timefilter.endTime = '';
      timefilter.last = filter.lastTime;
    }
    return timefilter;
  } 
  setForm() {
    this.submitted = false; 
    this.feedbackForm = this.fb.group({ 

      timeFilter: ['true'],
       lastTime: [{ value: '1 Hour', disabled: false }],
      specifiedFrom: [{ value: this.customTimeFrame, disabled: true }],
      specifiedTo: [{ value: this.customTimeFrame, disabled: true }],
       page: [null], 
       pagecontrol: [{ value: null, disabled: true }, [Validators.required]], 
       name: [null], 
       namecontrol: [{ value: null, disabled: true }, [Validators.required]], 
       email: [null], 
       emailcontrol: [{ value: null, disabled: true }, [Validators.required, Validators.email,
       Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
       rating: [null], 
       ratingcontrol: [{ value: null, disabled: true }, [Validators.required]],
       comment: [null], 
       commentcontrol1: [{ value: null, disabled: true }], 
       commentcontrol2: [{ value: null, disabled: true }, [Validators.required]],
       number: [null],
       numbercontrol: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(15), Validators.minLength(1)]], 
    }); 

  } 
  disableFormControl() {
    this.feedbackForm.controls.lastTime.enable();
    this.feedbackForm.controls.specifiedFrom.disable();
    this.feedbackForm.controls.specifiedTo.disable();
    this.feedbackForm.controls.pagecontrol.disable();
    this.feedbackForm.controls.namecontrol.disable();
    this.feedbackForm.controls.emailcontrol.disable();
    this.feedbackForm.controls.ratingcontrol.disable();
    this.feedbackForm.controls.commentcontrol1.disable();
    this.feedbackForm.controls.commentcontrol2.disable();
    this.feedbackForm.controls.numbercontrol.disable();
  } 
  resetForm() {
    this.submitted = false;
    this.feedbackForm.reset();
    this.disableFormControl();
    this.feedbackForm.controls.timeFilter.patchValue('true');
    this.feedbackForm.controls.lastTime.patchValue('1 Hour');
    this.feedbackForm.controls.specifiedFrom.patchValue(this.customTimeFrame);
    this.feedbackForm.controls.specifiedTo.patchValue(this.customTimeFrame);
  } 
  changeCheckBox(event) {

    if (this.feedbackForm.controls[event].value !== null && this.feedbackForm.controls[event].value.length) {
      if (event === 'comment') {
        this.feedbackForm.controls[event + 'control1'].enable();
        this.feedbackForm.controls[event + 'control2'].enable();
      } else {
        this.feedbackForm.controls[event + 'control'].enable();
      }
    } else {
      if (event === 'comment') {
        this.feedbackForm.controls[event + 'control1'].disable();
        this.feedbackForm.controls[event + 'control2'].disable();
        this.feedbackForm.controls[event + 'control1'].reset();
        this.feedbackForm.controls[event + 'control2'].reset();
      } else {
        this.feedbackForm.controls[event + 'control'].disable();
        this.feedbackForm.controls[event + 'control'].reset();
      }
    }
  } 
  changeRadio(event) {

    if (event === 'Last') {
      this.feedbackForm.controls.lastTime.enable();
      this.feedbackForm.controls.specifiedFrom.disable();
      this.feedbackForm.controls.specifiedTo.disable();
    } else {
      this.feedbackForm.controls.lastTime.disable();
      this.feedbackForm.controls.specifiedFrom.enable();
      this.feedbackForm.controls.specifiedTo.enable();
    }
  } 
  onSubmit(formdata) {
    this.submitted = true;  
    let f = formdata.value;
    
    let c = new Date();
    if (f.timeFilter === 'Custom') {
      // date and time validation .   
      f.stime = f.specifiedFrom[0];
      f.etime = f.specifiedTo[1]; 
      console.log('filter ', f.timeFilter, f.stime, f.etime); 
   
      if (f.stime === null || f.etime === null) {
        this.warn("Please Enter Valid Date and Time.");
        return;
      }
      if (new Date(f.stime).getTime() > new Date(f.etime).getTime()) { 
        
        this.warn("Start Time cannot be greater than End Time."); 
      
        return;
      }
      // else if (new Date(f.etime[1]).getTime() > c.getTime()) {
      //   this.warn("Invalid Date"); 
      
      //   return;
      // }
    } 
     
    if (this.submitted && this.feedbackForm.controls.pagecontrol.status == 'INVALID'){  
      this.warn("Please Select Page Name");  
      return;
     }  
    else if (this.submitted && this.feedbackForm.controls.namecontrol.status == 'INVALID'){
      this.warn("please Enter Name");
      return;
    } 
    else if (this.submitted && this.feedbackForm.controls.emailcontrol.untouched &&
      this.feedbackForm.controls.emailcontrol.status == 'INVALID') {
      this.warn("Please Enter your Email Id");
      return;
    } 
    else if (this.submitted && this.feedbackForm.controls.emailcontrol.touched &&
      this.feedbackForm.controls.emailcontrol.status == 'INVALID') {
      this.warn("Please Enter vaild Email Id");
      return;
    }
    else if (this.submitted && this.feedbackForm.controls.numbercontrol.status == 'INVALID') {
      this.warn("Please Enter Phone Number");
      return;
    } 
    else if (this.submitted && this.feedbackForm.controls.ratingcontrol.status == 'INVALID') {
      this.warn("Please Select Rating");
      return;
    } 
    else if (this.submitted && this.feedbackForm.controls.commentcontrol2.status == 'INVALID') {
      this.warn("Please Write Some Comment");
      return;
    }





    this.hide(); 
    this.showTimeFilter = false;
     // call the service only when the form is valid
    this.filterCriteria = {};
     let timeFilter = {};
     this.filters = {};
    timeFilter = this.setTimeFilter(f);
     this.filterCriteria['timeFilter'] = timeFilter;
    if (f.page !== null && f.page.length) {
       this.filters['page'] = this.metadata.getPageName(f.pagecontrol).name;
       this.filterCriteria['page'] = '0:' + f.pagecontrol;
     }
     if (f.name !== null && f.name.length) {
      this.filters['name'] = f.namecontrol;
      this.filterCriteria['name'] = '5:' + f.namecontrol;
     }
     if (f.email !== null && f.email.length) {
       this.filters['email'] = f.emailcontrol;
      this.filterCriteria['email'] = '6:' + f.emailcontrol;
    }
     if (f.rating !== null && f.rating.length) {
       this.filters['rating'] = f.ratingcontrol;
       this.filterCriteria['rating'] = '9:' + f.ratingcontrol;
     }
     if (f.comment !== null && f.comment.length) {
       this.filters['comment'] = f.commentcontrol2 + '(' + (f.commentcontrol1 == null ? 'All' : f.commentcontrol1) + ')';
      this.filterCriteria['comment'] = '8:' + (f.commentcontrol1 == null ? 'All' : f.commentcontrol1) + encodeURIComponent('#' + f.commentcontrol2.trim().replace(/[ \t\r\n]+/g, ' ').replace(/'/g, 'a12'));
     }
     if (f.number !== null && f.number.length) {
       this.filters['number'] = f.numbercontrol;
       this.filterCriteria['mobile'] = '7:' + f.numbercontrol;
     }

    // set limit and offset in the filterCriteria
    
    this.filterCriteria['limit'] = this.Limit;
     this.filterCriteria['offset'] = this.Offset; 
    this.stateService.set('feedbackfilter', formdata, true);
    this.filterChange.emit(this.filterCriteria);  
    //this.setForm(); 
 } 
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  } 

 

}
