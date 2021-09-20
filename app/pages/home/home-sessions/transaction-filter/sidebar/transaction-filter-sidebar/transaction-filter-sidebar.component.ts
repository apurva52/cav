import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng';
import TimeFilterUtil, { TimeFilter } from '../../../common/interfaces/timefilter';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-transaction-filter-sidebar',
  templateUrl: './transaction-filter-sidebar.component.html',
  styleUrls: ['./transaction-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TransactionFilterSidebarComponent implements OnInit {
  @Output() submit = new EventEmitter<TimeFilter>();

  timefilter: 'last' | 'custom' = 'last';
  duration: SelectItem[];
  lasttime = '1 Day';
  maxDate: Date;
  customTime: Date[] = [];
  invalidDate: boolean;
  visible: boolean;
  msg : any;
  startTime : any;
  endTime : any;

  constructor(private messageService: MessageService) {
    this.duration = [
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
    
   this.startTime = new Date()+ ' 00:00:00';
   this.endTime = new Date()+ ' 23:59:00';
  }

  ngOnInit(): void {
    // set the custom time
    this.getCustomTime();
  }

  getCustomTime() {
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');
  }
  warn(msg: string) {
        this.messageService.add({  key : "my key", severity: 'warn', summary: 'Warning', detail: msg });
  }
    

  apply(): void {
    // validate custom time
    if (this.timefilter === 'custom') {
      let c = new Date();
      if( new Date(this.customTime[0]).getTime() === new Date(this.customTime[1]).getTime()){
        this.warn("Start time and End Time should not be same.");
        return;
      }
      if (new Date(this.customTime[0]).getTime() === null || new Date(this.customTime[1]).getTime() === null) {
        this.warn("Please Enter Valid Date and Time.");
        return;
      }
      if (new Date(this.customTime[0]).getTime() > new Date(this.customTime[1]).getTime()) {
        console.log('apply is called ...',this.customTime )
        //this.invalidDate = true;
        this.warn("Start Time cannot be greater than End Time.");
        return;
      } else if(new Date(this.customTime[1]).getTime() > c.getTime()){
        this.warn("Invalid Date"); 
      
        return;
      }

    }

    let time: TimeFilter;

    if (this.timefilter === 'last') {
      time = TimeFilterUtil.getTimeFilter(this.lasttime, '', '');
    } else {
      time = TimeFilterUtil.getTimeFilter('', this.customTime[0], this.customTime[1]);
    }

    this.hide();
    // emit the filters
    this.submit.emit(time);
  }

  reset(): void {
    this.timefilter = 'last';
    this.lasttime = '1 Day';
    this.getCustomTime();
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

}
