import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table } from 'src/app/shared/table/table.model';
import { Store } from 'src/app/core/store/store';
import { TimeFilter } from '../../home-sessions/common/interfaces/timefilter';

export class FunnelPreLoadingState extends Store.AbstractLoadingState<Funnel> { }
export class FunnelPreLoadingErrorState extends Store.AbstractErrorState<Funnel> { }
export class FunnelPreLoadedState extends Store.AbstractIdealState<Funnel> { }

export interface Funnel {
  FunnelData: FunnelData[];
}

export interface FunnelData {
  PageName: string;
  TotalCount: number;
  EntryPage: EntryPage;
  ExitPage: ExitPage;
  BPNextPageCount: number;
  BPNextPageCountPct: string;
  BPProceedToNextPage: string;
  BPProceedTo: ProceedToType[];
  // It will be used to render in proceed to data. 
  BPProcessedProceedTo: ProceedToType[];
  shadowBoxBackground: string;
  Improvement?: Improvement;

}

export interface EntryPage {
  EntryDetail: EntryDetail[];
  TotalEntryCount: number;
  entryCountPct?: number;
  headers?: TableHeaders[];
  data?: EntryTableData[];
}

export interface ProceedToType {
  node: string;
  count: number;
}

export interface TableHeaders {
  cols: Cols[];
}

export interface Cols {
  label: string;
  valueField: string;
  dataClasses: string;
  isSort: boolean;
  width: string;
}

export interface EntryTableData {
  top: string;
  count: number;
}

export interface ExitPage {
  BPExitPageEvents?: PageEvents[];
  ExitDetails: ExitDetails[];
  TotalExitCount: number;
  exitCountPct?: number;
  headers?: TableHeaders[];
  data?: ExitTableData[];
}

export interface ExitTableData {
  top: string;
  count: number;
  exitPageEvents: PageEvents[];
  transitPageEvents: PageEvents[];
  // TODO: Handle for icons
}

export interface ExitDetails {
  ExitPageEvents: PageEvents[];
  TransitPageEvents: PageEvents[];
  counts: number;
  pageName: string;
}

export interface EntryDetail {
  pageName: string;
  entryCount: number;
}

export interface PageEvents {
  count: number;
  eventName: string;
  icon: string;
  iconCls : string;
}

export interface RevenueDetails {
  revenueLossData: Table;
}

export interface FilterCriteria {
  timeFilter: TimeFilter;
  channel: string;
  bpname: string;
  usersegment: string;
}

export interface Improvement {
  proceededUsers: number;
  proceededPct: number;
  bpEventCount: number;
  perEventContribution: number;
}

export interface EditFilter { icon: string; color: string; oldValue: number; newValue: number; percent: number }


export default class TimeFilterUtil {
  static setTimeFilter(last, stime, etime) {
    const timefilter = {
      startTime: '',
      endTime: '',
      last: ''
    };
    if (last === '') {
      const d = new Date(stime);
      const e = new Date(etime);
      const date1 = window['toDateString'](d);
      const date2 = window['toDateString'](e);

      timefilter.startTime = date1 + ' ' + d.toTimeString().split(' ')[0];
      timefilter.endTime = date2 + ' ' + e.toTimeString().split(' ')[0];
      timefilter.last = '';
    } else {
      timefilter.startTime = '';
      timefilter.endTime = '';
      timefilter.last = last;
    }
    return timefilter;
  }
}

