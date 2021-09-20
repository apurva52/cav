export class TimeFilter {
  last: string;
  // in msec.
  startTime: string;
  endTime: string;
  constructor() {
    this.last = '';
    this.startTime = '';
    this.endTime = '';
  }
}

export default class TimeFilterUtil {
  static getTimeFilter(last, stime, etime): TimeFilter {
    const timefilter: TimeFilter = { startTime: '', endTime: '', last: '' };

    if (last === '') {
      const d = new Date(stime);
      const e = new Date(etime);
      const date1 = TimeFilterUtil.toDateString(d);
      const date2 = TimeFilterUtil.toDateString(e);

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

  private static toDateString(d: Date) {
    return window['toDateString'](d);
  }
}
