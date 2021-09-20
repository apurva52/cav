import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { OVERALL_REPORT_TABLE_DATA } from './overall-report/service/overall-report.dummy';
import { overallReportTable } from './overall-report/service/overall-report.model';
import { FormReportService } from './overall-report/service/overall-report.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from './overall-report/service/overall-report.state';


@Component({
  selector: 'app-form-analytics',
  templateUrl: './form-analytics.component.html',
  styleUrls: ['./form-analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormAnalyticsComponent implements OnInit {
  datacommon: overallReportTable;
  items: MenuItem[];
  downloadOptions: MenuItem[];
  isShow: boolean = true;
  breadcrumb: MenuItem[];
  error: AppError;
  loading: boolean;
  empty: boolean;
  filterLabel: string = '';
  reportformdata: any;
  constructor(private route: ActivatedRoute, private router: Router, private FormReportService: FormReportService) { }

  ngOnInit(): void {
    const me = this;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Sessions', routerLink: '/home/home-sessions' },
      { label: 'Form Analytics', routerLink: '/form-analytic-overall' },
      { label: 'Form Analytics Reports', routerLink: '/form-analytics/overall-report' }
    ];

    me.items = [
      { label: 'Overall Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/overall-report' },
      { label: 'Conversion Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/conversion-report' },
      { label: 'Time Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/time-report' },
      { label: 'Hesitation Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/hesitation-report' },
      { label: 'Refill Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/refill-report' },
      { label: 'Drop Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/drop-report' },
      { label: 'Blank Report', icon: 'icons8 icons8-forward', routerLink: '/form-analytics/blank-report' },

    ];

    me.datacommon = OVERALL_REPORT_TABLE_DATA;
    console.log('me.data.data 1 : ', me.datacommon.data);
    console.log('me.data : ', me.datacommon);
    if (me.datacommon.overallformfiltercriteria != null)
      this.applyFilter(me.datacommon.overallformfiltercriteria);

  }

  closeSidePanel() {
    const me = this;
    me.isShow = false;
  }
  openSidePanel() {
    const me = this;
    me.isShow = true;
  }


  setFilterCriteriaLabel(st, et, last, channel, page, form) {
    this.filterLabel = '';
    if (last != "") {
      this.filterLabel += 'Last: ' + last;
    }
    else {
      this.filterLabel += 'From: ' + st + ', to: ' + et;
    }
    if (channel != "")
      this.filterLabel += ' , Channel: ' + channel;
    if (page == "")
      this.filterLabel += ' , Page: All Page';
    else
      this.filterLabel += ' , Page: ' + page;
    if (form != "")
      this.filterLabel += ' , Form Name: ' + form;

  }

  applyFilter(event) {
    console.log('applyFilter event : ', event);
    //form analytics restcall
    console.log("loadFormReportDataData method start");
    const me = this;
    let last = "";
    let st = "";
    let et = "";
    if (event.timeFilter) {
      let timefilter = event.timeFilter;
      if (timefilter.hasOwnProperty('endTime') == true && event.timeFilter.endTime != "")
        et = event.timeFilter.endTime;
      else
        et = "";
      if (timefilter.hasOwnProperty('startTime') == true && event.timeFilter.startTime != "")
        st = event.timeFilter.startTime;
      else
        st = "";
      if (timefilter.hasOwnProperty('last') == true && event.timeFilter.last != "")
        last = event.timeFilter.last;
      else
        last = "";
    }

    let channel = "Overall";
    let page = "";
    let form = "";
    if (event.channelform == null || event.channelform == "")
      channel = "Overall";
    else
      channel = event.channelform;
    if (event.pageform == null || event.pageform == "")
      page = "";
    else
      page = event.pageform;
    if (event.formnameform != null && event.formnameform != "")
      this.datacommon.setformName = event.formnameform;

    if (this.datacommon.setformName == null || this.datacommon.setformName == "")
      form = "";
    else
      form = this.datacommon.setformName;

    if (this.datacommon.setPageName == null || this.datacommon.setPageName == "")
      page = "";
    else
      page = this.datacommon.setPageName;
    this.setFilterCriteriaLabel(st, et, last, channel, page, form);
    me.FormReportService.LoadFormAnalyticsDetailData(st, et, last, channel, page, form).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof OverAllReportLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof OverAllReportLoadedState) {
          me.onLoaded(state);
          return;
        }

        if (state instanceof OverAllReportLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: OverAllReportLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: OverAllReportLoadingState) {
    console.log("state HomePageTabLoadingState : ", state);
    const me = this;
    me.datacommon.reportformdata = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: OverAllReportLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.datacommon.reportformdata = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: OverAllReportLoadedState) {
    const me = this;
    me.datacommon = OVERALL_REPORT_TABLE_DATA;
    this.reportformdata = state.data.data;
    console.log('formanalyticsreportformdata : ', this.reportformdata);
    //this.reportformdata = { "totalPageView": 100.0, "totalUniqueFormInteraction": 100.0, "totalUniqueFormSubmit": 0.0, "totalFormSubmit": 0.0, "totalUniqueFailedSubmit": 0.0, "avgFillDuration": 0.0, "avgBlankField": 0.0, "avgRefilledField": 0.0, "fillDurationSampleCounts": 0.0, "blankFieldSampleCounts": 1469, "refilledFieldSampleCounts": 1469, "fields": [{ "name": "passform2", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "userform2", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "passform22", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "userform22", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "password2", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }] };
    me.datacommon.data = this.reportformdata;
    me.datacommon.reportformdata = this.reportformdata;
    me.datacommon.reportformdatafield = this.reportformdata.fields;
    me.datacommon.timereportdata = this.getTimeReportData();
    me.datacommon.formfieldnamerefill = this.getRefillReportData();
    me.datacommon.formfieldnamehesitation = this.getHesitationReportData();
    me.datacommon.formfieldnamedrop = this.getDropReportData();
    me.datacommon.totalUniqueFormSubmitt = this.reportformdata.totalUniqueFormSubmit;
    me.datacommon.conversiondata = this.processconversionreport();
    me.datacommon.formfieldnameblank = this.getBlankReportData();
  }
  getBlankReportData() {
    let formfieldnameblank = [];
    for (let q = 0; q < this.reportformdata.fields.length; q++) {
      var obj = {};
      obj["fname"] = this.reportformdata.fields[q].name;
      if (this.reportformdata.totalFormSubmit == 0)
        obj["fdata"] = 0;
      else {
        obj["fdata"] = ((this.reportformdata.fields[q].totalLeftBlank / this.reportformdata.totalFormSubmit) * 100);
        if (obj["fdata"] < 0)
          obj["fdata"] = 0;
      }
      formfieldnameblank.push(obj);
    }
    formfieldnameblank.sort(function (a, b) {
      return (b.fdata) - (a.fdata);
    });
    return formfieldnameblank;
  }
  processconversionreport() {
    //const me = this;
    let funnelData = [
      {
        dec1: "User landed on this page",
        count1: 11,

        count2: 12,
        percentage: "8.33%(1 outof 12)",
        dec3: "User left the page without interacting with the form",

        dec2: "User interacted with the form",
        count3: 11,

      },
      {
        dec1: "User landed on this page",
        count1: 11,
        count2: 12,
        dec2: "User interacted with the form",
        percentage: "91.67%(11 outof 12)",
        dec3: "User didnt try to submit the form",
        count3: 11,

      },
      {
        dec1: "User landed on this page",
        count1: 0,
        count2: 0,
        dec2: "User submitted this form",
        percentage: "00.00%(0 outof 12)",
        dec3: "Failed form submit",
        count3: 0,

      },
    ]
    for (let i = 0; i < funnelData.length; i++) {
      if (i == 0) {
        funnelData[i]["dec1"] = "Users landed on this page";
        funnelData[i]["count1"] = this.reportformdata.totalPageView.toFixed(0);
        funnelData[i]["count2"] = ((((this.reportformdata.totalPageView.toFixed(2) - this.reportformdata.totalUniqueFormInteraction.toFixed(2)) / this.reportformdata.totalPageView.toFixed(2)) * 100)) / 3;
        let a = (((this.reportformdata.totalPageView - this.reportformdata.totalUniqueFormInteraction) / this.reportformdata.totalPageView) * 100).toFixed(2) === 'NaN' ? 0.00 : (((this.reportformdata.totalPageView - this.reportformdata.totalUniqueFormInteraction) / this.reportformdata.totalPageView) * 100).toFixed(2) + " % (" + (this.reportformdata.totalPageView - this.reportformdata.totalUniqueFormInteraction).toFixed(0) + " out of " + this.reportformdata.totalPageView.toFixed(0) + ")";
        funnelData[i]["percentage"] = a.toString();
        funnelData[i]["dec3"] = "users left the page without any interaction with the form.";
        funnelData[i]["dec2"] = "Users interacted with the form.";
        funnelData[i]["count3"] = this.reportformdata.totalUniqueFormInteraction;
      }
      if (i == 1) {
        funnelData[i]["dec1"] = "Users interacted with the form";
        funnelData[i]["count1"] = this.reportformdata.totalPageView.toFixed(0) - (this.reportformdata.totalPageView.toFixed(0) - this.reportformdata.totalUniqueFormInteraction.toFixed(0));
        funnelData[i]["count2"] = (((this.reportformdata.totalUniqueFormInteraction.toFixed(2) - this.reportformdata.totalUniqueFormSubmit.toFixed(2)) * 100) / this.reportformdata.totalPageView.toFixed(2)) / 3;
        let a = (((this.reportformdata.totalUniqueFormInteraction - this.reportformdata.totalUniqueFormSubmit) * 100) / this.reportformdata.totalPageView).toFixed(2) === 'NaN' ? 0 : (((this.reportformdata.totalUniqueFormInteraction - this.reportformdata.totalUniqueFormSubmit) * 100) / this.reportformdata.totalPageView).toFixed(2) + " %( " + ((this.reportformdata.totalUniqueFormInteraction - this.reportformdata.totalUniqueFormSubmit).toFixed()) + "out of " + this.reportformdata.totalPageView.toFixed(0) + " )";

        funnelData[i]["percentage"] = a.toString();
        funnelData[i]["dec3"] = "users didn't try to submit the form";
        funnelData[i]["dec2"] = "Users submitted this form";
        funnelData[i]["count3"] = this.reportformdata.totalUniqueFormInteraction - (((this.reportformdata.totalUniqueFormInteraction.toFixed(0) - this.reportformdata.totalUniqueFormSubmit.toFixed(0))));
      }
      if (i == 2) {
        funnelData[i]["dec1"] = "Users submitted this form";
        funnelData[i]["count1"] = this.reportformdata.totalPageView.toFixed(0) - (this.reportformdata.totalPageView.toFixed() - this.reportformdata.totalUniqueFormInteraction.toFixed()) - (this.reportformdata.totalUniqueFormInteraction.toFixed() - this.reportformdata.totalUniqueFormSubmit.toFixed());
        funnelData[i]["count2"] = ((this.reportformdata.totalUniqueFailedSubmit.toFixed(2) / this.reportformdata.totalPageView.toFixed(2)) * 100) / 3;
        let a = ((this.reportformdata.totalUniqueFailedSubmit / this.reportformdata.totalPageView) * 100).toFixed(2) === 'NaN' ? 0 : ((this.reportformdata.totalUniqueFailedSubmit / this.reportformdata.totalPageView) * 100).toFixed(2) + " % ( " + this.reportformdata.totalUniqueFailedSubmit + " out of " + this.reportformdata.totalPageView.toFixed(0) + " )";
        funnelData[i]["percentage"] = a.toString();
        funnelData[i]["dec3"] = "Failed form submit.";
        funnelData[i]["dec2"] = "Users Successfully submitted this form.";
        funnelData[i]["count3"] = (this.reportformdata.totalUniqueFormSubmit).toFixed();
      }
    }
    return funnelData;
  }

  getDropReportData() {
    let formfieldnamedrop = [];
    for (let q = 0; q < this.reportformdata.fields.length; q++) {
      let obj = {};
      obj["fname"] = this.reportformdata.fields[q].name;
      if (this.reportformdata.fields[q].totalUniqueInteraction == 0)
        obj["fdata"] = 0;
      else {
        obj["fdata"] = ((this.reportformdata.fields[q].totalDropFromField / this.reportformdata.fields[q].totalUniqueInteraction) * 100);
        if (obj["fdata"] < 0)
          obj["fdata"] = 0;
      }
      formfieldnamedrop.push(obj);
    }
    formfieldnamedrop.sort(function (a, b) {
      return (b.fdata) - (a.fdata);
    });
    return formfieldnamedrop;
  }
  getHesitationReportData() {
    let formfieldnamehesitation = [];
    for (let q = 0; q < this.reportformdata.fields.length; q++) {
      let obj = {};
      obj["fname"] = this.reportformdata.fields[q].name;
      obj["fdata"] = this.reportformdata.fields[q].avgHesitationDuration;
      if (obj["fdata"] < 0)
        obj["fdata"] = 0;
      formfieldnamehesitation.push(obj);
    }
    formfieldnamehesitation.sort(function (a, b) {
      return (b.fdata) - (a.fdata);
    });
    return formfieldnamehesitation;
  }
  getRefillReportData() {
    let formfieldnamerefill = [];
    for (let q = 0; q < this.reportformdata.fields.length; q++) {
      let obj = {};
      obj["fname"] = this.reportformdata.fields[q].name;
      if (this.reportformdata.fields[q].totalUniqueInteraction == 0)
        obj["fdata"] = 0;
      else {
        obj["fdata"] = (this.reportformdata.fields[q].totalInteraction / this.reportformdata.fields[q].totalUniqueInteraction);
        if (obj["fdata"] < 0)
          obj["fdata"] = 0;
      }
      formfieldnamerefill.push(obj);
    }
    formfieldnamerefill.sort(function (a, b) {
      return (b.fdata) - (a.fdata);
    });
    return formfieldnamerefill;
  }

  getTimeReportData() {
    let formfieldnametime = [];
    for (let q = 0; q < this.reportformdata.fields.length; q++) {
      let obj = {};
      obj["fname"] = this.reportformdata.fields[q].name;
      obj["avgFillDuration"] = this.reportformdata.fields[q].avgFillDuration;
      if (obj["avgFillDuration"] < 0)
        obj["avgFillDuration"] = 0;
      obj["avgHesitationDuration"] = this.reportformdata.fields[q].avgHesitationDuration;
      if (obj["avgHesitationDuration"] < 0)
        obj["avgHesitationDuration"] = 0;
      formfieldnametime.push(obj);
    }
    formfieldnametime.sort(function (a, b) {
      return (b.avgFillDuration) - (a.avgFillDuration);
    });
    return formfieldnametime;
  }
}