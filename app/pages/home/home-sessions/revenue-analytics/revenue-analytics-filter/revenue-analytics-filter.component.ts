import { Component, EventEmitter, OnInit, ViewEncapsulation, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moment } from 'moment-timezone';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { LAST_TIME_OPTIONS } from '../../common/constants/constants';
import { ParsePagePerformanceFilters } from '../../common/interfaces/parsepageperformancefilter';
import { MetadataService } from '../../common/service/metadata.service';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import * as _ from 'lodash';
import { MenuItem, MessageService } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import * as moment from 'moment';
import { RevenueAnalyticsFilter } from '../service/revenue-analytics.model';
import { Util } from '../../common/util/util';
import { Metadata } from '../../common/interfaces/metadata';
@Component({
  selector: 'app-revenue-analytics-filter',
  templateUrl: './revenue-analytics-filter.component.html',
  styleUrls: ['./revenue-analytics-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class RevenueAnalyticsFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'revenue-analytics-filter-sidebar';
  form: FormGroup;
  metricOptions: any[];
  rollingWindowOptions: any[];
  granularityOptions: any[];
  npage: any[] = [];
  nchannel: any[] = [];
  checkoutbpPagelist: any[] = [];
  metadata: Metadata;
  @Output() filterChange: EventEmitter<any>;
  @Output() getMetadata = new EventEmitter<Metadata>();

  constructor(private timebarService: TimebarService, private metadataService: MetadataService, private msgService: MessageService) {
    super();

    this.filterChange = new EventEmitter();

    this.metricOptions = [{
      label: 'On Load',
      value: 'onload'
    }, {
      label: 'Dom Interactive',
      value: 'dominteractive'
    }];

    // set rolling window options. 
    this.rollingWindowOptions = [{
      label: 'Select Rolling Window',
      value: ''
    }];
    // fill till 30 days.
    for (let i = 1; i < 31; i++) {
      this.rollingWindowOptions.push(
        {
          value: i,
          label: `${i} Day`
        }
      );
    }

    // set granularity options. 
    this.granularityOptions = [{
      label: 'Select Granularity',
      value: '0.1'
    }];

    for (let i = 1; i <= 10; i++) {
      this.granularityOptions.push({
        label: `${(i / 10).toFixed(1)}`,
        value: `${(i / 10).toFixed(1)}`
      });
    }

    this.metadataService.getMetadata().subscribe(metadata => {
      let channelm: any[] = Array.from(metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return { label: metadata.channelMap.get(key).name, value: metadata.channelMap.get(key).id }
      });

      let pagem: any[] = Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return { label: metadata.pageNameMap.get(key).name, value: metadata.pageNameMap.get(key).id }
      });
      this.metadata = metadata;
      this.getMetadata.emit(this.metadata);
      this.getBPCheckoutPageIds(metadata);
    });


    this.form = new FormGroup({
      channels: new FormControl(null),
      entryPage: new FormControl(null),
      timeFilter: new FormControl(null),
      granular: new FormControl('0.1'),
      metric: new FormControl('onload'),
      rollingwindow: new FormControl(''),
    });
  }

  resetForm() {
    this.form.patchValue({
      channels: null,
      entryPage: null,
      timeFilter: null,
      granular: '0.1',
      metric: 'onload',
      rollingWindow: ''
    })
  }

  ngOnInit(): void {
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
  onSelectChannel(ev) {
    console.log("onSelectChannel : ", ev, "entryPageValue :", this.form.controls['entryPage'].value);
    this.form.controls['entryPage'].patchValue(null);
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
    this.form.controls['entryPage'].setValue(temp);
  }

  submitRecord() {
    const formData = this.form.value;
    console.log("submit record method called f : ", formData);

    // TODO: validation. 
    if (!formData.channels || !formData.channels.length) {
      this.msgService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Channel.' });
      return;
    }

    // Change to Filter format. 
    let filterObj: RevenueAnalyticsFilter = {
      timeFilter: formData.timeFilter,
      channels: formData.channels.join(','),
      granularity: formData.granular,
      rollingwindow: formData.rollingWindow,
      metricType: formData.metric,
      pages: (formData.entryPage && formData.entryPage.length ? formData.entryPage.join(',') : '-2')

    };

    if (formData.entryPage !== null && formData.entryPage !== "" && formData.entryPage !== "null" && formData.entryPage.length > 0) {
      filterObj["pageName"] = Util.getPageNames(formData.entryPage, this.metadata);
    }
    this.filterChange.emit(filterObj);

    this.closeClick();
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
