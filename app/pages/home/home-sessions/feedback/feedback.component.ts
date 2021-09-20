import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Menu, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FEEDBACK_TABLE } from './service/feedback-table.dummy';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';
import { Moment } from 'moment-timezone';
import * as moment from 'moment';
import { NVAppConfigService } from './../common/service/nvappconfig.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SessionStateService } from '../session-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from './../common/interfaces/metadata';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent implements OnInit {
  @ViewChild('op') op: any;
  url: string;
  urlSafe: SafeResourceUrl = '';
  startT: Date;
  endT: Date;
  startTime: string;
  endTime: string;
  linkOptions: MenuItem[];
  items: MenuItem[];
  rateval: number;
  data: Table;
  totalRecords = 0;
  countLoading: boolean = false;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  commentMsg: string;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  tooltipzindex = 100000;
  filterCriteria: any;
  tabledata: any;
  metadata: Metadata = null;

  mediaID: string = '1402726504';
  siddata: any;

  selectedRowIndex: any;
  imageflag: boolean = false;

  API_ENDPOINT: string = 'https://www.cbc.ca/bistro/order';

  video: any = {
    title: '',
    description: '',
    duration: '',
    key: '',
  };
  @ViewChild('actionC') actionC: ElementRef;
  h: any = "100%";

  @ViewChild('VideoWidget', { read: ElementRef, static: false })


  VideoWidget: ElementRef;
  starttime: any
  endtime: any;
  covtime: any;
  retime: any
  nvconfigurations: any = null;
  base: any;
  resdata: any;
  breadcrumb: BreadcrumbService;
  ddrpageDetails: any;
  filterLabel: string = '';

  constructor(private stateService: SessionStateService, private http: HttpClient,
    private nvhttp: NvhttpService, private nvAppConfigService: NVAppConfigService,
    public sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router,
    breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;

    });


    this.ddrpageDetails = [
      { label: 'Sessions', command: (event: any) => { this.navigate_to_page_detail() } },

    ];
  }

  ngOnInit(): void {

    const me = this;
    me.base = environment.api.netvision.base.base;
    me.urlSafe = me.sanitizer.bypassSecurityTrustResourceUrl(me.url)

    // set breadcrumb.
    if (Object.keys(this.route.snapshot.queryParams).length == 0) {
      // clear all breadcrumb. 
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
      this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    }
    this.breadcrumb.add({ label: 'Feedback', routerLink: '/feedback', queryParams: { ...this.route.snapshot.queryParams } } as MenuItem);

    me.downloadOptions = [
      { label: 'CSV' },
      { label: 'EXCEL' }
    ]
    me.linkOptions = [

      { label: 'CSV ', command: (event: any) => { } },
      { label: 'EXCEL', command: (event: any) => { } }

    ],

      me.data = { ...FEEDBACK_TABLE };
    me.totalRecords = me.data.data.length;
    me.empty = !me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }


  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
  }



  applyFilter(e) {
    this.imageflag = false;
    const me = this;
    me.filterCriteria = e

    this.setFilterCriteriaLabel();

    me.nvhttp.getFeedbackData((me.filterCriteria)).subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        me.loading = state.loading;
        me.error = state.error;
        me.data.data = state.data;
        me.empty = false;
      }

      if (state instanceof NVPreLoadedState) {
        // data format : [count, data_array, error, if any]
        let error = state.data[2];
        if (error != null) {
          me.loading = false;
          me.countLoading = false;
          me.error = {};
          me.error['msg'] = error;
          return;
        }
        me.loading = state.loading;
        me.countLoading = true;
        me.error = state.error;
        for (const i of state.data[1]) {
          i.sessionStartTime = moment.utc((parseInt("" + i.sessionStartTime) + me.nvconfigurations.cavEpochDiff) * 1000).tz(sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
          i.name = unescape(i.name);
          i.comments = unescape(i.comments);
          me.rateval = i.rating;
          me.siddata = i.sid;
        }
        me.data.data = state.data[1];
        me.totalRecords = me.data.data.length;
        me.countLoading = false;
        me.empty = !me.data.data.length;
        console.log("data.data", me.data.data)
        if (me.data.data.length) {
          this.imageflag = true;
          me.showPageDump(me.data.data[0], 0);
        }

      }

    },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          me.loading = err.loading;
          me.error = err.error;
          me.error.msg = "Error while loading data";
          me.tabledata = err.data;
        }

      });


  }

  setFilterCriteriaLabel(): void {
    this.filterLabel = '';
    if (this.filterCriteria.timeFilter.last != '') {
      this.filterLabel += 'Last: ' + this.filterCriteria.timeFilter.last;
    } else {
      this.filterLabel += 'From: ' + this.filterCriteria.timeFilter.startTime + ', ';
      this.filterLabel += 'To: ' + this.filterCriteria.timeFilter.endTime;
    }

    if (this.filterCriteria.page) {
      this.filterLabel += ', Page: ' + this.metadata.pageNameMap.get(parseInt(this.filterCriteria.page.split(':')[1])).name;
    }

    if (this.filterCriteria.name) {
      this.filterLabel += ', Name: ' + this.filterCriteria.name.split(':')[1];
    }

    if (this.filterCriteria.mobile) {
      this.filterLabel += ', Contact: ' + this.filterCriteria.mobile.split(':')[1];
    }

    if (this.filterCriteria.email) {
      this.filterLabel += ', Email: ' + this.filterCriteria.email.split(':')[1];
    }

    if (this.filterCriteria.rating) {
      this.filterLabel += ', Rating: ' + this.filterCriteria.rating.split(':')[1];
    }


    if (this.filterCriteria.comment) {
      this.filterLabel += ', Comment: ' + unescape(this.filterCriteria.comment.split(':')[1]);
    }
  }

  showPageDump(data: any, index: number) {
    const me = this;
    try {
      me.h = "calc(100vh - " + me.actionC.nativeElement.offsetHeight + "px)";
    } catch (e) { }
    let time = me.convertDateTimeInMillis(data.sessionStartTime, false);
    data['sessionStartTimeMilli'] = time[0] / 1000 - me.nvconfigurations.cavEpochDiff;
    this.nvhttp.getPageDump(data, index).subscribe((response: any) => {

      let responseData = response;
      const str = responseData.trim();//.split('%%%');
      if (str === '') {

        // me.url = document.location.origin + '/netvision/reports/noPageDump.html';
        me.url = '/netvision/reports/noPageDump.html';
      } else {
        me.url = str;
        //me.url =  document.location.origin + str[0];
      }

      //me.urlSafe = me.sanitizer.bypassSecurityTrustResourceUrl(me.url);
    }

    )
  }

   tableToExcel(table, tablename) {
    let tmpTable;
    let uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><img src="' + document.location.origin + '/ProductUI/images/cavi_logo_new.png" "><br><table>{table}</table></body></html>',
      base64 = (s) => {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      format = (s, c) => {
        return s.replace(/{(\w+)}/g, (m, p) => {
          return c[p];
        })
      };

    if (!table.nodeType) table = document.getElementById(table);
    tmpTable = document.createElement("table");
    tmpTable.innerHTML = table.innerHTML;

    //tmpTable.innerHTML = '<div style="font-size: 18px;text-align: center;font-weight:700">' + ' Duration : ' +  ' To ' + '<br></div>' + tmpTable.innerHTML;
    let ctx = {
      worksheet: name || 'Worksheet',
      table: tmpTable.innerHTML
    }
    window.location.href = uri + base64(format(template, ctx));
  }

  convertDateTimeInMillis(format, timeFilter) {
    const me = this;
    let currentTime = new Date();
    const startEndTime = new Array();
    const time = format.split('_');
    currentTime = new Date(
      currentTime.getTime() +
      currentTime.getTimezoneOffset() * 60000 +
      this.nvconfigurations.cavEpochDiff
    );
    if (timeFilter === false) {
      for (let j = 0; j < 2; j++) {
        // since new Date("17:03:39 08/10/21"); gives error in safari : bug 112100
        if(time[j]){
          let temp = time[j].split(" ");
          let t = temp[1] + " " + temp[0];
          const d = new Date(t);
          const n = d.getTime();
          startEndTime[j] = n;
        }
      }
    } else {
      if (time[1] === 'Minutes') {
        startEndTime[1] = currentTime.getTime();
        startEndTime[0] = startEndTime[1] - time[0] * 60 * 1000;

      } else if (time[1] === 'Hours' || time[1] === 'Hour') {
        startEndTime[1] = currentTime.getTime();
        startEndTime[0] = startEndTime[1] - time[0] * 60 * 60 * 1000;
      } else if (time[1] === 'Day') {
        startEndTime[1] = currentTime.getTime();
        const lastDay =
          currentTime.getHours() * 3600 +
          currentTime.getMinutes() * 60 +
          currentTime.getSeconds();
        // handling for the last day.
        const lastTime =
          lastDay + (time[0] === 1 ? 1 : time[0] - 1) * 24 * 60 * 60 * 1000;
        startEndTime[0] = startEndTime[1] - lastTime;
      } else if (time[1] === 'Weeks' || time[1] === 'Week') {
        startEndTime[1] = currentTime.getTime();
        startEndTime[0] = startEndTime[1] - time[0] * 7 * 24 * 60 * 60 * 1000;
      } else if (time[1] === 'Months' || time[1] === 'Month') {
        startEndTime[1] = currentTime.getTime();
        startEndTime[0] = startEndTime[1] - time[0] * 30 * 24 * 60 * 60 * 1000;
      } else {
        startEndTime[1] = currentTime.getTime();
        startEndTime[0] = startEndTime[1] - time[0] * 365 * 24 * 60 * 60 * 1000;
      }
      return startEndTime;
    }
    return startEndTime;
  }

  navigate_to_page_detail() {
    console.log("ddr method is called ");
    this.router.navigate(['home/home-sessions'], { queryParams: { sid: this.selectedRow.sid } });
  }
  toggleMenuOptions(e: MouseEvent, menuOptions: Menu): void {
    console.log("toggleMenuOptions called", e)
    this.hideAllMenus();
    menuOptions.toggle(e);
  }

  hideAllMenus(): void {
    document.getElementById('nothing').click();
  }



  handleRowSelection($event) {
    console.log('handleRowSelection selectedRowIndex - ' + $event.index, $event.sid);
    this.selectedRow = $event.data;
    this.selectedRowIndex = $event.index;
    // TODO: find solution. 
    if (this.selectedRowIndex === undefined) {
      this.data.data.some((value, index) => {
        if (value == this.selectedRow) {
          this.selectedRowIndex = index;
          return true;
        }
      });

      this.selectedRowIndex = this.selectedRowIndex || 0;
    }
    this.imageflag = true;
    this.showPageDump($event.data, this.selectedRowIndex);

  }

  loaded(event) {
    //console.log("loaded called : ", event, " -- ");
    let elm = <HTMLIFrameElement>event.target;
    let i = null;
    try {
      let el = <HTMLDocument>elm.contentWindow.document;
      i = <HTMLImageElement>el.querySelector('img');
      i.style.cssText = "position:absolute;transform:translateX(-50%);left:50%;margin:auto;";
    } catch (e) {

    }

  }


}


