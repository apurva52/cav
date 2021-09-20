import { Component, OnInit } from '@angular/core';
import { FormAnalyticsOverAll_TABLE_DATA } from './service/form-analytic-overall.dummy';
import { FormAnalyticsOverAllReportTable } from './service/form-analytic-overall.model';
import { FormReportService } from './service/form-analytic-overall.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { MenuItem } from 'primeng';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from './service/form-analytic-overall.state';
import { ActivatedRoute, Router } from '@angular/router';
import { OVERALL_REPORT_TABLE_DATA } from '../overall-report/service/overall-report.dummy';
import { overallReportTable } from '../overall-report/service/overall-report.model';

@Component({
  selector: 'app-form-analytic-overall',
  templateUrl: './form-analytic-overall.component.html',
  styleUrls: ['./form-analytic-overall.component.scss']
})
export class FormAnalyticOverallComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  data: FormAnalyticsOverAllReportTable;
  breadcrumb: MenuItem[];
  formdataa: any;
  pageNameflag: boolean = true;
  dataoverallreport: overallReportTable;
  filterLabel: string = '';
  constructor(private FormReportService: FormReportService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    const me = this;
    me.dataoverallreport = OVERALL_REPORT_TABLE_DATA;
    //set setFormName null because in overall no need to show formName dropdown
    this.dataoverallreport.setformName = null;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Sessions', routerLink: '/home/home-sessions' },
      { label: 'Form Analytics', routerLink: '/form-analytic-overall' }
    ];
    me.data = FormAnalyticsOverAll_TABLE_DATA;
    console.log('me.data.data 1 : ', me.data.data);

    // this.formdataa = { "pages": [{ "name": "ShoppingCheckout", "view": 10, "forms": [{ "name": "signinForm", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "shipping_addressy_form_v3", "interaction": 5.0, "submit": 2.0, "failed": 3.0 }] }, { "name": "SAIndex", "view": 4, "forms": [{ "name": "form2", "interaction": 30.0, "submit": 3.0, "failed": 1.0 }, { "name": "store_locator_form", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "kohls_login", "interaction": 100.0, "submit": 100.0, "failed": 100.0 }, { "name": "kohls_create_acct", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Home", "view": 7, "forms": [{ "name": "site-search", "interaction": 10.0, "submit": 5.0, "failed": 5.0 }, { "name": "form2", "interaction": 100.0, "submit": 100.0, "failed": 100.0 }, { "name": "store_locator_form", "interaction": 20.0, "submit": 10.0, "failed": 10.0 }] }, { "name": "SACheckout", "view": 104, "forms": [{ "name": "roboFilterForm", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Catalog", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "SearchResult", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "ShoppingBag", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Login", "view": 4, "forms": [{ "name": "kohls_login", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }, { "name": "kohls_create_acct", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }, { "name": "Product", "view": 4, "forms": [{ "name": "site-search", "interaction": 0.0, "submit": 0.0, "failed": 0.0 }] }] };
    // this.formdataa.pages.sort(function (a, b) { return b.view - a.view })
    // //sort method  forms
    // for (let i = 0; i < this.formdataa.pages.length; i++)
    //   this.formdataa.pages[i].forms.sort(function (a, b) { return b.interaction - a.interaction });
    // //this.applyFilter();
    // me.data.formdataa = this.formdataa;
    let filtercriteria = { "channelform": "Overall", "pageform": "", "formnameform": null, "timeFilter": { "last": "1 Day" } };
    if (this.dataoverallreport.overallformfiltercriteria == null) {
      console.log('ngonint this.dataoverallreport.overallformfiltercriteria null ', this.dataoverallreport.overallformfiltercriteria);
      this.applyFilter(filtercriteria);
      this.dataoverallreport.overallformfiltercriteria = filtercriteria;
    }
    else {
      console.log('ngOnint this.dataoverallreport.overallformfiltercriteria not null ', this.dataoverallreport.overallformfiltercriteria);
      this.applyFilter(this.dataoverallreport.overallformfiltercriteria)
    }
  }
  openFormReportDetail(formAnalyticinfo, pageinfo) {
    console.log('openFormReportDetail formAnalyticinfo : ', formAnalyticinfo, ' pageinfo : ', pageinfo);
    //set formName for ddr to formanalytics report 
    this.dataoverallreport.setformName = formAnalyticinfo.name;
    this.dataoverallreport.setPageName = pageinfo;
    this.router.navigate(['/form-analytics'], { replaceUrl: true });
  }

  setFilterCriteriaLabel(st, et, last, channel, page) {
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
    if (event.channelform == null || event.channelform == "")
      channel = "Overall";
    else
      channel = event.channelform;
    if (event.pageform == null || event.pageform == "")
      page = "";
    else
      page = event.pageform;
    this.setFilterCriteriaLabel(st, et, last, channel, page);
    me.FormReportService.LoadFormAnalyticsData(st, et, last, channel, page).subscribe(
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
    me.data.formdataa = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: OverAllReportLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data.formdataa = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: OverAllReportLoadedState) {
    const me = this;
    me.data = FormAnalyticsOverAll_TABLE_DATA;
    console.log('state onloaded overall data : ', state.data);
    let response = state.data.data;
    this.pageNameflag = true;
    if (response == null) {
      this.formdataa = {};
      this.formdataa["pages"] = [];
    }
    else if (response === '{}') {
      this.formdataa = {};
      this.formdataa["pages"] = [];
    }
    else {
      //this.formdataa = {};
      this.formdataa = response;
      if (this.formdataa != null && this.formdataa["pages"] != null) {

        for (let j = 0; j < this.formdataa.pages.length; j++) {
          if (this.formdataa.pages[j].forms.length == 0 || this.formdataa.pages[j].name == null || this.formdataa.pages[j].view == 0 || this.formdataa.pages[j].name == "Others")
            continue;
          else
            this.pageNameflag = false;
        }
        //sort method for pages
        this.formdataa.pages.sort(function (a, b) { return b.view - a.view })
        //sort method  forms
        for (let i = 0; i < this.formdataa.pages.length; i++)
          this.formdataa.pages[i].forms.sort(function (a, b) { return b.interaction - a.interaction });
      }
    }
    me.data.formdataa = this.formdataa;
    me.error = null;
    me.loading = false;
  }


}
