import { Injectable } from '@angular/core';

import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { ActivatedRoute } from '@angular/router';
import { MetricsLoadingState, MetricsLoadingErrorState, MetricsLoadedState } from './metrics-settings.state'
import { MetricsTable } from './metrics-settings.model';
import { DashboardWidgetLoadingErrorState, DashboardWidgetLoadedState, DashboardWidgetLoadingState } from '../../dashboard/service/dashboard.state';
import { MFrequencyTsDetails } from '../../derived-metric/service/derived-metric.model';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardServiceInterceptor } from '../../dashboard/service/dashboard.service.interceptor';
import { DashboardWidgetLoadRes } from '../../dashboard/service/dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class MetricsSettingsService extends Store.AbstractService {
  stateID: string;
  /*Group id of selected node*/
  groupId: string;
  groupName: string;
  /*Meta data of hirarchy*/
  metaDataInfo: any;
  private graphId: any[] = [];
  private graphName: any;
  public interceptor: DashboardServiceInterceptor;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) {
    super();
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    });
  }
  /**---------------------------------DevCode-------------------------------------------------------------*/
  public setMetaDataInfo(metaDataInfo) {
    this.metaDataInfo = metaDataInfo;
  }

  public getMetaDataInfo() {
    return this.metaDataInfo;
  }

  public setGroupId(groupId) {
    this.groupId = groupId;
  }

  public getGroupId() {
    return this.groupId;
  }
  public setGroupName(groupName) {
    this.groupName = groupName;
  }

  public getGroupName() {
    return this.groupName;
  }

  public getGraphName() {
    return this.graphName;
  }

  public setGraphName(graphName) {
    this.graphName = graphName;
  }
  public getGraphId() {
    return this.graphId;
  }

  public setGraphId(graphId) {
    this.graphId = graphId;
  }


  loadMetricSetting(metricsSettingPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new MetricsLoadingState());
    }, 0);

    const metaDatapath = environment.api.dashboard.metaData.endpoint;
    me.controller.post(metaDatapath, metricsSettingPayload).subscribe(
      (data: MetricsTable) => {
        output.next(new MetricsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new MetricsLoadingErrorState(e));
        output.complete();

        me.logger.error('Hierarchicalpath Data loading failed', e);
      }
    );
    return output;
  }

  loadMetricData(payload){
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new DashboardWidgetLoadingState());
    }, 0);

    let path = environment.api.dashboardWidget.load.endpoint;
    path += '?r=' + new Date().valueOf() + '&pn=' + payload.widget.widgetIndex;
    
    me.controller.post(path, payload).subscribe((data: DashboardWidgetLoadRes) => {
      output.next(new DashboardWidgetLoadedState(data));
      output.complete();
    }
      ,
      (e: any) => {
        output.error(new DashboardWidgetLoadingErrorState(e));
        output.complete();

        me.logger.error('visualization  Data loading failed', e);
      }
    );
    return output;
  }
}