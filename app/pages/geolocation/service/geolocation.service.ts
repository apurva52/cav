import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { GEOLOCATION_DATA } from './geolocation.dummy';
import { Duration, GeolocationData, StoreViewMapData } from './geolocation.model';
import { PayLoadData } from './geolocation.model';
import {
  GeolocationDataLoadedState,
  GeolocationDataLoadingErrorState,
  GeolocationDataLoadingState,
} from './geolocation.state';
import { TimebarService } from '../../../shared/time-bar/service/time-bar.service';
import * as _ from 'lodash';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { AppError } from 'src/app/core/error/error.model';
@Injectable({
  providedIn: 'root',
})
export class GeolocationService extends Store.AbstractService {
  payLoadData: PayLoadData;
  selectedGeoApp: any = 'All';
  selectedStoreName: any;
  storeViewData: StoreViewMapData;
  tp: any;
  st: any;
  et: any;
  duration: Duration;

  private readonly autoUpdateTimeInMs: number = 60000;

  constructor(private sessionService: SessionService, private timebarService: TimebarService) {
    super();
    this.payLoadData = new PayLoadData();
    const me = this;
  }

    //For selectedGeoApp 
    public set $selectedGeoApp(value: any) {
      this.selectedGeoApp = value;
    }
    public get $selectedGeoApp() {
      return this.selectedGeoApp;
    }
  
    //For selectedStoreName 
    public set $selectedStoreName(value: any) {
      this.selectedStoreName = value;
    }
    public get $selectedStoreName() {
      return this.selectedStoreName;
    }

    public setStoreViewData(value: any) {
      this.storeViewData = value;
    }
    public getStoreViewData() {
      return this.storeViewData;
    }

    //For time period
    public set $tp(value: any) {
      this.tp = value;
    }
    public get $tp() {
      return this.tp;
    }

    //For time period
    public set $st(value: any) {
      this.st = value;
    }
    public get $st() {
      return this.st;
    }

    //For time period
    public set $et(value: any) {
      this.et = value;
    }
    public get $et() {
      return this.et;
    }

  load(selectedApplication, durationObj): Observable<Store.State> {
    const me = this;
    // me.timebarService.instance.getInstance().subscribe(() => {
    //   const value = me.timebarService.getValue();
    //   const timePeriod = _.get(value, 'timePeriod.selected.id', null);
    //   const viewBy = _.get (value,'viewBy.selected.id', null)
    //   console.log('timePeriod====>',timePeriod)
    //   console.log('viewBy====>',viewBy)
    //   console.log('value==>', value)

    // });
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new GeolocationDataLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    //   output.next(new GeolocationDataLoadedState(GEOLOCATION_DATA));
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new GeolocationDataLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    const path = environment.api.geoLocation.load.endpoint;
    const payload = {
      // localDataCtx: me.payLoadData.localDataCtx,
      cctx: me.sessionService.session.cctx,
      dataFilter : me.payLoadData.dataFilter,
      duration: durationObj,
      dc: me.payLoadData.dc,
      appName: selectedApplication,   //Need to configure from selected App
      isAll: me.payLoadData.isAll,
      multiDc: me.payLoadData.multiDc,
      opType: me.payLoadData.opType,
      storeAlertType: me.payLoadData.storeAlertType,
      tr: me.sessionService.testRun.id,
    };
    me.controller.post(path, payload).subscribe(
      (data: GeolocationData) => {
        output.next(new GeolocationDataLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new GeolocationDataLoadingErrorState(e));
        output.complete();

        me.logger.error('Geolocation Data loading failed', e);
      }
    );

    return output;
  }

  public createDuration(startTime: number, endTime: number, preset: string, viewBy: number): Duration {
    return {st: startTime, et: endTime, preset: preset, viewBy: viewBy}
  }

  public setDuration(duration: Duration) {
    this.duration = duration;
  }

  public getDuration(): Duration {
    return this.duration;
  }

  public getAutoUpdateTimeInMs(): number {
    return this.autoUpdateTimeInMs;
  }
  downloadShowDescReports(downloadType, rowData, header, colWidth): Observable<Store.State> {
    try {
    const me = this;
    const output = new Subject<Store.State>();
    
    setTimeout(() => {
    output.next(new DownloadReportLoadingState());
    }, 3000);
    
    let skipColumn = "";
    let downloadDataPayload = {};
    
    downloadDataPayload = {
    "testRun": me.sessionService.testRun.id,
    "cctx": me.sessionService.session.cctx,
    "type": downloadType,
    "skipColumn": skipColumn,
    "rowData": rowData,
    "header": header,
    "title": "GEO-LOCATION",
    "colWidth": colWidth
    }
    
    let downloadPath = environment.api.downloadData.load.endpoint;
    me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadReportData: any) => {
    output.next(new DownloadReportLoadedState(DownloadReportData));
    output.complete();
    },
    (error: AppError) => {
    output.next(new DownloadReportLoadingErrorState(error));
    output.complete();
    }
    );
    return output;
    } catch (err) {
    console.error("Exception has occured while Downloading Report for Show Description", err);
    }
    }
}
