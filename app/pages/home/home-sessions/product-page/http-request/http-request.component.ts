import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Store } from 'src/app/core/store/store';
import { HTTP_REQUEST } from './service/http-request.model';
import { HttpService } from './service/http-request.service';
import { HttpDataTableHeaderColumn, HttpDataTable } from './service/http-request-data.model';
import {
  HttpLoadedState, HttpLoadingErrorState, HttpLoadingState
} from './service/http-request-state';
import { Session } from '../../common/interfaces/session';
import { HttpRequest } from '../../common/interfaces/httprequest';
import { SessionStateService } from '../../session-state.service';
import { DrillDownDDRService } from '../../common/service/drilldownddrservice.service';

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
  styleUrls: ['./http-request.component.scss']
})

export class HttpRequestComponent implements OnInit {
  breadcrumb: MenuItem[];
  globalFilterFields: string[] = [];
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  isCheckbox: boolean;
  data: HttpDataTable;
  error: AppError;
  loading: boolean = true;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  selectedPage: any;

  cols: HttpDataTableHeaderColumn[] = [];
  _selectedColumns: HttpDataTableHeaderColumn[] = [];
  selectedRow: any;
  tooltipzindex = 100000;
  selectedValues: string[] = [];
  selectedSession: Session;
  Object = Object;
  domInteractiveTime: string;
  timeToLoad: string;

  row: any;
  timelineDialog: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private httpservice: HttpService, private stateService: SessionStateService, private ddrService : DrillDownDDRService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      console.log("params in http-scater mapp : ", params);
    }); 
   

    let me = this;
    me.data = HTTP_REQUEST;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('http request, page change - ', idx);

      me.reload();
    });

    me.reload();
  }


  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.selectedPage = me.stateService.getSelectedSessionPage();
    me.httpservice.LoadHttpData(this.selectedPage, this.selectedSession).subscribe(
      (state: Store.State) => {

        if (state instanceof HttpLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HttpLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: HttpLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

    if (me.selectedPage && me.selectedPage.domInteractiveTime)
      me.domInteractiveTime = me.ttgetstartvalue(me.selectedPage.domInteractiveTime);
    else
      me.domInteractiveTime = "0ms";

    if (me.selectedPage && me.selectedPage.timeToLoad != undefined)
      this.timeToLoad = this.ttgetstartvalue(me.selectedPage.timeToLoad);
    else
      this.timeToLoad = "0ms";
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
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }



  private onLoading(state: HttpLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: HttpLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }

  private onLoaded(state: HttpLoadedState) {
    const me = this;
    me.data = HTTP_REQUEST;
    let counter = 0;
    me.data.data = state.data.data.map(data => {
      const httpRequest = new HttpRequest(data);
      let startTime: number = Number.MAX_SAFE_INTEGER;
      let endTime: number = 0;

      // calculate startTime and endTime. 
      if (startTime > httpRequest.timestamp) {
        startTime = httpRequest.timestamp;
      }

      if (endTime < httpRequest.timestamp + parseFloat('' + httpRequest.responseTime)) {
        endTime = httpRequest.timestamp + parseFloat('' + httpRequest.responseTime);
      }

      httpRequest['startTime'] = startTime;
      httpRequest['duration'] = (endTime - startTime);

      const t = (httpRequest.timestamp - httpRequest['startTime']) * 1000;
      httpRequest["startTimeValue"] = me.ttgetstartvalue(t);
      httpRequest['eventcounter'] = counter++;
      return httpRequest;
    });

    me.totalRecords = me.data.data.length;
    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }


  getWidth(item): string {
    return ((parseFloat(item.responseTime) * 100) / parseFloat(item['duration'])).toFixed() + 'px';
  }

  getLeft(item): string {
    return (((parseFloat(item.timestamp) - parseFloat(item['startTime'])) * 100) / item['duration']).toFixed() + 'px';
  }

  //value will be passed in ms.
  ttgetstartvalue(value) {
    let sign = "+";
    if (value < 0)
      sign = "-";
    value = Math.abs(value);

    if (value > 1000)
      value = (value / 1000).toFixed(2) + "s";
    else
      value = parseInt(value) + "ms";
    if (value.replace(/[ms]/g, '') != 0)
      value = sign + value;
    return value;
  }

  showTimelineDialog(row: any): void {
    this.timelineDialog = true;
    this.row = row;
  }

  hideTimelineDialog(): void {
    this.timelineDialog = false;
    this.row = null;
  }

  openNDFlowpath(flowPathInstance)
  {
            let st = this.selectedSession.startTime;
            let et = this.selectedSession.endTime;
            
            this.ddrService.ndFlowpathDdr((st * 1000).toString(), (et * 1000).toString(), this.selectedSession.trnum + '',  flowPathInstance);
  }
}
