import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu, MenuItem, SelectItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionsDataTable } from '../session-data/service/session-data.model';
import { SESSION_PAGE_DATA } from './service/session-page.model';
import { SessionsPageDataTableHeaderColumn } from './service/session-page-data.model';
import { SessionPageService } from './service/session-page.service';
import { Store } from 'src/app/core/store/store';
import { SessionPageMenuOption } from './service/session-page.model';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { SessionPageLoadedState, SessionPageLoadingErrorState, SessionPageLoadingState } from './service/session-page.state';
import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation';
import * as moment from 'moment';
import 'moment-timezone';
import { Session } from '../../common/interfaces/session';
import { DataManager } from '../../common/datamanager/datamanager';
import { SessionStateService } from '../../session-state.service';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from '../../common/service/nvhttp.service';
import { ReplayService } from '../../play-sessions/service/replay.service';
import { Clipboard } from '@angular/cdk/clipboard'
import { DrillDownDDRService } from '../../common/service/drilldownddrservice.service';
import { NVAppConfigService } from '../../common/service/nvappconfig.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../../common/util/export-util';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionPageComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  //tablefalg: boolean == true;

  @ViewChild('template') template: Table;
  @ViewChild('searchInput') searchInput: ElementRef;
  data: SessionsDataTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  first: number = 0;
  _disab: boolean = false;
  pages: PageInformation = null;
  cols: SessionsPageDataTableHeaderColumn[] = [];
  _selectedColumns: SessionsPageDataTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean = false;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  //error: boolean;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  activeSession = false;


  //tabledata: [] = [];
  selectedSession: Session;
  showData: boolean = false;
  tabular: boolean = true;
  //breadInfo = null;
  //@Output() reloadPages: EventEmitter<boolean>; 
  metric: SelectItem = { label: 'Onload', value: "timeToLoad" };
  //metric: any;
  items: any;
  currentRowData: any;
  currentEvent: any;
  eventOptions: MenuItem[];
  appFlag: boolean = false;
  impactFlag: boolean = false;
  impactData: any = [];
  displayFlag: boolean = false;
  cardData: any
  selectedRowIndex: any;
  nvconfigurations: any; 
  countLoading: boolean = false;
  constructor(
    private router: Router, private pageservice: SessionPageService, private metadataService: MetadataService, private route: ActivatedRoute,
    private stateService: SessionStateService, private nvHttp: NvhttpService, private replayService: ReplayService, private _clipboardService: Clipboard,
    private ddrService: DrillDownDDRService, private nvAppConfigService: NVAppConfigService
  ) {
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;

    });
  }

  ngOnInit(): void {
    const me = this;
    //me.pageservice.LoadSessionPageData();

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: ' Color Management' },

    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];

    me.options = [
      { label: 'Page Details', command: (event: any) => { this.showProductPage(); } },
      { label: 'Play Session', command: (event: any) => { this.navigate_to_replay(); } }
    ];
    me.eventOptions = [

      { label: 'Impact of Event', command: (event: any) => { this.openImpactEvent(event); } },
    ];

    this.items = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];


    me.data = {...SESSION_PAGE_DATA};
    this.route.queryParams.subscribe(params => {
      console.log("params in sessions details : ", params);
    });

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.stateService.set('selectedTab', 'page');
    this.selectedSession = this.stateService.getSelectedSession();
    this.activeSession = this.stateService.get('sessions.active', false);

    this.stateService.onSessionChange().subscribe((idx: number) => {
      console.log('session-page, session change - ', idx);

      // wait for activeFlag to be set. 
      setTimeout(() => {
        me.selectedSession = me.stateService.getSelectedSession();
        me.activeSession = me.stateService.get('sessions.active', false);
        if (me.selectedSession) {
          me.reloadPage();
        } else {
          console.error('session-page, selected session is null');
        }
      }, 0);
    });

    // check if data is already there then take from there. 
    let oldPages = this.stateService.get('sessions.pages.data', []);

    if (oldPages.length > 0) {
      console.log('session-page, old data found. Reloading it');
      this.loading = false;
      this.showData = true;
      me.data.data =[];
      me.data.data = oldPages;
      me.totalRecords = me.data.data.length;
      me.first = this.stateService.get('sessions.pages.first', 0);
      me.data.paginator.rows = this.stateService.get('sessions.pages.rows', me.data.paginator.rows);
    } else {
      console.log('session-page, old data is not found. Fetching again.');
      me.reloadPage();
    }
  }

  get selectedColumns(): SessionsPageDataTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: SessionsPageDataTableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  reloadPage() {
    let me = this;
    let filter = JSON.parse(JSON.stringify(this.selectedSession));
    me.pageservice.LoadSessionPageData(filter, this.activeSession).subscribe(
      (state: Store.State) => {

        if (state instanceof SessionPageLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof SessionPageLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: SessionPageLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  showProductPage(pageInstance?: number) {//(rowdata, rowidx) {
    console.log('showProductPage called, rowData - ', this.selectedRow, ', rowidx - ', this.selectedRowIndex);
    // update state
    if (pageInstance) {
      this.stateService.set('sessions.selectedPageIdx', pageInstance);
    } else {
      this.stateService.set('sessions.selectedPageIdx', this.selectedRowIndex);
    }

    this.router.navigate(['/product-page'], { replaceUrl: true });
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  private onLoading(state: SessionPageLoadingState) {
    const me = this;
    me.empty = false;
    me.error = null;
    me.loading = true; 
    me.countLoading = true;
    this.stateService.set('sessions.pages.data', null, true);
    this.stateService.set('sessions.selectedPageIdx', null, true);
  }

  private onLoadingError(state: SessionPageLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = "error";
    me.error['msg'] = "Error while loading data.";
    me.loading = false;
  }

  private onLoaded(state: SessionPageLoadedState) {
    const me = this; 
    me.countLoading = true;
    me.metadataService.getMetadata().subscribe(metadata => {
      me.data = {...SESSION_PAGE_DATA};
      if (state.data.data.length != 0) {
        me.showData = true;
      }
      me.data.data = state.data.data.map((a, i) => {
        return new PageInformation(a, i, metadata);
      }); 
      this.totalRecords = this.data.data.length;
      this.countLoading = false;
      me.empty = !me.data.data.length; 
      me.loading = false;
      me.error = null;

      // save data. 
      this.stateService.set('sessions.pages.data', me.data.data, true);

    })

  }

  updatePagination($event) {
    //update first and rows in state. 
    this.stateService.setAll({
      'sessions.pages.first': $event.first,
      'sessions.pages.rows': $event.rows
    });
  }


  updateMetric(e) {
    this.metric = e;
  }

  enablecopyicon() {
    this._disab = true;
  }
  disablecopy() {
    this._disab = false;
  }
  openImpactEvent(item) {
    console.log("openImpactEvent called with  -- item -- ", this.selectedSession.channel);
    this.appFlag = true;
    this.impactFlag = true;
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    var yesterdayStr = moment.tz(dateObj, sessionStorage.getItem("_nvtimezone")).format("MM/DD/YYYY");
    var st = yesterdayStr + " 00:00:00";
    var et = yesterdayStr + " 23:59:59";
    let st_utc = moment.tz(new Date(st), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    let et_utc = moment.tz(new Date(et), "UTC").format('MM/DD/YYYY  HH:mm:ss');
    this.nvHttp.getEventImpactInfo("", st_utc, et_utc, this.selectedSession.channel.name, this.currentEvent).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        console.log('NVPreLoadingState', state);
        this.loading = true;
        this.error = state.error;

        this.appFlag = true;
      }
      if (state instanceof NVPreLoadedState) {

        this.appFlag = false;
        console.log("response : ", state);
        this.cardData = state;
        this.displayFlag = true;
      }
    }, (err: Store.State) => {
      if (err instanceof NVPreLoadingErrorState) {
        this.appFlag = false;
        console.log("error occred : ", err);
      }
    })
    this.impactData = [];
    console.log("eventName ", this.currentEvent);
    this.impactData.push({ event: this.currentEvent });
    this.impactData.push({ last: "" });
    this.impactData.push({ startDateTime: st });
    this.impactData.push({ endDateTime: et });
    this.impactData.push({ channel: this.selectedSession.channel });
    console.log("after this.impactData ", this.impactData);
    console.log("impactFlag ", this.impactFlag);
  }

  changeFlagValue(ev) {
    console.log("changeFlagValue ", ev);
    this.impactFlag = ev;
  }


  onClickMenu(rowData: any, name, eventMenu, evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
    console.log("setting event name as : ", name, " on clicking menu ");
    this.currentRowData = rowData;
    this.currentEvent = name;
    //  ISSUE: Event Menus doesn't hide on single click
    this.hideAllMenus();
    this.hideAllMenus();
    eventMenu.toggle(evt);

  }
  handleRowSelection($event) {
    console.log('handleRowSelection selectedRowIndex - ' + $event.index);
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
    // update state
    this.stateService.set('sessions.selectedPageIdx', this.selectedRowIndex);

  }
  navigate_to_replay() {
    console.log("navigate_to_replay_details called : ", this.selectedRow, " --row idx : ", this.selectedRowIndex);
    //this.router.navigate(['/play-sessions'],{ queryParams: { selectedSession : JSON.stringify(this.selectedRow),random: Math.random()}, replaceUrl : true});
    //let msg = "session with sid : " + this.selectedRow.sid;
    //this.replayService.console("log", "openReplay1", msg);
    this.replayService.openReplay(this.selectedRow.sid, this.selectedSession/*session*/, this.data.data/*pages*/, this.selectedRowIndex/**index */, this.selectedRow.pageinstance/**pageinstance */, this.activeSession);
  }

  copyText(evt, text) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
    console.log("copyText called with text : ", text);
    this._clipboardService.copy(text);
  }

  openNDSession(e, data) {
    e.stopPropagation();
    var url = "";
    var pi = null;
    let flowpathID = "-1";
    if (this.selectedRowIndex != null) {
      var ele = document.createElement('a');
      pi = Number(data.pageinstance);
      pi = pi - 1;

      ele.href = data.url;
      url = ele.pathname;

      flowpathID = data.flowpathinstances;
    }
    let st = new Date(data.navigationStartTime).getTime() / 1000;
    let et = (new Date(data.navigationStartTime).getTime() / 1000) + 300;
    if (this.activeSession) {
      st += this.nvconfigurations.cavEpochDiff;
      et += this.nvconfigurations.cavEpochDiff;
    }
    this.ddrService.ndSessionDdr((st * 1000).toString(), (et * 1000).toString(), this.selectedSession.trnum + '', this.selectedSession.sid, flowpathID + '', pi + '', url);

  }
  openNF(e, data) {
    e.stopPropagation();
    let st = new Date(data.navigationStartTime).getTime() / 1000;
    let et = (new Date(data.navigationStartTime).getTime() / 1000) + 300;
    let ele = document.createElement('a');
    ele.href = data.url;
    let url = ele.pathname;
    if (this.activeSession) {
      st += this.nvconfigurations.cavEpochDiff;
      et += this.nvconfigurations.cavEpochDiff;
    }
    //nfSessionDdr(pageinstance,requestType,flowpathid,sessionId,urlParam,startTime,endTime)
    this.ddrService.nfSessionDdr(data.pageinstance, "page", data.flowpathinstances, data.sid, url, (st * 1000), (et * 1000));
  }
  Reload() {
    this.reloadPage();
  }

  toggleMenu(e: MouseEvent, menuOptions: Menu) {
    this.hideAllMenus();
    menuOptions.toggle(e);
  }

  hideAllMenus(): void {
    // Hide all open Menus
    document.getElementById('nothing').click();
  }

  exportPdf() {
    // save current state of table. 
    const rows = this.template.rows;
    const first = this.template.first;
    this.template.rows = this.totalRecords;
    this.template.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.template.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.template.el.nativeElement, 1);
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('session-page.pdf');
      } catch(e) {
        console.error('error while exporting in pdf. error - ', e);
      }
      
      //revert back to previous state. 
      this.template.rows = rows;
      this.template.first = first;
    });
    
  }

  exportCSV() {
    // save current state of table. 
    const rows = this.template.rows;
    const first = this.template.first;
    this.template.rows = this.totalRecords;
    this.template.first = 0;

    setTimeout(() => {
      try {
        ExportUtil.exportToCSV(this.template.el.nativeElement, 1, 'session-page.csv');
      } catch(e) {
        console.error('Error while exporting into CSV');
      }

      //revert back to previous state. 
      this.template.rows = rows;
      this.template.first = first;
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      // save the current state. 
      // get rows and first value. 
      const rows = this.template.rows;
      const first = this.template.first;

      this.template.rows = this.totalRecords;
      this.template.first = 0;
      setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.template.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, {header: jsonData.headers, skipHeader: true});
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        }catch(e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
        this.template.rows = rows;
        this.template.first = first;
      });
    });
  }


  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'session-page.xlsx');
    });
  }







}

