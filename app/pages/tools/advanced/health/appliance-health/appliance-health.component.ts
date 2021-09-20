import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { ApplicationHealth } from './service/application-health.model';

@Component({
  selector: 'app-appliance-health',
  templateUrl: './appliance-health.component.html',
  styleUrls: ['./appliance-health.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplianceHealthComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  data: ApplicationHealth;

  @ViewChild('dashboard', { read: DashboardComponent })
  dashboardC: DashboardComponent;

  constructor(
    public timebarService: TimebarService,
    private sessionService: SessionService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
    });
  }

  ngAfterViewInit() {
    const me = this;

    me.initDashboard();
    // to avoid parallel view updates
    setTimeout(() => {
      me.dashboardC.load(
        'DASHBOARD',
        me.sessionService.session.defaults.dashboardName,
        me.sessionService.session.defaults.dashboardPath
      );
    });
  }

  private initDashboard() {
    const me = this;
    if (me.data && me.data.dashboards && me.data.dashboards.length) {
      const primaryDashboard = me.data.dashboards[0];
      me.dashboardC.load(
        'APPLICATION_HEALTH',
        primaryDashboard.name,
        primaryDashboard.path,
        true
      );
    }
  }
}
