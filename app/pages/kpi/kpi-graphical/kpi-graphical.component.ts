import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { KPIService } from '../service/kpi.service';
import { Store } from 'src/app/core/store/store';
import { KPIPreLoadingState, KPIPreLoadedState, KPIPreLoadingErrorState } from '../service/kpi.state';
import { AppError } from 'src/app/core/error/error.model';
import { KPIPre } from '../service/kpi.model';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-kpi-graphical',
  templateUrl: './kpi-graphical.component.html',
  styleUrls: ['./kpi-graphical.component.scss'],
})
export class KpiGraphicalComponent implements AfterViewInit {

  error: AppError;
  loading: boolean;
  empty: boolean;
  data: KPIPre;

  kpiURL = '/kpi';

  @ViewChild('dashboard', { read: DashboardComponent }) dashboardC: DashboardComponent;


  constructor(private kpiService: KPIService, public timebarService: TimebarService, private sessionService: SessionService) {
    this.loading = true;
  }

  ngOnInit(): void {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);

      if (timePeriod) {
        me.kpiURL += '/detailed/' + timePeriod;
      }

    });
  }

  ngAfterViewInit() {
    const me = this;
    this.loadKPIPre();

    // to avoid parallel view updates
    setTimeout(() => {
      me.dashboardC.load('DASHBOARD', me.sessionService.session.defaults.dashboardName, me.sessionService.session.defaults.dashboardPath);
    });
  }

  private loadKPIPre() {
    const me = this;
    me.kpiService.loadKPIPre(null).subscribe(
      (state: Store.State) => {
        if (state instanceof KPIPreLoadingState) {
          me.loading = true;
          return;
        }

        if (state instanceof KPIPreLoadedState) {
          me.data = state.data;
          me.loading = false;
          me.initDashboard();
          return;
        }
      },
      (state: KPIPreLoadingErrorState) => {
        me.error = state.error;
        me.loading = false;
      }
    );
  }

  private initDashboard() {
    const me = this;
    if (me.data && me.data.dashboards && me.data.dashboards.length) {
      const primaryDashboard = me.data.dashboards[0];
      me.dashboardC.load('GKPI', primaryDashboard.name, primaryDashboard.path, true);
    }
  }
}
