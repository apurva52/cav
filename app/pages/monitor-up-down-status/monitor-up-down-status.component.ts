import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from '../../shared/page-dialog/page-dialog.component';
import { AppError } from 'src/app/core/error/error.model';
import {
  MonitorupdownstatusPayload,
  MonitorupdownstatusHeaderCols,
  MonitorupdownstatusTable,
} from './service/monitorupdownstatus.model';
import { Moment } from 'moment-timezone';
import {
  TimebarValue,
  TimebarValueInput,
} from '../../shared/time-bar/service/time-bar.model';
import { TimebarService } from '../../shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from '../../shared/utility/menu-item';
import { MenuItem } from 'primeng';
import * as _ from 'lodash';
import { Observable, Subject, Subscription } from 'rxjs';
import { MonitorupdownstatusService } from './service/monitorupdownstatus.service';
import { Store } from 'src/app/core/store/store';
import {
  MonitorupdownstatusErrorState,
  MonitorupdownstatusLoadedState,
  MonitorupdownstatusLoadingState,
} from './service/monitorupdownstatus.state';
import { Router } from '@angular/router';
import {
  DownloadReportLoadedState,
  DownloadReportLoadingErrorState,
  DownloadReportLoadingState,
} from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-monitor-up-down-status',
  templateUrl: './monitor-up-down-status.component.html',
  styleUrls: ['./monitor-up-down-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MonitorUpDownStatusComponent
  extends PageDialogComponent
  implements OnInit {
  data: MonitorupdownstatusTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;

  cols: MonitorupdownstatusHeaderCols[] = [];
  _selectedColumns: MonitorupdownstatusHeaderCols[] = [];
  globalFilterFields: string[] = [];
  tmpValue: TimebarValue = null;
  MUDSTmpValue: TimebarValue = null;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  selectedItem;
  errorMessage: string = 'Data not available.';
  currentTimebarValue: TimebarValue;
  sp: string = 'LIVE5';
  isShowColumnFilter: boolean = false;
  showPaginator: boolean = false;
  first: number = 0;

  private subscriptions: { [key: string]: Subscription } = {
    timebarOnChange: null,
  };

  constructor(
    private timebarService: TimebarService,
    private monitorupdownstatusService: MonitorupdownstatusService,
    private router: Router,
    private schedulerService: SchedulerService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    // me.downloadOptions = [
    //   { label: 'WORD', disabled: true },
    //   { label: 'PDF', disabled: true },
    //   { label: 'EXCEL', disabled: true }
    // ]

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports('worddoc');
        },
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports('excel');
        },
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports('pdf');
        },
      },
    ];

    // me.timebarService.instance.getInstance().subscribe(() => {
    //   const value = me.timebarService.getValue();

    //   me.MUDSTmpValue = value;

    //   const timePeriod = _.get(value, 'timePeriod.selected.id', null);
    //   if (!timePeriod) {
    //     let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))[
    //       'selectedPreset'
    //     ];
    //     var clientObj: MonitorupdownstatusPayload = {
    //       sp: timePreset,
    //     };
    //   } else if (timePeriod) {
    //     var clientObj: MonitorupdownstatusPayload = {
    //       sp: timePeriod,
    //     };
    //   } else {
    //     var clientObj: MonitorupdownstatusPayload = {
    //       sp: me.sp,
    //     };
    //   }
    //   me.load(clientObj);
    // });

    me.syncGlobalTimebar();
  }

  ngAfterViewInit() {
    const me = this;
    me.schedulerService.subscribe('monitor-up-down-status', () => {
      me.syncGlobalTimebar();
    });
  }

  ngOnDestroy(): void {
    const me = this;

    me.schedulerService.unsubscribe('monitor-up-down-status');

    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
    }
  }

  load(clientObj: MonitorupdownstatusPayload) {
    const me = this;

    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
      me.subscriptions.timebarOnChange = null;
    }

    me.monitorupdownstatusService.load(clientObj).subscribe(
      (state: Store.State) => {
        if (state instanceof MonitorupdownstatusLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof MonitorupdownstatusLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: MonitorupdownstatusErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: MonitorupdownstatusLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MonitorupdownstatusErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.error.msg = 'Error while loading data.';
    me.loading = false;
  }

  private onLoaded(state: MonitorupdownstatusLoadedState) {
    const me = this;
    // me.syncGlobalTimebar();
    me.data = state.data;
    if (state.data && state.data.status)
      me.errorMessage = state.data.status.msg;
    me.error = null;
    me.loading = false;
    if (me.data) {
      me.cols = me.data.headers[0].cols;
      for (const c of me.data.headers[0].cols) {
        me.globalFilterFields.push(c.valueField);
        if (c.selected) {
          me._selectedColumns.push(c);
        }
      }
      me.totalRecords = me.data.data.length;
      if (me.data.data.length === 0) me.showPaginator = false;
      else me.showPaginator = true;
    }
  }

  @Input() get selectedColumns(): MonitorupdownstatusHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: MonitorupdownstatusHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  show() {
    super.show();
  }

  close() {
    super.hide();
  }

  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    });
  }

  onClickMenu(item) {
   // console.log('show item:' + item);
    this.selectedItem = item.toElement.innerText;
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

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  refreshData() {
    const me = this;
    me.data = null;
    me._selectedColumns = [];
    me.cols = null;
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      const clientObj: MonitorupdownstatusPayload = {
        sp: timePeriod,
      };
      me.load(clientObj);
    });
  }

  private syncGlobalTimebar() {
    const me = this;

    if (me.subscriptions.timebarOnChange) {
      me.subscriptions.timebarOnChange.unsubscribe();
      me.subscriptions.timebarOnChange = null;
    }

    me.first = 0;
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      me.MUDSTmpValue = value;

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
            let clientObj: MonitorupdownstatusPayload = {
              sp: timePeriod.id,
            };
            if (me.data && me.data.data) me.data.data = null;
            me._selectedColumns = [];
            me.cols = null;
            me.load(clientObj);
          }
        );
      }

      if (me.MUDSTmpValue) {
        const timebarValueInput: TimebarValueInput = {
          timePeriod: me.MUDSTmpValue.timePeriod.selected.id,
          viewBy: me.MUDSTmpValue.viewBy.selected.id,
          running: me.MUDSTmpValue.running,
          discontinued: me.MUDSTmpValue.discontinued,
        };

        me.timebarService
          .prepareValue(timebarValueInput, me.timebarService.getValue())
          .subscribe((value: TimebarValue) => {
            setTimeout(() => {
              me.timebarService.setValue(value);
            });
          });
      }
    });
  }

  showConfigureMonitor() {
    const me = this;
    me.router.navigate(['/configure-monitors']);
  }

  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.data;
    let header = ['S No.'];
    for (const c of me.data.headers[0].cols) header.push(c.label);
    try {
      me.monitorupdownstatusService
        .downloadShowDescReports(label, tableData, header)
        .subscribe(
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
      console.error(
        'Exception in downloadShowDescReports method in metric description component :',
        err
      );
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
    path = url + '/common/' + path;
    window.open(path + '#page=1&zoom=85', '_blank');
  }
  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  goBack() {
    const me = this;
    me.location.back();
  }
}
