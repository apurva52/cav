import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { EndToEndTierData } from './service/end-to-end-tier.model';
import { EndToEndTierService } from './service/end-to-end-tier.service';
import {
  EndToEndTierLoadingState,
  EndToEndTierLoadedState,
  EndToEndTierLoadingErrorState,
} from './service/end-to-end-tier.state';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-end-to-end-tier',
  templateUrl: './end-to-end-tier.component.html',
  styleUrls: ['./end-to-end-tier.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EndToEndTierComponent implements OnInit {
  data: EndToEndTierData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  isShow: boolean;
  serverCount : number;
  instanceCount : number;
  breadcrumb: MenuItem[];

  endToEndGraphicalURL = '/end-to-end';
  nodeName : string = 'cavisson';
  duration;
  constructor(
    private endToEndTierService: EndToEndTierService,
    public timebarService: TimebarService,
    private route : ActivatedRoute,
    private sessionService : SessionService
  ) {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [{ label: 'System' }, { label: 'End To End Tier' }];
    me.route.queryParams.subscribe((queryParams) => {
      if (queryParams && queryParams.node) {
        var duration = {
          st :queryParams.st,
          et :queryParams.et,
          preset :queryParams.preset,
        }
        me.nodeName = queryParams.node;
        me.load(queryParams.node, duration);
      }
    });
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      const viewBy = _.get (value,'viewBy.selected.id', null)
      if (timePeriod) {
        me.endToEndGraphicalURL += '/graphical-tier/' + timePeriod + '/' + viewBy
      }
    });
  }

  load(nodeName : string, duration) {
    const me = this;
    me.duration = duration;
    me.endToEndTierService.load(nodeName, duration).subscribe(
      (state: Store.State) => {
        if (state instanceof EndToEndTierLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof EndToEndTierLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EndToEndTierLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: EndToEndTierLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: EndToEndTierLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: EndToEndTierLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;

    if (me.data) {
      me.empty = false;
      if(me.data.charts){
        me.data.charts.forEach(e=>{
          e.highchart.plotOptions.area.pointStart = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(Number.parseInt(me.duration.st));
          e.highchart.plotOptions.area['pointInterval'] = 60000;
          e.highchart.xAxis['type'] = 'datetime';
          e.highchart.tooltip.pointFormat = "{series.name} : <b>{point.y}" 
          // const highchart = e.highchart;
          // console.log({highchart});
        });
      }
      if (!me.data.allServers && me.data.allServers == null) {
        me.emptyTable = true;
      }
      if(me.data.allServers){
        me.serverCount = me.data.allServers.length;
      }
      if(me.data.instances){
        me.instanceCount = me.data.instances.length;
      }
    } else {
      me.empty = true;
    }
  }
}
