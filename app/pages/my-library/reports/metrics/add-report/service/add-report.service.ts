import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { StaticInstance } from 'src/app/shared/utility/static-instance';
import {
  GlobalTimebarResponse,
  TimebarTimeConfig,
  TimebarTimeFrameTimeConfig,
  TimebarValue,
  TimebarValueInput,
  AlertMarker,
  Measurement,
} from './add-report.model';
import {
  ReportTimebarLoadingState,
  ReportTimebarLoadedState,
  ReportTimebarLoadingErrorState,
  ReportTimebarTimeLoadingState,
  ReportTimebarTimeLoadedState,
  ReportTimebarTimeLoadingErrorState,
  ReportTemplateListLoadedState,
  ReportTemplateListLoadingErrorState,
  ReportTemplateListLoadingState,
  GenerateReportLoadedState,
  GenerateReportLoadingErrorState,
  GenerateReportLoadingState,
  TransactionErrorCodeLoadingState,
  TransactionErrorCodeLoadingErrorState,
  TransactionErrorCodeLoadedState,
  AddReportGroupLoadingState,
  AddReportGroupLoadedState,
  AddReportGroupLoadingErrorState,
  getMetricServiceLoading,
  getMetricServiceLoaded,
  getMetricServiceLoadingError,
  getChartAndReportDataLoaded,
  getChartAndReportDataError,
  createChartAndReportLoaded,
  createChartAndReportError,
  getChartAndReportDataLoading,
  createChartAndReportLoading,
  ThresholdTemplateListLoadingState,
  ThresholdTemplateListLoadedState,
  ThresholdTemplateListLoadingErrorState
} from './add-report.state';
import * as _ from 'lodash';
import { hasValue, ObjectUtility } from 'src/app/shared/utility/object';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { MenuItem } from 'primeng';
import { MetricsService } from '../../service/metrics.service';
import { DeleteTemplateLoadingState, DeleteTemplateLoadedState, DeleteTemplateLoadingErrorState} from '../../../../reports/template/service/template.state';
import { DeleteTemplate} from '../../../template/service/template.model';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddReportService extends Store.AbstractService {

  private value: TimebarValue;
  defaultValue: TimebarValue;

  instance: StaticInstance<AddReportService> = new StaticInstance<AddReportService>();
   
  events: { [key: string]: Subject<any> } = {
    onChange: new Subject<void>(),
    onApply: new Subject<void>(),
  };

  private specifiedTimeSelectionRegex: RegExp = new RegExp('([0-9]+)', 'g');
  private timerEventProvider = new Subject<number>();
  private timerObservable =  this.timerEventProvider.asObservable();

  constructor(
    private sessionService: SessionService,
    private schedulerService: SchedulerService,
    private metricsService: MetricsService
  ) {
    super();
    // this.preInit();
    let timer$ = timer(0,1000);
    const subscribe = timer$.subscribe(t => this.timerEventProvider.next(t));
  }
  timeBack: any;
  compareData: Measurement;
  timebck: boolean;
  tmpValue: TimebarValue = null;
  presetTimeDate: any;
  presetTime: any;
  isHeirarchical = false;
  isMultiLayot = false;
  isCompareReport = false;
  checkIncludeChart = true;
  ischeckTrendCompare = false;
  templateListData:any;
  srtTimeZero: any;
  getTimerSubscription() {
    return this.timerObservable;
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

  preInit() {
    const me = this;

    me.pre().subscribe((state: Store.State) => {
      if (state instanceof ReportTimebarLoadedState) {
        me.defaultValue = {
          timePeriod: {
            selected: state.data.timePeriod.selected,
            previous: state.data.timePeriod.selected,
            options: state.data.timePeriod.options,
          },

          viewBy: {
            selected: state.data.viewBy.selected,
            previous: state.data.viewBy.previous,
            options: state.data.viewBy.options,
          },

          time: state.data.time,

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
            if (state instanceof ReportTimebarTimeLoadedState) {
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

  private setViewByOptions(
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
          } else if (seconds && seconds < diff) {
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

  private setViewByValue(
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
      output.next(new ReportTimebarLoadingState());
    }, 0);

    const path = environment.api.globalTimebar.load.endpoint;
    const payload = {
      pk: me.sessionService.session.cctx.pk,
      u: me.sessionService.session.cctx.u
    }
    me.controller.get(path, payload).subscribe(
      (data: GlobalTimebarResponse) => {
        console.log("Preset time Pre() response", data);
        
        let dataPreset = me.parsePresetTime(data);
        me.defaultValue = dataPreset;
        me.presetTimeDate = data;
        output.next(new ReportTimebarLoadedState(dataPreset));
        output.complete();
      },
      (e: any) => {
        output.error(new ReportTimebarLoadingErrorState(e));
        output.complete();

        me.logger.error('ReportTimebar Loading failed', e);
      }
    );

    return output;
  }

  parsePresetTime(dataPreset){
    
    let selectedPreset = MenuItemUtility.searchById(
      dataPreset.selectedPreset,
      dataPreset.timePeriod[0].items
    );
    let selectedViewBy = MenuItemUtility.searchById(
      dataPreset.viewBy[1].items[1].id,
      dataPreset.viewBy[1].items
    );

    if (selectedPreset) {
      selectedPreset = selectedPreset;
    }
    else {
      selectedPreset = dataPreset.timePeriod[1].items[5];
    }

    if (selectedViewBy) {
      selectedViewBy = selectedViewBy;
    }
    else {
      selectedViewBy = dataPreset.viewBy[1].items[0];
    }

    let presetTimePeriod : TimebarValue = {
      running: dataPreset.running,
      discontinued: false,
      includeCurrent: false,
      time : {
        min: {
          raw: null,
          value: dataPreset.times[0]
        },
        max: {
          raw: null,
          value: dataPreset.times[2]
        },
        frameStart: {
          raw: null,
          value: dataPreset.times[1]
        },
        frameEnd: {
          raw: null,
          value: dataPreset.times[2]
        }
      },
      timePeriod: {
        selected: selectedPreset,
        previous: selectedPreset,
        options: dataPreset.timePeriod
      },
      viewBy: {
        selected: selectedViewBy,
        previous: selectedViewBy,
        options: dataPreset.viewBy
      }
    }
    return presetTimePeriod;
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

  // loadAlert(start: number, end: number) {
  //   const me = this;
  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new GlobalTimebarAlertLoadingState());
  //   }, 0);

  //   const path = environment.api.globalTimebar.alert.endpoint;

  //   if (me.sessionService.session && start && end && end > start) {
  //     const payload = {
  //       st: start,
  //       et: end,
  //       tr: me.sessionService.testRun.id,
  //     };

  //     RequestUtility.closeRequest(payload, path);

  //     const subscription: Subscription = me.controller
  //       .get(path, payload)
  //       .subscribe(
  //         (data: any[]) => {
  //           output.next(
  //             new GlobalTimebarAlertLoadedState(me.parseAlertMarkers(data))
  //           );
  //           output.complete();
  //         },
  //         (e: any) => {
  //           output.error(new GlobalTimebarAlertLoadingErrorState(e));
  //           output.complete();

  //           me.logger.error('GlobalTimebar Alert Loading failed', e);
  //         }
  //       );

  //     RequestUtility.openRequest(payload, path, subscription);
  //   }

  //   return output;
  // }

  loadTime(timePeriod: string, viewBy?: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ReportTimebarTimeLoadingState());
    }, 0);

    // setTimeout(() => {
    //   output.next(new GlobalTimebarTimeLoadedState());
    // }, 2000);

    const path = environment.api.globalTimebar.time.endpoint;
    const session = me.sessionService.session;

    if (session) {
      let payload = {
          cck: session.cctx.cck,
          tr: me.sessionService.testRun.id,
          pk: session.cctx.pk,
          u: session.cctx.u,
          // svb: viewBy,
          sp: timePeriod,
        };
      
      me.controller.get(path, payload).subscribe(
        (data: number[]) => {
          output.next(new ReportTimebarTimeLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ReportTimebarTimeLoadingErrorState(e));
          output.complete();

          me.logger.error('ReportTimebar Time Loading failed', e);
        }
      );
    }

    return output;
  }

  getThresholdTemplate(extrePath): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new ReportTemplateListLoadingState());
    }, 0);

    const path = environment.api.report.getTemplateFavList.endpoint;
    const session = me.sessionService.session;
    
    if (session) {
      let payload = "" ;
      
      
      me.controller.post(path, payload).subscribe(
        (data :any) => {
          output.next(new ReportTemplateListLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ReportTemplateListLoadingErrorState(e));
          output.complete();

          me.logger.error('Report template List Loading failed', e);
        }
      );
    }

    return output;
  }

  listAllTemplate(reportTypeObj): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new ReportTemplateListLoadingState());
    }, 0);

    const path = environment.api.report.getTemplateFavList.endpoint;
    const session = me.sessionService.session;
    
    if (session) {
      let payload = {
        cctx: me.sessionService.session.cctx,
        tR: parseInt(me.sessionService.session.testRun.id),
        rT: reportTypeObj.rT,
        mO: reportTypeObj.mO
      };
      
      me.controller.post(path, payload).subscribe(
        (data :any) => {
          output.next(new ReportTemplateListLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ReportTemplateListLoadingErrorState(e));
          output.complete();

          me.logger.error('Report template List Loading failed', e);
        }
      );
    }

    return output;
  }

  listThresholdTemplate(reportTypeObj): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new ThresholdTemplateListLoadingState());
    }, 0);

    const path = environment.api.report.getTemplateFavList.endpoint;
    const session = me.sessionService.session;
    
    if (session) {
      let payload = {
        cctx: me.sessionService.session.cctx,
        tR: parseInt(me.sessionService.session.testRun.id),
        rT: reportTypeObj.rT,
        mO: reportTypeObj.mO
      };
      
      me.controller.post(path, payload).subscribe(
        (data :any) => {
          output.next(new ThresholdTemplateListLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new ThresholdTemplateListLoadingErrorState(e));
          output.complete();

          me.logger.error('Report template List Loading failed', e);
        }
      );
    }

    return output;

  }

  generateReport(reportObjPayload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new GenerateReportLoadingState());
    }, 0);

    const path = environment.api.report.generateReport.endpoint;
    const session = me.sessionService.session;
    
    if (session) {  
      me.controller.post(path, reportObjPayload).subscribe(
        (data :any) => {
          console.log("report generation :",data);
          // this.metricsService.reportListData.date.push()
          output.next(new GenerateReportLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new GenerateReportLoadingErrorState(e));
          output.complete();

          me.logger.error('Report template List Loading failed', e);
        }
      );
    }

    return output;
  }


  getMetricService(metricsPayload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new getMetricServiceLoading());
    }, 0);

    const path = environment.api.report.getMetricSource.endpoint;
    const session = me.sessionService.session;
    if (session) {
    me.controller.post(path,metricsPayload).subscribe(
      (data: any) => {
        output.next(new getMetricServiceLoaded(data));
        output.complete();
      },
      (e: any) => {
        output.error(new getMetricServiceLoadingError(e));
        output.complete();
          me.logger.error('Rule Data loading failed', e);
      }
    );
    }
    return output;
  }

  getTransactionErrorList(): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new TransactionErrorCodeLoadingState());
    }, 0);

    const path = environment.api.report.transactionCodeList.endpoint+
    '?testRun='+this.sessionService.session.testRun.id+
    '&productKey=' +this.sessionService.session.cctx.pk;
    const session = me.sessionService.session;
    if(session){  
      me.controller.get(path,null,'/DashboardServer/web').subscribe(
        (data :any) => {
          console.log("report transaction error code :",data);
          // this.metricsService.reportListData.date.push()
          output.next(new TransactionErrorCodeLoadedState(data));
          output.complete();
        },
        (e: any) => {
          output.error(new TransactionErrorCodeLoadingErrorState (e));
          output.complete();

          me.logger.error('report transaction error code List Loading failed', e);
        }
      );
    }

    return output;
  }

  groupDataList(payload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new AddReportGroupLoadingState());
    }, 0);
    const path = environment.api.report.group.endpoint;
    console.log("Path----------",path);
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        console.log("GroupData------------",data);
        output.next(new AddReportGroupLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new AddReportGroupLoadingErrorState(e));
        output.complete();
  
        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }
  deleteTemplateList(tempInfoList): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new DeleteTemplateLoadingState());
    }, 0);
    const path = environment.api.report.deleteTemplate.endpoint;
    const base = environment.api.core.defaultBase;
    const payload = {
      cctx: me.sessionService.session.cctx,
      temInfo: tempInfoList,
    };
    me.controller.post(path, payload).subscribe(
      (data: DeleteTemplate[]) => {
        output.next(new DeleteTemplateLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new DeleteTemplateLoadingErrorState(e));
        output.complete();
        me.logger.error('loading failed', e);
      }
    );
    return output;
  }

  getChartAndReportData(payload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new getChartAndReportDataLoading());
    }, 0);

    const path = environment.api.report.getChartAndReportData.endpoint;
    const session = me.sessionService.session;
    
    if (session) {  
      me.controller.post(path, payload).subscribe(
        (data :any) => {
          console.log("result of getChartAndReportData :",data);
          output.next(new getChartAndReportDataLoaded(data));
          output.complete();
        },
        (e: any) => {
          output.error(new getChartAndReportDataError(e));
          output.complete();
          me.logger.error('getChartAndReportData failed', e);
        }
      );
    }
    return output;
  }

  createChartAndReport(payload): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
      output.next(new createChartAndReportLoading());
    }, 0);

    const path = environment.api.report.createChartAndReport.endpoint;
    const session = me.sessionService.session;
    
    if (session) {  
      me.controller.post(path, payload).subscribe(
        (data :any) => {
          console.log("result of createChartAndReport :",data);
          output.next(new createChartAndReportLoaded(data));
          output.complete();
        },
        (e: any) => {
          output.error(new createChartAndReportError(e));
          output.complete();
          me.logger.error('createChartAndReport failed', e);
        }
      );
    }

    return output;
  }

}

