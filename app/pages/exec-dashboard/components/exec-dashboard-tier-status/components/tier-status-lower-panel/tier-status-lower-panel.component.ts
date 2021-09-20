import { TierStatusDataHandlerService } from './../../services/tier-status-data-handler.service';
import { Component, OnInit } from '@angular/core';
// import * as moment from 'moment';
import { ExecDashboardChartProviderService } from '../../../../services/exec-dashboard-chart-provider.service';
@Component({
  selector: 'app-tier-status-lower-panel',
  templateUrl: './tier-status-lower-panel.component.html',
  styleUrls: ['./tier-status-lower-panel.component.css']
})
export class TierStatusLowerPanelComponent implements OnInit {
  className: string = "TierStatusLowerPanelComponent";
  graphtData = [];
  constructor(public _dataHandlerService: TierStatusDataHandlerService, public _chartProviderService: ExecDashboardChartProviderService) { }

  ngOnInit() {
    this._chartProviderService.getDashboardData(this.graphtData);  
  }
  
}
