import {
  Component,
  OnInit,
  PipeTransform,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_LOCALE,
  OWL_DATE_TIME_FORMATS,
} from 'ng-pick-datetime';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { MomentDateTimeAdapter } from '../date-time-picker-moment/moment-date-time-adapter';
import { PipeService } from '../pipes/pipe.service';
import {
  GlobalTimebarResponse,
  TimebarMenuConfig,
} from '../time-bar/service/time-bar.model';
import { TimebarService } from '../time-bar/service/time-bar.service';
import {
  GlobalTimebarLoadedState,
  GlobalTimebarLoadingErrorState,
  GlobalTimebarLoadingState,
  GlobalTimebarTimeLoadedState,
  GlobalTimebarTimeLoadingErrorState,
  GlobalTimebarTimeLoadingState,
} from '../time-bar/service/time-bar.state';

@Component({
  selector: 'app-ete-time-filter',
  templateUrl: './ete-time-filter.component.html',
  styleUrls: ['./ete-time-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    },
  ],
})
export class EteTimeFilterComponent implements OnInit {
  data: GlobalTimebarResponse;
  error: AppError;
  empty: boolean;
  loading: boolean;
  paused: boolean;

  timeLoading: boolean;
  timeError: AppError;

  isVisible: boolean = false;
  enableApply: boolean = false;

  type: 'PRESET' | 'CUSTOM' = 'PRESET';

  //TODO: Fetch From Global TimeBar
  viewBy: TimebarMenuConfig = {
    selected: null,
    previous: null,
    options: [],
  };

  customTimeFrame: moment.Moment[] = null;
  customTimeFrameMax: moment.Moment = null;

  temporaryTimeFrame: number[] = [];

  timePeriod: TimebarMenuConfig = {
    selected: null,
    previous: null,
    options: [],
  };

  onChange: Subject<EteTimeFilterComponent> = new Subject<EteTimeFilterComponent>();

  private timerOnTimeFilterChange: NodeJS.Timeout = null;
  private timerOnChange: NodeJS.Timeout = null;

  private urlTimePeriod: string = null;

  //View By
  private urlViewBy: string = null;

  private timers: { [key: string]: NodeJS.Timeout } = {
    timeFilterChange: null,
  };

  private static instance: EteTimeFilterComponent = null;
  private static instanceOutput: Subject<EteTimeFilterComponent> = null;

  constructor(
    private timebarService: TimebarService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private pipeSerivce: PipeService
  ) {
    EteTimeFilterComponent.instance = this;
    this.clearCustomTime();
  }

  static getInstance(): Observable<EteTimeFilterComponent> {
    const output =
      EteTimeFilterComponent.instanceOutput ||
      new Subject<EteTimeFilterComponent>();

    if (EteTimeFilterComponent.instance) {
      setTimeout(() => {
        output.next(EteTimeFilterComponent.instance);
        output.complete();
        EteTimeFilterComponent.instanceOutput = null;
      });
    } else {
      EteTimeFilterComponent.instanceOutput = output;
    }

    return output;
  }

  ngOnInit(): void {
    const me = this;
  }

  closeClick() {
    const me = this;
    this.isVisible = !this.isVisible;
  }

  ngAfterViewInit() {
    const me = this;
    setTimeout(() => {
      me.viewBy = {
        selected: { id: '600', label: '10 Min', url: '' },
        previous: null,
        options: [
          {
            id: 'S',
            label: 'Sec',
            items: [
              { id: '1', label: '1 Sec', url: '' },
              { id: '10', label: '10 Sec', url: '' },
            ],
          },
          {
            id: 'M',
            label: 'Min',
            items: [
              { id: '60', label: '1 Min', url: '' },
              { id: '600', label: '10 Min', url: '' },
            ],
          },
          {
            id: 'H',
            label: 'Hour',
            items: [{ id: '3600', label: '1 Hour', url: '' }],
          },
        ],
      };
    });

    me.load();
  }

  load() {
    const me = this;

    me.timebarService.pre().subscribe(
      (state: Store.State) => {
        if (state instanceof GlobalTimebarLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof GlobalTimebarLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: GlobalTimebarLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  init() {
    const me = this;

    me.route.params.pipe(first()).subscribe((params) => {
      if (params && params.tp) {
        me.urlTimePeriod = params.tp;
        me.urlViewBy = params.vb;
      }

      const tp: string = me.urlTimePeriod || me.data.selectedPreset;

      // Time Filter Init
      me.timePeriod.options = me.selectTimePeriodOptions(
        me.data.timePeriod,
        tp
      );

      setTimeout(() => {
        const customTime: number[] = me.timebarService.parseCustomTime(tp);
        if (customTime && customTime.length) {
          const formatter: PipeTransform = me.pipeSerivce.getFormatter(
            'format_date_time'
          );
          me.timePeriodSlected({
            id: tp,
            label: 'Custom Time',
            title:
              formatter.transform(customTime[0], 'default') +
              ' to ' +
              formatter.transform(customTime[1], 'default'),
          });
        }
	else{
          me.onTimeFilterChange(true);
        }
      });
    });
  }

  onCustomTimeChange() {
    const me = this;

    if (me.type !== 'CUSTOM') {
      return;
    }

    me.enableApply = false;

    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        const timePeriod = me.timebarService.getCustomTime(
          me.customTimeFrame[0].valueOf(),
          me.customTimeFrame[1].valueOf()
        );
        if (timePeriod) {
          me.enableApply = true;
        }
      }
    });
  }

  getTimePeriod(): string {
    const me = this;

    if (
      me.type === 'CUSTOM' &&
      me.customTimeFrame &&
      me.customTimeFrame.length === 2
    ) {
      return me.timebarService.getCustomTime(
        me.customTimeFrame[0].valueOf(),
        me.customTimeFrame[1].valueOf()
      );
    }

    if (me.type === 'PRESET') {
      return _.get(me, 'timePeriod.selected.id', null);
    }

    return null;
  }

  onTimeFilterClose() {
    const me = this;

    if (me.timePeriod && me.timePeriod.previous) {
      me.timePeriod.selected = me.timePeriod.previous;
    }
    if (me.viewBy && me.viewBy.selected) {
      me.viewBy.previous = me.viewBy.selected;
    }
  }

  openTimeFilter() {
    const me = this;
    me.isVisible = true;

    // me.type = 'PRESET';

    if (me.timePeriod && me.timePeriod.selected) {
      me.timePeriod.previous = me.timePeriod.selected;
    }
    if (me.viewBy && me.viewBy.selected) {
      me.viewBy.previous = me.viewBy.selected;
    }
  }

  tabChange(e) {
    const me = this;
    me.clearCustomTime();

    switch (e.index) {
      case 0:
        me.type = 'PRESET';
        me.enableApply = true;
        break;
      case 1:
        me.type = 'CUSTOM';

        const serverTime = moment(me.sessionService.time);
        me.customTimeFrame = [
          serverTime.clone().subtract(1, 'hour'),
          serverTime.clone(),
        ];
        me.customTimeFrameMax = serverTime.clone();

        me.enableApply = true;
        break;
    }
  }

  applyTimeFilter(): void {
    const me = this;
    if (me.enableApply) {
      me.timePeriod.previous = null;
      me.onChange.next(me);
      me.isVisible = false;
    }
  }

  triggerChange() {
    const me = this;

    if (me.timerOnChange) {
      clearTimeout(me.timerOnChange);
    }

    me.timerOnChange = setTimeout(() => {
      me.onChange.next(me);
    }, 400);
  }

  private onLoading(state: GlobalTimebarLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: GlobalTimebarLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: GlobalTimebarLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data;
    me.error = null;
    me.loading = false;

    if (!me.empty) {
      me.init();
      me.getInstanceCommit();
    }
  }

  private onTimeFilterChange(apply?: boolean) {
    const me = this;

    if (me.timers) {
      clearTimeout(me.timerOnTimeFilterChange);
    }

    me.timerOnTimeFilterChange = setTimeout(() => {
      me.timebarService
        .loadTime(_.get(me, 'timePeriod.selected.id'), null)
        .subscribe(
          (state: Store.State) => {
            if (state instanceof GlobalTimebarTimeLoadingState) {
              me.timeLoading = true;
              me.enableApply = false;
              me.temporaryTimeFrame = null;
              return;
            }

            if (state instanceof GlobalTimebarTimeLoadedState) {
              me.timeLoading = false;
              me.enableApply = true;
              me.temporaryTimeFrame = state.data;
              if (apply) {
                me.applyTimeFilter();
              }
              return;
            }
          },
          (state: GlobalTimebarTimeLoadingErrorState) => {
            me.timeError = state.error;
            me.timeLoading = false;
            me.enableApply = false;
            me.temporaryTimeFrame = null;
          }
        );
    }, 400);
  }

  private timePeriodSlected(menuItem: MenuItem, apply?: boolean) {
    const me = this;
    me.timePeriod.selected = menuItem;
    me.onTimeFilterChange(apply);
  }

  private selectTimePeriodOptions(
    items: MenuItem[],
    selected: string,
    apply?: boolean,
    onlySelection?: boolean
  ): MenuItem[] {
    const me = this;

    for (const item of items) {
      if (item.items) {
        item.items = me.selectTimePeriodOptions(item.items, selected, apply);
      } else {
        if (item.id === selected) {
          me.timePeriodSlected(item, apply);
        }

        if (!onlySelection) {
          item.command = (event: { originalEvent: Event; item: MenuItem }) => {
            me.timePeriodSlected(event.item);
          };
        }
      }
    }

    return items;
  }

  private clearCustomTime() {
    const me = this;

    me.customTimeFrame = [];
  }

  private getInstanceCommit() {
    const me = this;
    if (EteTimeFilterComponent.instanceOutput) {
      EteTimeFilterComponent.instanceOutput.next(me);
      EteTimeFilterComponent.instanceOutput.complete();
    }

    me.paused = false;
  }

  onIncludeDiscontinuousGraph() {
    const me = this;
  }
}
