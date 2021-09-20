import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { JSEditor } from '../../common/interfaces/jseditor';
import { JSError } from '../../common/interfaces/jserror';
import { PageInformation } from '../../common/interfaces/pageinformation';
import { Session } from '../../common/interfaces/session';
import { NVAppConfigService } from '../../common/service/nvappconfig.service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../common/service/nvhttp.service';
import { Util } from '../../common/util/util';
import { SessionStateService } from '../../session-state.service';
import { JSERROR_DATA, StackTrace } from './service/js-error.model';

@Component({
  selector: 'app-js-error',
  templateUrl: './js-error.component.html',
  styleUrls: ['./js-error.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JsErrorComponent implements OnInit {
  globalFilterFields: string[] = [];
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  isCheckbox: boolean;
  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  selectedPage: PageInformation;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  selectedRow: any;
  tooltipzindex = 100000;
  selectedValues: string[] = [];
  selectedSession: Session;

  showEditor: boolean;
  editorInfo: JSEditor;

  code: string;
  stackTrace: StackTrace[];
  message: string;

  jsEditorMap = new Map<string, JSEditor>();





  constructor(private route: ActivatedRoute, private stateService: SessionStateService, private httpService: NvhttpService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("params in js error : ", params);
    });

    let me = this;
    me.data = { ...JSERROR_DATA };
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('jserror, page change - ', idx);

      me.reload();
    });

    me.reload();
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


  reload() {
    const me = this;
    me.selectedSession = me.stateService.getSelectedSession();
    me.selectedPage = me.stateService.getSelectedSessionPage();

    let duration = Util.FormattedDurationToSec(this.selectedSession.duration);
    me.httpService.getJSErrorData(me.selectedSession.sid, me.selectedPage.pageInstance, duration).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        me.onLoading(state);
      } else if (state instanceof NVPreLoadedState) {
        me.onLoaded(state);
        return;
      } else if (state instanceof NVPreLoadingErrorState) {
        me.onLoadingError(state);
      }
    });
  }

  private onLoading(_state: NVPreLoadingState<any>) {
    const me = this;
    me.data.data = [];
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(_state: NVPreLoadingErrorState<any>) {
    const me = this;
    me.data.data = [];
    me.empty = false;
    me.error = {};
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = false;

  }
  private onLoaded(state: NVPreLoadedState<any[]>) {
    const me = this;
    me.data = JSERROR_DATA;
    let data = state.data;
    me.data.data = data.map((d, index) => {
      let n = new JSError(d);
      n.seq = index;
      return n;
    });

    console.log('JS Error data loaded. total record - ' + (me.data.data ? me.data.data.length : 'null'));

    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }

  addInJSEditor(token: StackTrace, stackTrace: StackTrace[], message: string): void {
    this.showEditor = true;
    this.stackTrace = stackTrace;
    this.message = message;
    console.log('token : ', token, 'stackTrace : ', stackTrace);

    // get row, column and filename from token
    const tmp = token.text.split(':');
    const col = Number(tmp[tmp.length - 1]);
    const row = Number(tmp[tmp.length - 2]);
    tmp.pop();
    tmp.pop();
    const url = tmp.join(':');

    this.editorInfo = new JSEditor(url, col, row);
  }

}
