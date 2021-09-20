import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { MenuItem } from 'primeng';
import { Observable, Subject, Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { MenuItemUtility } from '../../utility/menu-item';
import { StaticInstance } from '../../utility/static-instance';
import {
  GlobalTimebarResponse,
  TimebarTimeConfig,
  TimebarTimeFrameTimeConfig,
  TimebarValue,
  TimebarValueInput,
  AlertMarker,
} from './time-bar.model';
import {
  GlobalTimebarAlertLoadedState,
  GlobalTimebarAlertLoadingErrorState,
  GlobalTimebarAlertLoadingState,
  GlobalTimebarLoadedState,
  GlobalTimebarLoadingErrorState,
  GlobalTimebarLoadingState,
  GlobalTimebarTimeLoadedState,
  GlobalTimebarTimeLoadingErrorState,
  GlobalTimebarTimeLoadingState,
} from './time-bar.state';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { RequestUtility } from '../../utility/request';
import { hasValue, ObjectUtility } from '../../utility/object';
import { Measurement } from '../../compare-data/service/compare-data.model';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { PatternMatchingService } from '../../pattern-matching/service/pattern-matching.service';

@Injectable({
  providedIn: 'root',
})
export class TimebarService extends Store.AbstractService {
  private value: TimebarValue;
  defaultValue: TimebarValue;
  isTimeChangedFromGlobal: boolean = false;

  instance: StaticInstance<TimebarService> = new StaticInstance<TimebarService>();

  events: { [key: string]: Subject<any> } = {
    onChange: new Subject<void>(),
    onApply: new Subject<void>(),
  };

  private specifiedTimeSelectionRegex: RegExp = new RegExp('([0-9]+)', 'g');

  constructor(
    private sessionService: SessionService,
    private schedulerService: SchedulerService,
    private patternMatchService : PatternMatchingService
  ) {
    super();
    this.preInit();
  }
  timeBack: any;
  compareData: Measurement;
  timebck: boolean;
  baselineTime:Measurement;
  tmpValue: TimebarValue = null;
  compareTableData:Measurement[];
  loading1:boolean =false;
  alertDataLoading: boolean = false;
  originalPreCallData:any;
  getOriginalPreCallData(){
    return this.originalPreCallData;
  }
  setOriginalPreCallData(originalPreCallData:any){
  this.originalPreCallData =originalPreCallData;
  }
  getTimeBck() {
    let me = this;
    return me.timeBack;
  }
  setTimeBck(timeBack: any) {
    let me = this;
    me.timeBack = timeBack;
  }
  getTimeBckFlag() {
    let me = this;
    return me.timebck;
  }
  setTimeBckFlag(timebck: boolean) {
    let me = this;
    me.timebck = timebck;
  }
  getTimeBckDetail() {
    let me = this;
    return me.compareData;
  }
  setTimeBckDetail(compareData: Measurement) {
    let me = this;
    me.compareData = compareData;
  }

  getGlobalTimeBar(){
      let me =this;
      return me.tmpValue;
  }
  setGlobalTimeBar(tmpValue:TimebarValue){
    let me=this;
    me.tmpValue =tmpValue;
  }
  getBaselineTime(){
   return this.baselineTime;
  }
  setBaselineTime(baselineTime:Measurement){
   this.baselineTime =baselineTime;
  }
  getCompareTableData(){
    this.compareTableData;
  }
  setCompareTableData(compareTableData:Measurement[]){
    this.compareTableData=compareTableData;
  }
  getLoading(){
    return this.loading1;
  }
  setLoading(loading1:boolean){
   this.loading1=loading1;
  }

  preInit() {
    const me = this;

    me.pre().subscribe((state: Store.State) => {
      if (state instanceof GlobalTimebarLoadedState) {
        me.defaultValue = {
          timePeriod: {
            selected: null,
            previous: null,
            options: state.data.timePeriod,
          },

          viewBy: {
            selected: null,
            previous: null,
            options: state.data.viewBy,
          },

          time: null,

          running: _.get(me.sessionService.session, 'testRun.running', null),
          discontinued: null,
          includeCurrent: null,
        };

        me.instance.commitInstance(me);

        //done for auditlogs as we need preset list
        sessionStorage.setItem('timePresets', JSON.stringify(state.data));
      }
    });
  }


  getCustomTime(min: number, max: number): string {
    const me = this;

    if (me.isValidTimeFrame(min, max)) {
      return 'SPECIFIED_TIME_' + min + '_' + max;
    }

    return null;
  }

  isValidTimeFrame(min: number, max: number): boolean {
    const me = this;

    if (max < min || max > me.sessionService.time) {
      return false;
    }

    return true;
  }

  controlPrevious() {
    const me = this;
    const time: TimebarTimeConfig = _.get(me.value, 'time', null);

    if (time) {
      const diff = time.frameEnd.value - time.frameStart.value;
      const timePeriod = me.getCustomTime(
        time.frameStart.value - diff,
        time.frameStart.value
      );

      if (timePeriod) {
        me.prepareValue(
          {
            timePeriod: timePeriod,
            running: false,
          },
          me.getValue()
        ).subscribe((value: TimebarValue) => {
          me.setValue(value);
        });
      }
    }
  }

  controlPause() {
    const me = this;

    me.prepareValue(
      {
        running: false,
      },
      me.getValue()
    ).subscribe((value: TimebarValue) => {
      me.setValue(value);
      me.schedulerService.unsubscribe('global-timebar');
    });
  }

  controlStart() {
    const me = this;

    me.prepareValue(
      {
        running: true,
      },
      me.getValue()
    ).subscribe((value: TimebarValue) => {
      me.setValue(value);
    });
  }

  controlNext() {
    const me = this;
    const time: TimebarTimeConfig = _.get(me.value, 'time', null);

    if (time) {
      const diff = time.frameEnd.value - time.frameStart.value;

      const timePeriod = me.getCustomTime(
        time.frameEnd.value,
        time.frameEnd.value + diff
      );

      if (timePeriod) {
        me.prepareValue(
          {
            timePeriod: timePeriod,
            running: false,
          },
          me.getValue()
        ).subscribe((value: TimebarValue) => {
          me.setValue(value);
        });
      }
    }
  }

  prepareValue(
    input: TimebarValueInput,
    inputValue: TimebarValue
  ): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();

    const value: TimebarValue = JSON.parse(
      JSON.stringify(inputValue || me.defaultValue)
    );

    if (value) {
      if (hasValue(input.running)) {
        value.running = !!input.running;
        value.includeCurrent = !input.running;
      }

      if (hasValue(input.discontinued)) {
        value.discontinued = !!input.discontinued;
      }

      if (hasValue(input.includeCurrent)) {
        value.includeCurrent = !!input.includeCurrent;
      }

      me.setTimePeriodValue(input, value).subscribe((value: TimebarValue) => {
        setTimeout(() => {
          me.setViewByOptions(input, value).subscribe((value: TimebarValue) => {
            setTimeout(() => {
              me.setViewByValue(input, value).subscribe(
                (value: TimebarValue) => {
                  setTimeout(() => {
                    output.next(value);
                    output.complete();
                  });
                }
              );
            });
          });
        });
      });
    }

    return output;
  }

  getValue(): TimebarValue {

    if(this.isTimeChangedFromGlobal)
    return this.tmpValue;
    else
     return this.value;
  }

  setValue(value: TimebarValue) {
    const me = this;

    value.running = !!value.timePeriod.selected.state.online
      ? value.running
      : false;
    value.discontinued = !!value.timePeriod.selected.state.discontinued
      ? value.discontinued
      : false;
    value.includeCurrent = !!value.timePeriod.selected.state.incCurrData
      ? value.includeCurrent
      : false;

    me.value = value;

    if (me.value.running) {
      me.schedulerService.subscribe('global-timebar', () => {
        me.prepareValue({ updateTime: true }, me.value).subscribe(
          (value: TimebarValue) => {
              if(value.timePeriod.selected.id.startsWith("LIVE")){
                me.tmpValue.time = me.value.time;
              }
            me.setValue(value);
          }
        );
      });
    } else {
      me.schedulerService.unsubscribe('global-timebar');
    }

    setTimeout(() => {
      me.events.onChange.next();
    });
  }

  parseCustomTime(str: string): number[] {
    const me = this;
    if (me.isCustomTime(str)) {
      const timeStr: string[] = str.match(me.specifiedTimeSelectionRegex);

      if (timeStr.length) {
        return [Number(timeStr[0]), Number(timeStr[1])];
      }
    }
    return null;
  }

  public getTimeConfig(str: string): TimebarTimeConfig {
    const me = this;

    const timeArr: number[] = me.parseCustomTime(str);

    if (timeArr && timeArr.length) {
      const startNum: number = timeArr[0];
      const endNum: number = timeArr[1];
      if (
        startNum &&
        endNum &&
        !isNaN(startNum) &&
        !isNaN(endNum) &&
        endNum > startNum
      ) {
        const start = moment(startNum);
        const end = moment(endNum);

        if (start.isValid() && end.isValid()) {
          const diff: number = endNum - startNum;

          const maxMin = startNum - diff * 4;
          const maxMax = endNum + diff * 4;

          const currentMin = _.get(me.value, 'time.min.value', maxMin);
          const currentMax = _.get(me.value, 'time.max.value', maxMax);

          let min: number = currentMin; //startNum < currentMin ? currentMin - diff : currentMin;
          let max: number = currentMax; // endNum > currentMax ? endNum : currentMax;

          if (min > startNum) {
            min = startNum;
          }

          if (max < endNum) {
            max = endNum;
          }

          if (max > maxMax) {
            max = maxMax;
          }

          if (min < maxMin) {
            min = maxMin;
          }

          return {
            min: {
              raw: null,
              value: min,
            },
            max: {
              raw: null,
              value: max,
            },
            frameStart: {
              raw: null,
              value: startNum,
            },
            frameEnd: {
              raw: null,
              value: endNum,
            },
          };
        } else {
          me.logger.error('Invalid Specified Time');
        }
      }
    }

    return null;
  }

  private populateFormatedTime(time: TimebarTimeConfig) {
    for (const key in time) {
      if (time.hasOwnProperty(key)) {
        const d: TimebarTimeFrameTimeConfig = time[key];
        const dMoment = moment(d.value);
        d.raw = dMoment.format(environment.formats.dateTime.default);
      }
    }
  }

  isCustomTime(tp: string): boolean {
    return tp.startsWith('SPECIFIED_TIME_');
  }

  private setTimePeriodValue(
    input: TimebarValueInput,
    value: TimebarValue
  ): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    let timeChanged: boolean = false;

    if (input.timePeriod) {
      value.timePeriod.previous = ObjectUtility.duplicate(
        value.timePeriod.selected
      );

      if (me.isCustomTime(input.timePeriod)) {
        value.timePeriod.selected = {
          id: input.timePeriod,
          label: 'Custom Time',
          state: {
            online: false,
            discontinued: true,
            incCurrData: false,
          },
        };

        value.time = me.getTimeConfig(input.timePeriod);
        setTimeout(() => {
          output.next(value);
          output.complete();
        });
        return output;
      } else {
        value.timePeriod.selected = MenuItemUtility.searchById(
          input.timePeriod,
          value.timePeriod.options
        );
      }

      timeChanged = true;
    }
   if(this.patternMatchService.matchPatternFlag){
    value= this.tmpValue;
   }
    if (value.timePeriod.selected) {
      if (me.isCustomTime(value.timePeriod.selected.id)) {
        value.time = me.getTimeConfig(value.timePeriod.selected.id);
        setTimeout(() => {
          output.next(value);
          output.complete();
        });
      } else if (timeChanged || input.updateTime) {
        me.loadTime(value.timePeriod.selected.id).subscribe(
          (state: Store.State) => {
            if (state instanceof GlobalTimebarTimeLoadedState) {
              value.time = {
                min: {
                  raw: null,
                  value: state.data[0],
                },
                max: {
                  raw: null,
                  value: state.data[2],
                },
                frameStart: {
                  raw: null,
                  value: state.data[1],
                },
                frameEnd: {
                  raw: null,
                  value: state.data[2],
                },
              };

              setTimeout(() => {
                output.next(value);
              });
            }
          },
          () => {
            setTimeout(() => {
              me.logger.error(
                'Invalid TimePeriod <' + input.timePeriod + '> @1'
              );
              output.next(value);
            });
          }
        );
      } else {
        setTimeout(() => {
          output.next(value);
          output.complete();
        });
      }
    } else {
      setTimeout(() => {
        me.logger.error('Invalid TimePeriod <' + input.timePeriod + '> @2');
        output.next(value);
      });
    }

    return output;
  }

  public setViewByOptions(
    input: TimebarValueInput,
    value: TimebarValue
  ): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();

    const start: number = _.get(value, 'time.frameStart.value', null);
    const end: number = _.get(value, 'time.frameEnd.value', null);

    if (start && end) {
      const diff = (end - start) / 1000; // Convert to seconds
      const viewByAllOptions = JSON.parse(
        JSON.stringify(me.defaultValue.viewBy.options)
      );
      // Filter view by items if applicable
      value.viewBy.options = MenuItemUtility.filterWithParent(
        (item: MenuItem) => {
          const seconds: number =
            item && item.id && item.id.length ? Number(item.id) : null;
          if ((seconds == 1 || seconds == 10) && diff > 86400) {
            return false; //Exclude sec option for more than 1 day
          } else if (seconds !== null && seconds < diff) {
            return true;
          }

          /* if (seconds && (seconds < diff || seconds <= Number(input.viewBy)) ) {
           return true;
         } */
          return false;
        },
        viewByAllOptions
      );

      setTimeout(() => {
        output.next(value);
        output.complete();
      });
    } else {
      setTimeout(() => {
        me.logger.error('Invalid Time for View By Option Calculation');
        output.next(value);
        output.complete();
      });
    }

    return output;
  }

  public setViewByValue(
    input: TimebarValueInput,
    value: TimebarValue
  ): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();

    if (value.viewBy && value.viewBy.options && value.viewBy.options.length) {
      let selected: MenuItem = value.viewBy.selected;

      if (selected && selected.id) {
        selected = MenuItemUtility.searchById(
          selected.id,
          value.viewBy.options
        );
      }

      if (input.viewBy === null) {
        selected = null;
      }

      if (input.viewBy) {
        value.viewBy.previous = value.viewBy.selected;
        selected = MenuItemUtility.searchById(
          input.viewBy,
          value.viewBy.options
        );
      }

      if (!selected) {
        const defaultValue: string = _.get(
          value,
          'timePeriod.selected.state.svb',
          null
        );
        selected = defaultValue
          ? MenuItemUtility.searchById(defaultValue, value.viewBy.options)
          : null;
      }

      if (!selected) {
        console.log(
          'do not remove checking one rare bug',
          input.viewBy,
          new Error()
        );
        selected = _.get(value, 'viewBy.options[0].items[0]', null); // Select first by default
      }

      value.viewBy.selected = selected;

      setTimeout(() => {
        output.next(value);
        output.complete();
      });
    } else {
      setTimeout(() => {
        me.logger.error('Invalid View By Options');
        output.next(value);
        output.complete();
      });
    }

    return output;
  }

  pre(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new GlobalTimebarLoadingState());
    }, 0);

    const path = environment.api.globalTimebar.load.endpoint;

    const payload = {
      pk: me.sessionService.session.cctx.pk,
      u: me.sessionService.session.cctx.u}
    me.controller.get(path,payload).subscribe(
      (data: GlobalTimebarResponse) => {
        this.setOriginalPreCallData(data);
        output.next(new GlobalTimebarLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new GlobalTimebarLoadingErrorState(e));
        output.complete();

        me.logger.error('GlobalTimebar Loading failed', e);
      }
    );

    return output;
  }

  private parseAlertMarkers(rawMarkers: any[]): AlertMarker[] {
    const markers: AlertMarker[] = [];
    for (const rawMarker of rawMarkers) {
      markers.push({
        label: rawMarker.label,
        value: rawMarker.timeStamp,
        position: null,
      });
    }

    return markers;
  }

  loadAlert(start: number, end: number) {
    const me = this;
    const output = new Subject<Store.State>();
    if(me.alertDataLoading){
      return output;
    }

    me.alertDataLoading = !me.alertDataLoading;


    setTimeout(() => {

      output.next(new GlobalTimebarAlertLoadingState());
    }, 0);

    const path = environment.api.globalTimebar.alert.endpoint;

    if (me.sessionService.session && start && end && end > start) {
      const payload = {
        st: start,
        et: end,
        tr: me.sessionService.testRun.id,
      };

      //RequestUtility.closeRequest(payload, path);

      const subscription: Subscription = me.controller
        .get(path, payload)
        .subscribe(
          (data: any[]) => {
            output.next(
              new GlobalTimebarAlertLoadedState(me.parseAlertMarkers(data))
            );

            output.complete();
            me.alertDataLoading = !me.alertDataLoading;
          },
          (e: any) => {
            output.error(new GlobalTimebarAlertLoadingErrorState(e));
            output.complete();
            me.alertDataLoading = !me.alertDataLoading;
            me.logger.error('GlobalTimebar Alert Loading failed', e);
          }
        );

     //RequestUtility.openRequest(payload, path, subscription);
    }

    return output;
  }

  loadTime(timePeriod: string, viewBy?: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      //me.loading1 =true;
      output.next(new GlobalTimebarTimeLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new GlobalTimebarTimeLoadedState());
    // }, 2000);

    const path = environment.api.globalTimebar.time.endpoint;
    const session = me.sessionService.session;

    if (session) {
      let payload = null;
      if (me.getTimeBckFlag()) {
        payload = {
          cck: session.cctx.cck,
          tr: me.sessionService.testRun.id,
          pk: session.cctx.pk,
          u: session.cctx.u,
          timeBack: me.getTimeBck(),
          pStart: me.getTimeBckDetail().start,
          pEnd: me.getTimeBckDetail().end,

          // svb: viewBy,
          sp: timePeriod,
        };
      } else {
        if(timePeriod.startsWith("TB")){
          timePeriod = this.baselineTime.preset;
        }
        let runningFlag: boolean = false;
        if(me.tmpValue)
           runningFlag = me.tmpValue.running;


        payload = {
          cck: session.cctx.cck,
          tr: me.sessionService.testRun.id,
          pk: session.cctx.pk,
          u: session.cctx.u,
          // svb: viewBy,
          sp: timePeriod,
          running:runningFlag
        };
      }

      me.controller.get(path, payload).subscribe(
        (data: number[]) => {
          output.next(new GlobalTimebarTimeLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new GlobalTimebarTimeLoadingErrorState(e));
          output.complete();

          me.logger.error('GlobalTimebar Time Loading failed', e);
        }
      );
    }

    return output;
  }

}
