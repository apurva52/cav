import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { EndToEndGraphicalComponent } from '../../end-to-end-graphical/end-to-end-graphical.component';
import { EndToEndNode } from '../../service/end-to-end.model';
import { ShowDashboard } from './service/show-dashboard.model';
import { ShowDashboardService } from './service/show-dashboard.service';
import {
  EndToEndShowDashboardLoadingState,
  EndToEndShowDashboardLoadedState,
  EndToEndShowDashboardLoadingErrorState,
} from './service/show-dashboard.state';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-show-dashboard',
  templateUrl: './show-dahboard.component.html',
  styleUrls: ['./show-dahboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowDashboardComponent
  extends PageSidebarComponent
  implements OnInit {
  visible: boolean;

  @Input() solarNodeData: EndToEndNode;
  @Input() Graphical: EndToEndGraphicalComponent;

  error: any;
  loading: boolean;
  empty: boolean;
  data: ShowDashboard;
  duration;
  constructor(private showDashboardService: ShowDashboardService, private sessionService : SessionService) {
    super();
  }

  ngOnInit(): void {
    // this.load();   
  }

  load(duration) {
    const me = this;
    me.duration = duration;
    me.showDashboardService.load(me.solarNodeData.nodeName,duration).subscribe(
      (state: Store.State) => {
        if (state instanceof EndToEndShowDashboardLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof EndToEndShowDashboardLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EndToEndShowDashboardLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: EndToEndShowDashboardLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: EndToEndShowDashboardLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: EndToEndShowDashboardLoadedState) {
    const me = this;
    me.data = state.data;
    me.data.charts.forEach(e=>{
      e.highchart.plotOptions.area.pointStart = me.sessionService.adjustTimeAccToTimeZoneOffSetDiff(me.duration.st);
      e.highchart.plotOptions.area['pointInterval'] = me.duration.viewBy*1000;
      e.highchart.xAxis['type'] = 'datetime';
      e.highchart.tooltip.pointFormat = "{series.name} : <b>{point.y}" 
      // const highchart = e.highchart;
      // console.log({highchart});
    });
    me.error = null;
    me.loading = false;
    me.empty = false;
  }
}
