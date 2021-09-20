import { Subscription } from 'rxjs';
import { Component, OnInit, HostListener } from '@angular/core';
import { TierStatusDataHandlerService } from './services/tier-status-data-handler.service';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { ExecDashboardUtil } from './utils/utility';
import { ExecDashboardCommonRequestHandler } from '../../services/exec-dashboard-common-request-handler.service';
import { TierStatusCommonDataHandlerService } from './services/tier-status-common-data-handler.service';
import { ExecDashboardDataContainerService } from '../../services/exec-dashboard-data-container.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
import { ExecDashboardConfigService } from '../../services/exec-dashboard-config.service';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-exec-dashboard-tier-status',
  templateUrl: './exec-dashboard-tier-status.component.html',
  styleUrls: ['./exec-dashboard-tier-status.component.css'],
  providers: [
    TierStatusDataHandlerService,
    CavConfigService,
    ExecDashboardUtil,
    ExecDashboardCommonRequestHandler,
    ExecDashboardConfigService,
    TierStatusCommonDataHandlerService,
    ExecDashboardDataContainerService,
    DdrDataModelService,
    CavTopPanelNavigationService,
  ]
})

export class ExecDashboardTierStatusComponent implements OnInit {
  className: string = "Tier-Status-AppComponent";
  dataSubscription: Subscription;
  tierStatusInterval;
  toggleClass : boolean = false;
  isProgressBar: boolean = false;
  color: string = "primary";
  private _continuousTimer: any;
  constructor(public _dataHandlerService: TierStatusDataHandlerService,
    public cavConfig: CavConfigService,
    public sessionService: SessionService) {
  }

  ngOnInit() {
    console.log('this.cavConfig.$eDParam', this.cavConfig.$eDParam);
    // setting basic configurations like testrun, timeperiod, etc.
    this.setEDConfigurations();
    this._dataHandlerService.$noLoadDetected = false;
    this._dataHandlerService.$flowmapLoadedFirstTime = true; // setting tier status loaded for first time to true
    if (this.cavConfig.$eDParam.fromStoreView) {
      this._dataHandlerService.$isStoreView = this.cavConfig.$eDParam.fromStoreView
      this._dataHandlerService.flowChartActionHandler('FROM_STORE_VIEW');
    }
    this.initUpdateTimer();
  }

  getEventFromLeftPanel(event) {
    console.log('getEventFromLeftPanel called', event);
  }

  showHideRightPanel(){
    if(this._dataHandlerService.$isMinMax){ // case : when node is dblClicked and min/max btn isn't clicked
      this.toggleClass = false; // hide the sidebar on click on minimize btn
    }
    else{
      this.toggleClass=!this.toggleClass; 
    }
    // this._dataHandlerService.$isMinimize=true;
    this._dataHandlerService.$isMinMax=false;
  }

  ngOnDestroy(): void {
    this._dataHandlerService.$noLoadDetected = false
    this._dataHandlerService.$isRefreshMode = false
    this._dataHandlerService.$flowmapLoadedFirstTime = false; // setting tier status loaded for first time to false
    this._dataHandlerService.$isStoreView = false;
    clearInterval(this._continuousTimer);
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    // Setting all current settings to sessionstorage
    this.setEDConfigurations();
  }

  /**
   * Sets the properties like testrun number, timeperiod, etc. to the sessionstorage
   */
  private setEDConfigurations() {
    // this._dataHandlerService._config.$testRun = (isNaN(this.cavConfig.$eDParam.testRun) || "" == this.cavConfig.$eDParam.testRun)
    //   ? sessionStorage.runningtest : this.cavConfig.$eDParam.testRun;
    this._dataHandlerService._config.$testRun = this.sessionService.testRun.id;
    this._dataHandlerService._config.$actTimePeriod = (this.cavConfig.$eDParam.graphKey == undefined || this.cavConfig.$eDParam.graphKey.trim() == "") ?
      "Last_60_Minutes" : this.cavConfig.$eDParam.graphKey;
    this._dataHandlerService._config.$appliedStartTime = this.cavConfig.$eDParam.startTime;
    this._dataHandlerService._config.$appliedEndTime = this.cavConfig.$eDParam.endTime;
    this._dataHandlerService._config.$appliedEventDay = this.cavConfig.$eDParam.eventDay;
    this._dataHandlerService._config.$isIncDisGraph = this.cavConfig.$eDParam.isDiscontGraph;
    this._dataHandlerService.$isAllDCs = this.cavConfig.$eDParam.isAllDC == "" ? this._dataHandlerService.$isAllDCs : this.cavConfig.$eDParam.isAllDC;
    this._dataHandlerService.$multiDCMode = this.cavConfig.$eDParam.multidc_mode ? true : this._dataHandlerService.$multiDCMode;
    this._dataHandlerService.$isRefreshMode = true
    if (this.cavConfig.$eDParam.isFreshOpen) { // checking if freshly opened
      this.resetProperties();
      this.cavConfig.$eDParam.isFreshOpen = false;
    }
  }

  private initUpdateTimer() {
    clearInterval(this._continuousTimer);
    this._continuousTimer = setInterval(() => {
      this._dataHandlerService.getTSData('REFRESH_DATA');
    }, this._dataHandlerService.$refreshInterval);
  }

  /**
   * Resets to default properties
   */
  private resetProperties() {
    this._dataHandlerService.clearFlowmapConfig();
  }
}
