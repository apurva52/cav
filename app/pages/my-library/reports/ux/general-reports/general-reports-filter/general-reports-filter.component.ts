import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';
import { Metadata } from 'src/app/pages/home/home-sessions/common/interfaces/metadata';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';

@Component({
  selector: 'app-general-reports-filter',
  templateUrl: './general-reports-filter.component.html',
  styleUrls: ['./general-reports-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GeneralReportsFilterComponent implements OnInit, OnChanges {
  @Output() submit = new EventEmitter<any>();
  @Output() sidebarClose = new EventEmitter<boolean>();
  @Input() CRQ: any;
  @Input() display: boolean;
  @Input() name: string;


  timeFilter: string = 'last';
  lastSelect: string = 'days';
  channel: string = 'all';

  lastValue: number = 1;
  bucket: number;

  maxDate: Date = new Date();
  customTime: Date[] = [];

  lastSelects: SelectItem[] = [];
  buckets: SelectItem[] = [];
  channels: SelectItem[] = [];

  metadata: Metadata;

  invalidDate: boolean;
  submitted: boolean;

  constructor(private metadataService: MetadataService) {
    this.lastSelects = [
      { label: 'Hour(s)', value: 'hours' },
      { label: 'Day(s)', value: 'days' },
      { label: 'Week(s)', value: 'weeks' },
      { label: 'Month(s)', value: 'months' },
      { label: 'Year(s)', value: 'years' }
    ];
  }

  ngOnChanges(): void {
    if (this.CRQ) {
      // reports other than date type should have only complete bucket option
      if (this.CRQ.reportType !== 'date') {
        this.buckets = [{ label: 'Complete', value: 0 }];
        this.bucket = 0;

      } else {
        this.buckets = [
          { label: 'Hourly', value: 1 },
          { label: 'Daily', value: 2 },
          { label: 'Weekly', value: 3 },
          { label: 'Monthly', value: 4 }
        ];
        this.bucket = 1;
      }
    }

  }

  ngOnInit(): void {
    const d = new Date(moment.tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
    this.customTime[0] = new Date(d.toDateString() + ' 00:00:00');
    this.customTime[1] = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(d.toDateString() + ' 23:59:00');

    this.getChannels();

    this.timeFilter = 'last';
  }

  getChannels(): void {
    this.metadataService.getMetadata().subscribe((response: any) => {
      this.metadata = response;
      // -------channel----------
      let channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        };
      });

      this.channels.unshift({ label: 'All', value: 'all' });
    });
  }

  show(): void {
    this.display = true;
  }

  hide(): void {
    this.display = false;

    this.sidebarClose.emit(false);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.lastValue == null || this.channel == null || this.bucket == null) {
      return;
    }

    if (new Date(this.customTime[0]).getTime() > new Date(this.customTime[1]).getTime()) {
      this.invalidDate = true;
      return;
    }

    this.invalidDate = false;
    this.submitted = false;
    this.hide();

    const filter = {
      timeFilter: this.timeFilter,
      lastValue: this.lastValue,
      lastSelect: this.lastSelect,
      customTime: this.customTime,
      bucket: this.bucket,
      channel: this.channel
    };

    this.submit.emit(filter);
  }



}
