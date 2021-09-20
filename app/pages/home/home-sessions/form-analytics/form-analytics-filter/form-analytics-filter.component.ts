import { Component, OnInit, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { Store } from 'src/app/core/store/store';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState } from '../../common/service/nvhttp.service';
import { OVERALL_REPORT_TABLE_DATA } from '../overall-report/service/overall-report.dummy';
import { overallReportTable } from '../overall-report/service/overall-report.model';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-form-analytics-filter',
  templateUrl: './form-analytics-filter.component.html',
  styleUrls: ['./form-analytics-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormAnalyticsFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'form-analytics-filter-sidebar';
  form: FormGroup;
  channelopn: any;
  data: overallReportTable;
  pageopn: any;
  formnameopn: any;
  reloading = false;
  formNameflag = false;
  @Output() filterChange: EventEmitter<any>;
  constructor(private metadataService: MetadataService, private http: NvhttpService) {
    super();
    this.filterChange = new EventEmitter();
    this.channelopn = [];
    this.pageopn = [];
    this.metadataService.getMetadata().subscribe(metadata => {
      // -------channel----------
      let channelm: any[] = Array.from(metadata.channelMap.keys());
      this.channelopn = [];
      let channell = channelm.map(key => {
        return {
          label: metadata.channelMap.get(key).name,
          value: metadata.channelMap.get(key).name
        }
      });
      this.channelopn.push({ label: "All", value: "Overall" });
      for (let n = 0; n < channell.length; n++)
        this.channelopn.push(channell[n]);

      // ---------Page Name----------------

      this.http.getFormAnalyticsPageNameMap().subscribe((state: Store.State) => {
        if (state instanceof NVPreLoadedState) {
          console.log('Total Records : ', state.data);
          let response = state.data;
          this.pageopn = [];
          this.pageopn.push({ label: "All Pages", value: "" });
          for (let m = 0; m < response.length; m++)
            this.pageopn.push(response[m]);
          //this.pageopn = response;
        }
      },
        (error: Store.State) => {
          console.error('Failed to get the Page Name List. Error : ', error);
        });

      this.http.getFormAnalyticsFormNameMap().subscribe((state: Store.State) => {
        if (state instanceof NVPreLoadedState) {
          console.log('Total Records : ', state.data);
          let response = state.data;
          this.formnameopn = [];
          //this.pageopn.push({ label: "All Pages", value: "" });
          this.formnameopn = response.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
        }
      },
        (error: Store.State) => {
          console.error('Failed to get the Page Name List. Error : ', error);
        });

    });
  }

  ngOnInit(): void {
    const me = this;
    me.data = OVERALL_REPORT_TABLE_DATA;
    if (this.data.overallformfiltercriteria == null)
      this.setForm();
    else {
      console.log('this.data.filtercriteria : ', this.data.overallformfiltercriteria, ' this.data.setformName : ', this.data.setformName);
      let filterr = JSON.parse(JSON.stringify(this.data.overallformfiltercriteria));
      if (this.data.setformName == null)
        this.formNameflag = false;
      else
        this.formNameflag = true;
      this.setAfterForm(filterr);
    }

  }
  setAfterForm(filter) {
    console.log('filter: ', filter);
    this.form = new FormGroup({
      timeFilter: new FormControl(filter.timeFilter),
      channelform: new FormControl(filter.channelform),
      pageform: new FormControl(filter.pageform),
      formnameform: new FormControl(this.data.setformName),
    });
    console.log('this.form : ', this.form);
  }
  setForm() {
    this.form = new FormGroup({
      timeFilter: new FormControl(),
      channelform: new FormControl(null),
      pageform: new FormControl(null),
      formnameform: new FormControl(null),
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
  submitRecord() {
    let filterr = this.form.value;
    let f = JSON.parse(JSON.stringify(filterr));
    if (f.timeFilter.hasOwnProperty('startTime') == true && f.timeFilter.hasOwnProperty('endTime') == true && f.timeFilter.startTime != "" && f.timeFilter.endTime != "") {
      let timeutc = moment.utc(f.timeFilter.startTime, "MM/DD/YYYY HH:mm:ss").valueOf();
      f.timeFilter.startTime = moment.tz(new Date(timeutc), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
      let timeutcc = moment.utc(f.timeFilter.endTime, "MM/DD/YYYY HH:mm:ss").valueOf();
      f.timeFilter.endTime = moment.tz(new Date(timeutcc), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    }
    this.data.overallformfiltercriteria = f;
    this.filterChange.emit(f);
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
