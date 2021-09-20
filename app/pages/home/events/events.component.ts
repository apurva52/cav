import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { EventLoadingState, EventLoadingErrorState, EventLoadedState} from './service/event.state';
import { EventsTable, EventFilter, EventsTableHeaderColumn, FilterObject} from './service/event.model';
import { EventService } from './service/event.service';
import { AppError } from 'src/app/core/error/error.model';
import { Router } from '@angular/router';
import { TimebarValue } from 'src/app/shared/time-bar/service/time-bar.model';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import * as _ from 'lodash';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';

export const INFO_SEVERITY = "6";
export const ALL_SEVERITY = "4"
export const CRITICAL_SEVERITY = "3";
export const MAJOR_SEVERITY = "2";
export const MINOR_SEVERITY = "1";
export const ALL_TYPE = "All";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class EventsComponent implements OnInit {

  data: EventsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: EventsTableHeaderColumn[];
  selected: boolean = false;
  filterObj: FilterObject = null;
  sp: string = "LIVE5";
  severity: string = ALL_SEVERITY;
  type: string = "All";
  downloadOptions: MenuItem[];
  _selectedColumns: EventsTableHeaderColumn[] = [];
  KeyPressed: string;
  currentTimebarValue: TimebarValue;
  errorMessage : string = "Data not available.";
  showPaginator: boolean = false;
  totalRecords = 0;
  isShowColumnFilter: boolean = false;
  first: number = 0;
  filterTitle: string = "";
  @ViewChild("eventData") eventData: ElementRef;
  
  private subscriptions: { [key: string]: Subscription } = {
    timebarOnChange: null,
  };

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  showUI: boolean = true;

  constructor(private eventService: EventService, private router: Router,
    private timebarService: TimebarService) {

    // this.showUI = !!localStorage.getItem('SHOW_EVENTS_UI');
  }

  ngOnInit(): void {
    const me = this;

    // me.downloadOptions = [
    //   { label: 'WORD' },
    //   { label: 'PDF' },
    //   { label: 'EXCEL' },
    // ];

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports("pdf");
        }
      }
    ]

    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      if (!timePeriod) {
        let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['selectedPreset'];
        var filters: FilterObject = {
          severity: me.severity,
          type: me.type,
          sp: timePreset
        }
      }
      else if (timePeriod) {
        var filters: FilterObject = {
          severity: me.severity,
          type: me.type,
          sp: timePeriod
        }
      }
      else {
        var filters: FilterObject = {
          severity: me.severity,
          type: me.type,
          sp: me.sp
        }
      }
      me.load(filters);
    });
    sessionStorage.removeItem("keyName");
  }

  load(filterObj: FilterObject) {
    const me = this;

    if (filterObj['sp']) {
      me.sp = filterObj['sp'];
    }
    if (me.data) {
      const keyword = sessionStorage.getItem("keyName");
      if ((keyword) && (!filterObj.severity)) {

        if (keyword == "major")
          filterObj.severity = MAJOR_SEVERITY;
        else if (keyword == "minor")
          filterObj.severity = MINOR_SEVERITY;
        else if (keyword == "critical")
          filterObj.severity = CRITICAL_SEVERITY;
        else if (keyword == "info")
          filterObj.severity = INFO_SEVERITY;
        else
          filterObj.severity = ALL_SEVERITY;
      }
      else if(!keyword)
        filterObj.severity = ALL_SEVERITY;
    }

    if (!filterObj.type)
      filterObj.type = ALL_TYPE;

    me.eventService.load(filterObj).subscribe(

      (state: Store.State) => {
        if (state instanceof EventLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof EventLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EventLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: EventLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: EventLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.error.msg = "Error while loading data."
    me.loading = false;
  }

  private onLoaded(state: EventLoadedState) {
    const me = this;
    me.syncGlobalTimebar();
    me.data = state.data;
    if(state.data && state.data.status)
    me.errorMessage = state.data.status.msg;
    me.error = null;
    me.loading = false;
    if(me.data){
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected)
        me._selectedColumns.push(c);
    }

    if (me.ischecked) {
      for (const filter of me.data.filters) {
        if (me.key == filter.key)
          filter.selected = true;
        else
          filter.selected = false;
      }
    }
    if(me.data.data.length === 0)
      me.showPaginator = false;
    else
      me.showPaginator = true;

     me.totalRecords = me.data.data.length;
    }
  }

  toggleFilter(filterToToggle: EventFilter) {
    const me = this;
    me.data.data = null;
    me._selectedColumns = [];
    me.cols = null;
    me.KeyPressed = filterToToggle.key;
    sessionStorage.setItem("keyName", filterToToggle.key);
    for (const filter of me.data.filters) {
      if (filterToToggle.key === filter.key) {
        me.ischecked = true;
        me.key = filterToToggle.key;

        if (filter.key == "critical")
          me.severity = CRITICAL_SEVERITY;
        else if (filter.key == "major")
          me.severity = MAJOR_SEVERITY;
        else if (filter.key == "minor")
          me.severity = MINOR_SEVERITY;
        else if (filter.key == "info")
          me.severity = INFO_SEVERITY;
        else
          me.severity = ALL_SEVERITY;

        let filters : FilterObject = {
          severity: me.severity,
          type: ALL_TYPE,
          sp: me.sp
        }
        me.load(filters);
      }
    }
  }

  readField() {
    const me = this;
    me.router.navigate(['/drilldown']);
  }

  private syncGlobalTimebar() {
    const me = this;
    me.first = 0;
    me.timebarService.instance.getInstance().subscribe(() => {
      if (!me.subscriptions.timebarOnChange) {
        me.subscriptions.timebarOnChange = me.timebarService.events.onChange.subscribe(
          () => {

            const timebarValue: TimebarValue = me.timebarService.getValue();
            const viewBy: MenuItem = timebarValue.viewBy.selected;
            const viewByNumber: number =
              viewBy && viewBy.id ? Number(viewBy.id) : null;
            const viewByMs: number = viewByNumber ? viewByNumber * 1000 : null;
            const timePeriod: MenuItem = timebarValue.timePeriod.selected;
            me.currentTimebarValue = timebarValue;

            let filters: FilterObject = {
              severity: me.severity,
              type: ALL_TYPE,
              sp: timePeriod.id
            }
            if(me.data && me.data.data)
            me.data.data = null;
            me._selectedColumns = [];
            me.cols = null;
            me.load(filters);
          }

        );
      }
    }

    );
  }

  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.data;
    let header = ['S No.'];
    for (const c of me.data.headers[0].cols)
        header.push(c.label); 
    try {
      me.eventService.downloadShowDescReports(label, tableData, header).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadReportLoadingState) {
            me.onLoadingReport(state);

            return;
          }

          if (state instanceof DownloadReportLoadedState) {
            me.onLoadedReport(state);
            return;
          }
        },
        (state: DownloadReportLoadingErrorState) => {
          me.onLoadingReportError(state);

        }
      );
    } catch (err) {
      console.error("Exception in downloadShowDescReports method in metric description component :", err);
    }
  }

  private onLoadingReport(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadedReport(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");

  }
  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  refreshData(){
    const me = this;
    me.data.data = null;
    me._selectedColumns = [];
    me.cols = null;
    let filters : FilterObject = {
      severity: me.severity,
      type: ALL_TYPE,
      sp: me.sp
    }
    me.load(filters);
  }

  columnFilter() {
    const me = this;
    me.isShowColumnFilter = !me.isShowColumnFilter;
    if (me.isShowColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
      me.eventData['filters']['sev'] = ''
      me.refreshData();
    }
  }
}
