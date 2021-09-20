import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import * as moment from 'moment';
import 'moment-timezone';
import { AUTOCOMPLETE_DATA } from '../service/home-sessions.dummy';
import { AutoCompleteData } from '../service/home-sessions.model';
import { CustomMetrics_TABLE } from './service/custommetrics.dummy';
import { CustomMetricsReportTable } from './service/custommetrics.model';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/custommetrics-service.state'
import { CustomMetricsService } from './service/custommetrics.service';
import { CustomPieChartProcessData } from './service/custompiechartprocessdata';
import { CustomLineChartProcessData } from './service/customlinechartprocessdata';
import { CustomCorrelationData } from './service/customcorrelationdata';

@Component({
  selector: 'app-custom-metrics-report',
  templateUrl: './custom-metrics-report.component.html',
  styleUrls: ['./custom-metrics-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomMetricsReportComponent extends PageSidebarComponent implements OnInit {
  classes = 'custom-metrics-report-sidebar';
  pageForm: FormGroup;
  channelopn: any;
  custommerticsopn: any;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  customTime: Moment[] = [];
  timefilter: string = "last";
  lasttimeoption: any;
  bucketopn: any;
  limitInput: number;
  data: CustomMetricsReportTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  enableChart: boolean = false;
  breadcrumb: MenuItem[] = [];
  static templatehtml: any = "";
  cols: TableHeaderColumn[] = [];
  autoCompleteList: AutoCompleteData;
  _selectedColumns: TableHeaderColumn[] = [];
  filteredReports: any[];
  globalFilterFields: string[] = [];
  custommetricsData = null;
  custommetricspieData = [];
  custommetricstableData = [];
  custommetricspieDatatotal = [];
  custommetricslineData = []
  custommetricsDatatotal = [];
  custommetricslineDatatotal = [];
  customcorelationdata = [];

  constructor(private timebarService: TimebarService, private metadataService: MetadataService, private CustomMetricsService: CustomMetricsService) {
    super();
    CustomMetricsReportComponent.templatehtml = "";
    this.channelopn = [];
    this.limitInput = 10;
    this.bucketopn = [];
    this.custommerticsopn = [];
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
    this.bucketopn = [
      { label: '5 Min', value: '5 Min' },
      { label: '15 Min', value: '15 Min' },
      { label: '30 Min', value: '30 Min' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hour', value: '4 Hour' },
      { label: '8 Hour', value: '8 Hour' },
      { label: '24 Hour', value: '24 Hour' }
    ];
    this.metadataService.getMetadata().subscribe(metadata => {
      // -------channel----------
      let channelm: any[] = Array.from(metadata.channelMap.keys());
      this.channelopn = channelm.map(key => {
        return {
          label: metadata.channelMap.get(key).name,
          value: metadata.channelMap.get(key).name
        }
      });

      // ---------custom metrics----------------
      let custommet: any[] = Array.from(metadata.customMetricMap.keys());
      let custommerticssss: any[] = custommet.map(key => { return metadata.customMetricMap.get(key) });
      for (let i = 0; i < custommerticssss.length; i++) {
        if (custommerticssss[i].valueType == 0) {
          this.custommerticsopn.push({ label: custommerticssss[i].name, value: custommerticssss[i].name });
        }
        else {
          this.custommerticsopn.push({ label: custommerticssss[i].name, value: custommerticssss[i].name, disabled: true });
        }
      }

    });

  }

  ngOnInit(): void {
    this.setForm();
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Sessions' },
      { label: 'Custom Metrics Report' },
    ];
    me.autoCompleteList = AUTOCOMPLETE_DATA;

    me.data = CustomMetrics_TABLE;
    //this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
  closeClick() {
    const me = this;
    me.hide();
  }
  filteropen() {
    const me = this;
    me.show();
  }
  loadPagePerformanceData(filtercriteria) {
    console.log("loadPagePerformanceData method start");
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    me.CustomMetricsService.LoadCustomMetroicsData(filtercriteria).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          if (state.data.data.length < 3) {
            return
          }
          else {
            me.onLoaded(state);
            return;
          }
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: HomePageTabLoadingState) {
    console.log("state HomePageTabLoadingState : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: HomePageTabLoadedState) {
    const me = this;
    me.data = CustomMetrics_TABLE;
    this.enableChart = false;
    let response = state.data.data;
    this.custommetricsData = [];
    this.custommetricspieData = [];
    this.custommetricstableData = [];
    this.custommetricspieDatatotal = [];
    this.custommetricslineData = []
    this.custommetricsDatatotal = [];
    this.custommetricslineDatatotal = [];
    this.customcorelationdata = [];
    this.custommetricsData = response[0];
    // need to apply sorting
    this.custommetricsDatatotal = this.custommetricsData;
    this.custommetricsDatatotal = this.sortObj("count", this.custommetricsDatatotal);
    this.custommetricstableData = this.custommetricsDatatotal.slice(0, this.limitInput);
    let customfun = new CustomPieChartProcessData();
    this.custommetricspieDatatotal = customfun.processData(this.custommetricsData);
    this.custommetricspieData = this.custommetricspieDatatotal.slice(0, this.limitInput);
    let customline = new CustomLineChartProcessData();
    this.custommetricslineDatatotal = customline.processData(response[1]);
    this.custommetricslineData = this.custommetricslineDatatotal;
    let namecutom = [];
    for (let m = 0; m < this.custommetricspieData.length; m++) {
      namecutom.push(this.custommetricspieData[m].name);
    }
    let responseline = [];
    namecutom = namecutom.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
    this.custommetricslineData = this.custommetricslineData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    for (let n = 0; n < namecutom.length; n++) {
      for (let k = 0; k < this.custommetricslineData.length; k++) {
        if (namecutom[n] === this.custommetricslineData[k].name)
          responseline.push(this.custommetricslineData[k]);
      }
    }
    this.custommetricslineData = responseline.slice(0, this.limitInput);
    let customcorre = new CustomCorrelationData();
    this.customcorelationdata = customcorre.processData(response[2]);

    console.log('this.custommetricspieData : ', this.custommetricspieData);
    console.log('this.customcorelationdata : ', this.customcorelationdata);
    me.data.data = this.custommetricstableData;
    let series = [];
    series.push({
      name: '',
      colorByPoint: true,
      data: this.custommetricspieData
    });

    CustomMetrics_TABLE.chartspie[0]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
    CustomMetrics_TABLE.chartstrend[0]["highchart"]["series"] = this.custommetricslineData as Highcharts.SeriesOptionsType[];
    CustomMetrics_TABLE.chartscorelation[0]["highchart"]["series"] = this.customcorelationdata as Highcharts.SeriesOptionsType[];
    setTimeout(() => {
      this.enableChart = true;

    }, 150);
    console.log('CustomMetrics_TABLE.chartscorelation : ', CustomMetrics_TABLE.chartscorelation);
  }

  claculateSeriesData() {

  }
  sortObj(val, d) {
    let grp = d;
    let sortedIndex = [];
    sortedIndex = Object.keys(grp).sort(function (a, b) {
      return parseInt(grp[b][val]) - parseInt(grp[a][val])
    });
    let newData = [];
    for (let i = 0; i < sortedIndex.length; i++) {
      newData.push(grp[sortedIndex[i]]);
    }
    return newData;
  }


  getFilterHTML() {
    CustomMetricsReportComponent.templatehtml = " ";
    return CustomMetricsReportComponent.templatehtml;
  }


  setForm() {
    this.limitInput = 10;
    let time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
    let d = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    let startT = new Date(d.toDateString() + " 00:00:00");
    let endT = new Date(d.toDateString() + ' 23:59:00');
    let date = new Date(time);
    let st = new Date(date.toLocaleDateString() + " " + "00:00:00");
    let et = new Date(date.toLocaleDateString() + " " + "23:59:59");
    this.pageForm = new FormGroup({
      customTime: new FormControl([st, et]),
      channelform: new FormControl(null),
      customform: new FormControl(null),
      bucket: new FormControl('1 Hour'),
      lastval: new FormControl('1 Day'),
      _timefilter: new FormControl('last')
    });
    console.log('startT ', startT);
    //this.pageForm.get('customTime').value[0] = startT;
    //this.pageForm.get('customTime').value[1] = endT;
    this.triggerfilter();
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  filterFields(event) {
    const me = this;
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < me.autoCompleteList.autocompleteData.length; i++) {
      let reportitem = me.autoCompleteList.autocompleteData[i];
      if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reportitem);
      }
    }

    me.filteredReports = filtered;
  }
  //Top variation
  onBlurMethod() {
    console.log("this.limitInput : =", this.limitInput);
    this.onChange();
  }
  onChange() {
    this.enableChart = false;
    this.custommetricspieData = this.custommetricspieDatatotal.slice(0, this.limitInput);
    this.custommetricstableData = this.custommetricsDatatotal.slice(0, this.limitInput);
    let namecutom = [];
    for (let m = 0; m < this.custommetricspieData.length; m++) {
      namecutom.push(this.custommetricspieData[m].name);
    }
    let responseline = [];
    namecutom = namecutom.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
    this.custommetricslineDatatotal = this.custommetricslineDatatotal.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    for (let n = 0; n < namecutom.length; n++) {
      for (let k = 0; k < this.custommetricslineDatatotal.length; k++) {
        if (namecutom[n] === this.custommetricslineDatatotal[k].name)
          responseline.push(this.custommetricslineDatatotal[k]);
      }
    }
    this.custommetricslineData = responseline;
    this.data.data = this.custommetricstableData;
    let series = [];
    series.push({
      name: '',
      colorByPoint: true,
      data: this.custommetricspieData
    });
    CustomMetrics_TABLE.chartspie[0]["highchart"]["series"] = series as Highcharts.SeriesOptionsType[];
    CustomMetrics_TABLE.chartstrend[0]["highchart"]["series"] = this.custommetricslineData as Highcharts.SeriesOptionsType[];
    setTimeout(() => {
      this.enableChart = true;
    }, 150);
  }

  submitRecord() {
    const f = this.pageForm.value;
    console.log("submit record method called f : ", f);
    let timefilter = this.setTimeFilter(f);
    var filtercriteria = {};
    if (this.pageForm.controls['customform'].value == null) {
      alert("Please Select Custom Metrics");
      return true;
    }
    filtercriteria["timeFilter"] = timefilter;
    if (!(this.pageForm.controls['channelform'].value === null))
      filtercriteria["channel"] = this.pageForm.controls['channelform'].value;
    else
      filtercriteria["channel"] = "";
    if (!(this.pageForm.controls['customform'].value === null))
      filtercriteria["custommetrics"] = this.pageForm.controls['customform'].value;
    else
      filtercriteria["custommetrics"] = "";
    filtercriteria["bucket"] = this.pageForm.controls['bucket'].value;
    console.log('filtercriteria : ', filtercriteria);
    this.closeClick();
    this.loadPagePerformanceData(filtercriteria);
  }
  // handling for time filter.
  setTimeFilter(filter) {
    let timefilter = { "startTime": "", "endTime": "", "last": "" };
    if (filter._timefilter != "last") {
      let d = new Date(this.pageForm.get('customTime').value[0]);
      let e = new Date(this.pageForm.get('customTime').value[1]);
      let date1 = window["toDateString"](d);
      let date2 = window["toDateString"](e);
      if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1) {
        let tmpDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        date1 = tmpDate;
        let tmpDate1 = (e.getMonth() + 1) + "/" + e.getDate() + "/" + e.getFullYear();
        date2 = tmpDate1;
      }
      timefilter.startTime = date1 + ' ' + d.toTimeString().split(" ")[0];
      timefilter.endTime = date2 + ' ' + e.toTimeString().split(" ")[0];
      timefilter.last = "";
    }
    else {
      timefilter.startTime = "";
      timefilter.endTime = "";
      timefilter.last = filter.lastval;
    }
    return timefilter;
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
  triggerfilter() {
    console.log('triggerfilter : ', this.pageForm.get('_timefilter'));
    if (this.pageForm.get('_timefilter').value === 'last') {
      this.pageForm.get('customTime').disable();
      this.pageForm.get('lastval').enable();

    } else {
      this.pageForm.get('customTime').enable();
      this.pageForm.get('lastval').disable();

    }
  }

  onTimeFilterCustomTimeChange(timeType) {

    switch (timeType) {
      case 'start':
        this.customTime[0] = this.pageForm.get('customTime').value[0];
        break;

      case 'end':
        this.customTime[1] = this.pageForm.get('customTime').value[1];
        break;
    }

    this.pageForm.get('customTime').patchValue(this.customTime);

    setTimeout(() => {
      if (this.customTime && this.customTime.length === 2) {
        if (this.customTime[0].valueOf() == this.customTime[1].valueOf()) {
          this.timeFilterEnableApply = false;
          this.invalidDate = true;

        } else {
          this.invalidDate = false;
          const timePeriod = this.timebarService.getCustomTime(
            this.customTime[0].valueOf(),
            this.customTime[1].valueOf()
          );

          console.log('timePeriod : ', timePeriod);

          this.setTmpValue({
            timePeriod,
          });
        }
      }
    });
  }

}
