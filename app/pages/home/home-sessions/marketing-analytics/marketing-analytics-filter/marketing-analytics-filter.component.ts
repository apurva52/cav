import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { LAST_TIME_OPTIONS } from '../../common/constants/constants';
import { ParsePagePerformanceFilters } from '../../common/interfaces/parsepageperformancefilter';
import { MetadataService } from '../../common/service/metadata.service';
import { MarketAnalyticsTable } from '../service/table.model';
import { MARKETING_ANALYTICS_TABLE, PANEL_DUMMY, VISUAL_CHART_DATA } from '../service/marketing-analytics.dummy'; 
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-marketing-analytics-filter',
  templateUrl: './marketing-analytics-filter.component.html',
  styleUrls: ['./marketing-analytics-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MarketingAnalyticsFilterComponent extends PageSidebarComponent implements OnInit, OnChanges {

  classes = 'marketing-analytics-filter-sidebar';
  form: FormGroup;
  @Output() filterChange: EventEmitter<any>;
  @Input() filterMode = 'overview'; // detail/compare/overview
  @Input() campaigns: string[];
  campaignOpts: any[];
  @Input() campaign: string;
  bucketoptions: any[];
  reloading = false;
  data: MarketAnalyticsTable;

  constructor(private timebarService: TimebarService, private metadataService: MetadataService, private messageService: MessageService ) {
    super();

    this.bucketoptions = [
      { label: '5 mins', value: '5 mins' },
      { label: '15 mins', value: '15 mins' },
      { label: '1 hour', value: '1 hour' },
      { label: '1 day', value: '1 day' },
      { label: '2 days', value: '2 days' },
      { label: '3 days', value: '3 days' },
      { label: '4 days', value: '4 days' }
    ];

    this.campaignOpts = [{
      label: 'Select Campaign',
      value: null
    }];
    this.setForm();
    this.filterChange = new EventEmitter();
  }

  ngOnInit(): void {
    this.data = MARKETING_ANALYTICS_TABLE;
    if (this.data.filtercriteria == null)
      this.setForm();
    else
      {
       let filterr = JSON.parse(JSON.stringify(this.data.filtercriteria));
       this.setAfterForm(filterr);
      }

  }
  setAfterForm(filter) {
    let timeutc = moment.utc(filter.timeFilter.startTime, "MM/DD/YYYY HH:mm:ss").valueOf();
    filter.timeFilter.startTime = moment.tz(new Date(timeutc), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    let timeutcc = moment.utc(filter.timeFilter.endTime, "MM/DD/YYYY HH:mm:ss").valueOf();
    filter.timeFilter.endTime = moment.tz(new Date(timeutcc), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');

    this.form = new FormGroup({
      timeFilter: new FormControl(filter.timeFilter),
      campaign: new FormControl(this.campaign),
      bucket: new FormControl(filter.bucket)
    });
  }
  ngOnChanges(): void {
    // TODO: check what got changed. 
    if (this.campaigns && this.campaigns.length) {
      this.campaignOpts = this.campaigns.map(c => {
        return {
          label: c,
          value: c
        };
      });
    }

    // update form control.
    this.form.patchValue({
      campaign: this.campaign
    });
  }

  submitRecord() {
    const f = this.form.value;
    console.log("after set form f : ", f); 
    let c = new Date(); 
    f.stime = f.timeFilter.startTime;
    f.etime = f.timeFilter.endTime;
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
    this.data.filtercriteria = f;
    if (f.campaign != null && f.campaign != "")
      f.campaign = encodeURIComponent(f.campaign);

    this.filterChange.emit(f);

    this.closeClick();

    /*
    this.metadataService.getMetadata().subscribe(metadata => {
    this.parsepagefilter.getPagePerformanceFilter(f,metadata,this.bucketflag);//bucket false
    console.log("this.parsepagefilter : ",this.parsepagefilter);
    
    this.newFilterEvent.emit(JSON.stringify(this.parsepagefilter));
    });*/
  }

  setForm() {
    this.form = new FormGroup({
      timeFilter: new FormControl(),
      campaign: new FormControl(this.campaign),
      bucket: new FormControl('5 mins')
    });
    let nestedGroup: FormGroup = <FormGroup>this.form.controls['timeFilter'];
    nestedGroup.patchValue({ last: '1 Day' });
  }

  resetForm() {
    this.reloading = true;

    setTimeout(() => {
      this.setForm();
      this.reloading = false;
    }, 0);
  }
  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }   

  warn(msg: string) {
    this.messageService.add({ key: "my key", severity: 'warn', summary: 'Warning', detail: msg });


  }
}
