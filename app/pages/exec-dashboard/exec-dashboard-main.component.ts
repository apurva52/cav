import { Component, OnInit } from '@angular/core';
import { ExecDashboardConfigService } from './services/exec-dashboard-config.service';
import { ActivatedRoute } from '@angular/router';
import { ExecDashboardGraphTimeDataservice } from './services/exec-dashboard-graph-time-data.service';
import { ExecDashboardCommonKPIDataservice } from './services/exec-dashboard-common-kpi-data.service';
import { ExecDashboardDataContainerService } from './services/exec-dashboard-data-container.service';
import { ExecDashboardCommonRequestHandler } from './services/exec-dashboard-common-request-handler.service';
import { ExecDashboardUtil } from './utils/exec-dashboard-util';

@Component({
  selector: 'app-root',
  templateUrl: './exec-dashboard-main.component.html',
  styleUrls: ['./exec-dashboard-main.component.css'],
  providers: [
    ExecDashboardConfigService,
    ExecDashboardGraphTimeDataservice,
    ExecDashboardCommonKPIDataservice,
    ExecDashboardDataContainerService,
    ExecDashboardCommonRequestHandler,
    ExecDashboardUtil
  ]
})


export class ExecDashboardMainComponent implements OnInit {
  title = 'app works!';
  constructor(
    public _config: ExecDashboardConfigService, 
    public route: ActivatedRoute, 
    public graphTime: ExecDashboardGraphTimeDataservice, 
    public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice
    ) 
    {
      console.log(' inside ExecDashboardMainComponent');
  }

  ngOnInit() {
    try {
      console.log('in main ===============================');
      this._config.initConfiguration();
    } catch (error) {
      console.log('error in execDashboardMainComponent', error);
    }
  }
}

