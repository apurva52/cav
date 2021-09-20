import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class TabNavigatorService {

  constructor() { }

  /*
  *set a run command graph properties 
  */
  xAxisFieldName = '';
  yAxisFieldName = '';
  basisFieldName = '';
  graphData: any;

  /**Graph Properties which need to send in json */
  xAxisIndex = 0;
  yAxisIndex = 0;
  graphIndex = 0;
  showTotal = false;
  seprator = "Tab";

  /*Observable string sources.*/
  private tabNavMenuService = new Subject<Object>();

  /*Observable string sources.*/
  private removeTabMenuService = new Subject<string>();

  /*Observable command Data */
  private cmdJsonDataService = new Subject<Object>();


  /*Observable TimeZone*/
  private timeZoneInfo = new Subject<Object>();


  /*Service message commands.*/
  navigateTabAction(value: Object) {

    /*Observable string streams.*/
    this.tabNavMenuService.next(value);
  }

  setTimeZoneInfo(value: Object) {
    this.timeZoneInfo.next(value);
  }

  pushCmdJsonDataInTableJson(value: Object) {
    this.cmdJsonDataService.next(value);
  }

  /*Service message commands.*/
  removeTabAction(value: string) {

    /*Observable string streams.*/
    this.removeTabMenuService.next(value);
  }

  /*Service Observable for getting Menu Toggle Action.*/
  navigateTabProvider$ = this.tabNavMenuService.asObservable();

  /*Service Observable for getting Menu Toggle Action.*/
  removeTabProvider$ = this.removeTabMenuService.asObservable();

  /** Service Observable for getting data from Add Command Gui*/
  pushCmdJsonDataInTableJsonProvider$ = this.cmdJsonDataService.asObservable();

  timeZoneInfoProvider$ = this.timeZoneInfo.asObservable();
}
